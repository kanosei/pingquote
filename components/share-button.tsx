"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Check if Web Share API is supported (iOS Safari, Android Chrome, etc.)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback to copy
          fallbackCopy();
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="w-full sm:w-auto"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          Share Quote
        </>
      )}
    </Button>
  );
}
