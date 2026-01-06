import { notFound } from "next/navigation";
import { getPublicQuote } from "@/app/actions/public";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculateQuoteTotals } from "@/lib/quote-calculations";
import { QuoteViewTracker } from "@/components/quote-view-tracker";
import { Logo } from "@/components/logo";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const quote = await getPublicQuote(params.id);

  if (!quote) {
    return {
      title: "Quote Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const quoteUrl = `${baseUrl}/q/${params.id}`;
  const ogImageUrl = `${baseUrl}/api/og`;

  const { total } = calculateQuoteTotals(quote.items, quote.discountType, quote.discount);

  const senderName = quote.user.name || "PingQuote";
  const itemCount = quote.items.length;
  const itemsText = itemCount === 1 ? "item" : "items";

  const title = `${senderName} sent you a quote for ${formatCurrency(total)}`;
  const description = `View your personalized quote with ${itemCount} ${itemsText} totaling ${formatCurrency(total)}. Click to see the full details and breakdown.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: quoteUrl,
      siteName: "PingQuote",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "PingQuote - Professional Quote Management",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicQuotePage({ params }: { params: { id: string } }) {
  const quote = await getPublicQuote(params.id);

  if (!quote) {
    notFound();
  }

  const { subtotal, discountAmount, total } = calculateQuoteTotals(
    quote.items,
    quote.discountType,
    quote.discount
  );

  return (
    <>
      {/* Client-side component to track view on mount */}
      <QuoteViewTracker quoteId={params.id} />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
            <div className="flex items-start justify-between mb-8">
              <div>
                <Logo size="large" />
                <p className="text-sm text-gray-600 mt-2">Quote</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(quote.createdAt)}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">From</h3>
                  <p className="font-medium">{quote.user.name || "PingQuote User"}</p>
                  <p className="text-sm text-gray-600">{quote.user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">To</h3>
                  <p className="font-medium">{quote.clientName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6">Quote Details</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3 font-medium text-gray-600">Description</th>
                  <th className="text-right pb-3 font-medium text-gray-600">Qty</th>
                  <th className="text-right pb-3 font-medium text-gray-600">Price</th>
                  <th className="text-right pb-3 font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-4">{item.description}</td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-4 text-right font-medium">
                      {formatCurrency(item.quantity * item.price)}
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
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Discount
                      {quote.discountType === "percentage" && ` (${quote.discount}%)`}
                    </span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This quote was created with{" "}
              <a
                href="https://pingquote.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                PingQuote
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
