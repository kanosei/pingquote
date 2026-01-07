"use client";

import { useState, useEffect } from "react";
import { fetchOpenGraphData, OpenGraphData } from "@/app/actions/opengraph";
import { Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";

export function PaymentLinkPreview({ url }: { url: string }) {
  const [ogData, setOgData] = useState<OpenGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadOgData() {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchOpenGraphData(url);
        if (mounted) {
          setOgData(data);
          setError(!data);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOgData();

    return () => {
      mounted = false;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-600">Loading preview...</span>
      </div>
    );
  }

  if (error || !ogData) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="border rounded-lg p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm text-gray-600 truncate">{url}</span>
        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow block"
    >
      {ogData.image && (
        <div className="relative w-full bg-gray-100" style={{ aspectRatio: '2/1' }}>
          <Image
            src={ogData.image}
            alt={ogData.title || "Preview"}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}
      <div className="p-4">
        {ogData.siteName && (
          <p className="text-xs text-gray-500 mb-1">{ogData.siteName}</p>
        )}
        {ogData.title && (
          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {ogData.title}
          </h4>
        )}
        {ogData.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {ogData.description}
          </p>
        )}
        <div className="flex items-center mt-2 text-xs text-gray-400">
          <ExternalLink className="h-3 w-3 mr-1" />
          <span className="truncate">{new URL(url).hostname}</span>
        </div>
      </div>
    </a>
  );
}
