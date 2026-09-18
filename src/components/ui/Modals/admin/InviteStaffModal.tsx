"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import type { AdminRoleListItem } from "@/types/admin";

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InviteStaffModal({ isOpen, onClose, onSuccess }: InviteStaffModalProps) {
  const [roles, setRoles] = useState<AdminRoleListItem[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchAdminRoles, inviteAdminStaff } = AdminDetails();

  useEffect(() => {
    if (!isOpen) return;
    setRolesLoading(true);
    fetchAdminRoles({ status: "ACTIVE", page_size: 100 }, (data) => {
      setRoles(data?.results ?? []);
      setRolesLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  const resetForm = () => {
    setRoleId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!roleId || !firstName.trim() || !lastName.trim() || !email.trim()) return;

    setSubmitting(true);
    inviteAdminStaff(
      {
        role_id: Number(roleId),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      },
      () => {
        setSubmitting(false);
        toast.success("Invitation sent successfully.");
        handleClose();
        onSuccess?.();
      },
      () => setSubmitting(false),
    );
  };

  const canSubmit = !!roleId && !!firstName.trim() && !!lastName.trim() && !!email.trim();

  return (
    <DrawerWrapper isOpen={isOpen} onClose={handleClose}>
      <button
        onClick={handleClose}
        disabled={submitting}
        className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors disabled:opacity-50"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-lg font-MontserratMedium mb-1">Account information</h2>
          <p className="text-c12 font-MontserratNormal text-000000/68">
            Update details of buyers account information
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Role</Label>
            <DropdownInput
              placeholder={rolesLoading ? "Loading roles..." : "Select role"}
              options={roles.map((r) => ({ label: r.name, value: String(r.id) }))}
              value={roleId}
              onChange={setRoleId}
              disabled={submitting}
              loading={rolesLoading}
              emptyState="No active roles found"
            />
          </div>

          <div>
            <Label>First name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Frank"
              disabled={submitting}
            />
          </div>

          <div>
            <Label>Last name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Frank"
              disabled={submitting}
            />
          </div>

          <div>
            <Label>Email address</Label>
            <Input
              type="email"
              validateEmail
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Frank@example.com"
              disabled={submitting}
            />
          </div>

          <div>
            <Label>Phone number</Label>
            <Input
              validatePhone
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234806549875"
              disabled={submitting}
            />
          </div>

          <Button onClick={handleSubmit} disabled={submitting || !canSubmit} className="mt-4 h-12">
            {submitting ? <LoadingSpinner /> : "Send invitation"}
          </Button>
        </div>
      </div>
    </DrawerWrapper>
  );
}
