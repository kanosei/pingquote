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
 * Sends email notification to quote owner on first view
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

    // Check if this is the first view for this quote
    const existingViews = await prisma.quoteView.count({
      where: { quoteId },
    });

    const isFirstView = existingViews === 0;

    // Track the view for external/non-owner viewers
    await prisma.quoteView.create({
      data: {
        quoteId,
      },
    });

    // Send email notification on first view only
    if (isFirstView) {
      try {
        // Get quote details with user info
        const quote = await prisma.quote.findUnique({
          where: { id: quoteId },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                companyName: true,
              },
            },
          },
        });

        if (quote && quote.user.email) {
          // Generate URLs
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          const quoteUrl = `${baseUrl}/q/${quoteId}`;
          const dashboardUrl = `${baseUrl}/dashboard`;

          // Prepare email data
          const emailData = {
            senderName: quote.user.companyName || quote.user.name || "there",
            clientName: quote.clientName,
            quoteUrl,
            dashboardUrl,
          };

          // Get email templates
          const { getQuoteViewNotificationHtml, getQuoteViewNotificationText } =
            await import("@/lib/email-templates");

          // Send email via Resend
          const { resend } = await import("@/lib/resend");
          const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

          await resend.emails.send({
            from: fromEmail,
            to: quote.user.email,
            subject: `🔥 Your quote for ${quote.clientName} was just viewed!`,
            html: getQuoteViewNotificationHtml(emailData),
            text: getQuoteViewNotificationText(emailData),
          });

          return { success: true, tracked: true, notified: true };
        }
      } catch (emailError) {
        // Log email error but don't fail the tracking
        console.error("Failed to send view notification email:", emailError);
        return { success: true, tracked: true, notified: false, emailError: true };
      }
    }

    return { success: true, tracked: true, notified: false };
  } catch (error) {
    console.error("Track quote view error:", error);
    return { error: "Failed to track view" };
  }
}
