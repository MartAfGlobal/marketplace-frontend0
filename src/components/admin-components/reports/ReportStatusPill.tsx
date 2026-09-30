"use client";

// A generic status pill for every Reports table -- FinanceStatusPill exists
// already, but it's keyed to Finance's own ledger status codes and falls
// back to flat gray for anything else, which is most order/refund/dispute/
// buyer/seller/staff status codes in this module. This one buckets by
// common keyword instead, so every status across every section gets a
// colored label without a per-domain lookup table.
const POSITIVE = ['COMPLETED', 'DELIVERED', 'RESOLVED', 'RELEASED', 'APPROVED', 'VERIFIED', 'ACTIVE', 'PAID', 'CLOSED', 'SUCCESS'];
const NEGATIVE = ['CANCELLED', 'CANCELED', 'REJECTED', 'FAILED', 'SUSPENDED', 'INACTIVE', 'FAILURE'];
const WARNING = [
  'PENDING', 'PROCESSING', 'ESCROWED', 'REQUESTED', 'ACCEPTED', 'IN_TRANSIT_TO_HUB',
  'RECEIVED_AT_HUB', 'SHIPPED_TO_BUYER', 'NEEDS_MORE_INFO',
];

const TONE_CLASSES: Record<string, string> = {
  positive: 'text-[#2ea37d] bg-[#2ea37d]/10',
  negative: 'text-[#f44336] bg-[#f44336]/10',
  warning: 'text-[#B67300] bg-[#FFAC06]/12',
  neutral: 'text-000000/60 bg-000000/8',
};

const toneFor = (status: string) => {
  const key = status?.toUpperCase?.() ?? '';
  if (POSITIVE.includes(key)) return 'positive';
  if (NEGATIVE.includes(key)) return 'negative';
  if (WARNING.includes(key)) return 'warning';
  return 'neutral';
};

export default function ReportStatusPill({ status, label }: { status: string; label?: string }) {
  if (!status) return <span>—</span>;
  return (
    <span
      className={`text-[10px] px-3 py-1 inline-flex items-center justify-center h-6 rounded-c32 text-center font-MontserratSemiBold whitespace-nowrap ${TONE_CLASSES[toneFor(status)]}`}
    >
      {label ?? status}
    </span>
  );
}
