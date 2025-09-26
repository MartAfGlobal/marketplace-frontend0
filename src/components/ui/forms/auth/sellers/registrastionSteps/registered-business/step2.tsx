"use client";

import { useState } from "react";
import { Input } from "@/components/ui/forms/Input";
import { DropdownInput } from "./modals/business-type";
import { africaLocationData } from "./countrydata"; 
import { Button } from "@/components/ui/Button/Button";
import { BusinessRegisterParams } from "@/types/global";
import { useDispatch, useSelector } from "react-redux";



import { sellerActions } from "@/store/user-data/seller/seller-slice";


export default function RegisteredBusinessStep1({
  onContinue,
  goBack,
}: {
  onContinue: () => void;
  goBack: () => void;
}) {
   const sellerData = useSelector((state: any) => state.seller);
  const [formData, setFormData] = useState<BusinessRegisterParams>({
   
    company_name: "",
    buisness_type: "",
    business_category: "",
    business_description: "",
    company_city: "",
    business_registration_location: "",
    company_country: "",
    company_state: "",
    phone2: "",
    postal_code: "",
    is_registered_business: true
  });
   const sellerId = sellerData?.data?.id || "";

  const dispatch = useDispatch();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
    sellerActions.updateSellerData({
      ...formData,
      profileId:sellerId 
    })
  );

    // ✅ Move to the next step
    onContinue();
  };

  const states = formData.company_country
    ? Object.keys(africaLocationData[formData.company_country].states)
    : [];

  const cities =
    formData.company_country && formData.company_state
      ? africaLocationData[formData.company_country].states[formData.company_state]
      : [];

  const isContinueDisabled =
    !formData.company_name ||
    // !formData.business_registration_number ||
    !formData.buisness_type ||
    !formData.business_category ||
    !formData.business_description ||
    !formData.phone2 ||
    !formData.business_registration_location ||
    !formData.company_city||
    !formData.company_country ||
    !formData.company_state ||
    !formData.postal_code;

  return (
    <div className="mt-c48 w-full max-w-270">
      <form onSubmit={handleNext} className="flex flex-col gap-6 text-000000/60">
        {/* Row 1 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Business Name
            </label>
            <Input
              type="text"
              placeholder="Enter your business name"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              className="mt-2"
            />
          </div>
          {/* <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Registration Number
            </label>
            <Input
              type="text"
              placeholder="Enter your registration number"
              value={formData.business_registration_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  business_registration_number: e.target.value,
                })
              }
              className="mt-2"
            />
          </div> */}
        </div>

        {/* Row 2 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Business Type
            </label>
            <DropdownInput
              placeholder="Enter business type"
              options={["Company", "Sole Proprietor", "Partnership"]}
              value={formData.buisness_type}
              onChange={(val) => setFormData({ ...formData, buisness_type: val })}
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Business Category
            </label>
            <DropdownInput
              placeholder="Select business category"
              options={[
                "Agricultural Products",
                "Textiles and Apparel",
                "Fashion",
                "Plastic Products",
                "Footwear and Leather Products",
                "Timber and Wood Products",
                "Building Products",
                "Ceramics",
                "Personal Care Products",
                "Other (Please Specify)",
              ]}
              value={formData.business_category}
              onChange={(val) =>
                setFormData({ ...formData, business_category: val })
              }
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Short Business Introduction
            </label>
            <Input
              type="text"
              placeholder="Enter short business introduction"
              value={formData.business_description}
              onChange={(e) =>
                setFormData({ ...formData, business_description: e.target.value })
              }
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Business Phone Number
            </label>
            <Input
              type="text"
              placeholder="Enter business phone number"
              value={formData.phone2}
              onChange={(e) =>
                setFormData({ ...formData, phone2: e.target.value })
              }
              className="mt-2"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Business Address
            </label>
            <Input
              type="text"
              placeholder="Enter your business address"
              value={formData.business_registration_location}
              onChange={(e) =>
                setFormData({ ...formData, business_registration_location: e.target.value })
              }
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Postal Code
            </label>
            <Input
              type="text"
              placeholder="Enter your postal code"
              value={formData.postal_code}
              onChange={(e) =>
                setFormData({ ...formData, postal_code: e.target.value })
              }
              className="mt-2"
            />
          </div>
        </div>

        {/* Row 5: Country, State, City */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">Country</label>
            <DropdownInput
              placeholder="Choose your country"
              options={Object.keys(africaLocationData)}
              value={formData.company_country}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  company_country: val,
                  company_state: "",
                  company_city: "",
                })
              }
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">State</label>
            <DropdownInput
              placeholder="Choose your state"
              options={states}
              value={formData.company_state}
              onChange={(val) =>
                setFormData({ ...formData, company_state: val, company_city: "" })
              }
              disabled={!formData.company_country}
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">City</label>
            <DropdownInput
              placeholder="Enter your city"
              options={cities}
              value={formData.company_city}
              onChange={(val) => setFormData({ ...formData, company_city: val })}
              disabled={!formData.company_state}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-6 justify-end mt-6">
          <button
            type="button"
            onClick={goBack}
            className="h-11 w-full max-w-39.75 border border-ff715b rounded-xl text-sm font-MontserratSemiBold text-ff715b"
          >
            Previous
          </button>
          <Button
            type="submit"
            disabled={isContinueDisabled}
            className="h-11 w-full max-w-39.75 rounded-xl text-sm font-MontserratSemiBold "
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
