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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key:
      | "CAC_No_file"
      | "tax_identification_file"
      | "certificate_of_registration",
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedExtensions = /(\.pdf|\.png|\.jpg|\.jpeg)$/i;
      if (!allowedExtensions.exec(file.name)) {
        toast.error("Only PDF, PNG, JPG, or JPEG files are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Max allowed size is 2MB.`);
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, [key]: file });
    }
  };

  const clearFile = (
    key:
      | "CAC_No_file"
      | "tax_identification_file"
      | "certificate_of_registration",
  ) => {
    setFormData({ ...formData, [key]: null });
  };

  const handleConfirm = () => {
    router.push(`/auth/seller/login`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append(
      "business_registration_number",
      formData.business_registration_number ?? "",
    );
    payload.append("CAC_No", formData.CAC_No ?? "");
    payload.append(
      "tax_identification_number",
      formData.tax_identification_number ?? "",
    );
    payload.append("vat_number", formData.vat_number ?? "");
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
      payload.append("certificate_of_registration", formData.certificate_of_registration);
    }

    registerUserReq({
      successRes: () => {
        setIsOpen(true);
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
          {/* ROW 1 */}
          <div className="flex gap-4 items-center md:flex-row flex-col w-full">
            <div className="flex-1 flex flex-col gap-2 w-full">
              <Label>Business registration number*</Label>
              <Input
                value={formData.business_registration_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_registration_number: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 w-full">
              <Label>CAC Registration Number *</Label>
              <Input
                value={formData.CAC_No}
                onChange={(e) =>
                  setFormData({ ...formData, CAC_No: e.target.value })
                }
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="flex gap-4 items-center md:flex-row flex-col">
            <div className="flex-1 flex flex-col w-full gap-2 min-w-0">
              <Label>CAC02 & CAC07</Label>

              <input
                ref={cacFileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
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
                accept=".pdf,.png,.jpg,.jpeg"
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

          {/* ROW 3 */}
          <div className="flex gap-4 items-center md:flex-row flex-col">
            <div className="flex-1 flex flex-col gap-2 w-full min-w-0">
              <Label>Upload TIN (tax identification number)</Label>

              <input
                ref={tinFileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
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
            <div className="flex-1 flex flex-col gap-2 w-full">
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
          </div>

          {/* ROW 4 */}
          <div className="flex gap-4 items-center w-full md:flex-row flex-col">
            <div className="flex-1 flex flex-col gap-2 w-full">
              <Label>VAT number</Label>
              <Input
                value={formData.vat_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vat_number: e.target.value,
                  })
                }
              />
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
