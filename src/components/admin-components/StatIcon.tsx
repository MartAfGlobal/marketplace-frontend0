import type { ReactNode } from "react";

// Small colored-circle wrapper for a lucide icon inside a StatusFrame tile —
// shared by the Staff Management and Roles & Permissions stat rows so the
// tone→color mapping lives in one place.
type Tone = "neutral" | "positive" | "negative";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-500",
  positive: "bg-[#2ea37d]/10 text-[#2ea37d]",
  negative: "bg-[#f44336]/10 text-[#f44336]",
};

export default function StatIcon({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${TONE_CLASSES[tone]}`}>
      {children}
    </div>
  );
}
