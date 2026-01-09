"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  companyName: string | null;
  logoUrl: string | null;
};

export function SettingsForm({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [companyName, setCompanyName] = useState(user.companyName || "");
  const [logoUrl, setLogoUrl] = useState(user.logoUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateProfile({
      name,
      companyName,
      logoUrl,
    });

    setIsSaving(false);

    if (result.error) {
      setAlert({ type: "error", message: result.error });
    } else {
      setAlert({ type: "success", message: "Profile updated successfully" });
      router.refresh();
    }

    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlert(null), 5000);
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 space-y-6">
      {alert && (
        <div
          className={`p-4 rounded-md ${
            alert.type === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Account Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="border-t dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Company Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This will be displayed on your quotes
              </p>
            </div>

            <div>
              <Label>Company Logo</Label>
              <div className="mt-2">
                {logoUrl ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <Image
                        src={logoUrl}
                        alt="Company logo"
                        width={200}
                        height={200}
                        className="rounded-lg border dark:border-gray-700 object-contain bg-white dark:bg-gray-900"
                        style={{ maxHeight: "200px", width: "auto" }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click the X to remove and upload a new logo
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <UploadButton<OurFileRouter, "logoUploader">
                      endpoint="logoUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          setLogoUrl(res[0].url);
                          setAlert({
                            type: "success",
                            message: "Logo uploaded successfully. Don't forget to save!",
                          });
                          setTimeout(() => setAlert(null), 5000);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setAlert({
                          type: "error",
                          message: `Upload failed: ${error.message}`,
                        });
                        setTimeout(() => setAlert(null), 5000);
                      }}
                      appearance={{
                        button:
                          "ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium",
                        allowedContent: "text-xs text-gray-500 dark:text-gray-400 mt-2",
                      }}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PNG, JPG up to 4MB
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Your logo will appear on quotes and in OpenGraph previews
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t dark:border-gray-700 pt-6 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
