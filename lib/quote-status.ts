import { QuoteView } from "@prisma/client";

export type QuoteStatus = "hot" | "warm" | "cold" | "unviewed";

/**
 * Determines the "heat" status of a quote based on view history
 *
 * Logic:
 * - Hot: viewed in last 48 hours OR viewed more than once
 * - Warm: viewed once in last 7 days
 * - Cold: not viewed in 7+ days
 * - Unviewed: never viewed
 */
export function getQuoteStatus(views: QuoteView[]): QuoteStatus {
  if (!views || views.length === 0) {
    return "unviewed";
  }

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Check if viewed more than once
  if (views.length > 1) {
    return "hot";
  }

  const lastView = views[0];

  // Check if viewed in last 48 hours
  if (lastView.viewedAt >= twoDaysAgo) {
    return "hot";
  }

  // Check if viewed in last 7 days
  if (lastView.viewedAt >= sevenDaysAgo) {
    return "warm";
  }

  // Not viewed in 7+ days
  return "cold";
}

export function getStatusColor(status: QuoteStatus): string {
  switch (status) {
    case "hot":
      return "text-orange-600";
    case "warm":
      return "text-green-600";
    case "cold":
      return "text-blue-600";
    case "unviewed":
      return "text-gray-400";
  }
}

export function getStatusIcon(status: QuoteStatus): string {
  switch (status) {
    case "hot":
      return "🔥";
    case "warm":
      return "😊";
    case "cold":
      return "❄️";
    case "unviewed":
      return "👁️";
  }
}

export function getStatusLabel(status: QuoteStatus): string {
  switch (status) {
    case "hot":
      return "Hot";
    case "warm":
      return "Warm";
    case "cold":
      return "Cold";
    case "unviewed":
      return "Not viewed";
  }
}
