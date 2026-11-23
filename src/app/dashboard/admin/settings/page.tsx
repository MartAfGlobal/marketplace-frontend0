"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import SettingsCard, { SettingsFieldSchema } from "@/components/admin-components/settings/SettingsCard";
import ChecklistEditor from "@/components/admin-components/settings/ChecklistEditor";
import ReasonsEditor from "@/components/admin-components/settings/ReasonsEditor";
import GeneralSettings from "@/components/admin-components/settings/GeneralSettings";
import LocalisationSettings from "@/components/admin-components/settings/LocalisationSettings";
import type { PermissionCategoryKey } from "@/types/admin";
import type { SettingsSectionKey } from "@/store/admin/settings/adminSettingsSlice";

/* ───────────────────────── Navigation model ─────────────────────────
 * The admin Settings area is grouped the way the new design lays it out
 * (PLATFORM / USERS / MARKETPLACE / COMMERCE / SUPPORT). Each leaf maps to
 * an existing RBAC PermissionCategory via `category` -- a leaf only shows
 * if the viewer can("view") that category, so no new permission concept is
 * introduced. `comingSoon` leaves are placeholders for sections the design
 * includes but the backend doesn't cover yet.
 */
interface NavItem {
  id: string;
  label: string;
  category: PermissionCategoryKey;
  comingSoon?: boolean;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { id: "general", label: "General", category: "STAFF" },
      { id: "localisation", label: "Localisation", category: "STAFF" },
      { id: "notifications", label: "Notifications", category: "STAFF", comingSoon: true },
      { id: "legal", label: "Legal pages", category: "STAFF", comingSoon: true },
      { id: "integrations", label: "Integrations", category: "STAFF", comingSoon: true },
    ],
  },
  {
    label: "Users",
    items: [
      { id: "security", label: "Sign-in & security", category: "USERS" },
      { id: "orders", label: "Buyer rules", category: "ORDERS" },
      { id: "seller-kyc", label: "Seller onboarding & KYC", category: "VERIFICATIONS", comingSoon: true },
      { id: "products", label: "Seller operations", category: "PRODUCTS" },
      { id: "staff", label: "Staff rules", category: "STAFF" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { id: "moderation", label: "Product moderation", category: "PRODUCTS" },
      { id: "reasons", label: "Reasons & lists", category: "ORDERS" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: "payments", label: "Payments", category: "FINANCES", comingSoon: true },
      { id: "finance", label: "Fees & commission", category: "FINANCES" },
      { id: "payouts", label: "Payouts", category: "FINANCES" },
      { id: "shipping", label: "Shipping & hubs", category: "ORDERS" },
      { id: "returns", label: "Returns & disputes", category: "FINANCES" },
    ],
  },
  {
    label: "Support",
    items: [{ id: "support", label: "Ticketing", category: "SUPPORT" }],
  },
];

/* ───────────────────────── Field schemas ───────────────────────── */
const SECURITY_FIELDS: SettingsFieldSchema[] = [
  { key: "otp_code_length", label: "OTP code length", type: "number", min: 4 },
  { key: "otp_expiry_minutes", label: "OTP expiry (minutes)", type: "number", min: 1 },
  { key: "otp_resend_cooldown_seconds", label: "OTP resend cooldown (seconds)", type: "number", min: 10 },
  { key: "login_lockout_enabled", label: "Lock account after repeated failed logins", type: "boolean" },
  { key: "login_lockout_max_attempts", label: "Max failed attempts before lockout", type: "number", min: 1 },
  { key: "login_lockout_duration_minutes", label: "Lockout duration (minutes)", type: "number", min: 1 },
];

const ORDER_RULES_FIELDS: SettingsFieldSchema[] = [
  { key: "seller_acceptance_window_hours", label: "Seller order-acceptance window (hours)", type: "number", min: 1 },
  { key: "seller_fulfillment_window_hours", label: "Seller fulfillment window (hours)", type: "number", min: 1 },
  { key: "unpaid_order_expiry_hours", label: "Unpaid order expiry (hours)", type: "number", min: 1 },
];

