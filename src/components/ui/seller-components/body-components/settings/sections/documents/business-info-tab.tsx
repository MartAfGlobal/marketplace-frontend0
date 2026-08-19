"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import SelectButton from "@/assets/icons/selectbutton.png";
import Xicon from "@/assets/FormIcon/xicon.svg";
import { Label } from "@/components/ui/forms/Label";
import { TextInput } from "./shared/text-input";
import { FileInput } from "./shared/file-input";

// ── ID type map ───────────────────────────────────────────────────
const ID_TYPE_MAP: Record<string, string> = {
  Passport: "PASSPORT",
  "National ID": "NATIONAL_ID",
  "Voter's card": "VOTERS_CARD",
  "Driver's license": "DRIVERS_LICENCE",
};

const availableIds = Object.keys(ID_TYPE_MAP);

// ── Nigerian document rules ───────────────────────────────────────
/**
 * Business Registration Number (BRN)
 * Distinct from CAC number: general registration code, certificate number,
 * or state/entity business ID (alphanumeric, 6–20 characters, allowing hyphens and slashes).
 */
const BIZ_REG_REGEX = /^[A-Z0-9\/-]{6,20}$/i;

/**
 * CAC Registration Number
 * Specific Corporate Affairs Commission registration code (RC, BN, IT, LP, LLP prefix + digits, or numeric CAC number).
 */
const CAC_REGEX = /^((RC|BN|IT|LP|LLP)[-\s]?\d{5,8}|\d{6,10})$/i;

/**
 * TIN / VAT
 * Nigerian FIRS format: 12345678-0001 (8 digits, hyphen, 4 digits) or 8 digits
 */
const TIN_REGEX = /^\d{8}(-\d{4})?$/;

/**
 * VAT Number
 */
const VAT_REGEX = /^([A-Z]{2})?\d{8}(-\d{4})?$/i;

/**
 * ID-number rules per type
 */
const ID_NUMBER_RULES: Record<
  string,
  { regex: RegExp; minLength: number; maxLength: number; hint: string }
> = {
  PASSPORT: {
    regex: /^[A-Z]{1}\d{8}$/i,
    minLength: 9,
    maxLength: 9,
    hint: "Passport: 1 letter + 8 digits (e.g. A12345678)",
  },
  NATIONAL_ID: {
    regex: /^\d{11}$/,
    minLength: 11,
    maxLength: 11,
    hint: "NIN: exactly 11 digits",
  },
  VOTERS_CARD: {
    regex: /^[A-Z0-9]{11,19}$/i,
    minLength: 11,
    maxLength: 19,
    hint: "Voter's card: 11–19 alphanumeric characters",
  },
  DRIVERS_LICENCE: {
    regex: /^[A-Z]{3}[0-9A-Z]{5,12}$/i,
    minLength: 8,
    maxLength: 15,
    hint: "Driver's licence: 8–15 alphanumeric characters",
  },
};

// ── Types ─────────────────────────────────────────────────────────
export interface IdEntry {
  means_of_id: string;
  id_number: string;
  id_front_image?: File | null;
  id_back_image?: File | null;
  id_front_image_url?: string;
  id_back_image_url?: string;
}

interface FieldErrors {
  business_registration_number?: string;
  CAC_No?: string;
  tax_identification_number?: string;
  vat_number?: string;
  id_numbers?: Record<number, string>;
}

