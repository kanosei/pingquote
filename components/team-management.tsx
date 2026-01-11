"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Copy, Trash2, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  role: string;
  joinedAt: Date;
};

type Invite = {
  id: string;
  code: string;
  email: string | null;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
  createdAt: Date;
};

type Organization = {
  id: string;
  name: string;
  logoUrl: string | null;
  members: Member[];
  invites: Invite[];
};

type Membership = {
  id: string;
  role: string;
  joinedAt: Date;
  organization: Organization;
};

type TeamManagementProps = {
  memberships: Membership[];
  currentUserId: string;
};

export function TeamManagement({ memberships, currentUserId }: TeamManagementProps) {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState(memberships[0]?.organization);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localInvites, setLocalInvites] = useState(selectedOrg?.invites || []);

  // Update local invites when selectedOrg changes
  useEffect(() => {
    if (selectedOrg) {
      setLocalInvites(selectedOrg.invites);
    }
  }, [selectedOrg]);

  const currentMembership = memberships.find(
    (m) => m.organization.id === selectedOrg?.id
  );
  const canManageInvites =
    currentMembership?.role === "owner" || currentMembership?.role === "admin";

  const handleCreateInvite = async () => {
    if (!selectedOrg) return;

    setIsCreatingInvite(true);
    setError(null);

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: selectedOrg.id,
          email: inviteEmail || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create invite");
      }

      const { invite } = await response.json();

      // Optimistically add the new invite to the local state
      setLocalInvites((prev) => [
        {
          id: invite.id,
          code: invite.code,
          email: invite.email,
          expiresAt: invite.expiresAt,
          maxUses: invite.maxUses,
          usedCount: invite.usedCount,
          createdAt: invite.createdAt,
        },
        ...prev,
      ]);

      setInviteEmail("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite");
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const handleCopyInviteLink = (code: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/signup?invite=${code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteInvite = async (inviteId: string) => {
    if (!confirm("Are you sure you want to delete this invite?")) return;

    try {
      // Optimistically remove the invite from local state
      setLocalInvites((prev) => prev.filter((invite) => invite.id !== inviteId));

      const response = await fetch(`/api/invites?id=${inviteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete invite");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete invite");
      // Refresh to get the correct state if delete failed
      router.refresh();
    }
  };

  if (!selectedOrg) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Organization Selector */}
      {memberships.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {memberships.map((m) => (
                <Button
                  key={m.organization.id}
                  variant={
                    selectedOrg.id === m.organization.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedOrg(m.organization)}
                >
                  {m.organization.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Team Members</CardTitle>
          </div>
          <CardDescription>
            {selectedOrg.members.length} member
            {selectedOrg.members.length !== 1 ? "s" : ""} in {selectedOrg.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedOrg.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {member.name || "Unknown"}
                    {member.userId === currentUserId && (
                      <span className="text-sm text-gray-500 ml-2">(You)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.email}
                  </p>
                </div>
                <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Management */}
      {canManageInvites && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Invite Team Members</CardTitle>
            </div>
            <CardDescription>
              Create invite links to add new members to your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create Invite */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="inviteEmail" className="text-base">
                  Invite Team Member
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Send an invite link to a specific email address
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={isCreatingInvite}
                  required
                />
                <Button
                  onClick={handleCreateInvite}
                  disabled={isCreatingInvite || !inviteEmail}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                The invite link will only work for this specific email address
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Active Invites */}
            {localInvites.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="font-medium">Active Invites</h3>
                {localInvites.map((invite) => {
                  const isExpired =
                    invite.expiresAt && new Date(invite.expiresAt) < new Date();
                  const isMaxedOut =
                    invite.maxUses && invite.usedCount >= invite.maxUses;
                  const isInactive = isExpired || isMaxedOut;

                  return (
                    <div
                      key={invite.id}
                      className={`p-3 border rounded-lg ${
                        isInactive
                          ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {invite.email && (
                            <p className="text-sm font-medium mb-1">
                              {invite.email}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                            Code: {invite.code}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Used {invite.usedCount} time
                            {invite.usedCount !== 1 ? "s" : ""}
                            {invite.maxUses && ` (max: ${invite.maxUses})`}
                          </p>
                          {isExpired && (
                            <Badge variant="destructive" className="mt-2">
                              Expired
                            </Badge>
                          )}
                          {isMaxedOut && (
                            <Badge variant="secondary" className="mt-2">
                              Max uses reached
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!isInactive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyInviteLink(invite.code)}
                            >
                              {copiedCode === invite.code ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteInvite(invite.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!canManageInvites && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only organization owners and admins can manage invites.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
