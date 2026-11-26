"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { SectionTitle, Row, NumberField, MoneyField, Dropdown } from "./SettingsControls";

export default function PayoutsSettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const data = useSelector((s: RootState) => s.adminSettings.sections.payouts ?? null);

  useEffect(() => { fetchSettingsSection("payouts"); /* eslint-disable-next-line */ }, []);
  const d = data || {};
  const save = (patch: Record<string, any>) => updateSettingsSection("payouts", patch);

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Payouts</h2>

      {/* Methods + BVN */}
      <div>
        <Row title="Payout methods" desc="Choose where seller's payout are sent">
          <Dropdown
            value={d.payout_method ?? "bank_account"}
            options={[
              { value: "bank_account", label: "Bank account" },
              { value: "momo", label: "Momo" },
              { value: "paystack", label: "Paystack" },
            ]}
            onChange={(v) => save({ payout_method: v })}
          />
        </Row>
        <Row title="Require BVN" desc="Choose if verification is required before payout">
          <ToggleSwitch checked={!!d.bvn_required} onChange={() => save({ bvn_required: !d.bvn_required })} />
        </Row>
        {d.bvn_required && (
          <Row title="BVN verification method" desc="Choose what verification method is used" indent>
            <Dropdown
              value={d.bvn_verification_method ?? "automatic"}
              options={[
                { value: "automatic", label: "Automatic" },
                { value: "manual", label: "Manual" },
              ]}
              onChange={(v) => save({ bvn_verification_method: v })}
            />
          </Row>
        )}
      </div>

      {/* Accounts */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Accounts</SectionTitle>
        <Row title="Maximum account per seller" desc="Choose the maximum number of accounts a seller can have">
          <NumberField value={d.max_bank_accounts_per_seller} unit="Accounts" min={1}
            onSave={(v) => save({ max_bank_accounts_per_seller: v })} />
        </Row>
        <Row title="New account cooldown" desc="Choose how long a newly added account stays on pause">
          <NumberField value={d.new_account_cooldown_hours} unit="Hours" min={0}
            onSave={(v) => save({ new_account_cooldown_hours: v })} />
        </Row>
      </div>

      {/* Withdrawal limits */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Withdrawal limits</SectionTitle>
        <Row title="Minimum amount" desc="Choose the minimum amount for withdrawals">
          <MoneyField value={d.min_withdrawal_amount} onSave={(v) => save({ min_withdrawal_amount: v })} />
        </Row>
        <Row title="Maximum amount" desc="Choose the maximum amount for withdrawals">
          <MoneyField value={d.max_withdrawal_amount} onSave={(v) => save({ max_withdrawal_amount: v })} />
        </Row>
        <Row title="Maximum amount per day" desc="Choose the maximum total a seller may withdraw in a day">
          <MoneyField value={d.max_withdrawal_per_day} onSave={(v) => save({ max_withdrawal_per_day: v })} />
        </Row>
        <Row title="Require OTP for withdrawals" desc="Choose if an OTP is sent before a withdrawal is processed">
          <ToggleSwitch checked={!!d.require_otp_for_withdrawals}
            onChange={() => save({ require_otp_for_withdrawals: !d.require_otp_for_withdrawals })} />
        </Row>
      </div>

      {/* Holds */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Holds</SectionTitle>
        <Row title="Pause payout if KYC is unverified" desc="Choose if payouts work for unverified sellers">
          <ToggleSwitch checked={!!d.pause_payouts_on_verification_lapse}
            onChange={() => save({ pause_payouts_on_verification_lapse: !d.pause_payouts_on_verification_lapse })} />
        </Row>
        <Row title="New seller payout cooldown" desc="Choose the cooldown time for new sellers withdrawals">
          <NumberField value={d.new_seller_payout_cooldown_hours} unit="Hours" min={0}
            onSave={(v) => save({ new_seller_payout_cooldown_hours: v })} />
        </Row>
      </div>
    </div>
  );
}
