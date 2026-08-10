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

  /* Fetch user details on mount to sync profile (same as Settings page) */
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

    if (formData.ids.length !== 2) {
      toast.error("Please select exactly 2 IDs");
      return;
    }

    // Build payload matching Settings page (documents-section.tsx) exactly
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

    for (const [key, value] of payload.entries()) {
      console.log("check registration key and value:", key, value);
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
          className="flex flex-col gap-3 d p-4 rounded-c8"
        >
          {/* ROW 1: Full Name + ID Selector */}
          <div className="flex md:flex-row flex-col gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label>Full Legal Name</Label>
              <Input
                validateName={true}
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>

            <div
              ref={idDropdownRef}
              className="flex-1 flex flex-col gap-2 relative"
            >
              <Label>ID type</Label>
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
          {formData.ids.map((id, idx) => (
            <div
              key={id.means_of_id}
              className="flex gap-4 md:flex-row flex-col w-full min-w-0"
            >
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <Label> {getIdLabel(id.means_of_id)}</Label>
                <Input
                  value={id.id_number}
                  onChange={(e) => {
                    const ids = [...formData.ids];
                    ids[idx].id_number = e.target.value;
                    setFormData({ ...formData, ids });
                  }}
                />
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
          ))}

          {/* ROW 3: Tax Number + Tax File */}
          <div className="flex gap-4 flex-col md:flex-row w-full min-w-0">
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <Label>TIN (tax identification number)</Label>
              <Input
                value={formData.tax_identification_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax_identification_number: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-0">
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
                  setFormData({
                    ...formData,
                    tax_identification_file: file,
                  });
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
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label>VAT Number</Label>
              <Input
                value={formData.vat_number}
                onChange={(e) =>
                  setFormData({ ...formData, vat_number: e.target.value })
                }
              />
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
