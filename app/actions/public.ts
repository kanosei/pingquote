"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Get a quote for public viewing (no authentication required)
 */
export async function getPublicQuote(id: string) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    return quote;
  } catch (error) {
    console.error("Get public quote error:", error);
    return null;
  }
}

/**
 * Track a quote view (privacy-first: timestamp only)
 * Only tracks views from non-owners (external viewers)
 */
export async function trackQuoteView(quoteId: string) {
  try {
    // Check if the viewer is authenticated and owns this quote
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      // Check if this user owns the quote
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        select: { userId: true },
      });

      // Don't track views if the viewer is the quote owner
      if (quote && quote.userId === session.user.id) {
        return { success: true, tracked: false, reason: "owner" };
      }
    }

    // Track the view for external/non-owner viewers
    await prisma.quoteView.create({
      data: {
        quoteId,
      },
    });

    return { success: true, tracked: true };
  } catch (error) {
    console.error("Track quote view error:", error);
    return { error: "Failed to track view" };
  }
}
