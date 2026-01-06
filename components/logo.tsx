import { MessageSquareQuote } from "lucide-react";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${size === "large" ? "p-2" : "p-1.5"} bg-primary rounded-lg`}>
        <MessageSquareQuote className={`${size === "large" ? "h-6 w-6" : "h-5 w-5"} text-white`} />
      </div>
      <span className={`font-semibold ${size === "large" ? "text-2xl" : "text-xl"}`}>
        Ping<span className="text-primary">Quote</span>
      </span>
    </div>
  );
}
