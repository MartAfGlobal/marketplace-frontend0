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
import { useSelector } from "react-redux";
import SelectButton from "@/assets/icons/selectbutton.png";
import ResultModal from "@/components/ui/forms/resultModal";
import Xicon from "@/assets/FormIcon/xicon.svg";
import Trash from "@/assets/FormIcon/Trash.svg";
import { Check } from "lucide-react";

interface RegisterIndividual3Props {
  userType: "seller" | "buyer";
  businessType: "registered" | "unregistered";
}

const ID_TYPE_MAP: Record<string, string> = {
  Passport: "PASSPORT",
  "National ID": "NATIONAL_ID",
  "Voter’s card": "VOTERS_CARD",
  "Driver’s license": "DRIVERS_LICENCE",
};

type IdEntry = {
  means_of_id: string;
  id_number: string;
  id_front_image?: File | null;
  id_back_image?: File | null;
};

export default function RegisterIndividual3({
  userType,
  businessType,
}: RegisterIndividual3Props) {
  const router = useRouter();
  const { loading, sendHttpRequest, error } = useHttp();
  const emailVerification = useSelector(
    (state: RootState) => state.registration.email,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [idDropdownOpen, setIdDropdownOpen] = useState(false);
  const certFileRef = useRef<HTMLInputElement | null>(null);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
          means_of_id: backendValue, // ✅ stored as PASSPORT, NATIONAL_ID, etc.
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

    if (formData.ids.length !== 2) {
      alert("Please select exactly 2 IDs");
      return;
    }

    const payload = new FormData();
    payload.append("fullname", formData.fullname);
    payload.append("vat_number", formData.vat_number);
    payload.append(
      "tax_identification_number",
      formData.tax_identification_number,
    );
    if (formData.tax_identification_file)
      payload.append(
        "tax_identification_file",
        formData.tax_identification_file,
      );

    formData.ids.forEach((id, idx) => {
      payload.append(`ids[${idx}][means_of_id]`, id.means_of_id);
      payload.append(`ids[${idx}][id_number]`, id.id_number);
      if (id.id_front_image)
        payload.append(`ids[${idx}][id_front_image]`, id.id_front_image);
      if (id.id_back_image)
        payload.append(`ids[${idx}][id_back_image]`, id.id_back_image);
    });

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/manufacturer/personal-documents/${emailVerification}/`,
        method: "PATCH",
        body: payload,
        userType,
      },
      successRes: () => setIsOpen(true),
    });
  };
  const clearFile = (
    key: "id_front_image" | "tax_identification_file" | "id_front_image",
  ) => {
    setFormData({ ...formData, [key]: null });
  };
  return (
    <div className="w-full h-full text-black/65">
      {!isOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 d max-h-[70vh] overflow-y-auto p-4 rounded-c8">
          {/* ROW 1: Full Name + ID Selector */}
          <div className="flex md:flex-row flex-col gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label>Full Legal Name</Label>
              <Input
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 relative">
              <Label>ID type</Label>
              <div
                className="border rounded-c8 px-3 py-2 min-h-[44px] flex flex-wrap gap-2 cursor-pointer relative items-center"
                onClick={() => setIdDropdownOpen((p) => !p)}
              >
                {/* LEFT: Dropdown Icon */}

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
                      onClick={() => addId(id)}
                      className="py-2.5 flex items-center text-000000/65 text-xs font-MontserratNormal  gap-3 cursor-pointer hover:bg-gray-100"
                    >
                      <div
                        className={`w-4 h-4 rounded border ${formData.ids.some((i) => i.means_of_id === ID_TYPE_MAP[id]) ? "bg-ff715b border-ff715b" : "border-gray-400"}`}
                      >
                        {formData.ids.some((i) => i.means_of_id === ID_TYPE_MAP[id]) && (
                          <Check size={15} color="white" />
                        )}
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
            <div key={id.means_of_id} className="flex gap-4 md:flex-row flex-col">
              <div className="flex-1 flex flex-col gap-2 ">
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

              <div className="flex-1 flex flex-col gap-2 ">
                <Label> Upload {id.means_of_id.toLocaleLowerCase()} </Label>
                <div className="flex gap-4">
                  {(["id_front_image", "id_back_image"] as const).map((key) => (
                    <div key={key} className="flex-1 flex flex-col gap-2">
                      <input
                        type="file"
                        className="hidden"
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
                        className="border rounded-c8 px-3 py-2 flex justify-between cursor-pointer"
                        onClick={() =>
                          fileRefs.current[`${key}-${idx}`]?.click()
                        }
                      >
                        <span className="truncate text-sm">
                          {id[key]?.name ||
                            (key === "id_front_image"
                              ? "Front Image"
                              : "Back Image")}
                        </span>
                        <Image src={UploadIcon} alt="upload" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* ROW 3: Tax Number + Tax File */}
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 flex flex-col gap-2">
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

            <div className="flex-1 flex flex-col gap-2">
              <Label>Upload TIN (tax identification number)</Label>
              <input
                type="file"
                className="hidden"
                ref={(el) => {
                  fileRefs.current["tax_file"] = el;
                }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax_identification_file: e.target.files?.[0] ?? null,
                  })
                }
              />
              <div
                className="border rounded-c8 px-3 py-2 flex justify-between cursor-pointer"
                onClick={() => fileRefs.current["tax_file"]?.click()}
              >
                <span className="truncate text-sm">
                  {formData.tax_identification_file?.name || "Upload File"}
                </span>
                
                {formData.tax_identification_file ? (
                  <button
                    type="button"
                    onClick={() => clearFile("tax_identification_file")}
                  >
                    <Image src={Trash} alt="Delete" className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => certFileRef.current?.click()}
                  >
                    <Image src={UploadIcon} alt="Upload" className="w-5 h-5" />
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
