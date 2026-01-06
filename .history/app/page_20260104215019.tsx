import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Flame, Smile, Snowflake, CheckCircle, Eye, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Know when your quote is viewed.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create simple estimates, share them as links, and get notified when they're actually opened.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 h-12">
              Get started for free
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card needed · Create your first quote in minutes
          </p>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="rounded-lg border bg-white shadow-xl overflow-hidden">
            <div className="border-b bg-gray-50 px-6 py-4 flex items-center justify-between">
              <Logo size="default" />
              <Button size="sm">+ New Quote</Button>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Heat</th>
                    <th className="pb-3 font-medium">Viewed</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-4 font-medium">Acme Ltd</td>
                    <td className="py-4 text-gray-600">Website redesign</td>
                    <td className="py-4">£3,500</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-orange-600">
                        <Flame className="h-4 w-4" />
                        Hot
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">Today</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 font-medium">John Smith</td>
                    <td className="py-4 text-gray-600">App prototype</td>
                    <td className="py-4">£1,200</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Smile className="h-4 w-4" />
                        Warm
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">2 days ago</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium">XYZ Co</td>
                    <td className="py-4 text-gray-600">Maintenance</td>
                    <td className="py-4">£600</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-blue-600">
                        <Snowflake className="h-4 w-4" />
                        Cold
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">9 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Stop guessing if a deal is dead</h3>
            <p className="text-gray-600">
              See exactly when prospects open your quotes and know where to focus your follow-up efforts.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Follow up at the right time</h3>
            <p className="text-gray-600">
              Get instant visibility when quotes are viewed so you can reach out while you're top of mind.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Focus on services getting interest</h3>
            <p className="text-gray-600">
              Understand which quotes generate the most engagement and double down on what works.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join freelancers who know exactly when their quotes are viewed.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-12">
              Create your first quote
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <Logo />
            <p className="text-sm text-gray-500">
              © 2024 PingQuote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
