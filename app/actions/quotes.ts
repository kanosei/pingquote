"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const quoteItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  price: z.number().min(0, "Price must be non-negative"),
});

const createQuoteSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  discountType: z.enum(["percentage", "fixed", "none"]).optional(),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
  paymentLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
});

export async function createQuote(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Parse the items JSON from formData
    const itemsJson = formData.get("items") as string;
    const items = JSON.parse(itemsJson);

    const data = {
      clientName: formData.get("clientName") as string,
      clientEmail: formData.get("clientEmail") as string || "",
      discountType: (formData.get("discountType") as string) || "none",
      discount: parseFloat(formData.get("discount") as string) || 0,
      notes: formData.get("notes") as string || "",
      paymentLink: formData.get("paymentLink") as string || "",
      items,
    };

    const validated = createQuoteSchema.parse(data);

    // Create quote with items in a transaction
    const quote = await prisma.quote.create({
      data: {
        userId: session.user.id,
        clientName: validated.clientName,
        clientEmail: validated.clientEmail || null,
        discountType: validated.discountType === "none" ? null : validated.discountType,
        discount: validated.discount || 0,
        notes: validated.notes || null,
        paymentLink: validated.paymentLink || null,
        items: {
          create: validated.items,
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, quoteId: quote.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Create quote error:", error);
    return { error: "Failed to create quote. Please try again." };
  }
}

export async function getQuotes() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      redirect("/login");
    }

    const quotes = await prisma.quote.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null, // Exclude soft-deleted quotes
      },
      include: {
        items: true,
        views: {
          orderBy: {
            viewedAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return quotes;
  } catch (error) {
    console.error("Get quotes error:", error);
    return [];
  }
}

export async function getUniqueClients() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return [];
    }

    // Get unique clients by grouping quotes
    const quotes = await prisma.quote.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null, // Exclude soft-deleted quotes
      },
      select: {
        clientName: true,
        clientEmail: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create a map to deduplicate by client name (case-insensitive)
    const clientMap = new Map<string, { name: string; email: string | null }>();

    quotes.forEach((quote) => {
      const key = quote.clientName.toLowerCase();
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          name: quote.clientName,
          email: quote.clientEmail,
        });
      } else {
        // If we already have this client but didn't have an email, update it
        const existing = clientMap.get(key);
        if (existing && !existing.email && quote.clientEmail) {
          existing.email = quote.clientEmail;
        }
      }
    });

    return Array.from(clientMap.values());
  } catch (error) {
    console.error("Get unique clients error:", error);
    return [];
  }
}

export async function getUniqueLineItems() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return [];
    }

    // Get all line items from user's quotes, most recent first
    const items = await prisma.quoteItem.findMany({
      where: {
        quote: {
          userId: session.user.id,
        },
      },
      select: {
        description: true,
        price: true,
        quantity: true,
      },
      orderBy: {
        quote: {
          createdAt: "desc",
        },
      },
    });

    // Create a map to deduplicate by description (case-insensitive)
    // Keep the most recent price for each unique description
    const itemMap = new Map<string, { description: string; price: number; quantity: number }>();

    items.forEach((item) => {
      const key = item.description.toLowerCase().trim();
      if (key && !itemMap.has(key)) {
        itemMap.set(key, {
          description: item.description,
          price: item.price,
          quantity: item.quantity,
        });
      }
    });

    return Array.from(itemMap.values());
  } catch (error) {
    console.error("Get unique line items error:", error);
    return [];
  }
}

export async function getQuote(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    const quote = await prisma.quote.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null, // Exclude soft-deleted quotes
      },
      include: {
        items: true,
        views: true,
      },
    });

    return quote;
  } catch (error) {
    console.error("Get quote error:", error);
    return null;
  }
}

export async function deleteQuote(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Verify ownership before deleting
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null, // Only allow deleting non-deleted quotes
      },
    });

    if (!quote) {
      return { error: "Quote not found" };
    }

    // Soft delete: set deletedAt timestamp
    await prisma.quote.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete quote error:", error);
    return { error: "Failed to delete quote" };
  }
}

export async function trackQuoteLinkCopy(quoteId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Verify ownership and increment counter
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        userId: session.user.id,
        deletedAt: null, // Only track for non-deleted quotes
      },
    });

    if (!quote) {
      return { error: "Quote not found" };
    }

    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        linkCopied: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Track link copy error:", error);
    return { error: "Failed to track link copy" };
  }
}

export async function sendQuoteEmail(quoteId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Verify ownership and get quote with email
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        userId: session.user.id,
        deletedAt: null, // Only send emails for non-deleted quotes
      },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!quote) {
      return { error: "Quote not found" };
    }

    if (!quote.clientEmail) {
      return { error: "No email address for this quote" };
    }

    // Generate the quote URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const quoteUrl = `${baseUrl}/q/${quoteId}`;

    // Prepare email data
    const emailData = {
      clientName: quote.clientName,
      senderName: quote.user.name || "PingQuote User",
      quoteUrl: quoteUrl,
      itemCount: quote.items.length,
    };

    // Get email templates
    const { getQuoteEmailHtml, getQuoteEmailText } = await import("@/lib/email-templates");

    // Send email via Resend
    const { resend } = await import("@/lib/resend");
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const result = await resend.emails.send({
      from: fromEmail,
      to: quote.clientEmail,
      subject: `New quote from ${emailData.senderName}`,
      html: getQuoteEmailHtml(emailData),
      text: getQuoteEmailText(emailData),
      replyTo: quote.user.email,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return { error: "Failed to send email. Please check your Resend configuration." };
    }

    // Increment email sent counter
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        emailSent: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: `Email sent successfully to ${quote.clientEmail}`,
    };
  } catch (error) {
    console.error("Send quote email error:", error);
    return { error: "Failed to send email. Please check your Resend API key." };
  }
}
