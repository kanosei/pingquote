import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Flame, Smile, Snowflake, CheckCircle, Eye, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Logo size="small" />
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 sm:h-9 md:h-10 text-sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="h-8 sm:h-9 md:h-10 text-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
            Know when your quote is viewed.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2">
            Create simple estimates, share them as links, and get notified when they&apos;re actually opened.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 h-10 sm:h-12">
              Get started for free
            </Button>
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4">
            No credit card needed · Create your first quote in minutes
          </p>
        </div>

        {/* Mock Dashboard Preview - Hidden on mobile */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto hidden sm:block">
          <div className="rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
              <Logo size="default" />
              <Button size="sm" className="text-xs md:text-sm">+ New Quote</Button>
            </div>
            <div className="p-4 md:p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-left text-sm text-gray-600 dark:text-gray-400">
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Heat</th>
                    <th className="pb-3 font-medium">Viewed</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-4 font-medium dark:text-gray-200">Acme Ltd</td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">Website redesign</td>
                    <td className="py-4 dark:text-gray-200">£3,500</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <Flame className="h-4 w-4" />
                        Hot
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">Today</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-4 font-medium dark:text-gray-200">John Smith</td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">App prototype</td>
                    <td className="py-4 dark:text-gray-200">£1,200</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Smile className="h-4 w-4" />
                        Warm
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">2 days ago</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium dark:text-gray-200">XYZ Co</td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">Maintenance</td>
                    <td className="py-4 dark:text-gray-200">£600</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <Snowflake className="h-4 w-4" />
                        Cold
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">9 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-gray-200">Stop guessing if a deal is dead</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              See exactly when prospects open your quotes and know where to focus your follow-up efforts.
            </p>
          </div>

          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-gray-200">Follow up at the right time</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Get instant visibility when quotes are viewed so you can reach out while you&apos;re top of mind.
            </p>
          </div>

          <div className="text-center px-4 sm:col-span-2 md:col-span-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-gray-200">Focus on services getting interest</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Understand which quotes generate the most engagement and double down on what works.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to get started?</h2>
          <p className="text-gray-300 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg px-2">
            Join freelancers who know exactly when their quotes are viewed.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 h-10 sm:h-12">
              Create your first quote
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <Logo size="small" />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              © 2025 PingQuote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
