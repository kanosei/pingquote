"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, Plus, Settings } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/dashboard">
            <Logo size="small" />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <Link href="/quotes/new">
              <Button size="sm" className="h-8 px-2 sm:h-9 sm:px-3 md:h-10 md:px-4">
                <Plus className="h-4 w-4 sm:mr-1 md:mr-2" />
                <span className="hidden sm:inline">New Quote</span>
              </Button>
            </Link>
            <ThemeToggle />
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
