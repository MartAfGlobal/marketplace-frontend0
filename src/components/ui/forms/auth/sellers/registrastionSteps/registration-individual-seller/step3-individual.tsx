"use client";

import { useState } from "react";
import { Input } from "@/components/ui/forms/Input";
import { DropdownInput } from "../registered-business/modals/business-type";
import { africaLocationData } from "../registered-business/countrydata"; // make sure path is correct
import { Button } from "@/components/ui/Button/Button";

export default function RegisteredIndividualStep3({
  onContinue,
  goBack,
}: {
  onContinue: () => void;
  goBack: () => void;
}) {

  const [businessEmail, setBusinessEmail] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessIntro, setBusinessIntro] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // Dynamically get states & cities
  const states = country ? Object.keys(africaLocationData[country].states) : [];
  const cities =
    country && state ? africaLocationData[country].states[state] : [];

  // Disable continue if any input is empty
  const isContinueDisabled =
    !businessEmail ||
    
    !businessCategory ||
    !businessIntro ||
    !businessPhone ||
    !businessAddress ||
    !postalCode ||
    !country ||
    !state ||
    !city;

  return (
    <div className="mt-c48 w-full max-w-270">
      <form className="flex flex-col gap-6 text-000000/60">
        {/* Row 1 */}
       

        {/* Row 2 */}
        <div className="flex justify-center gap-20">
          
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
              value={businessCategory}
              onChange={setBusinessCategory}
            />
          </div>
           <div className="w-full max-w-125 h-fit">
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
         
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Business Phone Number
            </label>
            <Input
              type="text"
              placeholder="Enter business phone number"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
             Business Email Address (if applicable)
            </label>
            <Input
              type="text"
              placeholder="Enter business phone number"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
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
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
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
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
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
              value={country}
              onChange={(val) => {
                setCountry(val);
                setState("");
                setCity("");
              }}
            />
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">State</label>
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
          </div>
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">City</label>
            <DropdownInput
              placeholder="Enter your city"
              options={cities}
              value={city}
              onChange={setCity}
              disabled={!state}
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
            type="button"
            onClick={onContinue}
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
