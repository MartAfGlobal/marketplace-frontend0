import { LEDGER_STATUS_STYLES } from "@/helpers/admin/financeFormat";

interface FinanceStatusPillProps {
  status: string;
  label: string;
}

// Same pill every admin table uses for a status (see StaffTable's
// STATUS_STYLES), keyed by the ledger/withdrawal status code.
export default function FinanceStatusPill({ status, label }: FinanceStatusPillProps) {
  return (
    <span
      className={`text-[10px] px-4 py-1 inline-flex items-center justify-center h-6 rounded-c32 text-center ${
        LEDGER_STATUS_STYLES[status] ?? "text-000000/44 bg-000000/8"
      }`}
    >
      {label}
    </span>
  );
}
