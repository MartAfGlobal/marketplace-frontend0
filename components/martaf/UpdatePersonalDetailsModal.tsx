"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User as AppUser } from "@/types/api";
import { apiService } from "@/lib/api";
import { Phone } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: AppUser) => void;
  initialValues: {
    first_name: string;
    last_name: string;
    phone: string;
    phone2: string;
  };
}

export function UpdatePersonalDetailsModal({
  open,
  onClose,
  onProfileUpdated,
  initialValues,
}: Props) {
  const [firstName, setFirstName] = useState(initialValues.first_name);
  const [lastName, setLastName] = useState(initialValues.last_name);
  const [phone, setPhone] = useState(initialValues.phone);
  const [phone2, setPhone2] = useState(initialValues.phone2);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("first_name", firstName || "");
    formData.append("last_name", lastName || "");
    formData.append("phone", phone || "");
    formData.append("phone2", phone2 || "");

    setLoading(true);
    try {
      const updatedUser = await apiService.updateUserProfile(formData);
      console.log({ firstName, lastName, phone, phone2 });

      toast.success("Personal details updated");
      onProfileUpdated(updatedUser); // pass updated user to parent
      onClose(); // close modal
    } catch (error: any) {
      toast.error(error.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl px-4 py-12 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-start">
            Personal Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-evenly">
          <div className="flex flex-col gap-3">
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          
        </div>
        <div className="flex justify-evenly mt-4">
          <div className="flex flex-col gap-3">
            <Label>Mobile number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Home number</Label>
            <Input value={phone2} onChange={(e) => setPhone2(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            className=" bg-[#FF715B] text-white hover:bg-[#ff4d2d] absolute left-80"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update details"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