interface BusinessInfoTabProps {
  isEditing: boolean;
  businessType: string;
  identificationSubmitted?: boolean;
  formData: {
    business_registration_number: string;
    CAC_No: string;
    tax_identification_number: string;
    vat_number: string;
    company_address: string;
    company_address_line_2: string;
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
  /** Called by parent to run full validation before submit; returns true if valid */
  onValidate?: (validate: () => boolean) => void;
}

function getIdLabel(value: string): string {
  return Object.keys(ID_TYPE_MAP).find((key) => ID_TYPE_MAP[key] === value) ?? value;
}

// ── Validators ────────────────────────────────────────────────────
function validateCACNo(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (v.length < 6 || v.length > 14 || !CAC_REGEX.test(v))
    return "Invalid format. Expected: RC/BN/IT/LP/LLP followed by 5–8 digits (e.g. RC1234567) or 6–10 digits";
  return "";
}

function validateBizRegNo(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (v.length < 6 || v.length > 20 || !BIZ_REG_REGEX.test(v))
    return "Invalid format. Expected 6–20 characters (letters, numbers, - or /)";
  return "";
}

function validateTIN(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (v.length < 8 || v.length > 14 || !TIN_REGEX.test(v))
    return "Invalid TIN format. Expected 8 digits or 8 digits-4 digits (e.g. 12345678-0001)";
  return "";
}

function validateVAT(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (v.length < 8 || v.length > 14 || !VAT_REGEX.test(v))
    return "Invalid VAT format. Expected e.g. 12345678-0001 or NG12345678";
  return "";
}

function validateIdNumber(idType: string, value: string): string {
  const v = value.trim();
  if (!v) return "";
  const rule = ID_NUMBER_RULES[idType];
  if (!rule) return "";
  if (v.length < rule.minLength || v.length > rule.maxLength)
    return `${rule.hint}`;
  if (!rule.regex.test(v))
    return `${rule.hint}`;
  return "";
}

// ── Component ─────────────────────────────────────────────────────
export default function BusinessInfoTab({
  isEditing,
  businessType,
  identificationSubmitted = false,
  formData,
  profile,
  newFiles,
  onFieldChange,
  onIdChange,
  onFileSelect,
  onViewImage,
}: BusinessInfoTabProps) {
  const [idDropdownOpen, setIdDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const existingCACDoc = profile?.documents?.find(
    (doc: any) => doc.document_type === "CAC_CERTIFICATE"
  );
  const cacFileUrl =
    profile?.certificate_of_registration_url ||
    existingCACDoc?.file ||
    existingCACDoc?.file_url;

  // ── Field change handlers with live validation ─────────────────
  const handleFieldChange = (field: string, value: string) => {
    onFieldChange(field, value);

    setErrors((prev) => {
      let msg = "";
      if (field === "business_registration_number") msg = validateBizRegNo(value);
      else if (field === "CAC_No") msg = validateCACNo(value);
      else if (field === "tax_identification_number") msg = validateTIN(value);
      else if (field === "vat_number") msg = validateVAT(value);
      return { ...prev, [field]: msg };
    });
  };

  const handleIdNumberChange = (index: number, idType: string, value: string) => {
    updateIdField(index, "id_number", value);
    const msg = validateIdNumber(idType, value);
    setErrors((prev) => ({
      ...prev,
      id_numbers: { ...(prev.id_numbers || {}), [index]: msg },
    }));
  };

  // ── ID list helpers ────────────────────────────────────────────
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
      {/* ── Registered company ─────────────────────────────────────────── */}
      {businessType === "Registered company" && (
        <div className="flex flex-col gap-6">
          <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company registration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business registration number */}
            <TextInput
              label="Business registration number*"
              name="business_registration_number"
              type="text"
              minLength={6}
              maxLength={20}
              placeholder="e.g. BRN-12345678 or 1234567"
              value={formData.business_registration_number}
              disabled={!isEditing}
              error={isEditing ? errors.business_registration_number : undefined}
              onChange={(e) => {
                const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9\/-]/g, "").slice(0, 20);
                handleFieldChange("business_registration_number", raw);
              }}
            />

            {/* CAC registration number */}
            <TextInput
              label="CAC registration number*"
              name="CAC_No"
              type="text"
              minLength={6}
              maxLength={14}
              placeholder="e.g. RC1234567 or BN1234567"
              value={formData.CAC_No}
              disabled={!isEditing}
              error={isEditing ? errors.CAC_No : undefined}
              onChange={(e) => {
                const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 14);
                handleFieldChange("CAC_No", raw);
              }}
            />

