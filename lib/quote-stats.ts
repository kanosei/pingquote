import { Quote, QuoteItem, QuoteView } from "@prisma/client";
import { calculateQuoteTotals } from "./quote-calculations";
import { getQuoteStatus } from "./quote-status";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  views: QuoteView[];
};

export interface QuoteStats {
  totalQuotes: number;
  totalValue: number;
  viewedQuotes: number;
  hotQuotes: number;
  warmQuotes: number;
  coldQuotes: number;
  avgQuoteValue: number;
  copiedCount: number;
  emailedCount: number;
}

export type QuoteStatsByCurrency = Record<string, QuoteStats>;

export function calculateQuoteStats(quotes: QuoteWithRelations[]): QuoteStatsByCurrency {
  const statsByCurrency: QuoteStatsByCurrency = {};

  quotes.forEach((quote) => {
    const currency = quote.currency || "USD";
    if (!statsByCurrency[currency]) {
      statsByCurrency[currency] = {
        totalQuotes: 0,
        totalValue: 0,
        viewedQuotes: 0,
        hotQuotes: 0,
        warmQuotes: 0,
        coldQuotes: 0,
        avgQuoteValue: 0,
        copiedCount: 0,
        emailedCount: 0,
      };
    }

    const stats = statsByCurrency[currency];
    stats.totalQuotes++;

    // Calculate total value
    const { total } = calculateQuoteTotals(
      quote.items,
      quote.discountType,
      quote.discount
    );
    stats.totalValue += total;

    // Count viewed quotes
    if (quote.views.length > 0) {
      stats.viewedQuotes++;
    }

    // Count by status
    const status = getQuoteStatus(quote.views);
    if (status === "hot") stats.hotQuotes++;
    else if (status === "warm") stats.warmQuotes++;
    else if (status === "cold") stats.coldQuotes++;

    // Sum up engagement metrics
    stats.copiedCount += quote.linkCopied || 0;
    stats.emailedCount += quote.emailSent || 0;
  });

  for (const currency in statsByCurrency) {
    const stats = statsByCurrency[currency];
    stats.avgQuoteValue = stats.totalQuotes > 0 ? stats.totalValue / stats.totalQuotes : 0;
  }

  return statsByCurrency;
}
