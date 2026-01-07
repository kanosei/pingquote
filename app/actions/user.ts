"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

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

    // Get current user data to check if logo is being removed/changed
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { logoUrl: true },
    });

    // If logo is being removed (empty string or null) and user had a logo, delete from UploadThing
    if (currentUser?.logoUrl && (!validated.logoUrl || validated.logoUrl === "")) {
      try {
        const utapi = new UTApi();
        // Extract file key from URL (everything after /f/)
        const fileKey = currentUser.logoUrl.split('/f/')[1];
        if (fileKey) {
          await utapi.deleteFiles(fileKey);
          console.log("Deleted old logo from UploadThing:", fileKey);
        }
      } catch (error) {
        console.error("Failed to delete old logo from UploadThing:", error);
        // Continue anyway - we still want to update the database
      }
    }

    // If logo is being changed to a new URL (not just removed), delete the old one
    if (
      currentUser?.logoUrl &&
      validated.logoUrl &&
      validated.logoUrl !== "" &&
      validated.logoUrl !== currentUser.logoUrl
    ) {
      try {
        const utapi = new UTApi();
        const fileKey = currentUser.logoUrl.split('/f/')[1];
        if (fileKey) {
          await utapi.deleteFiles(fileKey);
          console.log("Deleted old logo from UploadThing:", fileKey);
        }
      } catch (error) {
        console.error("Failed to delete old logo from UploadThing:", error);
        // Continue anyway
      }
    }

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
