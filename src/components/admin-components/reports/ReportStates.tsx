"use client";

import { RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/** Skeleton placeholders shown only once a section is expanded and its first fetch is in flight. */
export function ReportLoadingSkeleton() {
  return (
    <div className="py-16 flex justify-center items-center">
      <LoadingSpinner size={32} color="border-ff715b" />
    </div>
  );
}

/** Data failed to load -- explicit retry, never a raw stack trace or blank screen. */
export function ReportErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-000000/68 font-MontserratNormal">Something went wrong loading this report.</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 text-c12 font-MontserratSemiBold text-[#ff715b] hover:text-[#e56550] transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );
}

/** No data in the selected range -- explains why rather than showing a blank chart/table. */
export function ReportEmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-xs text-000000/44 font-MontserratNormal">{message}</div>
  );
}

/** "Data as of [timestamp]" -- required on every section since MVP data isn't real-time. */
export function DataAsOf({ at }: { at: Date }) {
  return (
    <p className="text-[10px] text-000000/44 font-MontserratNormal mt-4">
      Data as of {at.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
    </p>
  );
}
