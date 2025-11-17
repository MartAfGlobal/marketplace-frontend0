"use client";

import { useState } from "react";
import { Input } from "@/components/ui/forms/Input";
import { DropdownInput } from "../registered-business/modals/business-type";
import { africaLocationData } from "../registered-business/countrydata";
import { Button } from "@/components/ui/Button/Button";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Cookies from "js-cookie";


  export default function RegisteredIndividualStep3({
  goBack,
  onContinue,
}: {
  onContinue: () => void;
  goBack: () => void;
}) {


  const [businessCategory, setBusinessCategory] = useState("");
  const [businessIntro, setBusinessIntro] = useState("");
 
  const [businessAddress, setBusinessAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const token = useSelector((state: RootState) => state.token.token);

  const sellerId = useSelector((state: any) => state.seller.data?.id);
  const sellerData = useSelector((state: RootState) => state.seller.data);
  // const token = useSelector((state: any) => state.token?.token);
 

  const { loading, sendHttpRequest: UserkycUdateReq } = useHttp();

  const registerUserRes = () => {
    toast.success("Documents submitted successfully!");
    onContinue();
 
  };

  const handleSubmit = async () => {
    const newFormData = new FormData();
    if (!token){

    }

    // Add seller base data (from previous steps)
    if (sellerData) {
      Object.entries(sellerData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newFormData.append(key, String(value));
        }
      });
    }

    // Add Step 3 fields
    newFormData.append("business_category", businessCategory);
    newFormData.append("business_description", businessIntro);

    newFormData.append("business_address", businessAddress);
    newFormData.append("company_postal_code", postalCode);
    newFormData.append("country", country);
    newFormData.append("state", state);
    newFormData.append("city", city);

    if (sellerId) {
      if(!token){
        return
      }
      UserkycUdateReq({
        successRes: registerUserRes,
        requestConfig: {
          url: "/accounts/UserDetails/",
          method: "PATCH",
          body: newFormData,
          token,
          successMessage: "Data submitted successfully!",
        },
      });
    }
     
  };

  const states = country ? Object.keys(africaLocationData[country].states) : [];
  const cities =
    country && state ? africaLocationData[country].states[state] : [];

  const isContinueDisabled =
    !businessCategory ||
    !businessIntro ||
   
    !businessAddress ||
    !postalCode ||
    !country ||
    !state ||
    !city;

  return (
    <div className="mt-c48 w-full max-w-270">
      <form
        className="flex flex-col gap-6 text-000000/60"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Row 1 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
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
              value={businessCategory}
              onChange={setBusinessCategory}
            />
          </div>
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Short Business Introduction
            </label>
            <Input
              type="text"
              placeholder="Enter short business introduction"
              value={businessIntro}
              onChange={(e) => setBusinessIntro(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

       

        {/* Row 3 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Business Address
            </label>
            <Input
              type="text"
              placeholder="Enter your business address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Postal Code
            </label>
            <Input
              type="text"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Row 4: Country, State, City */}
        <div className="flex justify-center gap-20">
          <DropdownInput
            placeholder="Choose your country"
            options={Object.keys(africaLocationData)}
            value={country}
            onChange={(val) => {
              setCountry(val);
              setState("");
              setCity("");
            }}
          />
          <DropdownInput
            placeholder="Choose your state"
            options={states}
            value={state}
            onChange={(val) => {
              setState(val);
              setCity("");
            }}
            disabled={!country}
          />
          <DropdownInput
            placeholder="Choose your city"
            options={cities}
            value={city}
            onChange={setCity}
            disabled={!state}
          />
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
            disabled={isContinueDisabled || loading}
            className="h-11 w-full max-w-39.75 rounded-xl text-sm font-MontserratSemiBold "
          >
            {loading ?  <LoadingSpinner /> : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
