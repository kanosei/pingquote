import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  logoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ files }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) throw new Error("Unauthorized");

      // Get user email for filename
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
      });

      if (!user) throw new Error("User not found");

      // Generate custom filename: logo-<email>.<ext>
      const file = files[0];
      const ext = file.name.split('.').pop() || 'png';
      const sanitizedEmail = user.email.replace(/[^a-zA-Z0-9]/g, '-');

      return {
        userId: session.user.id,
        userEmail: user.email,
        uploadedFileExt: ext,
        sanitizedEmail,
      };
    })
    .onBeforeGenerateKey(({ metadata }) => {
      // Set custom key (filename) for the uploaded file
      return `logo-${metadata.sanitizedEmail}.${metadata.uploadedFileExt}`;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", metadata.userEmail);

      // Use ufsUrl (new API) if available, fallback to url for older versions
      const fileUrl = (file as any).ufsUrl || file.url;
      console.log("File stored as:", file.key);
      console.log("File URL:", fileUrl);

      return { uploadedBy: metadata.userId, url: fileUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