            {/* CAC02 & CAC07 */}
            <div className="flex flex-col gap-2">
              <Label className="">CAC02 &amp; CAC07</Label>
              <FileInput
                placeholder="upload as jpeg, jpg, png, pdf"
                disabled={!isEditing}
                fileName={
                  newFiles["CAC_No_file"]?.name ||
                  (profile?.CAC_No_file_url ? "CAC_Document.jpg" : "")
                }
                fileUrl={profile?.CAC_No_file_url}
                onFileSelect={(file) => onFileSelect("CAC_No_file", file)}
                onViewImage={onViewImage}
              />
            </div>

            {/* TIN */}
            <TextInput
              label="TIN (tax identification number)"
              name="tax_identification_number"
              type="text"
              minLength={8}
              maxLength={14}
              placeholder="e.g. 12345678-0001"
              value={formData.tax_identification_number}
              disabled={!isEditing}
              error={isEditing ? errors.tax_identification_number : undefined}
              onChange={(e) => {
                // Allow digits and a single hyphen, auto-format
                const raw = e.target.value.replace(/[^\d-]/g, "").slice(0, 14);
                handleFieldChange("tax_identification_number", raw);
              }}
            />

            {/* Upload TIN */}
            <div className="flex flex-col gap-2">
              <Label className="">Upload TIN (tax identification number)</Label>
              <FileInput
                placeholder="upload as jpeg, jpg, png, pdf"
                disabled={!isEditing}
                fileName={
                  newFiles["tax_identification_file"]?.name ||
                  (profile?.tax_certificate_url ? "Tax_Certificate.jpg" : "")
                }
                fileUrl={profile?.tax_certificate_url}
                onFileSelect={(file) => onFileSelect("tax_identification_file", file)}
                onViewImage={onViewImage}
              />
            </div>

            {/* Certificate of registration */}
            <div className="flex flex-col gap-2">
              <Label className="">Certificate of registration</Label>
              <FileInput
                placeholder="upload as jpeg, jpg, png, pdf"
                disabled={!isEditing}
                fileName={
                  newFiles["certificate_of_registration"]?.name ||
                  (cacFileUrl ? "Registration_Certificate.jpg" : "")
                }
                fileUrl={cacFileUrl}
                onFileSelect={(file) => onFileSelect("certificate_of_registration", file)}
                onViewImage={onViewImage}
              />
            </div>

