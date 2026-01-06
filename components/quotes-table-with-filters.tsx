"use client";

import { useState, useMemo } from "react";
import { Quote, QuoteItem, QuoteView } from "@prisma/client";
import { QuotesTable } from "@/components/quotes-table";
import { QuoteFilters, QuoteFilter } from "@/components/quote-filters";
import { getQuoteStatus } from "@/lib/quote-status";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  views: QuoteView[];
};

interface QuotesTableWithFiltersProps {
  quotes: QuoteWithRelations[];
}

export function QuotesTableWithFilters({ quotes }: QuotesTableWithFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<QuoteFilter>("all");

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    let hot = 0, warm = 0, cold = 0, viewed = 0, notViewed = 0;

    quotes.forEach((quote) => {
      const status = getQuoteStatus(quote.views);
      if (status === "hot") hot++;
      else if (status === "warm") warm++;
      else if (status === "cold") cold++;

      if (quote.views.length > 0) viewed++;
      else notViewed++;
    });

    return {
      all: quotes.length,
      hot,
      warm,
      cold,
      viewed,
      notViewed,
    };
  }, [quotes]);

  // Filter quotes based on active filter
  const filteredQuotes = useMemo(() => {
    if (activeFilter === "all") return quotes;

    return quotes.filter((quote) => {
      const status = getQuoteStatus(quote.views);

      switch (activeFilter) {
        case "hot":
          return status === "hot";
        case "warm":
          return status === "warm";
        case "cold":
          return status === "cold";
        case "viewed":
          return quote.views.length > 0;
        case "not-viewed":
          return quote.views.length === 0;
        default:
          return true;
      }
    });
  }, [quotes, activeFilter]);

  return (
    <div className="p-6">
      <QuoteFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={filterCounts}
      />
      <QuotesTable quotes={filteredQuotes} />
    </div>
  );
}