const PRODUCT_OPS_FIELDS: SettingsFieldSchema[] = [
  { key: "low_stock_threshold", label: "Low-stock warning level", type: "number", min: 0 },
  { key: "out_of_stock_threshold", label: "Out-of-stock level", type: "number", min: 0 },
];

const PRODUCT_MODERATION_FIELDS: SettingsFieldSchema[] = [
  { key: "min_pass_score", label: "Minimum checklist items required to approve", type: "number", min: 1 },
  { key: "trusted_sellers_skip_review", label: "Trusted sellers skip manual review", type: "boolean", helpText: "Not yet enforced — no trusted-seller classification exists yet." },
  { key: "image_min_px", label: "Minimum image size (px)", type: "number", min: 1 },
  { key: "image_max_px", label: "Maximum image size (px)", type: "number", min: 1 },
];

const DISPUTE_FIELDS: SettingsFieldSchema[] = [
  { key: "dispute_feedback_deadline_days", label: "Dispute feedback deadline (days)", type: "number", min: 1 },
];

const STAFF_POLICY_FIELDS: SettingsFieldSchema[] = [
  { key: "invite_token_ttl_days", label: "Staff invite link lifetime (days)", type: "number", min: 1 },
  { key: "invite_email_domain", label: "Restrict staff invites to email domain", type: "text", nullable: true, helpText: "e.g. martaf.com — leave blank to allow any domain." },
  { key: "staff_2fa_required", label: "Require two-factor authentication for staff", type: "boolean" },
];

const FINANCE_FIELDS: SettingsFieldSchema[] = [
  { key: "commission_default_rate", label: "Default commission rate", type: "decimal", step: "0.0001" },
  { key: "commission_min_rate", label: "Minimum commission rate", type: "decimal", step: "0.0001" },
  { key: "commission_max_rate", label: "Maximum commission rate", type: "decimal", step: "0.0001" },
  {
    key: "gateway_charge_payer_purchase",
    label: "Who pays the gateway charge on a purchase",
    type: "select",
    options: [
      { value: "buyer", label: "Buyer" },
      { value: "seller", label: "Seller" },
    ],
    helpText: "Not yet wired to the payment flow.",
  },
  {
    key: "gateway_charge_payer_withdrawal",
    label: "Who pays the gateway charge on a withdrawal",
    type: "select",
    options: [
      { value: "buyer", label: "Buyer" },
      { value: "seller", label: "Seller" },
    ],
    helpText: "Not yet wired to the payout flow. Refund gateway charges are always borne by the platform and aren't configurable.",
  },
  { key: "transaction_fee_amount", label: "Transaction fee (₦)", type: "decimal", nullable: true },
  { key: "service_charge", label: "Service charge (₦)", type: "decimal", nullable: true },
  { key: "processing_fee", label: "Processing fee (₦)", type: "decimal", nullable: true },
  { key: "membership_fee", label: "Membership fee (₦)", type: "decimal", nullable: true },
  { key: "account_maintenance_fee", label: "Account maintenance fee (₦)", type: "decimal", nullable: true },
  { key: "late_payment_penalty", label: "Late payment penalty (₦)", type: "decimal", nullable: true },
  { key: "shipping_deduction", label: "Shipping deduction (₦)", type: "decimal", nullable: true },
];

const PAYOUT_FIELDS: SettingsFieldSchema[] = [
  { key: "bvn_required", label: "Require BVN for payouts", type: "boolean" },
  { key: "max_bank_accounts_per_seller", label: "Max bank accounts per seller", type: "number", nullable: true },
  { key: "min_withdrawal_amount", label: "Minimum withdrawal amount (₦)", type: "decimal" },
  { key: "max_withdrawal_amount", label: "Maximum withdrawal amount (₦)", type: "decimal", nullable: true },
  {
    key: "payout_mode",
    label: "Payout mode",
    type: "select",
    options: [
      { value: "on_demand", label: "On demand" },
      { value: "scheduled", label: "Scheduled" },
    ],
    helpText: "Not yet wired — all payouts are on-demand today regardless of this value.",
  },
  { key: "pause_payouts_on_verification_lapse", label: "Pause payouts when verification lapses", type: "boolean", helpText: "Not yet wired." },
];

