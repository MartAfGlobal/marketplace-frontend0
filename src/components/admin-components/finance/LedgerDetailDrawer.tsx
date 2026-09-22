"use client";

import { useEffect, useState, type ReactElement } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, RefreshCw, X, XCircle } from "lucide-react";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { formatDate, formatNaira, formatTime, LEDGER_STATUS_STYLES } from "@/helpers/admin/financeFormat";
import type { BankSnapshot, FinanceTransactionDetail, TimelineStep } from "@/types/finance";

interface LedgerDetailDrawerProps {
  /** Ledger transaction id (TXN-…) to show; the drawer is closed when null. */
  transactionId?: string | null;
  /** Withdrawal id: opens the payout variant (Payout management screen). */
  payoutId?: number | null;
  onClose: () => void;
}

const STEP_ICON: Record<TimelineStep["state"], ReactElement> = {
  done: <CheckCircle2 className="w-5 h-5 text-[#00BE5C]" />,
  pending: <RefreshCw className="w-5 h-5 text-[#FFAC06]" />,
  failed: <XCircle className="w-5 h-5 text-[#CA0202]" />,
};

const Label = ({ children }: { children: string }) => (
  <p className="text-[10px] font-MontserratNormal text-000000/44 mb-1">{children}</p>
);

function paymentMethodLabel(method: FinanceTransactionDetail["payment_method"]) {
  if (!method) return "—";
  if (typeof method === "string") return method;
  const bank = method as BankSnapshot;
  return (
    <>
      {bank.account_number} <span className="mx-1 text-000000/32">•</span> {bank.bank_name}
    </>
  );
}

/**
 * The transaction drawer shared by Transactions (order / refund / payout) and
 * Payout management. Both are the same ledger entry; the payout variant leads
 * with the seller and the balance instead of the entity and gateway reference.
 */
