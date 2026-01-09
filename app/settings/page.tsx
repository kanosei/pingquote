import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/app/actions/user";
import { SettingsForm } from "@/components/settings-form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userProfile = await getUserProfile();

  if (!userProfile) {
    redirect("/login");
  }

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
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and company information
          </p>
        </div>

        <SettingsForm user={userProfile} />
      </main>
    </div>
  );
}
