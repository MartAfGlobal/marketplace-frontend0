"use client";

// The row/select-all checkbox used across every admin table (BuyersTable,
// VerificationsTable, StaffTable, RolesTable, ...) — one definition instead
// of each table re-implementing the same little SVG-check button.
export default function AdminRowCheckbox({
  checked,
  onClick,
  ariaLabel,
}: {
  checked: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`group flex h-4 w-4 items-center justify-center border duration-200 ${
        checked ? "border-[#ff715b] bg-[#ff715b]" : "border-[#161616] hover:border-[#ff715b]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-2.5 w-2.5 ${
          checked ? "text-white" : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
        }`}
      >
        <path d="M5 12.5 9.5 17 19 7.5" />
      </svg>
    </button>
  );
}
