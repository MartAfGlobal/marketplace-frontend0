"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BusinessRegisterParams } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import Trash from "@/assets/FormIcon/Trash.svg";
import UploadIcon from "@/assets/FormIcon/Vector.svg";
import Image from "next/image";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ResultModal from "@/components/ui/forms/resultModal";
import { toast } from "sonner";

interface RegisterFormStep3Props {
  userType: "seller" | "buyer";
  businessType: "registered" | "unregistered";
}

// ── Validation regexes & rules ───────────────────────────────────

/**
 * Business Registration Number (BRN)
 * Distinct from CAC number: general registration code, certificate number,
 * or state/entity business ID (alphanumeric, 6–20 characters, allowing hyphens and slashes).
 * Examples: BRN-12345678, 1234567890, RC/2022/12345, BN-987654
 */
const BIZ_REG_REGEX = /^[A-Z0-9\/-]{6,20}$/i;

/**
 * CAC Registration Number
 * Specific Corporate Affairs Commission registration code (RC, BN, IT, LP, LLP prefix + digits, or numeric CAC number).
 * Examples: RC1234567, BN1234567, IT123456, RC-1234567, 12345678
 */
const CAC_REGEX = /^((RC|BN|IT|LP|LLP)[-\s]?\d{5,8}|\d{6,10})$/i;

/**
 * Tax Identification Number (TIN)
 * Nigerian FIRS format: 8 digits or 8 digits + hyphen + 4 digits (e.g. 12345678 or 12345678-0001)
 */
const TIN_REGEX = /^\d{8}(-\d{4})?$/;

/**
 * VAT Number
 * 8–14 characters (e.g. 12345678-0001, NG12345678, or standard 8-digit TIN/VAT)
 */
const VAT_REGEX = /^([A-Z]{2})?\d{8}(-\d{4})?$/i;

function validateBizReg(val: string): string {
  const v = val.trim();
  if (!v) return "Business registration number is required";
  if (v.length < 6 || v.length > 20) {
    return "Business registration number must be between 6 and 20 characters";
  }
  if (!BIZ_REG_REGEX.test(v)) {
    return "Invalid format. Only letters, numbers, hyphens (-) and slashes (/) are allowed";
  }
  return "";
}

function validateCAC(val: string): string {
  const v = val.trim();
  if (!v) return "CAC registration number is required";
  if (v.length < 6 || v.length > 14) {
    return "CAC registration number must be between 6 and 14 characters";
  }
  if (!CAC_REGEX.test(v)) {
    return "Invalid CAC format. Expected RC, BN, IT, LP, LLP followed by 5–8 digits (e.g. RC1234567) or 6–10 digits";
  }
  return "";
}

function validateTIN(val: string): string {
  const v = val.trim();
  if (!v) return "";
  if (v.length < 8 || v.length > 14) {
    return "TIN must be between 8 and 14 characters";
  }
  if (!TIN_REGEX.test(v)) {
    return "Invalid TIN format. Expected 8 digits or 8 digits-4 digits (e.g. 12345678-0001)";
  }
  return "";
}

function validateVAT(val: string): string {
  const v = val.trim();
  if (!v) return "";
  if (v.length < 8 || v.length > 14) {
    return "VAT number must be between 8 and 14 characters";
  }
  if (!VAT_REGEX.test(v)) {
    return "Invalid VAT format. Expected e.g. 12345678-0001 or NG12345678";
  }
  return "";
}

interface FormErrors {
  business_registration_number?: string;
  CAC_No?: string;
  tax_identification_number?: string;
  vat_number?: string;
}

