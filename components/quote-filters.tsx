"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Smile, Snowflake, Eye, EyeOff, Search, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type QuoteFilter =
  | "all"
  | "hot"
  | "warm"
  | "cold"
  | "viewed"
  | "not-viewed";

interface QuoteFiltersProps {
  activeFilter: QuoteFilter;
  onFilterChange: (filter: QuoteFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  counts: {
    all: number;
    hot: number;
    warm: number;
    cold: number;
    viewed: number;
    notViewed: number;
  };
}

export function QuoteFilters({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  counts,
}: QuoteFiltersProps) {
  const filters = [
    { id: "all" as QuoteFilter, label: "All", count: counts.all, icon: null },
    {
      id: "hot" as QuoteFilter,
      label: "Hot",
      count: counts.hot,
      icon: Flame,
      color: "text-orange-600",
      tooltip: "Viewed in last 48 hours OR viewed more than once",
    },
    {
      id: "warm" as QuoteFilter,
      label: "Warm",
      count: counts.warm,
      icon: Smile,
      color: "text-green-600",
      tooltip: "Viewed once in last 7 days",
    },
    {
      id: "cold" as QuoteFilter,
      label: "Cold",
      count: counts.cold,
      icon: Snowflake,
      color: "text-blue-600",
      tooltip: "Not viewed in 7+ days",
    },
    {
      id: "viewed" as QuoteFilter,
      label: "Viewed",
      count: counts.viewed,
      icon: Eye,
      color: "text-gray-600",
    },
    {
      id: "not-viewed" as QuoteFilter,
      label: "Not Viewed",
      count: counts.notViewed,
      icon: EyeOff,
      color: "text-gray-400",
    },
  ];

  const showClearButton = searchTerm || activeFilter !== "all";

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Filter by client, email, or line item..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
          {showClearButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onFilterChange("all");
                onSearchChange("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;

            const button = (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter.id)}
                className="gap-2"
              >
                {Icon && (
                  <Icon className={`h-4 w-4 ${!isActive && filter.color}`} />
                )}
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

            if (filter.tooltip) {
              return (
                <Tooltip key={filter.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent>
                    <p>{filter.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
