import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <Logo size="large" />
        <h1 className="text-2xl font-bold mt-8 mb-2">Quote not found</h1>
        <p className="text-gray-600 mb-6">
          This quote doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button>Go to homepage</Button>
        </Link>
      </div>
    </div>
  );
}
