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

export function calculateQuoteStats(quotes: QuoteWithRelations[]): QuoteStats {
  let totalValue = 0;
  let viewedQuotes = 0;
  let hotQuotes = 0;
  let warmQuotes = 0;
  let coldQuotes = 0;
  let copiedCount = 0;
  let emailedCount = 0;

  quotes.forEach((quote) => {
    // Calculate total value
    const { total } = calculateQuoteTotals(
      quote.items,
      quote.discountType,
      quote.discount
    );
    totalValue += total;

    // Count viewed quotes
    if (quote.views.length > 0) {
      viewedQuotes++;
    }

    // Count by status
    const status = getQuoteStatus(quote.views);
    if (status === "hot") hotQuotes++;
    else if (status === "warm") warmQuotes++;
    else if (status === "cold") coldQuotes++;

    // Sum up engagement metrics
    copiedCount += quote.linkCopied || 0;
    emailedCount += quote.emailSent || 0;
  });

  return {
    totalQuotes: quotes.length,
    totalValue,
    viewedQuotes,
    hotQuotes,
    warmQuotes,
    coldQuotes,
    avgQuoteValue: quotes.length > 0 ? totalValue / quotes.length : 0,
    copiedCount,
    emailedCount,
  };
}
