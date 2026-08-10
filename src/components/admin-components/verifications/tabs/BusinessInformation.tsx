"use client";

import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "@/components/ui/forms/Label";

interface BusinessInformationProps {
  seller: any;
}

export default function BusinessInformation({
  seller,
}: BusinessInformationProps) {
  const getFileName = (url: string | null, fallback: string) => {
    if (!url) return "No file uploaded";
    try {
      const parts = url.split("/");
      return parts[parts.length - 1] || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const handleViewFile = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <h3 className="font-MontserratNormal  text-base">
        {seller?.is_registered_business
          ? "Company registration"
          : "Business Details"}
      </h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Row 1 */}
        {seller?.is_registered_business && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label className="">Business registration number*</Label>
              <Input
                value={seller?.business_registration_number || ""}
                readOnly
                className=""
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="">CAC registration number*</Label>
              <Input value={seller?.CAC_No || ""} readOnly className="" />
            </div>
          </>
        )}

        {/* Row 2 */}
        <div className="flex flex-col gap-1.5">
          <Label className="">TIN (tax identification number)</Label>
          <Input
            value={seller?.tax_identification_number || ""}
            readOnly
            className=""
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="">Upload TIN (tax identification number)</Label>
          <div className="relative">
            <Input
              value={getFileName(
                seller?.tax_identification_file,
                "TIN_Document.pdf",
              )}
              readOnly
              className="  border-[#ff715b]/30 "
            />
            <button
              type="button"
              disabled={!seller?.tax_identification_file}
              onClick={() => handleViewFile(seller?.tax_identification_file)}
              className="absolute right-1.5 bg-ff715b w-[57px] rounded-c4  top-1/2 -translate-y-1/2 text-c10 text-ffffff h-6 max-w-[57px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View
            </button>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col gap-1.5">
          <Label className="">CAC02 & CAC07</Label>
          <div className="relative ">
            <Input
              value={getFileName(seller?.CAC_No_file, "CAC_Document.pdf")}
              readOnly
              className="  border-[#ff715b]  pr-24"
            />
            <button
              type="button"
              disabled={!seller?.CAC_No_file}
              onClick={() => handleViewFile(seller?.CAC_No_file)}
              className="absolute right-1.5 bg-ff715b w-[57px] rounded-c4  top-1/2 -translate-y-1/2 text-c10 text-ffffff h-6 max-w-[57px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="">Certificate of registration</Label>
          <div className="relative">
            <Input
              value={getFileName(
                seller?.certificate_of_registration,
                "Certificate.pdf",
              )}
              readOnly
              className="  border-[#ff715b]/30 text-gray-500 pr-24"
            />
            <button
              type="button"
              disabled={!seller?.certificate_of_registration}
              onClick={() =>
                handleViewFile(seller?.certificate_of_registration)
              }
              className="absolute right-1.5 bg-ff715b w-[57px] rounded-c4  top-1/2 -translate-y-1/2 text-c10 text-ffffff h-6 max-w-[57px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View
            </button>
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex flex-col gap-1.5">
          <Label className="">VAT number</Label>
          <Input value={seller?.vat_number || ""} readOnly className="" />
        </div>
      </div>
    </div>
  );
}
