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
import { Eye, ExternalLink, Mail, Loader2, MoreVertical, Copy, Check, Share2, Trash2, AlertTriangle, Edit } from "lucide-react";
import { sendQuoteEmail, trackQuoteLinkCopy, deleteQuote } from "@/app/actions/quotes";
import { QuoteViewHistoryDialog } from "@/components/quote-view-history-dialog";
import { QuoteViewDialog } from "@/components/quote-view-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  views: QuoteView[];
};

export function QuotesTable({
  quotes,
  senderName,
}: {
  quotes: QuoteWithRelations[];
  senderName: string;
}) {
  const router = useRouter();
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<string | null>(null);
  const [viewDialogQuote, setViewDialogQuote] = useState<QuoteWithRelations | null>(null);
  const [viewHistoryQuote, setViewHistoryQuote] = useState<QuoteWithRelations | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<{ id: string; clientName: string } | null>(null);

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

    const shareTitle = `Quote from ${senderName}`;
    const shareText = `${senderName} sent you a quote to review`;

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

  const handleDeleteClick = (quoteId: string, clientName: string) => {
    setQuoteToDelete({ id: quoteId, clientName });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quoteToDelete) return;

    setDeletingQuote(quoteToDelete.id);
    setDeleteConfirmOpen(false);

    const result = await deleteQuote(quoteToDelete.id);
    setDeletingQuote(null);
    setQuoteToDelete(null);

    if (result.error) {
      setAlert({ type: "error", message: result.error });
    } else {
      setAlert({ type: "success", message: "Quote deleted successfully" });
      // Refresh the page data
      router.refresh();
    }

    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlert(null), 5000);
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
            <TableHead className="hidden lg:table-cell">Views</TableHead>
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
            const viewCount = quote.views.length;

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
                <TableCell className="font-medium">{formatCurrency(total, quote.currency)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`inline-flex items-center gap-1.5 ${getStatusColor(status)}`}>
                    <span>{getStatusIcon(status)}</span>
                    <span>{getStatusLabel(status)}</span>
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {viewCount > 0 ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-gray-600 hover:text-gray-900"
                      onClick={() => setViewHistoryQuote(quote)}
                    >
                      {viewCount} {viewCount === 1 ? "view" : "views"}
                    </Button>
                  ) : (
                    <span className="text-gray-500">No views yet</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={sendingEmail === quote.id || deletingQuote === quote.id}
                      >
                        {sendingEmail === quote.id || deletingQuote === quote.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href={`/quotes/${quote.id}/edit`} className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Quote
                        </Link>
                      </DropdownMenuItem>
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
                          View Public Page
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(quote.id, quote.clientName)}
                        disabled={deletingQuote === quote.id}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingQuote === quote.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
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

      {viewHistoryQuote && (
        <QuoteViewHistoryDialog
          quote={viewHistoryQuote}
          open={!!viewHistoryQuote}
          onOpenChange={(open) => !open && setViewHistoryQuote(null)}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Quote
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the quote for{" "}
              <strong>{quoteToDelete?.clientName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deletingQuote !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletingQuote !== null}
            >
              {deletingQuote ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Quote"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
