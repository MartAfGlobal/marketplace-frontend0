"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IndividualRegisterParams } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import UploadIcon from "@/assets/FormIcon/Vector.svg";
import Image from "next/image";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import SelectButton from "@/assets/icons/selectbutton.png";
import ResultModal from "@/components/ui/forms/resultModal";
import Xicon from "@/assets/FormIcon/xicon.svg";
import Trash from "@/assets/FormIcon/Trash.svg";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { sellerActions } from "@/store/user-data/seller/seller-slice";

interface RegisterIndividual3Props {
  userType: "seller" | "buyer";
  businessType: "registered" | "unregistered";
}

const ID_TYPE_MAP: Record<string, string> = {
  Passport: "PASSPORT",
  "National ID": "NATIONAL_ID",
  "Voter's card": "VOTERS_CARD",
  "Driver's license": "DRIVERS_LICENCE",
};

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

const TIN_REGEX = /^\d{8}(-\d{4})?$/;

function validateIdNumber(idType: string, value: string): string {
  const v = value.trim();
  if (!v) return "ID number is required";
  const rule = ID_NUMBER_RULES[idType];
  if (!rule) return "";
  if (v.length < rule.minLength || v.length > rule.maxLength || !rule.regex.test(v)) {
    return rule.hint;
  }
  return "";
}

function validateTIN(val: string): string {
  const v = val.trim();
  if (!v) return "";
  if (!TIN_REGEX.test(v)) {
    return "Invalid TIN format. Expected 8 digits or 8 digits-4 digits (e.g. 12345678-0001)";
  }
  return "";
}

function validateVAT(val: string): string {
  const v = val.trim();
  if (!v) return "";
  if (!TIN_REGEX.test(v)) {
    return "Invalid VAT format. Expected 8 digits or 8 digits-4 digits (e.g. 12345678-0001)";
  }
  return "";
}

type IdEntry = {
  means_of_id: string;
  id_number: string;
  id_front_image?: File | null;
  id_back_image?: File | null;
  id_front_image_url?: string;
  id_back_image_url?: string;
};

