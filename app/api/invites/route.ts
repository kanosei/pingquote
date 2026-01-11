import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

// GET /api/invites - List all invites for user's organization
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization memberships
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: {
            invites: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    // Get all invites across all organizations the user is a member of
    const invites = memberships.flatMap((m) =>
      m.organization.invites.map((invite) => ({
        ...invite,
        organizationName: m.organization.name,
      }))
    );

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}

// POST /api/invites - Create a new invite
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId, email, expiresAt, maxUses } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required for invites" },
        { status: 400 }
      );
    }

    // Check if user is a member of the organization (and has permission to invite)
    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Only owners and admins can create invites
    if (membership.role !== "owner" && membership.role !== "admin") {
      return NextResponse.json(
        { error: "Only owners and admins can create invites" },
        { status: 403 }
      );
    }

    // Generate unique invite code
    const code = nanoid(10);

    // Create invite - email-specific invites have maxUses of 1 by default
    const invite = await prisma.organizationInvite.create({
      data: {
        organizationId,
        code,
        email: email,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses || 1, // Default to 1 use for email-specific invites
        createdBy: session.user.id,
      },
      include: {
        organization: true,
      },
    });

    // Get the inviter's name for the email
    const inviter = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    // Send invite email
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const inviteUrl = `${baseUrl}/signup?invite=${code}`;

      const { resend } = await import("@/lib/resend");
      const { getTeamInviteEmailHtml, getTeamInviteEmailText } = await import("@/lib/email-templates");

      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `You're invited to join ${invite.organization.name} on PingQuote`,
        html: getTeamInviteEmailHtml({
          invitedEmail: email,
          organizationName: invite.organization.name,
          inviterName: inviter?.name || "A team member",
          inviteUrl,
        }),
        text: getTeamInviteEmailText({
          invitedEmail: email,
          organizationName: invite.organization.name,
          inviterName: inviter?.name || "A team member",
          inviteUrl,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send invite email:", emailError);
      // Don't fail the invite creation if email fails
      // Just log the error and continue
    }

    return NextResponse.json({ invite });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 }
    );
  }
}

// DELETE /api/invites - Delete an invite
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const inviteId = searchParams.get("id");

    if (!inviteId) {
      return NextResponse.json(
        { error: "Invite ID is required" },
        { status: 400 }
      );
    }

    // Get invite to check permissions
    const invite = await prisma.organizationInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check if user is a member of the organization
    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: invite.organizationId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Only owners and admins can delete invites
    if (membership.role !== "owner" && membership.role !== "admin") {
      return NextResponse.json(
        { error: "Only owners and admins can delete invites" },
        { status: 403 }
      );
    }

    // Delete invite
    await prisma.organizationInvite.delete({
      where: { id: inviteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invite:", error);
    return NextResponse.json(
      { error: "Failed to delete invite" },
      { status: 500 }
    );
  }
}
