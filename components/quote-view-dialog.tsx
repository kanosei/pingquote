import { Quote, QuoteItem, QuoteView } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculateQuoteTotals } from "@/lib/quote-calculations";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  views: QuoteView[];
};

interface QuoteViewDialogProps {
  quote: QuoteWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuoteViewDialog({ quote, open, onOpenChange }: QuoteViewDialogProps) {
  const { subtotal, discountAmount, total } = calculateQuoteTotals(
    quote.items,
    quote.discountType,
    quote.discount
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-white text-gray-900 dark:text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Quote Preview</DialogTitle>
          <DialogDescription className="text-gray-600">
            Preview how your client will see this quote
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Header Section */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">For</h3>
                <p className="font-semibold">{quote.clientName}</p>
                {quote.clientEmail && (
                  <p className="text-sm text-gray-600">{quote.clientEmail}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(quote.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quote Details</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3 font-medium text-gray-600 text-sm">
                    Description
                  </th>
                  <th className="text-right pb-3 font-medium text-gray-600 text-sm">
                    Qty
                  </th>
                  <th className="text-right pb-3 font-medium text-gray-600 text-sm">
                    Price
                  </th>
                  <th className="text-right pb-3 font-medium text-gray-600 text-sm">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.price, quote.currency)}</td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(item.quantity * item.price, quote.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t">
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal, quote.currency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Discount
                      {quote.discountType === "percentage" && ` (${quote.discount}%)`}
                    </span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(discountAmount, quote.currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatCurrency(total, quote.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
