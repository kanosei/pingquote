import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  logoUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      // Use ufsUrl (new API) if available, fallback to url for older versions
      const fileUrl = (file as any).ufsUrl || file.url;
      console.log("file url", fileUrl);

      return { uploadedBy: metadata.userId, url: fileUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
