"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import SettingsCard, { SettingsFieldSchema } from "./SettingsCard";
import MaintenanceCard from "./MaintenanceCard";

// General settings are platform-wide, gated under STAFF (see
// accounts/staff_access.py). All fields are plain free-text; the backend
// stores them as CharField so handles like "instagram.com/martaf" and bare
// map links are accepted as typed.
const GENERAL_CATEGORY = "STAFF" as const;

const CONTACT_FIELDS: SettingsFieldSchema[] = [
  { key: "support_email", label: "Support email", type: "text", nullable: true },
  { key: "general_email", label: "General email", type: "text", nullable: true },
  { key: "whatsapp_number", label: "Whatsapp number", type: "text", nullable: true },
  { key: "phone_number", label: "Phone number", type: "text", nullable: true },
];

const ADDRESS_FIELDS: SettingsFieldSchema[] = [
  { key: "country", label: "Country", type: "text", nullable: true },
  { key: "state", label: "State", type: "text", nullable: true },
  { key: "city", label: "City", type: "text", nullable: true },
  { key: "postal_code", label: "Postal code", type: "text", nullable: true },
  { key: "map_link", label: "Map link", type: "text", nullable: true },
];

const SOCIAL_FIELDS: SettingsFieldSchema[] = [
  { key: "instagram_url", label: "Instagram", type: "text", nullable: true },
  { key: "twitter_url", label: "X (twitter)", type: "text", nullable: true },
  { key: "facebook_url", label: "Facebook", type: "text", nullable: true },
  { key: "tiktok_url", label: "Tiktok", type: "text", nullable: true },
];

export default function GeneralSettings() {
  const { can } = useAdminAccess();
  const { fetchSettingsSection, updateSettingsSection, toggleMaintenance } =
    AdminSettingsDetails();
  const data = useSelector((state: RootState) => state.adminSettings.sections.general ?? null);

  useEffect(() => {
    fetchSettingsSection("general");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (changed: Record<string, any>) =>
    new Promise<void>((resolve) => {
      updateSettingsSection("general", changed, () => resolve(), () => resolve());
    });

  const handleToggle = (next: boolean, done: () => void) => {
    toggleMaintenance(
      next,
      () => {
        // Re-pull the authoritative admin row so the UI reflects the new
        // maintenance_mode without clobbering the raw message field.
        fetchSettingsSection("general");
        done();
      },
      () => done(),
    );
  };

  const handleSaveMessage = (message: string, done: () => void) => {
    updateSettingsSection("general", { maintenance_message: message }, () => done(), () => done());
  };

  return (
    <div>
      <div className="pb-2">
        <h2 className="text-c20 font-MontserratSemiBold text-161616">General settings</h2>
        <p className="text-c14 text-000000/50 mt-1">
          Contact details, address, social links and maintenance mode. These
          values are the single source of truth across the buyer and seller
          apps, the website and every email.
        </p>
      </div>

      <SettingsCard
        flush
        title="Contact details"
        description="Shown across the apps, website and email footers."
        category={GENERAL_CATEGORY}
        fields={CONTACT_FIELDS}
        data={data}
        onSave={save}
      />

      <SettingsCard
        flush
        title="Address details"
        description="The business address shown on contact pages."
        category={GENERAL_CATEGORY}
        fields={ADDRESS_FIELDS}
        data={data}
        onSave={save}
      />

      <SettingsCard
        flush
        title="Social links"
        description="Links used in footers and email templates."
        category={GENERAL_CATEGORY}
        fields={SOCIAL_FIELDS}
        data={data}
        onSave={save}
      />

      <MaintenanceCard
        flush
        data={data}
        canModify={can(GENERAL_CATEGORY, "modify")}
        onToggle={handleToggle}
        onSaveMessage={handleSaveMessage}
      />
    </div>
  );
}
