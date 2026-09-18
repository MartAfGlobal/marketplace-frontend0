"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import PermissionMatrixEditor from "./PermissionMatrixEditor";
import { emptyPermissionMatrix } from "./permissionCategories";
import type { AccessLevel, PermissionAction, PermissionCategoryKey, PermissionMatrix } from "@/types/admin";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const ACCESS_LEVEL_OPTIONS: { label: string; value: AccessLevel }[] = [
  { label: "Standard", value: "STANDARD" },
  { label: "High", value: "HIGH" },
  { label: "Restricted", value: "RESTRICTED" },
];

export default function CreateRoleModal({ isOpen, onClose, onCreated }: CreateRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("STANDARD");
  const [matrix, setMatrix] = useState<PermissionMatrix>(emptyPermissionMatrix());
  const [submitting, setSubmitting] = useState(false);

  const { createAdminRole } = AdminDetails();

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setAccessLevel("STANDARD");
      setMatrix(emptyPermissionMatrix());
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleToggle = (category: PermissionCategoryKey, action: PermissionAction) => {
    setMatrix((prev) => ({
      ...prev,
      [category]: { ...prev[category], [action]: !prev[category][action] },
    }));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a role name.");
      return;
    }
    setSubmitting(true);
    createAdminRole(
      { name: name.trim(), description: description.trim(), access_level: accessLevel, permissions: matrix },
      () => {
        setSubmitting(false);
        onCreated();
        onClose();
      },
      () => setSubmitting(false),
    );
  };

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-lg font-MontserratBold text-[#161616]">Create new role</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto">
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <Label>Role name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Warehouse manager" />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this role covers"
            />
          </div>
          <div>
            <Label>Access level</Label>
            <DropdownInput
              placeholder="Select access level"
              options={ACCESS_LEVEL_OPTIONS}
              value={accessLevel}
              onChange={(val) => setAccessLevel(val as AccessLevel)}
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 font-MontserratMedium mb-3">Permissions</p>
        <PermissionMatrixEditor matrix={matrix} onToggle={handleToggle} />

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={onClose} className="w-fit px-5 h-10" disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="w-fit px-6 h-10">
            {submitting ? <LoadingSpinner /> : "Create role"}
          </Button>
        </div>
      </div>
    </DrawerWrapper>
  );
}
