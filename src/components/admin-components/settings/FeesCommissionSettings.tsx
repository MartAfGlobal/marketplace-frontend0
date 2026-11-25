"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { SectionTitle, Row, Dropdown, MoneyField } from "./SettingsControls";

/** Commission is stored as a fraction (0.0095) but shown as a percentage (0.95). */
function PercentField({ value, onSave }: { value: any; onSave: (fraction: number) => void }) {
  const toPct = (f: any) => (f === null || f === undefined || f === "" ? "" : String(+(Number(f) * 100).toFixed(4)));
  const [v, setV] = useState(toPct(value));
  useEffect(() => setV(toPct(value)), [value]);
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        step="0.01"
        min={0}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          if (String(v) !== String(toPct(value))) {
            const fraction = v === "" ? 0 : +(Number(v) / 100).toFixed(4);
            onSave(fraction);
          }
        }}
        className="w-24 h-11 px-3 text-center rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14"
      />
      <span className="text-c14 text-161616">%</span>
    </div>
  );
}

export default function FeesCommissionSettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const finance = useSelector((s: RootState) => s.adminSettings.sections.finance ?? null);
  const payouts = useSelector((s: RootState) => s.adminSettings.sections.payouts ?? null);

  useEffect(() => {
    fetchSettingsSection("finance");
    fetchSettingsSection("payouts");
    /* eslint-disable-next-line */
  }, []);

  const f = finance || {};
  const p = payouts || {};
  const saveFinance = (patch: Record<string, any>) => updateSettingsSection("finance", patch);
  const savePayouts = (patch: Record<string, any>) => updateSettingsSection("payouts", patch);

  return (
    <div className="space-y-2">
      <h2 className="text-c20 font-MontserratSemiBold text-161616 mb-5">Fees &amp; Commission</h2>

      <SectionTitle>Default commission</SectionTitle>
      <Row title="Commission rate" desc="Choose the percentage rate per order">
        <PercentField value={f.commission_default_rate} onSave={(v) => saveFinance({ commission_default_rate: v })} />
      </Row>
      <Row title="Minimum rate" desc="Choose the minimum rate per order">
        <PercentField value={f.commission_min_rate} onSave={(v) => saveFinance({ commission_min_rate: v })} />
      </Row>
      <Row title="Maximum rate" desc="Choose the maximum rate per order">
        <PercentField value={f.commission_max_rate} onSave={(v) => saveFinance({ commission_max_rate: v })} />
      </Row>
      <Row title="Who pays the TPP charges" desc="Who bears the payment-gateway charge">
        <Dropdown
          value={f.gateway_charge_payer_purchase ?? "buyer"}
          options={[
            { value: "buyer", label: "Buyer" },
            { value: "seller", label: "Seller" },
            { value: "platform", label: "Platform" },
          ]}
          onChange={(v) => saveFinance({ gateway_charge_payer_purchase: v })}
        />
      </Row>
      <Row title="Maximum amount per day" desc="Largest total a seller may withdraw in a day">
        <MoneyField value={p.max_withdrawal_per_day} onSave={(v) => savePayouts({ max_withdrawal_per_day: v })} />
      </Row>
      <Row title="Require OTP for withdrawals" desc="Choose if an OTP is sent before a withdrawal is processed">
        <ToggleSwitch checked={!!p.require_otp_for_withdrawals}
          onChange={() => savePayouts({ require_otp_for_withdrawals: !p.require_otp_for_withdrawals })} />
      </Row>
    </div>
  );
}
