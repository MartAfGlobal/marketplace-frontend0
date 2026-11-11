"use client";

import Image from "next/image";
import priorityHighIcon from "@/assets/admin/priorityHigh.svg";
import priorityMediumIcon from "@/assets/admin/priorityMedium.svg";
import priorityLowIcon from "@/assets/admin/priorityLow.svg";
import { getSupportPriorityStyle } from "./supportTickets";

export default function SupportPriorityLabel({
  priority,
}: {
  priority: string;
}) {
  const normalizedPriority = priority.toLowerCase();
  const priorityIcon = normalizedPriority.includes("high") ||
    normalizedPriority.includes("urgent")
    ? priorityHighIcon
    : normalizedPriority.includes("medium")
      ? priorityMediumIcon
      : normalizedPriority.includes("low")
        ? priorityLowIcon
        : null;

  return (
    <span
      className={`inline-flex items-center gap-0 whitespace-nowrap ${getSupportPriorityStyle(
        priority,
      )}`}
    >
      {priorityIcon && (
        <div className="flex h-4 w-4 items-center justify-center ">
          <Image height={9} width={8.5} src={priorityIcon} alt="" aria-hidden="true" />
        </div>
        
      )}
      {priority}
    </span>
  );
}
