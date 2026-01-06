"use client";

import { useEffect } from "react";
import { trackQuoteView } from "@/app/actions/public";

/**
 * Client component that tracks quote views on mount
 * Privacy-first: only sends timestamp, no IP or personal data
 */
export function QuoteViewTracker({ quoteId }: { quoteId: string }) {
  useEffect(() => {
    // Track the view when component mounts
    trackQuoteView(quoteId);
  }, [quoteId]);

  // This component doesn't render anything
  return null;
}
