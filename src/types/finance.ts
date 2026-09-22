// ---------------------------------------------------------------------------
// Admin Finance API Types (commission/admin/finance/*)
// ---------------------------------------------------------------------------

export type FinancePeriod = "today" | "this_week" | "this_month" | "last_month" | "this_year";

export type LedgerStatus = "COMPLETED" | "PENDING" | "FAILED";
export type LedgerDirection = "CREDIT" | "DEBIT";
export type LedgerKind = "ORDER_PAYMENT" | "REFUND" | "PAYOUT";

export interface FinanceTransaction {
  id: number;
  transaction_id: string;
  date: string;
  entity_ref: string;
  entity_type: LedgerKind;
  entity_type_label: string;
  amount: number | string;
  type: LedgerDirection;
  status: LedgerStatus;
  status_label: string;
  fees: string;
  reference: string;
}

export interface FinanceMoneyFlow {
  number_of_transactions: number;
  debits: string;
  credits: string;
  pending: string;
}

export interface TimelineStep {
  step: string;
  detail: string;
  timestamp: string | null;
  state: "done" | "pending" | "failed";
}

export interface BreakdownRow {
  label: string;
  amount: string;
  total?: boolean;
}

export interface BankSnapshot {
  type: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface FinanceTransactionDetail extends FinanceTransaction {
  description: string;
  timeline: TimelineStep[];
  line_items: { name: string; amount: string }[];
  breakdown: BreakdownRow[];
  payment_method: string | BankSnapshot | null;
  tpp_service: string | null;
  seller: { id: number; seller_id: string; business_name: string } | null;
  orders: string[];
}

export interface FinancePayout {
  id: number;
  created_at: string;
  payout_method: string;
  amount: number | string;
  balance: number | string | null;
  status: string;
  status_code: string;
  fees: number | string | null;
  seller_id: string;
  manufacturer_id: number;
  business_name: string;
  withdrawal_reference: string;
  transaction_id: string | null;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardSlice {
  label: string;
  amount: string;
  series: DashboardSeriesPoint[];
}

export interface DashboardSeriesPoint {
  date: string;
  amount: string;
}

export interface DashboardFigure {
  total: string;
  change_percent: number | null;
  series: DashboardSeriesPoint[];
  sources: DashboardSlice[];
}

export interface FinanceDashboard {
  period: string;
  revenue: DashboardFigure;
  expenses: DashboardFigure & { taxes_estimated: boolean };
  pending_payouts: {
    count: number;
    total_amount: string;
    items: {
      id: number;
      transaction_id: string | null;
      amount: string;
      created_at: string;
      source: string;
      priority: "High" | "Medium" | "Normal";
    }[];
  };
}

export type SourceGrouping = "category" | "region" | "service";

// ── Tax & compliance ───────────────────────────────────────────────────────
export interface TaxRate {
  id: number;
  country: number;
  country_name: string;
  country_code: string;
  rate_percent: string;
  is_active: boolean;
  notes: string;
}

export interface TaxDashboard {
  total_revenue: string;
  total_tax_owed: string;
  by_country: {
    country: string;
    country_code: string;
    rate_percent: string;
    revenue: string;
    tax_owed: string;
  }[];
}

// ── Third-party providers ──────────────────────────────────────────────────
export interface ThirdPartyProvider {
  id: number;
  name: string;
  service_type: string;
  service_type_display: string;
  country: number | null;
  country_name: string | null;
  is_active: boolean;
  notes: string;
  total_fees_paid: string;
}

export interface TPPBillingRecord {
  id: number;
  provider: number;
  amount: string;
  description: string;
  invoice_reference: string;
  invoice_document_url: string | null;
  billed_at: string;
}

// ── Martaf earnings ────────────────────────────────────────────────────────
export interface EarningsSummary {
  period: string;
  service_fee_earned: string;
  service_fee_earned_change_percent: number | null;
  service_fee_pending: string;
  total_costs: string;
  costs: { label: string; amount: string }[];
  net_profit: string;
  net_profit_change_percent: number | null;
  series: DashboardSeriesPoint[];
}

export interface ServiceChargeEntry {
  id: number;
  transaction_id: string;
  date: string;
  order_id: string;
  seller_id: string | null;
  business_name: string | null;
  order_subtotal: string | null;
  amount: number | string;
  fee_rate_percent: string;
  reference: string;
}

// ── Escrow release ─────────────────────────────────────────────────────────
export interface EscrowOrder {
  id: string;
  order_id: string;
  seller_id: string;
  manufacturer_id: number;
  business_name: string;
  subtotal: string;
  service_fee: string;
  amount: string;
  status: string;
  status_label: string;
  delivered_at: string | null;
  escrow_release_date: string | null;
  has_dispute: boolean;
  releasable: boolean;
  blockers: string[];
  auto_payout_enabled: boolean;
}

export interface EscrowSummary {
  releasable_count: number;
  releasable_amount: string;
  in_escrow_count: number;
  in_escrow_amount: string;
}

export interface EscrowRunResult {
  message: string;
  paid: number;
  closed_with_nothing_owed: number;
  failed: number;
  released: { seller: string; order: string; amount: string }[];
  errors: { order: string; error: string }[];
}
