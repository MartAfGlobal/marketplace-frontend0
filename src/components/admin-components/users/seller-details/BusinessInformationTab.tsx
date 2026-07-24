import { Button } from "@/components/ui/Button/Button";
import { Label } from "@/components/ui/forms/Label";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";

export default function BusinessInformationTab() {
  const router = useRouter();
  const params = useParams();
  const seller = useSelector(
    (state: RootState) => state.adminSellerById?.adminSellerById,
  );

  const userId = (params?.id as string) || seller?.user_id || seller?.id;

  const handleViewMoreDetails = () => {
    if (userId) {
      router.push(`/dashboard/admin/verifications/${userId}`);
    }
  };
  return (
    <div className="w-full">
      <h3 className="font-MontserratNormal text-base  mb-6">
        Business details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <Label className="">Store name</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
              {seller?.company_name}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Business type</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
             {seller?.is_registered_business? "Registered":"Individual"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Registration number</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
              {seller?.business_registration_number || seller?.CAC_No}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="">Country</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
              {seller?.company_country}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">State</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
              {seller?.company_state}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Business Industry</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
              {seller?.business_industry}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="">City</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
             {seller?.company_city}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Postal code</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">
             {seller?.company_postal_code}
            </span>
          </div>
        </div>
      </div>

      <Button className="max-w-56.5" onClick={handleViewMoreDetails}>
        View more details
      </Button>
    </div>
  );
}
