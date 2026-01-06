"use client";

import { Quote, QuoteView } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";

type QuoteWithViews = Quote & {
  views: QuoteView[];
};

interface QuoteViewHistoryDialogProps {
  quote: QuoteWithViews;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuoteViewHistoryDialog({
  quote,
  open,
  onOpenChange,
}: QuoteViewHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>View History</DialogTitle>
          <DialogDescription>
            Showing all views for the quote sent to{" "}
            <span className="font-medium text-gray-900">{quote.clientName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {quote.views.length > 0 ? (
            <ul className="space-y-4">
              {quote.views.map((view) => (
                <li key={view.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                    <Eye className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatDate(view.viewedAt)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatRelativeTime(view.viewedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold">No views yet</h3>
              <p className="text-gray-600 mt-1">
                This quote has not been viewed by the client.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