export default function LedgerDetailDrawer({ transactionId, payoutId, onClose }: LedgerDetailDrawerProps) {
  const { fetchTransactionDetail, fetchPayoutDetail } = FinanceDetails();
  const [detail, setDetail] = useState<FinanceTransactionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const isPayout = payoutId != null;
  const isOpen = isPayout || !!transactionId;

  useEffect(() => {
    if (!isOpen) return;
    setDetail(null);
    setLoading(true);
    const done = () => setLoading(false);
    if (isPayout) fetchPayoutDetail(payoutId!, setDetail, done);
    else fetchTransactionDetail(transactionId!, setDetail, done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId, payoutId]);

  const isCredit = detail?.type === "CREDIT";
  const amountColor = isCredit ? "text-[#00BE5C]" : "text-[#CA0202]";
  const breakdown = detail?.breakdown ?? [];
  const total = breakdown.find((r) => r.total);
  const rest = breakdown.filter((r) => !r.total);
  const beforeWithdrawal = rest.find((r) => r.label === "Before withdrawal");

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose} maxWidthClassName="max-w-[580px]">
      <button onClick={onClose} className="absolute right-8 top-8 text-000000/44 hover:text-000000 cursor-pointer" aria-label="Close">
        <X className="w-6 h-6" />
      </button>

      {loading || !detail ? (
        <div className="flex-1 flex justify-center items-center py-24">
          <LoadingSpinner size={32} color="border-ff715b" />
        </div>
      ) : (
        <div className="overflow-y-auto scrollbar-hide -mr-2 pr-2 space-y-6">
          {/* Header */}
          <div>
            <Label>{isPayout ? "Seller ID" : "Transaction ID"}</Label>
            <p className={`text-c18 font-MontserratNormal ${isPayout ? "text-[#ff715b]" : ""}`}>
              {isPayout ? detail.seller?.seller_id : detail.transaction_id}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5 pb-6 border-b border-000000/8">
            <div>
              <Label>Amount</Label>
              <p className={`text-c32 font-MontserratMedium flex items-center gap-2 ${amountColor}`}>
                {formatNaira(detail.amount, 0)}
                {isCredit ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
              </p>
            </div>
            <div>
              <Label>Date &amp; time</Label>
              <p className="text-sm font-MontserratNormal">
                {formatDate(detail.date)} &nbsp;{formatTime(detail.date)}
              </p>
            </div>
            {isPayout ? (
              <>
                <div>
                  <Label>Balance</Label>
                  <p className="text-sm font-MontserratNormal">
                    {beforeWithdrawal ? formatNaira(beforeWithdrawal.amount) : "—"}
                  </p>
                </div>
                <div>
                  <Label>Transaction ID</Label>
                  <p className="text-sm font-MontserratNormal">{detail.transaction_id}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Entity</Label>
                  <p className="text-sm font-MontserratNormal text-[#ff715b]">{detail.entity_ref}</p>
                </div>
                <div>
                  <Label>Transaction reference</Label>
                  <p className="text-sm font-MontserratNormal break-all">{detail.reference || "—"}</p>
                </div>
              </>
            )}
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 h-9 inline-flex items-center rounded-c32 bg-000000/4 text-sm font-MontserratNormal text-000000/68">
                Timeline
              </span>
              <div className="flex-1 border-t border-dashed border-000000/16" />
              <span
                className={`px-4 h-9 inline-flex items-center rounded-c32 text-sm font-MontserratNormal ${
                  LEDGER_STATUS_STYLES[detail.status]
                }`}
              >
                {detail.status_label}
              </span>
            </div>

            <ol>
              {detail.timeline.map((step, i) => (
                <li key={`${step.step}-${i}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {STEP_ICON[step.state]}
                    {i < detail.timeline.length - 1 && <div className="w-px flex-1 bg-000000/12 my-1" />}
                  </div>
                  <div className="flex-1 flex justify-between gap-4 pb-6 text-sm font-MontserratNormal text-000000/68">
                    <div>
                      <p>{step.step}</p>
                      {step.detail && <p className="text-000000/44">({step.detail})</p>}
                    </div>
                    <span className="whitespace-nowrap">{formatTime(step.timestamp)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Transaction details */}
          <div className="rounded-c8 border border-000000/8 overflow-hidden">
            <div className="flex justify-between px-6 py-3 bg-000000/4 text-sm font-MontserratNormal text-000000/68">
              <span>Transaction details</span>
              <span>Amount</span>
            </div>
            {detail.line_items.map((item, i) => (
              <div key={`${item.name}-${i}`} className="flex justify-between gap-4 px-6 py-3 text-sm font-MontserratNormal text-000000/68">
                <span>{item.name}</span>
                <span className="whitespace-nowrap">{formatNaira(item.amount, 0)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-3 text-sm font-MontserratNormal text-000000/68">
            {isPayout && beforeWithdrawal && (
              <div className="flex justify-between pb-3 border-b border-000000/8">
                <span>{beforeWithdrawal.label}</span>
                <span>{formatNaira(beforeWithdrawal.amount)}</span>
              </div>
            )}
            {rest
              .filter((r) => r !== beforeWithdrawal)
              .map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span>{row.label}</span>
                  <span>{formatNaira(row.amount)}</span>
                </div>
              ))}
            {total && (
              <div className="flex justify-between text-c18 font-MontserratMedium text-000000">
                <span>{total.label}</span>
                <span>{formatNaira(total.amount)}</span>
              </div>
            )}
          </div>

          {/* Method + TPP */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <Label>{isPayout || detail.entity_type === "PAYOUT" ? "Payout method" : "Payment method"}</Label>
              <p className="text-sm font-MontserratNormal">{paymentMethodLabel(detail.payment_method)}</p>
            </div>
            <div className="text-right">
              <Label>TPP payment service</Label>
              <p className="text-sm font-MontserratNormal">{detail.tpp_service ?? "—"}</p>
            </div>
          </div>
        </div>
      )}
    </DrawerWrapper>
  );
}
