import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency?: string): string {
  if (amount === 0) {
    return "";
  }
  
  const targetCurrency = currency || getLocaleCurrency();
  const locale = (typeof window !== 'undefined' && navigator.language) || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: targetCurrency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return "Today";
  } else if (diffInDays < 2) {
    return `${Math.floor(diffInDays)} day ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`;
  } else {
    return formatDate(date);
  }
}

// Get currency from browser locale
export function getLocaleCurrency(): string {
  if (typeof window === "undefined") return "USD";

  const locale = navigator.language || "en-US";

  // Map common locales to currencies
  const localeToCurrency: Record<string, string> = {
    "en-US": "USD",
    "en-GB": "GBP",
    "en-IE": "EUR",
    "en-AU": "AUD",
    "en-CA": "CAD",
    "en-NZ": "NZD",
    "en-ZA": "ZAR",
    "de-DE": "EUR",
    "de-AT": "EUR",
    "de-CH": "CHF",
    "fr-FR": "EUR",
    "fr-CH": "CHF",
    "fr-CA": "CAD",
    "es-ES": "EUR",
    "es-MX": "MXN",
    "it-IT": "EUR",
    "nl-NL": "EUR",
    "pt-PT": "EUR",
    "pt-BR": "BRL",
    "ja-JP": "JPY",
    "zh-CN": "CNY",
    "ko-KR": "KRW",
    "ru-RU": "RUB",
    "pl-PL": "PLN",
    "sv-SE": "SEK",
    "no-NO": "NOK",
    "dk-DK": "DKK",
  };

  // Check exact match first
  if (localeToCurrency[locale]) {
    return localeToCurrency[locale];
  }

  // Check language prefix (e.g., "en" from "en-US")
  const lang = locale.split("-")[0];
  const countryCode = locale.split("-")[1];

  // Try to find by country code
  if (countryCode) {
    const matchingEntry = Object.entries(localeToCurrency).find(
      ([key]) => key.endsWith(`-${countryCode}`)
    );
    if (matchingEntry) {
      return matchingEntry[1];
    }
  }

  // Default to USD
  return "USD";
}

// List of supported currencies
export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
] as const;
