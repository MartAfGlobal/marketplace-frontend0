"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";

const thCls = "text-c12 font-MontserratMedium text-white/90 px-4 py-3";
const tdCls = "px-4 py-4 text-c14 text-161616";

function Segmented({ value, options, onChange }: { value: string; options: { v: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-000000/10">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className={`px-4 py-1.5 text-c13 font-MontserratMedium ${value === o.v ? "bg-[#1a8f3c] text-white" : "bg-white text-000000/55"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NumberField({ value, unit, onSave, min = 0 }: { value: any; unit: string; onSave: (v: number) => void; min?: number }) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <div className="flex items-center gap-2">
      <input type="number" min={min} value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => { if (String(v) !== String(value)) onSave(Number(v)); }}
        className="w-20 h-10 px-3 text-center rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14" />
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

export default function SignInSecuritySettings() {
  const { fetchSettingsSection, updateSettingsSection } = AdminSettingsDetails();
  const data = useSelector((s: RootState) => s.adminSettings.sections.security ?? null);

  useEffect(() => { fetchSettingsSection("security"); /* eslint-disable-next-line */ }, []);

  const save = (patch: Record<string, any>) => updateSettingsSection("security", patch);
  const d = data || {};

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Sign-in &amp; security</h2>

      {/* Sign-in methods */}
      <div>
        <SectionTitle>Sign-in methods</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-000000/5 mt-3">
          <table className="w-full min-w-[520px] border-collapse">
            <thead><tr className="bg-[#7b5bd6]">
              <th className={`${thCls} text-left`}>User</th>
              <th className={`${thCls} text-center`}>Email login</th>
              <th className={`${thCls} text-center`}>Google login</th>
            </tr></thead>
            <tbody>
              {[["Buyers", "buyers"], ["Sellers", "sellers"]].map(([label, k]) => (
                <tr key={k} className="border-t border-000000/5">
                  <td className={tdCls}>{label}</td>
                  <td className={`${tdCls} text-center`}><div className="flex justify-center"><ToggleSwitch checked={!!d[`email_login_${k}`]} onChange={() => save({ [`email_login_${k}`]: !d[`email_login_${k}`] })} /></div></td>
                  <td className={`${tdCls} text-center`}><div className="flex justify-center"><ToggleSwitch checked={!!d[`google_login_${k}`]} onChange={() => save({ [`google_login_${k}`]: !d[`google_login_${k}`] })} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email verification */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Email verification</SectionTitle>
        <Row title="Method for verification" desc="Verification method for security operations">
          <select value={d.verification_method ?? "otp"} onChange={(e) => save({ verification_method: e.target.value })}
            className="h-11 px-4 rounded-xl border border-000000/10 bg-[#f4f4f6] text-c14 outline-none">
            <option value="otp">OTP</option>
            <option value="link" disabled>Link (coming soon)</option>
            <option value="link_otp" disabled>Link + OTP (coming soon)</option>
          </select>
        </Row>
        <Row title="Code/link expiry period" desc="How long before an OTP code expires">
          <NumberField value={d.otp_expiry_minutes} unit="Minutes" min={1} onSave={(v) => save({ otp_expiry_minutes: v })} />
        </Row>
      </div>

      {/* Sessions */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Sessions</SectionTitle>
        <Row title={"“Remember me” duration"} desc="Login session duration">
          <NumberField value={d.remember_me_days} unit="days" min={1} onSave={(v) => save({ remember_me_days: v })} />
        </Row>
        <Row title="Sign out on password change" desc="Account is signed out across all sessions and devices">
          <ToggleSwitch checked={!!d.signout_on_password_change} onChange={() => save({ signout_on_password_change: !d.signout_on_password_change })} />
        </Row>
      </div>

      {/* Account deletion */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Account deletion</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-000000/5 mt-3">
          <table className="w-full min-w-[520px] border-collapse">
            <thead><tr className="bg-[#7b5bd6]">
              <th className={`${thCls} text-left`}>User</th>
              <th className={`${thCls} text-right pr-6`}>Method</th>
            </tr></thead>
            <tbody>
              {[["Buyers", "buyer_deletion_method"], ["Sellers", "seller_deletion_method"]].map(([label, key]) => (
                <tr key={key} className="border-t border-000000/5">
                  <td className={tdCls}>{label}</td>
                  <td className={`${tdCls} text-right pr-6`}>
                    <div className="flex justify-end">
                      <Segmented value={d[key] ?? "self_serve"} onChange={(v) => save({ [key]: v })}
                        options={[{ v: "self_serve", label: "Self serve" }, { v: "via_support", label: "Via support" }]} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Row title="Cool-off period" desc="How long before user's data is removed">
          <NumberField value={d.deletion_cooloff_days} unit="days" min={0} onSave={(v) => save({ deletion_cooloff_days: v })} />
        </Row>
      </div>
    </div>
  );
}
