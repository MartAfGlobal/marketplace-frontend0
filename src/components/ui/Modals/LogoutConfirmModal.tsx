"use client";

import ResultModal from "@/components/ui/forms/resultModal";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Reusable logout confirmation modal.
 * Uses the existing ResultModal in "warning" mode which shows
 * Cancel + a primary confirm button.
 */
export default function LogoutConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  loading,
}: LogoutConfirmModalProps) {
  return (
    <ResultModal
      isOpen={isOpen}
      result="warning"
      title="Log Out"
      message="Are you sure you want to log out?"
      discRescription="You will need to sign in again to access your account."
      buttenText="Yes, Log Out"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
    />
  );
}
