import { QuoteStats } from "@/lib/quote-stats";
import { formatCurrency } from "@/lib/utils";
import { FileText, TrendingUp, Eye, Flame, Copy, Mail } from "lucide-react";

interface QuoteStatsCardsProps {
  stats: QuoteStats;
}

export function QuoteStatsCards({ stats }: QuoteStatsCardsProps) {
  const cards = [
    {
      title: "Total Quotes",
      value: stats.totalQuotes.toString(),
      icon: FileText,
      description: `${stats.viewedQuotes} viewed`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pipeline Value",
      value: formatCurrency(stats.totalValue),
      icon: TrendingUp,
      description: `Avg ${formatCurrency(stats.avgQuoteValue)}`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Hot Quotes",
      value: stats.hotQuotes.toString(),
      icon: Flame,
      description: `${stats.warmQuotes} warm, ${stats.coldQuotes} cold`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Engagement",
      value: `${stats.copiedCount + stats.emailedCount}`,
      icon: Eye,
      description: `${stats.copiedCount} copied, ${stats.emailedCount} emailed`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
              <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