export default function RegisterFormStep3({}: RegisterFormStep3Props) {
  const router = useRouter();
  const { loading, sendHttpRequest: registerUserReq } = useHttp();
  const emailVerification = useSelector(
    (state: RootState) => state.registration.email,
  );
  const token = useSelector((state: RootState) => state.token?.token);
  const [isOpen, setIsOpen] = useState(false);

  const cacFileRef = useRef<HTMLInputElement | null>(null);
  const tinFileRef = useRef<HTMLInputElement | null>(null);
  const certFileRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<BusinessRegisterParams>({
    business_registration_number: "",
    CAC_No: "",
    CAC_No_file: null,
    tax_identification_number: "",
    tax_identification_file: null,
    certificate_of_registration: null,
    vat_number: "",
    is_registered_business: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key:
      | "CAC_No_file"
      | "tax_identification_file"
      | "certificate_of_registration",
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedExtensions = /(\.pdf|\.png|\.jpg|\.jpeg|\.webp)$/i;
      if (!allowedExtensions.exec(file.name)) {
        toast.error("Only PDF, PNG, JPG, JPEG, or WEBP files are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Max allowed size is 2MB.`);
        e.target.value = "";
        return;
      }
      setFormData((prev) => ({ ...prev, [key]: file }));
    }
  };

  const clearFile = (
    key:
      | "CAC_No_file"
      | "tax_identification_file"
      | "certificate_of_registration",
  ) => {
    setFormData((prev) => ({ ...prev, [key]: null }));
  };

  const handleConfirm = () => {
    router.push(`/auth/seller/login`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ── Validate Required & Optional Fields ─────────────────────────
    const newErrors: FormErrors = {};

    const bizRegErr = validateBizReg(formData.business_registration_number || "");
    if (bizRegErr) newErrors.business_registration_number = bizRegErr;

    const cacErr = validateCAC(formData.CAC_No || "");
    if (cacErr) newErrors.CAC_No = cacErr;

    if (formData.tax_identification_number?.trim()) {
      const tinErr = validateTIN(formData.tax_identification_number);
      if (tinErr) newErrors.tax_identification_number = tinErr;
    }

    if (formData.vat_number?.trim()) {
      const vatErr = validateVAT(formData.vat_number);
      if (vatErr) newErrors.vat_number = vatErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    const payload = new FormData();

    payload.append(
      "business_registration_number",
      formData.business_registration_number?.trim() ?? "",
    );
    payload.append("CAC_No", formData.CAC_No?.trim() ?? "");
    payload.append(
      "tax_identification_number",
      formData.tax_identification_number?.trim() ?? "",
    );
    payload.append("vat_number", formData.vat_number?.trim() ?? "");
    payload.append(
      "is_registered_business",
      String(formData.is_registered_business),
    );

    if (formData.CAC_No_file) {
      payload.append("CAC_No_file", formData.CAC_No_file);
    }

    if (formData.tax_identification_file) {
      payload.append(
        "tax_identification_file",
        formData.tax_identification_file,
      );
    }

    if (formData.certificate_of_registration) {
      payload.append(
        "certificate_of_registration",
        formData.certificate_of_registration,
      );
    }

    registerUserReq({
      successRes: () => {
        setIsOpen(true);
      },
      errorRes: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to submit documents. Please try again.";
        toast.error(msg);
      },
      requestConfig: {
        url: `/accounts/manufacturer/business-documents/`,
        method: "PATCH",
        body: payload,
        token: token ?? undefined,
        userType: "seller",
      },
    });
  };

  return (
    <div className="w-full text-black/65">
      {!isOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ROW 1: Business Registration Number & CAC Registration Number */}
          <div className="flex gap-4 items-start md:flex-row flex-col w-full">
            {/* Business Registration Number (BRN) */}
            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <Label>Business registration number*</Label>
              <Input
                type="text"
                minLength={6}
                maxLength={20}
                placeholder="e.g. BRN-12345678 or 1234567"
                value={formData.business_registration_number}
                valid={!errors.business_registration_number}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9\/-]/g, "")
                    .slice(0, 20);
                  setFormData((prev) => ({
                    ...prev,
                    business_registration_number: sanitized,
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    business_registration_number: sanitized ? validateBizReg(sanitized) : "",
                  }));
                }}
              />
              {errors.business_registration_number && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.business_registration_number}
                </p>
              )}
            </div>

            {/* CAC Registration Number */}
            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <Label>CAC Registration Number *</Label>
              <Input
                type="text"
                minLength={6}
                maxLength={14}
                placeholder="e.g. RC1234567 or BN1234567"
                value={formData.CAC_No}
                valid={!errors.CAC_No}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9-]/g, "")
                    .slice(0, 14);
                  setFormData((prev) => ({ ...prev, CAC_No: sanitized }));
                  setErrors((prev) => ({
                    ...prev,
                    CAC_No: sanitized ? validateCAC(sanitized) : "",
                  }));
                }}
              />
              {errors.CAC_No && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.CAC_No}
                </p>
              )}
            </div>
          </div>

          {/* ROW 2: CAC02 & CAC07 + Certificate of Registration */}
          <div className="flex gap-4 items-center md:flex-row flex-col">
            <div className="flex-1 flex flex-col w-full gap-2 min-w-0">
              <Label>CAC02 & CAC07</Label>

              <input
                ref={cacFileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => handleFileChange(e, "CAC_No_file")}
              />

              <div
                className={`flex items-center justify-between border rounded-c8 px-3 py-2 h-12 overflow-hidden w-full ${formData.CAC_No_file ? "border-ff715b border-2" : ""}`}
              >
                <span className="text-sm truncate flex-1 min-w-0 mr-2">
                  {formData.CAC_No_file?.name || ""}
                </span>

                {formData.CAC_No_file ? (
                  <button
                    type="button"
                    onClick={() => clearFile("CAC_No_file")}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={Trash}
                      alt="Delete"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => cacFileRef.current?.click()}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={UploadIcon}
                      alt="Upload"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 w-full min-w-0">
              <Label>Certificate of Registration</Label>

              <input
                ref={certFileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(e, "certificate_of_registration")
                }
              />

              <div
                className={`flex items-center justify-between border rounded-c8 px-3 py-2 h-12 overflow-hidden w-full ${formData.certificate_of_registration ? "border-ff715b border-2" : ""}`}
              >
                <span className="text-sm truncate flex-1 min-w-0 mr-2">
                  {formData.certificate_of_registration?.name || ""}
                </span>

                {formData.certificate_of_registration ? (
                  <button
                    type="button"
                    onClick={() => clearFile("certificate_of_registration")}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={Trash}
                      alt="Delete"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => certFileRef.current?.click()}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={UploadIcon}
                      alt="Upload"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ROW 3: Upload TIN & TIN (Tax Identification Number) */}
          <div className="flex gap-4 items-start md:flex-row flex-col">
            <div className="flex-1 flex flex-col gap-2 w-full min-w-0">
              <Label>Upload TIN (tax identification number)</Label>

              <input
                ref={tinFileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => handleFileChange(e, "tax_identification_file")}
              />
              <div
                className={`flex items-center justify-between border rounded-c8 px-3 py-2 h-12 overflow-hidden w-full ${formData.tax_identification_file ? "border-ff715b border-2" : ""}`}
              >
                <span className="text-sm truncate flex-1 min-w-0 mr-2">
                  {formData.tax_identification_file?.name || ""}
                </span>

                {formData.tax_identification_file ? (
                  <button
                    type="button"
                    onClick={() => clearFile("tax_identification_file")}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={Trash}
                      alt="Delete"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => tinFileRef.current?.click()}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={UploadIcon}
                      alt="Upload"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <Label>TIN (tax identification number)</Label>
              <Input
                type="text"
                minLength={8}
                maxLength={14}
                placeholder="e.g. 12345678-0001"
                value={formData.tax_identification_number}
                valid={!errors.tax_identification_number}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .replace(/[^\d-]/g, "")
                    .slice(0, 14);
                  setFormData((prev) => ({
                    ...prev,
                    tax_identification_number: sanitized,
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    tax_identification_number: sanitized ? validateTIN(sanitized) : "",
                  }));
                }}
              />
              {errors.tax_identification_number && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.tax_identification_number}
                </p>
              )}
            </div>
          </div>

          {/* ROW 4: VAT number */}
          <div className="flex gap-4 items-start w-full md:flex-row flex-col">
            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <Label>VAT number</Label>
              <Input
                type="text"
                minLength={8}
                maxLength={14}
                placeholder="e.g. 12345678-0001 or NG12345678"
                value={formData.vat_number}
                valid={!errors.vat_number}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9-]/g, "")
                    .slice(0, 14);
                  setFormData((prev) => ({ ...prev, vat_number: sanitized }));
                  setErrors((prev) => ({
                    ...prev,
                    vat_number: sanitized ? validateVAT(sanitized) : "",
                  }));
                }}
              />
              {errors.vat_number && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.vat_number}
                </p>
              )}
            </div>

            <div className="flex-1" />
          </div>

          {/* SUBMIT */}
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : "Complete"}
          </Button>
        </form>
      )}
      <div>
        <ResultModal
          isOpen={isOpen}
          title="Registration complete"
          message="Welcome to the team! Your registration is pending admin approval."
          discRescription={emailVerification || ""}
          onConfirm={handleConfirm}
          buttenText="Continue"
        />
      </div>
    </div>
  );
}
