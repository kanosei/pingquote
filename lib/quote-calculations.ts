import { QuoteItem } from "@prisma/client";

export interface QuoteItemInput {
  description: string;
  quantity: number;
  price: number;
}

export interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  total: number;
}

/**
 * Calculates quote totals server-side for security
 */
export function calculateQuoteTotals(
  items: QuoteItemInput[],
  discountType?: string | null,
  discount?: number
): QuoteTotals {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  // Calculate discount amount
  let discountAmount = 0;
  if (discount && discount > 0) {
    if (discountType === "percentage") {
      discountAmount = (subtotal * discount) / 100;
    } else if (discountType === "fixed") {
      discountAmount = discount;
    }
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  // Calculate final total
  const total = subtotal - discountAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
