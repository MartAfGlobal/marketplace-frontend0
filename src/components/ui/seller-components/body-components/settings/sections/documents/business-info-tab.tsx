"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import SelectButton from "@/assets/icons/selectbutton.png";
import Xicon from "@/assets/FormIcon/xicon.svg";
import { Label } from "@/components/ui/forms/Label";
import { TextInput } from "./shared/text-input";
import { FileInput } from "./shared/file-input";

const ID_TYPE_MAP: Record<string, string> = {
  Passport: "PASSPORT",
  "National ID": "NATIONAL_ID",
  "Voter's card": "VOTERS_CARD",
  "Driver's license": "DRIVERS_LICENCE",
};

const availableIds = Object.keys(ID_TYPE_MAP);

export interface IdEntry {
  means_of_id: string;
  id_number: string;
  id_front_image?: File | null;
  id_back_image?: File | null;
  id_front_image_url?: string;
  id_back_image_url?: string;
}

interface BusinessInfoTabProps {
  isEditing: boolean;
  businessType: string;
  formData: {
    business_registration_number: string;
    CAC_No: string;
    tax_identification_number: string;
    vat_number: string;
    company_address: string;
    company_address_line2: string;
    company_city: string;
    company_state: string;
    company_country: string;
    company_postal_code: string;
    ids: IdEntry[];
  };
  profile: Record<string, any>;
  newFiles: Record<string, File>;
  onFieldChange: (field: string, value: string) => void;
  onIdChange: (ids: IdEntry[]) => void;
  onFileSelect: (key: string, file: File) => void;
  onViewImage: (url: string) => void;
}

function getIdLabel(value: string): string {
  return Object.keys(ID_TYPE_MAP).find((key) => ID_TYPE_MAP[key] === value) ?? value;
}

