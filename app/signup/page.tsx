"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { signup } from "@/app/actions/auth";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>("");
  const [hasInvite, setHasInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [validatingInvite, setValidatingInvite] = useState(false);

  useEffect(() => {
    const invite = searchParams.get("invite");
    if (invite) {
      setInviteCode(invite);
      setHasInvite(true);

      // Validate and fetch invite details
      setValidatingInvite(true);
      fetch(`/api/invites/validate?code=${invite}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            if (data.email) {
              setInviteEmail(data.email);
            }
            if (data.organizationName) {
              setOrganizationName(data.organizationName);
            }
          } else if (data.error) {
            setError(data.error);
          }
        })
        .catch(() => {
          setError("Failed to validate invite code");
        })
        .finally(() => {
          setValidatingInvite(false);
        });
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await signup(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Sign in after successful signup
      const signInResult = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but sign in failed. Please log in manually.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo size="large" />
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              {hasInvite
                ? "Join your team on PingQuote"
                : "Get started with PingQuote for free"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {hasInvite && !validatingInvite && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    {organizationName ? `Join ${organizationName}` : "You're joining a team"}
                  </p>
                  {inviteEmail && (
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      This invite is for {inviteEmail}
                    </p>
                  )}
                </div>
              )}

              {validatingInvite && (
                <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Validating invite code...
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  disabled={loading || validatingInvite}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  defaultValue={inviteEmail}
                  key={inviteEmail} // Re-render when invite email changes
                  readOnly={hasInvite && !!inviteEmail}
                  disabled={loading || validatingInvite}
                  className={hasInvite && inviteEmail ? "bg-gray-50 dark:bg-gray-900 cursor-not-allowed" : ""}
                />
                {hasInvite && inviteEmail && (
                  <p className="text-xs text-gray-500">
                    Email pre-filled from invite
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  minLength={8}
                  disabled={loading || validatingInvite}
                />
              </div>

              {!hasInvite && (
                <div className="space-y-2">
                  <Label htmlFor="organizationName">
                    Organization Name
                  </Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required
                    placeholder="Acme Inc."
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    Your company or team name
                  </p>
                </div>
              )}

              {hasInvite && (
                <input type="hidden" name="inviteCode" value={inviteCode} />
              )}

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading || validatingInvite}>
                {loading ? "Creating account..." : validatingInvite ? "Validating..." : "Create account"}
              </Button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
