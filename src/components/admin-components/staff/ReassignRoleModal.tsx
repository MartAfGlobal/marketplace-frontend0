"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import HighRiskRoleConfirmModal from "@/components/ui/Modals/admin/HighRiskRoleConfirmModal";
import type { AdminRoleListItem } from "@/types/admin";

interface ReassignRoleModalProps {
  isOpen: boolean;
  userId: string;
  currentRoleId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReassignRoleModal({
  isOpen,
  userId,
  currentRoleId,
  onClose,
  onSuccess,
}: ReassignRoleModalProps) {
  const [roles, setRoles] = useState<AdminRoleListItem[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [highRisk, setHighRisk] = useState<{ roleName: string; message: string } | null>(null);

  const { fetchAdminRoles, reassignAdminStaffRole } = AdminDetails();

  useEffect(() => {
    if (!isOpen) return;
    setRoleId(currentRoleId ? String(currentRoleId) : "");
    setHighRisk(null);
    setRolesLoading(true);
    fetchAdminRoles({ status: "ACTIVE", page_size: 100 }, (data) => {
      setRoles(data?.results ?? []);
      setRolesLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const selectedRole = roles.find((r) => String(r.id) === roleId);

  const submit = (confirmRoleName?: string) => {
    if (!roleId) return;
    setSubmitting(true);
    reassignAdminStaffRole(
      userId,
      { role_id: Number(roleId), ...(confirmRoleName ? { confirm_role_name: confirmRoleName } : {}) },
      () => {
        setSubmitting(false);
        setHighRisk(null);
        toast.success("Role reassigned successfully.");
        onSuccess();
        onClose();
      },
      (err: any) => {
        setSubmitting(false);
        const data = err?.response?.data;
        if (err?.response?.status === 409 && data?.requires_confirmation) {
          setHighRisk({ roleName: data.role_name, message: data.message });
        }
      },
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !highRisk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-[420px] p-8"
            >
              <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-MontserratMedium mb-6">Reassign role</h2>

              <div className="mb-8">
                <Label>New role</Label>
                <DropdownInput
                  placeholder={rolesLoading ? "Loading roles..." : "Select role"}
                  options={roles.map((r) => ({ label: r.name, value: String(r.id) }))}
                  value={roleId}
                  onChange={setRoleId}
                  disabled={submitting}
                  loading={rolesLoading}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="secondary" onClick={onClose} disabled={submitting} className="flex-1 h-12">
                  Cancel
                </Button>
                <Button onClick={() => submit()} disabled={submitting || !roleId} className="flex-1 h-12">
                  {submitting ? <LoadingSpinner /> : "Reassign"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HighRiskRoleConfirmModal
        isOpen={!!highRisk}
        onClose={() => setHighRisk(null)}
        onConfirm={(confirmRoleName) => submit(confirmRoleName)}
        loading={submitting}
        roleName={highRisk?.roleName ?? selectedRole?.name ?? ""}
        message={highRisk?.message}
      />
    </>
  );
}
