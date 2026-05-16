import { Suspense } from "react";
import SellerSettings from "@/components/ui/seller-components/body-components/settings/seller-settings";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SellerSettings />
    </Suspense>
  );
}