export default function BusinessInfoTab({
  isEditing,
  businessType,
  formData,
  profile,
  newFiles,
  onFieldChange,
  onIdChange,
  onFileSelect,
  onViewImage,
}: BusinessInfoTabProps) {
  const [idDropdownOpen, setIdDropdownOpen] = useState(false);

  const addId = (idLabel: string) => {
    const backendValue = ID_TYPE_MAP[idLabel];
    if (formData.ids.some((i) => i.means_of_id === backendValue)) return;
    if (formData.ids.length >= 2) return;
    onIdChange([
      ...formData.ids,
      { means_of_id: backendValue, id_number: "", id_front_image: null, id_back_image: null },
    ]);
  };

  const removeId = (idType: string) => {
    onIdChange(formData.ids.filter((i) => i.means_of_id !== idType));
  };

  const updateIdField = (index: number, field: keyof IdEntry, value: any) => {
    const updated = [...formData.ids];
    (updated[index] as any)[field] = value;
    onIdChange(updated);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ── Registered company ─────────────────────────────────────── */}
      {businessType === "Registered company" && (
        <div className="flex flex-col gap-6">
          <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company registration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Business registration number*"
              name="business_registration_number"
              value={formData.business_registration_number}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("business_registration_number", e.target.value)}
            />
            <TextInput
              label="CAC registration number*"
              name="CAC_No"
              value={formData.CAC_No}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("CAC_No", e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Label className="">CAC02 &amp; CAC07</Label>
              <FileInput
                placeholder="upload as jpeg, jpg, png, pdf"
                disabled={!isEditing}
                fileName={newFiles["CAC_No_file"]?.name || (profile?.CAC_No_file_url ? "CAC_Document.jpg" : "")}
                fileUrl={profile?.CAC_No_file_url}
                onFileSelect={(file) => onFileSelect("CAC_No_file", file)}
                onViewImage={onViewImage}
              />
            </div>

            <TextInput
              label="TIN (tax identification number)"
              name="tax_identification_number"
              value={formData.tax_identification_number}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("tax_identification_number", e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Label className="">Upload TIN (tax identification number)</Label>
              <FileInput
                placeholder="upload as jpeg, jpg, png, pdf"
                disabled={!isEditing}
                fileName={newFiles["tax_identification_file"]?.name || (profile?.tax_certificate_url ? "Tax_Certificate.jpg" : "")}
                fileUrl={profile?.tax_certificate_url}
                onFileSelect={(file) => onFileSelect("tax_identification_file", file)}
                onViewImage={onViewImage}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="">Certificate of registration</Label>
              <FileInput
                placeholder="upload as jpeg, jpg, png, pdf"
                disabled={!isEditing}
                fileName={newFiles["certificate_of_registration"]?.name || (profile?.certificate_of_registration_url ? "Registration_Certificate.jpg" : "")}
                fileUrl={profile?.certificate_of_registration_url}
                onFileSelect={(file) => onFileSelect("certificate_of_registration", file)}
                onViewImage={onViewImage}
              />
            </div>

            <TextInput
              label="VAT number"
              name="vat_number"
              value={formData.vat_number}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("vat_number", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Individual ─────────────────────────────────────────────── */}
      {businessType === "Individual" && (
        <div className="flex flex-col gap-6">
          <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Personal identification</h3>

          {isEditing ? (
            <div className="flex flex-col gap-6">
              {/* ID type selector */}
              <div className="flex md:flex-row flex-col gap-4">
                <div className="flex-1 flex flex-col gap-2 relative">
                  <label className="">ID type</label>
                  <div
                    className="border border-[#e5e5e5] rounded-xl px-3 py-2 min-h-[48px] flex flex-wrap gap-2 cursor-pointer relative items-center bg-white"
                    onClick={() => setIdDropdownOpen((p) => !p)}
                  >
                    <div className="flex flex-wrap gap-2 flex-1">
                      {formData.ids.length === 0 && (
                        <span className="text-sm text-[#cccccc] font-MontserratMedium">Select ID</span>
                      )}
                      {formData.ids.map((id) => (
                        <span
                          key={id.means_of_id}
                          className="flex items-center gap-2.5 bg-black/10 font-MontserratMedium px-2.5 py-1 rounded-lg text-xs text-[#333333]"
                        >
                          {getIdLabel(id.means_of_id)}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeId(id.means_of_id);
                            }}
                          >
                            <Image src={Xicon} alt="remove" width={10} height={10} className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div
                      className="mx-2 transition-transform"
                      style={{ transform: idDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      <Image src={SelectButton} alt="select" width={12} height={7} />
                    </div>
                  </div>

                  {idDropdownOpen && (
                    <div className="absolute top-full w-full py-1.5 px-4 bg-white border rounded-xl shadow-lg z-20 mt-1">
                      {availableIds.map((id) => (
                        <div
                          key={id}
                          onClick={() => {
                            addId(id);
                            setIdDropdownOpen(false);
                          }}
                          className="py-2.5 flex items-center text-[#161616] text-xs font-MontserratMedium gap-3 cursor-pointer hover:bg-gray-50"
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              formData.ids.some((i) => i.means_of_id === ID_TYPE_MAP[id])
                                ? "bg-[#ff6b6b] border-[#ff6b6b]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.ids.some((i) => i.means_of_id === ID_TYPE_MAP[id]) && (
                              <Check size={12} color="white" />
                            )}
                          </div>
                          {id}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1" />
              </div>

              {/* ID forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formData.ids.map((id, index) => (
                  <div key={id.means_of_id} className="flex flex-col gap-4 p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] font-MontserratSemiBold text-[#333333]">
                        {getIdLabel(id.means_of_id)} Document {index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <TextInput
                        label="ID Number"
                        name={`id_number_${index}`}
                        value={id.id_number}
                        onChange={(e) => updateIdField(index, "id_number", e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label className="">Front view</Label>
                          <FileInput
                            placeholder="Front view"
                            fileName={id.id_front_image?.name || (id.id_front_image_url ? `Front_ID_${index + 1}.jpg` : "")}
                            fileUrl={id.id_front_image_url}
                            onFileSelect={(file) => updateIdField(index, "id_front_image", file)}
                            onViewImage={onViewImage}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="">Back view</Label>
                          <FileInput
                            placeholder="Back view"
                            fileName={id.id_back_image?.name || (id.id_back_image_url ? `Back_ID_${index + 1}.jpg` : "")}
                            fileUrl={id.id_back_image_url}
                            onFileSelect={(file) => updateIdField(index, "id_back_image", file)}
                            onViewImage={onViewImage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* View mode */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.ids.map((id, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 border border-[#f0f0f0] rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-MontserratSemiBold text-[#333333]">
                      {getIdLabel(id.means_of_id)} Document {index + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <TextInput label="ID Number" name={`id_number_view_${index}`} value={id.id_number} disabled />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label className="">Front view</Label>
                        <FileInput
                          placeholder="Front view"
                          disabled
                          fileName={id.id_front_image_url ? `Front_ID_${index + 1}.jpg` : ""}
                          fileUrl={id.id_front_image_url}
                          onViewImage={onViewImage}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="">Back view</Label>
                        <FileInput
                          placeholder="Back view"
                          disabled
                          fileName={id.id_back_image_url ? `Back_ID_${index + 1}.jpg` : ""}
                          fileUrl={id.id_back_image_url}
                          onViewImage={onViewImage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {formData.ids.length === 0 && (
                <p className="text-[13px] text-[#999999] font-MontserratMedium col-span-2 text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                  No identification documents found.
                </p>
              )}
            </div>
          )}

          {/* Individual TIN/VAT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextInput
              label="TIN (tax identification number)"
              name="tax_identification_number"
              value={formData.tax_identification_number}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("tax_identification_number", e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <Label className="">Upload TIN</Label>
              <FileInput
                placeholder="Upload TIN"
                disabled={!isEditing}
                fileName={newFiles["tax_identification_file"]?.name || (profile?.tax_certificate_url ? "Tax_Certificate.jpg" : "")}
                fileUrl={profile?.tax_certificate_url}
                onFileSelect={(file) => onFileSelect("tax_identification_file", file)}
                onViewImage={onViewImage}
              />
            </div>
            <TextInput
              label="VAT number"
              name="vat_number"
              value={formData.vat_number}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("vat_number", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Company address (shared) ────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput label="Address line 1" name="company_address" value={formData.company_address} disabled={!isEditing} onChange={(e) => onFieldChange("company_address", e.target.value)} />
          <TextInput label="Address line 2" name="company_address_line2" value={formData.company_address_line2} disabled={!isEditing} onChange={(e) => onFieldChange("company_address_line2", e.target.value)} />
          <TextInput label="City/Town" name="company_city" value={formData.company_city} disabled={!isEditing} onChange={(e) => onFieldChange("company_city", e.target.value)} />
          <TextInput label="State/Region" name="company_state" value={formData.company_state} disabled={!isEditing} onChange={(e) => onFieldChange("company_state", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <TextInput label="Country" name="company_country" value={formData.company_country} disabled={!isEditing} onChange={(e) => onFieldChange("company_country", e.target.value)} />
          </div>
          <div className="md:col-span-1">
            <TextInput label="Postal code" name="company_postal_code" value={formData.company_postal_code} disabled={!isEditing} onChange={(e) => onFieldChange("company_postal_code", e.target.value)} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label className="">Proof of address</Label>
            <FileInput
              placeholder="upload as jpeg, jpg, png, pdf"
              disabled={!isEditing}
              fileName={
                newFiles["proof_of_address"]?.name ||
                (profile?.proof_of_address ? "proof_of_address.pdf" : "")
              }
              fileUrl={profile?.proof_of_address}
              onFileSelect={(file) => onFileSelect("proof_of_address", file)}
              onViewImage={onViewImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
