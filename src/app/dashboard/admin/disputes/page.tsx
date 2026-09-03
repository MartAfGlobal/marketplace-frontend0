"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDisputesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/admin/orders/refund-dispute");
  }, [router]);

  return null;
}
