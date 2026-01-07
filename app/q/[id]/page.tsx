import { notFound } from "next/navigation";
import { getPublicQuote } from "@/app/actions/public";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculateQuoteTotals } from "@/lib/quote-calculations";
import { QuoteViewTracker } from "@/components/quote-view-tracker";
import { ShareButton } from "@/components/share-button";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Image from "next/image";
import { PaymentLinkPreview } from "@/components/payment-link-preview";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const quote = await getPublicQuote(params.id);

  if (!quote) {
    return {
      title: "Quote Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const quoteUrl = `${baseUrl}/q/${params.id}`;

  // Build OG image URL with company info
  const ogParams = new URLSearchParams();
  if (quote.user.logoUrl) {
    ogParams.set('logo', quote.user.logoUrl);
  }
  if (quote.user.companyName) {
    ogParams.set('company', quote.user.companyName);
  }
  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

  const { total } = calculateQuoteTotals(quote.items, quote.discountType, quote.discount);

  const senderName = quote.user.companyName || quote.user.name || "PingQuote";
  const itemCount = quote.items.length;
  const itemsText = itemCount === 1 ? "item" : "items";

  const title = `${senderName} sent you a quote to review`;
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

  // Generate share content
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const quoteUrl = `${baseUrl}/q/${params.id}`;
  const shareTitle = `Quote from ${quote.user.name || "PingQuote"}`;
  const shareText = `${quote.user.name || "PingQuote"} sent you a quote to review. View the details here:`;

  return (
    <>
      {/* Client-side component to track view on mount */}
      <QuoteViewTracker quoteId={params.id} />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:mb-8">
              <div>
                {quote.user.logoUrl ? (
                  <div>
                    <Image
                      src={quote.user.logoUrl}
                      alt={quote.user.companyName || "Company logo"}
                      width={150}
                      height={60}
                      className="object-contain"
                      style={{ maxHeight: "60px", width: "auto" }}
                    />
                    {quote.user.companyName && (
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {quote.user.companyName}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <Logo size="large" />
                    {quote.user.companyName && (
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {quote.user.companyName}
                      </p>
                    )}
                  </>
                )}
                <p className="text-sm text-gray-600 mt-2">Quote</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <ShareButton
                  title={shareTitle}
                  text={shareText}
                  url={quoteUrl}
                />
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{formatDate(quote.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="sm:hidden mb-6 text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{formatDate(quote.createdAt)}</p>
            </div>

            <div className="border-t pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">From</h3>
                  <p className="font-medium">
                    {quote.user.companyName || quote.user.name || "PingQuote User"}
                  </p>
                  {quote.user.companyName && quote.user.name && (
                    <p className="text-sm text-gray-700">{quote.user.name}</p>
                  )}
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
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6">Quote Details</h2>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
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
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {quote.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="font-medium text-gray-900 mb-2">{item.description}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="ml-2 font-medium">{item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-600">Price:</span>
                      <span className="ml-2 font-medium">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(item.quantity * item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-8 mb-6">
              <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {/* Payment Link */}
          {quote.paymentLink && (
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-8 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <PaymentLinkPreview url={quote.paymentLink} />
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