export default function RegisterIndividual3({
  userType,
  businessType,
}: RegisterIndividual3Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, sendHttpRequest, error } = useHttp();
  const { sendHttpRequest: fetchUserDetailsReq } = useHttp();

  const emailVerification = useSelector(
    (state: RootState) => state.registration.email,
  );
  const regTokenFromState = useSelector(
    (state: RootState) => state.registration?.token,
  );
  const tokenFromState = useSelector(
    (state: RootState) => state.token?.token,
  );
  const activeToken =
    tokenFromState ||
    regTokenFromState ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("registration_token") ||
        undefined
      : undefined);

  const [isOpen, setIsOpen] = useState(false);
  const [idDropdownOpen, setIdDropdownOpen] = useState(false);
  const idDropdownRef = useRef<HTMLDivElement | null>(null);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [errors, setErrors] = useState<{
    fullname?: string;
    tax_identification_number?: string;
    vat_number?: string;
    id_numbers?: Record<number, string>;
  }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        idDropdownRef.current &&
        !idDropdownRef.current.contains(event.target as Node)
      ) {
        setIdDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState<
    IndividualRegisterParams & {
      ids: IdEntry[];
      tax_identification_file?: File | null;
      fullname: string;
    }
  >({
    fullname: "",
    vat_number: "",
    tax_identification_number: "",
    tax_identification_file: null,
    ids: [],
    is_registered_business: false,
  });

  /* Fetch user details on mount to sync profile */
  useEffect(() => {
    if (activeToken) {
      fetchUserDetailsReq({
        requestConfig: {
          url: "/accounts/manufacturer/user-details/",
          method: "GET",
          token: activeToken,
          isAuth: true,
          userType: "seller",
        },
        successRes: (res: any) => {
          const profile = res.data?.profile || res.data || {};
          dispatch(sellerActions.updateSellerData(res.data));

          const firstName = profile?.first_name || "";
          const lastName = profile?.last_name || "";
          const fullname =
            profile?.fullname ||
            [firstName, lastName].filter(Boolean).join(" ") ||
            "";

          setFormData((prev) => ({
            ...prev,
            fullname: prev.fullname || fullname,
            vat_number: prev.vat_number || profile?.vat_number || "",
            tax_identification_number:
              prev.tax_identification_number ||
              profile?.tax_identification_number ||
              "",
            ids:
              prev.ids.length > 0
                ? prev.ids
                : (profile?.identification_verifications || []).map(
                    (id: any) => ({
                      means_of_id: id.type || id.means_of_id || "",
                      id_number: id.id_number || "",
                      id_front_image_url: id.id_front_image_url || "",
                      id_back_image_url: id.id_back_image_url || "",
                    }),
                  ),
          }));
        },
      });
    }
  }, [activeToken]);

  const availableIds = Object.keys(ID_TYPE_MAP);

  /* ================= ID SELECTION ================= */
  const addId = (idLabel: string) => {
    const backendValue = ID_TYPE_MAP[idLabel];

    if (formData.ids.some((i) => i.means_of_id === backendValue)) return;
    if (formData.ids.length >= 2) return;

    setFormData({
      ...formData,
      ids: [
        ...formData.ids,
        {
          means_of_id: backendValue,
          id_number: "",
          id_front_image: null,
          id_back_image: null,
        },
      ],
    });
  };

  const getIdLabel = (value: string) => {
    return (
      Object.keys(ID_TYPE_MAP).find((key) => ID_TYPE_MAP[key] === value) ??
      value
    );
  };

  const removeId = (idType: string) => {
    setFormData({
      ...formData,
      ids: formData.ids.filter((i) => i.means_of_id !== idType),
    });
  };

  const handleIdFileChange = (
    index: number,
    key: "id_front_image" | "id_back_image",
    file: File | null,
  ) => {
    if (!file) return;
    const isImage =
      file.type.startsWith("image/") ||
      /(\.png|\.jpg|\.jpeg|\.webp)$/i.test(file.name);
    if (!isImage) {
      toast.error(
        "Only image files (PNG, JPG, JPEG, WEBP) are allowed for ID documents.",
      );
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(`"${file.name}" is too large. Max allowed size is 2MB.`);
      return;
    }
    const ids = [...formData.ids];
    ids[index][key] = file;
    setFormData({ ...formData, ids });
  };

  useEffect(() => {
    if (!error) return;
    console.log("Error message:", error);

    if (error.includes("This endpoint is for personal businesses only")) {
      return;
    }
  }, [error, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToken) {
      toast.error("Token expired, please login");
      router.push("/auth/seller/login");
      return;
    }

    if (!formData.fullname?.trim()) {
      setErrors((prev) => ({ ...prev, fullname: "Full legal name is required" }));
      toast.error("Please enter your full legal name");
      return;
    }

    if (formData.ids.length !== 2) {
      toast.error("Please select exactly 2 IDs");
      return;
    }

    // Validate each ID number
    const idErrors: Record<number, string> = {};
    formData.ids.forEach((id, idx) => {
      const err = validateIdNumber(id.means_of_id, id.id_number);
      if (err) idErrors[idx] = err;
    });

    const tinErr = formData.tax_identification_number
      ? validateTIN(formData.tax_identification_number)
      : "";
    const vatErr = formData.vat_number ? validateVAT(formData.vat_number) : "";

    if (Object.keys(idErrors).length > 0 || tinErr || vatErr) {
      setErrors({
        id_numbers: idErrors,
        tax_identification_number: tinErr,
        vat_number: vatErr,
      });
      const firstError = Object.values(idErrors)[0] || tinErr || vatErr;
      toast.error(firstError);
      return;
    }

    // Build payload matching Settings page exactly
    const payload = new FormData();
    payload.append("fullname", formData.fullname);
    formData.ids.forEach((id, idx) => {
      if (id.means_of_id)
        payload.append(`ids[${idx}][means_of_id]`, id.means_of_id);
      if (id.id_number) payload.append(`ids[${idx}][id_number]`, id.id_number);
      if (
        id.id_front_image &&
        ((id.id_front_image as any) instanceof File ||
          (id.id_front_image as any) instanceof Blob)
      ) {
        payload.append(`ids[${idx}][id_front_image]`, id.id_front_image);
      }
      if (
        id.id_back_image &&
        ((id.id_back_image as any) instanceof File ||
          (id.id_back_image as any) instanceof Blob)
      ) {
        payload.append(`ids[${idx}][id_back_image]`, id.id_back_image);
      }
    });

    payload.append(
      "tax_identification_number",
      formData.tax_identification_number,
    );
    payload.append("vat_number", formData.vat_number);

    if (
      formData.tax_identification_file &&
      ((formData.tax_identification_file as any) instanceof File ||
        (formData.tax_identification_file as any) instanceof Blob)
    ) {
      payload.append(
        "tax_identification_file",
        formData.tax_identification_file,
      );
    }

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/manufacturer/personal-documents/`,
        method: "PATCH",
        body: payload,
        token: activeToken,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        if (res?.data) {
          dispatch(sellerActions.updateSellerData({ profile: res.data }));
        }
        setIsOpen(true);
      },
      errorRes: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to submit documents. Please try again.";
        toast.error(msg);
      },
    });
  };

  const clearFile = (key: "tax_identification_file") => {
    setFormData({ ...formData, [key]: null });
  };

  return (
    <div className="w-full text-black/65">
      {!isOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-4 rounded-c8"
        >
          {/* ROW 1: Full Name + ID Selector */}
          <div className="flex md:flex-row flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <Label>Full Legal Name*</Label>
              <Input
                type="text"
                validateName={true}
                maxLength={80}
                placeholder="Enter your full legal name"
                value={formData.fullname}
                valid={!errors.fullname}
                onChange={(e) => {
                  setFormData({ ...formData, fullname: e.target.value });
                  setErrors((prev) => ({ ...prev, fullname: "" }));
                }}
              />
              {errors.fullname && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.fullname}
                </p>
              )}
            </div>

            <div
              ref={idDropdownRef}
              className="flex-1 flex flex-col gap-2 relative"
            >
              <Label>ID type (Select 2)</Label>
              <div
                className="border rounded-c8 px-3 py-2 min-h-[44px] flex flex-wrap gap-2 cursor-pointer relative items-center"
                onClick={() => setIdDropdownOpen((p) => !p)}
              >
                {/* ID Tags */}
                <div className="flex flex-wrap gap-2 flex-1 ">
                  {formData.ids.length === 0 && (
                    <span className="text-sm text-gray-400">Select ID</span>
                  )}
                  {formData.ids.map((id) => (
                    <span
                      key={id.means_of_id}
                      className="flex items-center gap-2.5 bg-000000/20 font-MontserratMedium px-2 py-1 rounded-c8 text-xs"
                    >
                      {getIdLabel(id.means_of_id)}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeId(id.means_of_id);
                        }}
                      >
                        <Image
                          src={Xicon}
                          alt="remove"
                          width={12}
                          height={12}
                        />
                      </button>
                    </span>
                  ))}
                </div>
                <div
                  className="mx-2 transition-transform"
                  style={{
                    transform: idDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <Image
                    src={SelectButton}
                    alt="select"
                    width={14}
                    height={8}
                  />
                </div>
              </div>

              {idDropdownOpen && (
                <div className="absolute top-full w-full py-1.5 px-6 bg-white border rounded-c8 shadow-md z-20 mt-1">
                  {availableIds.map((id) => (
                    <div
                      key={id}
                      onClick={() => {
                        addId(id);
                        setIdDropdownOpen(false);
                      }}
                      className="py-2.5 flex items-center text-000000/65 text-xs font-MontserratNormal gap-3 cursor-pointer hover:bg-gray-100"
                    >
                      <div
                        className={`w-4 h-4 rounded border ${
                          formData.ids.some(
                            (i) => i.means_of_id === ID_TYPE_MAP[id],
                          )
                            ? "bg-ff715b border-ff715b"
                            : "border-gray-400"
                        }`}
                      >
                        {formData.ids.some(
                          (i) => i.means_of_id === ID_TYPE_MAP[id],
                        ) && <Check size={15} color="white" />}
                      </div>

                      {id}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ROW 2: ID Number + ID Front/Back Upload */}
          {formData.ids.map((id, idx) => {
            const rule = ID_NUMBER_RULES[id.means_of_id];
            const fieldError = errors.id_numbers?.[idx];
            return (
              <div
                key={id.means_of_id}
                className="flex gap-4 md:flex-row flex-col w-full min-w-0"
              >
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <Label> {getIdLabel(id.means_of_id)} Number*</Label>
                  <Input
                    type="text"
                    minLength={rule?.minLength}
                    maxLength={rule?.maxLength}
                    placeholder={rule?.hint || "Enter ID number"}
                    value={id.id_number}
                    valid={!fieldError}
                    onChange={(e) => {
                      const sanitized = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, rule?.maxLength ?? 20);
                      const ids = [...formData.ids];
                      ids[idx].id_number = sanitized;
                      setFormData((prev) => ({ ...prev, ids }));
                      setErrors((prev) => ({
                        ...prev,
                        id_numbers: {
                          ...(prev.id_numbers || {}),
                          [idx]: validateIdNumber(id.means_of_id, sanitized),
                        },
                      }));
                    }}
                  />
                  {fieldError && (
                    <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                      {fieldError}
                    </p>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <Label> Upload {getIdLabel(id.means_of_id).toLowerCase()} </Label>
                  <div className="flex gap-4 w-full min-w-0">
                    {(["id_front_image", "id_back_image"] as const).map((key) => (
                      <div
                        key={key}
                        className="flex-1 flex flex-col gap-2 w-1/2 min-w-0"
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden w-full truncate"
                          ref={(el) => {
                            fileRefs.current[`${key}-${idx}`] = el;
                          }}
                          onChange={(e) =>
                            handleIdFileChange(
                              idx,
                              key,
                              e.target.files?.[0] ?? null,
                            )
                          }
                        />
                        <div
                          className={`h-12 border border-efefef rounded-c8 px-3.5 flex justify-between items-center cursor-pointer w-full overflow-hidden ${
                            id[key] ? "border-ff715b border-2" : ""
                          }`}
                          onClick={() =>
                            fileRefs.current[`${key}-${idx}`]?.click()
                          }
                        >
                          <span className="text-sm truncate flex-1 min-w-0 mr-2">
                            {id[key]?.name ||
                              (key === "id_front_image"
                                ? "Front Image"
                                : "Back Image")}
                          </span>
                          <Image
                            src={UploadIcon}
                            width={16}
                            height={16}
                            alt="upload"
                            className="flex-shrink-0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ROW 3: Tax Number + Tax File */}
          <div className="flex gap-4 flex-col md:flex-row w-full min-w-0 items-start">
            <div className="flex-1 flex flex-col gap-1.5 min-w-0 w-full">
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
                    tax_identification_number: validateTIN(sanitized),
                  }));
                }}
              />
              {errors.tax_identification_number && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.tax_identification_number}
                </p>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-0 w-full">
              <Label>Upload TIN (tax identification number)</Label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
                ref={(el) => {
                  fileRefs.current["tax_file"] = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (!file) return;
                  const allowedExtensions =
                    /(\.pdf|\.png|\.jpg|\.jpeg|\.webp)$/i;
                  if (
                    !allowedExtensions.test(file.name) &&
                    !file.type.startsWith("image/") &&
                    file.type !== "application/pdf"
                  ) {
                    toast.error(
                      "Only PDF, PNG, JPG, JPEG, or WEBP files are allowed.",
                    );
                    return;
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    toast.error(
                      `"${file.name}" is too large. Max allowed size is 2MB.`,
                    );
                    return;
                  }
                  setFormData((prev) => ({
                    ...prev,
                    tax_identification_file: file,
                  }));
                }}
              />
              <div
                className={`h-12 border border-efefef rounded-c8 px-3.5 flex justify-between items-center cursor-pointer w-full overflow-hidden ${
                  formData.tax_identification_file ? "border-ff715b border-2" : ""
                }`}
                onClick={() => fileRefs.current["tax_file"]?.click()}
              >
                <span className="text-sm truncate flex-1 min-w-0 mr-2">
                  {formData.tax_identification_file?.name || "Upload File"}
                </span>

                {formData.tax_identification_file ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile("tax_identification_file");
                    }}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={Trash}
                      alt="Delete"
                      width={16}
                      height={16}
                      className="w-5 h-5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileRefs.current["tax_file"]?.click();
                    }}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={UploadIcon}
                      height={16}
                      width={16}
                      alt="Upload"
                      className="w-5 h-5"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ROW 4: VAT */}
          <div className="flex gap-4 items-start w-full">
            <div className="flex-1 flex flex-col gap-1.5">
              <Label>VAT Number</Label>
              <Input
                type="text"
                minLength={8}
                maxLength={14}
                placeholder="e.g. 12345678-0001"
                value={formData.vat_number}
                valid={!errors.vat_number}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .replace(/[^\d-]/g, "")
                    .slice(0, 14);
                  setFormData((prev) => ({ ...prev, vat_number: sanitized }));
                  setErrors((prev) => ({
                    ...prev,
                    vat_number: validateVAT(sanitized),
                  }));
                }}
              />
              {errors.vat_number && (
                <p className="text-[11px] text-[#CA0202] font-MontserratMedium">
                  {errors.vat_number}
                </p>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2" />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : "Complete"}
          </Button>
        </form>
      )}

      <ResultModal
        isOpen={isOpen}
        title="Registration complete"
        message="Welcome to the team! Your registration is pending admin approval."
        discRescription={emailVerification || ""}
        onConfirm={() => router.push("/auth/seller/login")}
        buttenText="Continue"
      />
    </div>
  );
}