const REFUND_FIELDS: SettingsFieldSchema[] = [
  { key: "return_window_hours", label: "Return / dispute window (hours)", type: "number", min: 1 },
  { key: "refund_timeline_days_min", label: "Refund timeline — minimum (days)", type: "number", min: 1 },
  { key: "refund_timeline_days_max", label: "Refund timeline — maximum (days)", type: "number", min: 1 },
  { key: "photo_evidence_required", label: "Require photo evidence for returns", type: "boolean" },
];

const SHIPPING_FIELDS: SettingsFieldSchema[] = [
  { key: "warehouse_package_photo_required", label: "Require warehouse package photo", type: "boolean" },
  { key: "warehouse_package_photo_max_mb", label: "Max photo size (MB)", type: "number", min: 1 },
];

const SUPPORT_FIELDS: SettingsFieldSchema[] = [
  { key: "max_active_tickets_per_agent", label: "Max active tickets per agent", type: "number", min: 1 },
  { key: "near_capacity_threshold", label: "Near-capacity warning level", type: "number", min: 1 },
  { key: "allow_assignment_beyond_limit", label: "Allow assignment beyond the cap", type: "boolean", helpText: "On (default): the cap is informational only. Off: assignment is blocked once an agent is at the cap." },
  { key: "target_first_response_minutes", label: "Target first-response time (minutes)", type: "number", min: 1 },
  { key: "target_resolution_minutes", label: "Target resolution time (minutes)", type: "number", min: 1 },
  { key: "auto_assignment_enabled", label: "Auto-assignment enabled", type: "boolean" },
  { key: "allow_assignment_to_unavailable_agents", label: "Allow assignment to unavailable agents", type: "boolean" },
];

// Singleton sections pre-fetched on mount so switching between them is
// instant. General / checklist / reasons self-fetch in their own components.
const PREFETCH_KEYS: SettingsSectionKey[] = [
  "security",
  "orders",
  "productOperations",
  "productModeration",
  "staffPolicy",
  "finance",
  "payouts",
  "refunds",
  "disputes",
  "shippingOperations",
  "support",
];

