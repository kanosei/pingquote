"use server";

export type OpenGraphData = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
};

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData | null> {
  try {
    // Validate URL
    new URL(url);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PingQuote/1.0; +https://pingquote.com)",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch URL:", response.status);
      return null;
    }

    const html = await response.text();

    // Extract OpenGraph tags
    const ogData: OpenGraphData = {};

    // Title
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    if (titleMatch) ogData.title = titleMatch[1];

    // Description
    const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
    if (descMatch) ogData.description = descMatch[1];

    // Image
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
    if (imageMatch) ogData.image = imageMatch[1];

    // URL
    const urlMatch = html.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i);
    if (urlMatch) ogData.url = urlMatch[1];

    // Site Name
    const siteMatch = html.match(/<meta\s+property="og:site_name"\s+content="([^"]*)"/i);
    if (siteMatch) ogData.siteName = siteMatch[1];

    // If no OG data found, try to extract basic info
    if (!ogData.title) {
      const pageTitleMatch = html.match(/<title>([^<]*)<\/title>/i);
      if (pageTitleMatch) ogData.title = pageTitleMatch[1];
    }

    return Object.keys(ogData).length > 0 ? ogData : null;
  } catch (error) {
    console.error("Error fetching OpenGraph data:", error);
    return null;
  }
}
