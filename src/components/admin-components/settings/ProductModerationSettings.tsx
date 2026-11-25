"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { Row, NumberField, Dropdown, Segmented } from "./SettingsControls";

export default function ProductModerationSettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const data = useSelector((s: RootState) => s.adminSettings.sections.productModeration ?? null);

  useEffect(() => { fetchSettingsSection("productModeration"); /* eslint-disable-next-line */ }, []);
  const d = data || {};
  const save = (patch: Record<string, any>) => updateSettingsSection("productModeration", patch);
  const allowResubmission = d.rejection_behaviour === "allow_resubmission";

  return (
    <div className="space-y-2">
      <h2 className="text-c20 font-MontserratSemiBold text-161616 mb-5">Product moderation</h2>

      <Row title="Approval mode" desc="How new product listings are approved">
        <Segmented
          value={d.approval_mode ?? "manual"}
          options={[
            { value: "manual", label: "Manual" },
            { value: "automatic", label: "Automatic" },
          ]}
          onChange={(v) => save({ approval_mode: v })}
        />
      </Row>
      <Row title="Pass mark" desc="Minimum checklist score to approve a product">
        <NumberField value={d.pass_mark_percent} unit="%" min={0}
          onSave={(v) => save({ pass_mark_percent: v })} />
      </Row>
      <Row title="Rejection behaviour" desc="What happens when a product is rejected">
        <Dropdown
          value={d.rejection_behaviour ?? "removed"}
          options={[
            { value: "removed", label: "Removed" },
            { value: "allow_resubmission", label: "Allow resubmission" },
          ]}
          onChange={(v) => save({ rejection_behaviour: v })}
        />
      </Row>
      <Row title="How many resubmissions after rejection" desc="Only active if allow resubmission is selected" muted={!allowResubmission}>
        <NumberField value={d.max_resubmissions} unit="times" min={1} disabled={!allowResubmission}
          onSave={(v) => save({ max_resubmissions: v })} />
      </Row>
    </div>
  );
}
