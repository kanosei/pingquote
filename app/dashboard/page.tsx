import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuotes } from "@/app/actions/quotes";
import { DashboardHeader } from "@/components/dashboard-header";
import { QuotesTableWithFilters } from "@/components/quotes-table-with-filters";
import { QuoteStatsCards } from "@/components/quote-stats-cards";
import { calculateQuoteStats } from "@/lib/quote-stats";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const quotes = await getQuotes();
  const stats = calculateQuoteStats(quotes);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Track and manage all your client quotes in one place
          </p>
        </div>

        <QuoteStatsCards stats={stats} />

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <QuotesTableWithFilters quotes={quotes} />
        </div>
      </main>
    </div>
  );
}
