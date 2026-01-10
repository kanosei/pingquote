import { MessageSquareQuote } from "lucide-react";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const iconSize = size === "large" ? "h-6 w-6" : size === "small" ? "h-4 w-4" : "h-5 w-5";
  const padding = size === "large" ? "p-2" : size === "small" ? "p-1" : "p-1.5";
  const textSize = size === "large" ? "text-2xl" : size === "small" ? "text-base" : "text-xl";
  const gap = size === "small" ? "gap-1.5" : "gap-2";

  return (
    <div className={`flex items-center ${gap}`}>
      <div className={`${padding} bg-primary rounded-lg`}>
        <MessageSquareQuote className={`${iconSize} text-white`} />
      </div>
      <span className={`font-semibold ${textSize}`}>
        Ping<span className="text-primary">Quote</span>
      </span>
    </div>
  );
}
