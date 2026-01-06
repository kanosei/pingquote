"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Quote, QuoteItem, QuoteView } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { getQuoteStatus, getStatusLabel, getStatusIcon, getStatusColor } from "@/lib/quote-status";
import { calculateQuoteTotals } from "@/lib/quote-calculations";
import { Eye, ExternalLink, Mail, Loader2, MoreVertical, Copy, Check, Share2 } from "lucide-react";
import { sendQuoteEmail, trackQuoteLinkCopy } from "@/app/actions/quotes";
import { QuoteViewDialog } from "@/components/quote-view-dialog";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  views: QuoteView[];
};

export function QuotesTable({ quotes }: { quotes: QuoteWithRelations[] }) {
  const router = useRouter();
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [viewDialogQuote, setViewDialogQuote] = useState<QuoteWithRelations | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  const handleSendEmail = async (quoteId: string) => {
    setSendingEmail(quoteId);
    const result = await sendQuoteEmail(quoteId);
    setSendingEmail(null);

    if (result.error) {
      setAlert({ type: "error", message: result.error });
    } else {
      setAlert({ type: "success", message: result.message || "Email sent successfully" });
      // Refresh the page data to show updated count
      router.refresh();
    }

    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCopyLink = async (quoteId: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const quoteUrl = `${baseUrl}/q/${quoteId}`;

    try {
      await navigator.clipboard.writeText(quoteUrl);

      // Track the copy
      await trackQuoteLinkCopy(quoteId);

      // Show copied confirmation
      setCopiedQuoteId(quoteId);
      setTimeout(() => setCopiedQuoteId(null), 2000);

      // Refresh the page data to show updated count
      router.refresh();
    } catch (error) {
      setAlert({ type: "error", message: "Failed to copy link" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleShare = async (quote: QuoteWithRelations) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const quoteUrl = `${baseUrl}/q/${quote.id}`;

    const { total } = calculateQuoteTotals(
      quote.items,
      quote.discountType,
      quote.discount
    );

    const shareTitle = `Quote for ${quote.clientName}`;
    const shareText = `Quote for ${formatCurrency(total)} - view details:`;

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: quoteUrl,
        });

        // Track the share (optional - you can track successful shares)
        await trackQuoteLinkCopy(quote.id);
        router.refresh();
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback to copy
          handleCopyLink(quote.id);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink(quote.id);
    }
  };

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first quote to start tracking views
        </p>
        <Link href="/quotes/new">
          <Button>Create your first quote</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {alert && (
        <div
          className={`mb-4 p-4 rounded-md ${
            alert.type === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Last Viewed</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => {
            const status = getQuoteStatus(quote.views);
            const { total } = calculateQuoteTotals(
              quote.items,
              quote.discountType,
              quote.discount
            );
            const lastView = quote.views[0];

            return (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">
                  <div>
                    {quote.clientName}
                    {quote.clientEmail && (
                      <span className="block text-xs text-gray-500">{quote.clientEmail}</span>
                    )}
                    {/* Show stats */}
                    {(quote.linkCopied > 0 || quote.emailSent > 0) && (
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        {quote.linkCopied > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Copy className="h-3 w-3" />
                            {quote.linkCopied}
                          </span>
                        )}
                        {quote.emailSent > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {quote.emailSent}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Show status on mobile */}
                    <span className="md:hidden mt-1">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${getStatusColor(status)}`}>
                        <span>{getStatusIcon(status)}</span>
                        <span>{getStatusLabel(status)}</span>
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(total)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`inline-flex items-center gap-1.5 ${getStatusColor(status)}`}>
                    <span>{getStatusIcon(status)}</span>
                    <span>{getStatusLabel(status)}</span>
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-600">
                  {lastView ? formatRelativeTime(lastView.viewedAt) : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={sendingEmail === quote.id}
                      >
                        {sendingEmail === quote.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => setViewDialogQuote(quote)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/q/${quote.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleShare(quote)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(quote.id)}>
                        {copiedQuoteId === quote.id ? (
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copiedQuoteId === quote.id ? "Copied!" : "Copy Link"}
                      </DropdownMenuItem>
                      {quote.clientEmail && (
                        <DropdownMenuItem
                          onClick={() => handleSendEmail(quote.id)}
                          disabled={sendingEmail === quote.id}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          {sendingEmail === quote.id ? "Sending..." : "Send Email"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {viewDialogQuote && (
        <QuoteViewDialog
          quote={viewDialogQuote}
          open={!!viewDialogQuote}
          onOpenChange={(open) => !open && setViewDialogQuote(null)}
        />
      )}
    </>
  );
}
