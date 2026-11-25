"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";

function NumberField({ value, unit, onSave, min = 0, nullable = false, width = "w-28" }: {
  value: any; unit: string; onSave: (v: number | null) => void; min?: number; nullable?: boolean; width?: string;
}) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <div className="flex items-center gap-2">
      <input type="number" min={min} value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          const next = v === "" ? (nullable ? null : 0) : Number(v);
          if (String(v) !== String(value ?? "")) onSave(next);
        }}
        className={`${width} h-10 px-3 text-center rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14`} />
      <span className="text-c14 text-000000/50">{unit}</span>
    </div>
  );
}

function Row({ title, desc, children }: any) {
  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div>
        <p className="text-c14 text-161616">{title}</p>
        {desc && <p className="text-c12 text-000000/45 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ children }: any) {
  return <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-1">{children}</h3>;
}

export default function BuyerRulesSettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const data = useSelector((s: RootState) => s.adminSettings.sections.orders ?? null);

  useEffect(() => { fetchSettingsSection("orders"); /* eslint-disable-next-line */ }, []);
  const save = (patch: Record<string, any>) => updateSettingsSection("orders", patch);
  const d = data || {};

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Buyer rules</h2>

      {/* Order limits */}
      <div>
        <SectionTitle>Order limits</SectionTitle>
        <Row title="Maximum order amount" desc="Largest total a single order may reach. Blank = no limit.">
          <NumberField value={d.max_order_amount} unit="Naira" nullable min={0} onSave={(v) => save({ max_order_amount: v })} />
        </Row>
      </div>

      {/* Payment & checkout */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Payment &amp; checkout</SectionTitle>
        <Row title="Unpaid order duration" desc="How long a pending payment order exists">
          <NumberField value={d.unpaid_order_expiry_hours} unit="Hours" min={1} onSave={(v) => save({ unpaid_order_expiry_hours: v })} />
        </Row>
        <Row title="Allow partial fulfilment on orders" desc="Allow an order with some items not being available">
          <ToggleSwitch checked={!!d.allow_partial_fulfillment} onChange={() => save({ allow_partial_fulfillment: !d.allow_partial_fulfillment })} />
        </Row>
        <Row title="Allow guest checkout" desc="Enable users with no account to make an order">
          <ToggleSwitch checked={!!d.allow_guest_checkout} onChange={() => save({ allow_guest_checkout: !d.allow_guest_checkout })} />
        </Row>
      </div>

      {/* Cancellation */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Cancellation</SectionTitle>
        <Row title="Users can cancel until" desc="At what point during the order cycle can buyers cancel">
          <select value={d.cancel_until ?? "order_accepted"} onChange={(e) => save({ cancel_until: e.target.value })}
            className="h-11 px-4 rounded-xl border border-000000/10 bg-[#f4f4f6] text-c14 outline-none">
            <option value="order_placed">Order is placed</option>
            <option value="order_accepted">Order is accepted</option>
            <option value="order_shipped">Order is shipped</option>
          </select>
        </Row>
        <Row title="Compulsory reason for order cancellation" desc="Require a reason when a buyer cancels an order">
          <ToggleSwitch checked={!!d.compulsory_cancellation_reason} onChange={() => save({ compulsory_cancellation_reason: !d.compulsory_cancellation_reason })} />
        </Row>
      </div>

      {/* Delivery */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Delivery</SectionTitle>
        <Row title="Auto confirm delivery after" desc="Auto confirmation of delivery if the buyer doesn't confirm">
          <NumberField value={d.auto_confirm_delivery_days} unit="days" min={1} onSave={(v) => save({ auto_confirm_delivery_days: v })} />
        </Row>
      </div>
    </div>
  );
}
