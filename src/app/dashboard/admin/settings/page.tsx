"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  ShieldCheck,
  ShoppingCart,
  Package,
  Gavel,
  UserSquare2,
  Wallet,
  RotateCcw,
  Truck,
  Headset,
  ListChecks,
} from "lucide-react";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import SettingsCard, { SettingsFieldSchema } from "@/components/admin-components/settings/SettingsCard";
import ChecklistEditor from "@/components/admin-components/settings/ChecklistEditor";
import ReasonsEditor from "@/components/admin-components/settings/ReasonsEditor";
import type { PermissionCategoryKey } from "@/types/admin";
import type { SettingsSectionKey } from "@/store/admin/settings/adminSettingsSlice";

interface SectionDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: PermissionCategoryKey;
}

const NAV_SECTIONS: SectionDef[] = [
  { id: "security", label: "Security", icon: <ShieldCheck className="w-4 h-4" />, category: "USERS" },
  { id: "orders", label: "Order rules", icon: <ShoppingCart className="w-4 h-4" />, category: "ORDERS" },
  { id: "products", label: "Product operations", icon: <Package className="w-4 h-4" />, category: "PRODUCTS" },
  { id: "disputes", label: "Disputes", icon: <Gavel className="w-4 h-4" />, category: "ORDERS" },
  { id: "staff", label: "Staff policy", icon: <UserSquare2 className="w-4 h-4" />, category: "STAFF" },
  { id: "finance", label: "Fees & commission", icon: <Wallet className="w-4 h-4" />, category: "FINANCES" },
  { id: "refunds", label: "Returns & refunds", icon: <RotateCcw className="w-4 h-4" />, category: "FINANCES" },
  { id: "shipping", label: "Shipping operations", icon: <Truck className="w-4 h-4" />, category: "ORDERS" },
  { id: "support", label: "Support SLA", icon: <Headset className="w-4 h-4" />, category: "SUPPORT" },
  { id: "reasons", label: "Reasons & lists", icon: <ListChecks className="w-4 h-4" />, category: "ORDERS" },
];

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

export default function AdminSettingsPage() {
  const { can } = useAdminAccess();
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const sections = useSelector((state: RootState) => state.adminSettings.sections);
  const [activeNav, setActiveNav] = useState(NAV_SECTIONS[0].id);

  const visibleNav = NAV_SECTIONS.filter((s) => can(s.category, "view"));

  useEffect(() => {
    const keys: SettingsSectionKey[] = [
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
    keys.forEach((k) => fetchSettingsSection(k));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [visibleNav.length]);

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const save = (key: SettingsSectionKey) => (changed: Record<string, any>) =>
    new Promise<void>((resolve) => {
      updateSettingsSection(key, changed, () => resolve(), () => resolve());
    });

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <aside className="lg:w-56 flex-shrink-0">
        <div className="lg:sticky lg:top-24 bg-white rounded-2xl p-3 border border-000000/4 flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide">
          {visibleNav.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-c14 font-MontserratMedium whitespace-nowrap transition-colors ${
                activeNav === s.id
                  ? "bg-6a0dad/10 text-6a0dad"
                  : "text-000000/60 hover:bg-000000/4"
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 space-y-6 min-w-0">
        <div>
          <h1 className="text-c20 font-MontserratSemiBold text-161616">Settings</h1>
          <p className="text-c14 text-000000/50 mt-1">
            Platform-wide rules. Changes here apply across buyer, seller and admin apps immediately and are logged in the audit trail.
          </p>
        </div>

        {can("USERS", "view") && (
          <div id="security">
            <SettingsCard
              title="Security"
              description="Sign-in and account-security rules."
              category="USERS"
              fields={SECURITY_FIELDS}
              data={sections.security ?? null}
              onSave={save("security")}
            />
          </div>
        )}

        {can("ORDERS", "view") && (
          <div id="orders">
            <SettingsCard
              title="Order rules"
              description="Timing windows that govern order acceptance, fulfillment and payment."
              category="ORDERS"
              fields={ORDER_RULES_FIELDS}
              data={sections.orders ?? null}
              onSave={save("orders")}
            />
          </div>
        )}

        {can("PRODUCTS", "view") && (
          <div id="products" className="space-y-6">
            <SettingsCard
              title="Product operations"
              description="Seller-facing product and inventory rules."
              category="PRODUCTS"
              fields={PRODUCT_OPS_FIELDS}
              data={sections.productOperations ?? null}
              onSave={save("productOperations")}
            />
            <SettingsCard
              title="Product moderation"
              description="Review-checklist pass criteria and image rules."
              category="PRODUCTS"
              fields={PRODUCT_MODERATION_FIELDS}
              data={sections.productModeration ?? null}
              onSave={save("productModeration")}
            />
            <ChecklistEditor />
          </div>
        )}

        {can("ORDERS", "view") && (
          <div id="disputes">
            <SettingsCard
              title="Disputes"
              description="Rules for buyer/seller disputes."
              category="ORDERS"
              fields={DISPUTE_FIELDS}
              data={sections.disputes ?? null}
              onSave={save("disputes")}
            />
          </div>
        )}

        {can("STAFF", "view") && (
          <div id="staff">
            <SettingsCard
              title="Staff policy"
              description="Rules for staff accounts and invitations."
              category="STAFF"
              fields={STAFF_POLICY_FIELDS}
              data={sections.staffPolicy ?? null}
              onSave={save("staffPolicy")}
            />
          </div>
        )}

        {can("FINANCES", "view") && (
          <div id="finance">
            <SettingsCard
              title="Fees & commission"
              description="Platform commission and fee rates."
              category="FINANCES"
              fields={FINANCE_FIELDS}
              data={sections.finance ?? null}
              onSave={save("finance")}
            />
          </div>
        )}

        {can("FINANCES", "view") && (
          <div id="refunds" className="space-y-6">
            <SettingsCard
              title="Payouts"
              description="Withdrawal and bank-detail rules for sellers."
              category="FINANCES"
              fields={PAYOUT_FIELDS}
              data={sections.payouts ?? null}
              onSave={save("payouts")}
            />
            <SettingsCard
              title="Returns & refunds"
              description="Return window and refund timeline."
              category="FINANCES"
              fields={REFUND_FIELDS}
              data={sections.refunds ?? null}
              onSave={save("refunds")}
            />
          </div>
        )}

        {can("ORDERS", "view") && (
          <div id="shipping">
            <SettingsCard
              title="Shipping operations"
              description="Warehouse and delivery rules."
              category="ORDERS"
              fields={SHIPPING_FIELDS}
              data={sections.shippingOperations ?? null}
              onSave={save("shippingOperations")}
            />
          </div>
        )}

        {can("SUPPORT", "view") && (
          <div id="support">
            <SettingsCard
              title="Support SLA"
              description="Agent workload caps and response-time targets."
              category="SUPPORT"
              fields={SUPPORT_FIELDS}
              data={sections.support ?? null}
              onSave={save("support")}
            />
          </div>
        )}

        <div id="reasons">
          <ReasonsEditor />
        </div>
      </div>
    </div>
  );
}