export default function AdminSettingsPage() {
  const { can, loaded } = useAdminAccess();
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const sections = useSelector((state: RootState) => state.adminSettings.sections);

  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Groups/leaves the viewer may see, after RBAC + search filtering.
  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          can(item.category, "view") &&
          (q === "" ||
            item.label.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)),
      ),
    })).filter((group) => group.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sections, loaded]);

  const firstVisibleId = visibleGroups[0]?.items[0]?.id ?? "general";
  const [active, setActive] = useState<string>(firstVisibleId);

  // Keep `active` valid as permissions load / search narrows the list.
  useEffect(() => {
    const stillVisible = visibleGroups.some((g) => g.items.some((i) => i.id === active));
    if (!stillVisible && visibleGroups.length > 0) {
      setActive(visibleGroups[0].items[0].id);
    }
  }, [visibleGroups, active]);

  useEffect(() => {
    PREFETCH_KEYS.forEach((k) => fetchSettingsSection(k));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (key: SettingsSectionKey) => (changed: Record<string, any>) =>
    new Promise<void>((resolve) => {
      updateSettingsSection(key, changed, () => resolve(), () => resolve());
    });

  return (
    <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-000000/5 p-5 md:p-7">
      <div className="mb-6">
        <h1 className="text-c20 font-MontserratSemiBold text-161616">Settings</h1>
        <p className="text-c14 text-000000/50 mt-1">
          Platform wide configurations across buyers, sellers and admin platform.
          Changes apply immediately and are recorded in the audit trail.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-0">
        {/* Grouped section navigation */}
        <aside className="lg:w-60 flex-shrink-0 lg:border-r lg:border-000000/6 lg:pr-5">
          <div className="lg:sticky lg:top-24 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-000000/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search settings"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-000000/8 bg-white text-c14 outline-none focus:border-ff715b"
              />
            </div>

            <nav>
              {visibleGroups.map((group) => {
                const isCollapsed = !!collapsed[group.label];
                return (
                  <div key={group.label} className="mb-1 last:mb-0">
                    <button
                      onClick={() =>
                        setCollapsed((prev) => ({ ...prev, [group.label]: !prev[group.label] }))
                      }
                      className="w-full flex items-center justify-between px-3 py-2 text-c12 font-MontserratSemiBold text-000000/40 uppercase tracking-wide"
                    >
                      {group.label}
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {!isCollapsed && (
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-c14 font-MontserratMedium transition-colors ${
                              active === item.id
                                ? "bg-ff715b/10 text-ff715b"
                                : "text-000000/70 hover:bg-000000/4"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Active section content */}
        <div className="flex-1 min-w-0 lg:pl-8">
          {active === "general" && <GeneralSettings />}

          {active === "localisation" && <LocalisationSettings />}

          {active === "security" && (
            <SettingsCard
              flush
              title="Security"
              description="Sign-in and account-security rules."
              category="USERS"
              fields={SECURITY_FIELDS}
              data={sections.security ?? null}
              onSave={save("security")}
            />
          )}

          {active === "orders" && (
            <SettingsCard
              flush
              title="Order rules"
              description="Timing windows that govern order acceptance, fulfillment and payment."
              category="ORDERS"
              fields={ORDER_RULES_FIELDS}
              data={sections.orders ?? null}
              onSave={save("orders")}
            />
          )}

          {active === "products" && (
            <SettingsCard
              flush
              title="Product operations"
              description="Seller-facing product and inventory rules."
              category="PRODUCTS"
              fields={PRODUCT_OPS_FIELDS}
              data={sections.productOperations ?? null}
              onSave={save("productOperations")}
            />
          )}

          {active === "moderation" && (
            <div>
              <SettingsCard
                flush
                title="Product moderation"
                description="Review-checklist pass criteria and image rules."
                category="PRODUCTS"
                fields={PRODUCT_MODERATION_FIELDS}
                data={sections.productModeration ?? null}
                onSave={save("productModeration")}
              />
              <div className="pt-6">
                <ChecklistEditor />
              </div>
            </div>
          )}

          {active === "shipping" && (
            <SettingsCard
              flush
              title="Shipping operations"
              description="Warehouse and delivery rules."
              category="ORDERS"
              fields={SHIPPING_FIELDS}
              data={sections.shippingOperations ?? null}
              onSave={save("shippingOperations")}
            />
          )}

          {active === "returns" && (
            <div>
              <SettingsCard
                flush
                title="Returns & refunds"
                description="Return window and refund timeline."
                category="FINANCES"
                fields={REFUND_FIELDS}
                data={sections.refunds ?? null}
                onSave={save("refunds")}
              />
              <SettingsCard
                flush
                title="Disputes"
                description="Rules for buyer/seller disputes."
                category="ORDERS"
                fields={DISPUTE_FIELDS}
                data={sections.disputes ?? null}
                onSave={save("disputes")}
              />
            </div>
          )}

          {active === "staff" && (
            <SettingsCard
              flush
              title="Staff policy"
              description="Rules for staff accounts and invitations."
              category="STAFF"
              fields={STAFF_POLICY_FIELDS}
              data={sections.staffPolicy ?? null}
              onSave={save("staffPolicy")}
            />
          )}

          {active === "reasons" && <ReasonsEditor />}

          {active === "finance" && (
            <SettingsCard
              flush
              title="Fees & commission"
              description="Platform commission and fee rates."
              category="FINANCES"
              fields={FINANCE_FIELDS}
              data={sections.finance ?? null}
              onSave={save("finance")}
            />
          )}

          {active === "payouts" && (
            <SettingsCard
              flush
              title="Payouts"
              description="Withdrawal and bank-detail rules for sellers."
              category="FINANCES"
              fields={PAYOUT_FIELDS}
              data={sections.payouts ?? null}
              onSave={save("payouts")}
            />
          )}

          {active === "support" && (
            <SettingsCard
              flush
              title="Support SLA"
              description="Agent workload caps and response-time targets."
              category="SUPPORT"
              fields={SUPPORT_FIELDS}
              data={sections.support ?? null}
              onSave={save("support")}
            />
          )}

          {["notifications", "legal", "integrations", "seller-kyc", "payments"].includes(active) && (
            <div className="py-16 text-center">
              <p className="text-c16 font-MontserratSemiBold text-161616">Coming soon</p>
              <p className="text-c14 text-000000/50 mt-1">
                This section hasn’t been built yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
