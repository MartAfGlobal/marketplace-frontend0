"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateAttributeModal from "@/components/ui/Modals/admin/CreateAttributeModal";

export default function CreateAttributePage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/dashboard/admin/categories");
  };

  return (
    <CreateAttributeModal
      isOpen={true}
      onClose={handleClose}
      onSuccess={handleClose}
    />
  );
}
