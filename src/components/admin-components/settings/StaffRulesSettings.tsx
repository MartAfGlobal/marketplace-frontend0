"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { SectionTitle, Row, NumberField, TextField } from "./SettingsControls";

export default function StaffRulesSettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const data = useSelector((s: RootState) => s.adminSettings.sections.staffPolicy ?? null);

  useEffect(() => { fetchSettingsSection("staffPolicy"); /* eslint-disable-next-line */ }, []);
  const d = data || {};
  const save = (patch: Record<string, any>) => updateSettingsSection("staffPolicy", patch);

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Staff rules</h2>

      <div>
        <SectionTitle>Security &amp; invites</SectionTitle>
        <Row title="Temporary password expiry timeout" desc="How long a temporary password remains valid">
          <NumberField value={d.temp_password_expiry_minutes} unit="Minutes" min={1}
            onSave={(v) => save({ temp_password_expiry_minutes: v })} />
        </Row>
        <Row title="Login session timeout" desc="How long a staff login session stays valid">
          <NumberField value={d.session_timeout_days} unit="days" min={1}
            onSave={(v) => save({ session_timeout_days: v })} />
        </Row>
        <Row title="Allow email domain" desc="Only emails with this domain are allowed to login">
          <TextField value={d.invite_email_domain} placeholder="@martaf.com"
            onSave={(v) => save({ invite_email_domain: v })} />
        </Row>
      </div>

      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Audit</SectionTitle>
        <Row title="Audit logs retention period" desc="How long before audit logs are cleared">
          <NumberField value={d.audit_log_retention_months} unit="Months" min={1}
            onSave={(v) => save({ audit_log_retention_months: v })} />
        </Row>
      </div>
    </div>
  );
}
