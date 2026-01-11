import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TeamManagement } from "@/components/team-management";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user's organizations and memberships
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: { joinedAt: "asc" },
          },
          invites: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your organization members and invite new team members
          </p>
        </div>

      {memberships.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You&apos;re not part of any organization yet.
          </p>
          <p className="text-sm text-gray-500">
            Organizations allow you to collaborate with team members and share quotes.
            You can create one during signup or ask a team member to invite you.
          </p>
        </div>
      ) : (
        <TeamManagement
          memberships={memberships.map((m) => ({
            id: m.id,
            role: m.role,
            joinedAt: m.joinedAt,
            organization: {
              id: m.organization.id,
              name: m.organization.name,
              logoUrl: m.organization.logoUrl,
              members: m.organization.members.map((member) => ({
                id: member.id,
                userId: member.userId,
                name: member.user.name,
                email: member.user.email,
                role: member.role,
                joinedAt: member.joinedAt,
              })),
              invites: m.organization.invites.map((invite) => ({
                id: invite.id,
                code: invite.code,
                email: invite.email,
                expiresAt: invite.expiresAt,
                maxUses: invite.maxUses,
                usedCount: invite.usedCount,
                createdAt: invite.createdAt,
              })),
            },
          }))}
          currentUserId={session.user.id}
        />
      )}
      </main>
    </div>
  );
}