            {/* VAT number */}
            <TextInput
              label="VAT number"
              name="vat_number"
              type="text"
              minLength={8}
              maxLength={14}
              placeholder="e.g. 12345678-0001"
              value={formData.vat_number}
              disabled={!isEditing}
              error={isEditing ? errors.vat_number : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d-]/g, "").slice(0, 14);
                handleFieldChange("vat_number", raw);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Individual ──────────────────────────────────────────────────── */}
      {businessType === "Individual" && (
        <div className="flex flex-col gap-6">
          {isEditing && (
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
                {formData.ids.map((id, index) => {
                  const rule = ID_NUMBER_RULES[id.means_of_id];
                  return (
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
                          type="text"
                          minLength={rule?.minLength}
                          maxLength={rule?.maxLength}
                          placeholder={rule?.hint || "Enter ID number"}
                          value={id.id_number}
                          error={errors.id_numbers?.[index]}
                          onChange={(e) => {
                            // Passport / NIN / Voter's / Driver's — uppercase alphanumeric
                            const raw = e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, "")
                              .slice(0, rule?.maxLength ?? 20);
                            handleIdNumberChange(index, id.means_of_id, raw);
                          }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <Label className="">Front view</Label>
                            <FileInput
                              placeholder="Front view"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              fileName={
                                id.id_front_image?.name ||
                                (id.id_front_image_url ? `Front_ID_${index + 1}.jpg` : "")
                              }
                              fileUrl={id.id_front_image_url}
                              onFileSelect={(file) => updateIdField(index, "id_front_image", file)}
                              onViewImage={onViewImage}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="">Back view</Label>
                            <FileInput
                              placeholder="Back view"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              fileName={
                                id.id_back_image?.name ||
                                (id.id_back_image_url ? `Back_ID_${index + 1}.jpg` : "")
                              }
                              fileUrl={id.id_back_image_url}
                              onFileSelect={(file) => updateIdField(index, "id_back_image", file)}
                              onViewImage={onViewImage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {formData.ids.length === 0 &&
                  (identificationSubmitted ? (
                    <div className="col-span-2 flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-xl">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-[13px] font-MontserratSemiBold text-green-700">
                          Identification documents already submitted
                        </p>
                        <p className="text-[12px] font-MontserratNormal text-green-600 mt-0.5">
                          Your ID documents are under review. To replace them, select a new ID type above.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#999999] font-MontserratMedium col-span-2 text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                      No identification documents found. Select an ID type above to add one.
                    </p>
                  ))}
              </div>
            </div>
          )}

          {/* Individual TIN / VAT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextInput
              label="TIN (tax identification number)"
              name="tax_identification_number"
              type="text"
              minLength={8}
              maxLength={14}
              placeholder="e.g. 12345678-0001"
              value={formData.tax_identification_number}
              disabled={!isEditing}
              error={isEditing ? errors.tax_identification_number : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d-]/g, "").slice(0, 14);
                handleFieldChange("tax_identification_number", raw);
              }}
            />
            <div className="flex flex-col gap-2">
              <Label className="">Upload TIN</Label>
              <FileInput
                placeholder="Upload TIN"
                disabled={!isEditing}
                fileName={
                  newFiles["tax_identification_file"]?.name ||
                  (profile?.tax_certificate_url ? "Tax_Certificate.jpg" : "")
                }
                fileUrl={profile?.tax_certificate_url}
                onFileSelect={(file) => onFileSelect("tax_identification_file", file)}
                onViewImage={onViewImage}
              />
            </div>
            <TextInput
              label="VAT number"
              name="vat_number"
              type="text"
              minLength={8}
              maxLength={14}
              placeholder="e.g. 12345678-0001"
              value={formData.vat_number}
              disabled={!isEditing}
              error={isEditing ? errors.vat_number : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d-]/g, "").slice(0, 14);
                handleFieldChange("vat_number", raw);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Company address (shared) ──────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Address line 1"
            name="company_address"
            type="text"
            maxLength={100}
            value={formData.company_address}
            disabled={!isEditing}
            onChange={(e) => onFieldChange("company_address", e.target.value)}
          />
          <TextInput
            label="Address line 2"
            name="company_address_line_2"
            type="text"
            maxLength={100}
            value={formData.company_address_line_2}
            disabled={!isEditing}
            onChange={(e) => onFieldChange("company_address_line_2", e.target.value)}
          />
          <TextInput
            label="City/Town"
            name="company_city"
            type="text"
            maxLength={60}
            value={formData.company_city}
            disabled={!isEditing}
            onChange={(e) => onFieldChange("company_city", e.target.value)}
          />
          <TextInput
            label="State/Region"
            name="company_state"
            type="text"
            maxLength={60}
            value={formData.company_state}
            disabled={!isEditing}
            onChange={(e) => onFieldChange("company_state", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <TextInput
              label="Country"
              name="company_country"
              type="text"
              maxLength={60}
              value={formData.company_country}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("company_country", e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <TextInput
              label="Postal code"
              name="company_postal_code"
              type="text"
              minLength={6}
              maxLength={6}
              placeholder="6-digit code"
              value={formData.company_postal_code}
              disabled={!isEditing}
              onChange={(e) => {
                // Postal codes in Nigeria are exactly 6 digits
                const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
                onFieldChange("company_postal_code", raw);
              }}
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label className="">Proof of address</Label>
            <FileInput
              placeholder="upload as jpeg, jpg, png, pdf"
              disabled={!isEditing}
              fileName={
                newFiles["proof_of_address_file"]?.name ||
                (profile?.proof_of_address_url ? "proof_of_address_file.pdf" : "")
              }
              fileUrl={profile?.proof_of_address_url}
              onFileSelect={(file) => onFileSelect("proof_of_address_file", file)}
              onViewImage={onViewImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
