"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";

function NumberField({ value, unit, onSave, min = 0, width = "w-28" }: {
  value: any; unit: string; onSave: (v: number) => void; min?: number; width?: string;
}) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <div className="flex items-center gap-2">
      <input type="number" min={min} value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          const next = v === "" ? min : Number(v);
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

export default function SellerOperationsSettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const orders = useSelector((s: RootState) => s.adminSettings.sections.orders ?? null);
  const ops = useSelector((s: RootState) => s.adminSettings.sections.productOperations ?? null);

  useEffect(() => {
    fetchSettingsSection("orders");
    fetchSettingsSection("productOperations");
    /* eslint-disable-next-line */
  }, []);

  const o = orders || {};
  const p = ops || {};
  const saveOrders = (patch: Record<string, any>) => updateSettingsSection("orders", patch);
  const saveOps = (patch: Record<string, any>) => updateSettingsSection("productOperations", patch);

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Seller operations</h2>

      {/* Order handling */}
      <div>
        <SectionTitle>Order handling</SectionTitle>
        <Row title="Order acceptance window" desc="How long an order stays pending before acceptance">
          <NumberField value={o.seller_acceptance_window_hours} unit="Hours" min={1}
            onSave={(v) => saveOrders({ seller_acceptance_window_hours: v })} />
        </Row>
        <Row title="Allow partial acceptance?" desc="Allow sellers accept only items they have from the order">
          <ToggleSwitch checked={!!o.allow_partial_fulfillment}
            onChange={() => saveOrders({ allow_partial_fulfillment: !o.allow_partial_fulfillment })} />
        </Row>
        <Row title="Dispatch deadline" desc="How long between acceptance and order dispatch">
          <NumberField value={o.seller_fulfillment_window_hours} unit="Hours" min={1}
            onSave={(v) => saveOrders({ seller_fulfillment_window_hours: v })} />
        </Row>
      </div>

      {/* Inventory */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Inventory</SectionTitle>
        <Row title="Low stock threshold" desc="Minimum number of items to trigger low stock alert">
          <NumberField value={p.low_stock_threshold} unit="items" min={0}
            onSave={(v) => saveOps({ low_stock_threshold: v })} />
        </Row>
        <Row title="Block product edits during active order" desc="Stop any product from being edited when part of an active order">
          <ToggleSwitch checked={!!p.block_product_edits_during_active_order}
            onChange={() => saveOps({ block_product_edits_during_active_order: !p.block_product_edits_during_active_order })} />
        </Row>
      </div>
    </div>
  );
}
