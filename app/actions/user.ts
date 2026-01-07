"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  companyName: z.string().min(1, "Company name is required").optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function updateProfile(data: {
  name?: string;
  companyName?: string;
  logoUrl?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validated = updateProfileSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.name,
        companyName: validated.companyName,
        logoUrl: validated.logoUrl || null,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        logoUrl: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
}
