"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  inviteCode: z.string().optional().nullable(),
  organizationName: z.string().optional().nullable(),
});

export async function signup(formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const inviteCode = formData.get("inviteCode");
    const organizationName = formData.get("organizationName");

    // Basic validation before Zod
    if (!email || !password || !name) {
      return { error: "Email, password, and name are required" };
    }

    const data = {
      email: email as string,
      password: password as string,
      name: name as string,
      inviteCode: inviteCode && inviteCode !== "" ? (inviteCode as string) : null,
      organizationName: organizationName && organizationName !== "" ? (organizationName as string) : null,
    };

    const validated = signupSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Validate that either inviteCode or organizationName is provided
    if (!validated.inviteCode && !validated.organizationName) {
      return { error: "Please provide an organization name or use an invite code" };
    }

    // Validate invite code if provided
    let invite = null;
    if (validated.inviteCode) {
      invite = await prisma.organizationInvite.findUnique({
        where: { code: validated.inviteCode },
        include: { organization: true },
      });

      if (!invite) {
        return { error: "Invalid invite code" };
      }

      // Check if invite has expired
      if (invite.expiresAt && invite.expiresAt < new Date()) {
        return { error: "This invite code has expired" };
      }

      // Check if invite has reached max uses
      if (invite.maxUses && invite.usedCount >= invite.maxUses) {
        return { error: "This invite code has been fully used" };
      }

      // Check if email-specific invite matches
      if (invite.email && invite.email !== validated.email) {
        return { error: "This invite is for a different email address" };
      }
    }

    // Hash password
    const hashedPassword = await hash(validated.password, 12);

    // Create user and handle organization membership in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validated.email,
          password: hashedPassword,
          name: validated.name,
        },
      });

      let organization = null;

      if (invite) {
        // Join existing organization via invite
        organization = invite.organization;

        await tx.organizationMember.create({
          data: {
            userId: newUser.id,
            organizationId: organization.id,
            role: "member",
          },
        });

        // Check if invite has reached max uses after incrementing
        const updatedInvite = await tx.organizationInvite.update({
          where: { id: invite.id },
          data: { usedCount: { increment: 1 } },
        });

        // Delete invite if it has reached max uses
        if (updatedInvite.maxUses && updatedInvite.usedCount >= updatedInvite.maxUses) {
          await tx.organizationInvite.delete({
            where: { id: invite.id },
          });
        }
      } else if (validated.organizationName) {
        // Create new organization
        organization = await tx.organization.create({
          data: {
            name: validated.organizationName,
          },
        });

        await tx.organizationMember.create({
          data: {
            userId: newUser.id,
            organizationId: organization.id,
            role: "owner",
          },
        });
      }

      return newUser;
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
