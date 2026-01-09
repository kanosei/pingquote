import { QuoteStatsByCurrency } from "@/lib/quote-stats";
import { formatCurrency } from "@/lib/utils";
import { FileText, TrendingUp, Eye, Flame } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuoteStatsCardsProps {
  stats: QuoteStatsByCurrency;
}

export function QuoteStatsCards({ stats }: QuoteStatsCardsProps) {
  const currencies = Object.keys(stats);

  if (currencies.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {currencies.map((currency) => {
          const currencyStats = stats[currency];
          const cards = [
            {
              title: "Total Quotes",
              value: currencyStats.totalQuotes.toString(),
              icon: FileText,
              description: `${currencyStats.totalQuotes - currencyStats.viewedQuotes} unviewed`,
              color: "text-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              title: "Pipeline Value",
              value: formatCurrency(currencyStats.totalValue, currency),
              icon: TrendingUp,
              description: `Avg ${formatCurrency(currencyStats.avgQuoteValue, currency)}`,
              color: "text-green-600",
              bgColor: "bg-green-50",
            },
            {
              title: "Hot Quotes",
              value: currencyStats.hotQuotes.toString(),
              icon: Flame,
              description: `${currencyStats.warmQuotes} warm, ${currencyStats.coldQuotes} cold`,
              color: "text-orange-600",
              bgColor: "bg-orange-50",
            },
            {
              title: "Engagement",
              value: `${
                currencyStats.viewedQuotes + currencyStats.copiedCount + currencyStats.emailedCount
              }`,
              icon: Eye,
              description: `${currencyStats.viewedQuotes} viewed, ${currencyStats.copiedCount} copied, ${currencyStats.emailedCount} emailed`,
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
          ];

          return (
            <div key={currency}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{currency}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card) => {
                  const Icon = card.icon;
                  if (card.title === "Hot Quotes") {
                    return (
                      <div
                        key={card.title}
                        className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 cursor-help">
                                  {card.title}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Viewed in last 48 hours OR viewed more than once</p>
                              </TooltipContent>
                            </Tooltip>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                              {card.value}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex space-x-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="cursor-help">
                                    {currencyStats.warmQuotes} warm
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Viewed once in last 7 days</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="cursor-help">
                                    {currencyStats.coldQuotes} cold
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Not viewed in 7+ days</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <div
                            className={`${card.bgColor} dark:bg-opacity-20 ${card.color} p-3 rounded-lg`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={card.title}
                      className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {card.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {card.value}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
                        </div>
                        <div
                          className={`${card.bgColor} dark:bg-opacity-20 ${card.color} p-3 rounded-lg`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
