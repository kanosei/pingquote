"use client";

import { Button } from "@/components/ui/button";
import { Flame, Smile, Snowflake, Eye, EyeOff } from "lucide-react";

export type QuoteFilter = "all" | "hot" | "warm" | "cold" | "viewed" | "not-viewed";

interface QuoteFiltersProps {
  activeFilter: QuoteFilter;
  onFilterChange: (filter: QuoteFilter) => void;
  counts: {
    all: number;
    hot: number;
    warm: number;
    cold: number;
    viewed: number;
    notViewed: number;
  };
}

export function QuoteFilters({ activeFilter, onFilterChange, counts }: QuoteFiltersProps) {
  const filters = [
    { id: "all" as QuoteFilter, label: "All", count: counts.all, icon: null },
    { id: "hot" as QuoteFilter, label: "Hot", count: counts.hot, icon: Flame, color: "text-orange-600" },
    { id: "warm" as QuoteFilter, label: "Warm", count: counts.warm, icon: Smile, color: "text-green-600" },
    { id: "cold" as QuoteFilter, label: "Cold", count: counts.cold, icon: Snowflake, color: "text-blue-600" },
    { id: "viewed" as QuoteFilter, label: "Viewed", count: counts.viewed, icon: Eye, color: "text-gray-600" },
    { id: "not-viewed" as QuoteFilter, label: "Not Viewed", count: counts.notViewed, icon: EyeOff, color: "text-gray-400" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="gap-2"
          >
            {Icon && <Icon className={`h-4 w-4 ${!isActive && filter.color}`} />}
            {filter.label}
            <span
              className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {filter.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
