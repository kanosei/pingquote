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
  senderName: string;
}

export function QuotesTableWithFilters({
  quotes,
  senderName,
}: QuotesTableWithFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<QuoteFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    let hot = 0,
      warm = 0,
      cold = 0,
      viewed = 0,
      notViewed = 0;

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

  // Filter quotes based on active filter and search term
  const filteredQuotes = useMemo(() => {
    let filtered = quotes;

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((quote) => {
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
    }

    // Apply search term filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((quote) => {
        const clientNameMatch = quote.clientName
          .toLowerCase()
          .includes(lowercasedTerm);
        const clientEmailMatch = quote.clientEmail
          ?.toLowerCase()
          .includes(lowercasedTerm);
        const lineItemMatch = quote.items.some((item) =>
          item.description.toLowerCase().includes(lowercasedTerm)
        );
        return clientNameMatch || clientEmailMatch || lineItemMatch;
      });
    }

    return filtered;
  }, [quotes, activeFilter, searchTerm]);

  return (
    <div className="p-6">
      <QuoteFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        counts={filterCounts}
      />
      <QuotesTable quotes={filteredQuotes} senderName={senderName} />
    </div>
  );
}
