"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/forms/Input";
import { DropdownInput } from "../registered-business/modals/business-type";
import { africaLocationData } from "../registered-business/countrydata";
import { Button } from "@/components/ui/Button/Button";

import clearIcon from "@/assets/icons/close.png";
import UploadIcon from "@/assets/uploadIcon.png";

export default function RegisteredIndividualStep1({
  onContinue,
  goBack,
}: {
  onContinue: () => void;
  goBack: () => void;
}) {
  // Input states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [residenceAddress, setResidenceAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [idType, setIdType] = useState("");
  const [dateOfInsurance, setDateOfInsurance] =useState("")
  const [expiringDate, setExpiringDate] =useState("")

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // Upload state
  const passportInputRef = useRef<HTMLInputElement | null>(null);
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const validIdInputRef = useRef<HTMLInputElement | null>(null);
  const [passportFile, setPassportFile] = useState("");
  const [validId, setValidId] = useState("");
  const [idFile, setIdFile] = useState("");

  // Reusable handlers
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: string) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0].name);
    }
  };

  const handleFileClear = (
    ref: React.RefObject<HTMLInputElement | null>,
    setter: (file: string) => void
  ) => {
    setter("");
    if (ref.current) ref.current.value = "";
  };

  // Dynamic states & cities
  const states = country ? Object.keys(africaLocationData[country].states) : [];
  const cities =
    country && state ? africaLocationData[country].states[state] : [];

  // Disable continue if any required field is empty
  const isContinueDisabled =
    !fullName ||
    !phoneNumber ||
    !email ||
    !dateOfBirth ||
    !nationality ||
    !countryOfResidence ||
    !residenceAddress ||
    !postalCode ||
    !country ||
    !state ||
    !city ||
    !passportFile ||
    !idFile ||
    !idType||
    !validId||
    !dateOfInsurance||
    ! expiringDate;

  return (
    <div className="mt-c48 w-full max-w-270">
      <form className="flex flex-col gap-6 text-000000/60">
        {/* Row 1 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Email Address
            </label>
            <Input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Phone Number
            </label>
            <Input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Date of Birth
            </label>
            <Input
              type="text"
              placeholder="Enter your date of birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Nationality
            </label>
            <Input
              type="text"
              placeholder="Enter your nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Country of Residence
            </label>
            <Input
              type="text"
              placeholder="Enter your country of residence"
              value={countryOfResidence}
              onChange={(e) => setCountryOfResidence(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
              Residential Address
            </label>
            <Input
              type="text"
              placeholder="Enter your residential address"
              value={residenceAddress}
              onChange={(e) => setResidenceAddress(e.target.value)}
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

        {/* Row 5: Country, State, City */}
        <div className="flex justify-center gap-20">
          <div className="w-full max-w-125">
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
          <div className="w-full max-w-125">
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
          <div className="w-full max-w-125">
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

        <p className="text-center font-MontserratSemiBold text-c20 text-161616 mt-6">
          Identity Verification
        </p>

        <div className="flex items-center gap-20 justify-center w-full h-fit mt-2">
          {/* Passport Upload */}
          <FileUpload
            label="Upload Your Passport Photo"
            file={passportFile}
            inputRef={passportInputRef}
            onFileSelect={(e) => handleFileSelect(e, setPassportFile)}
            onFileClear={() =>
              handleFileClear(passportInputRef, setPassportFile)
            }
          />

          {/* Selfie Upload */}
          <FileUpload
            label="Upload Selfie with ID"
            file={idFile}
            inputRef={idInputRef}
            onFileSelect={(e) => handleFileSelect(e, setIdFile)}
            onFileClear={() => handleFileClear(idInputRef, setIdFile)}
          />
        </div>

        <div className="w-full flex gap-20 items-center">
          <div className="w-full max-w-125 h-fit">
            <label className="font-MontserratSemiBold text-base">
              Select Means of Identification
            </label>
            <DropdownInput
              placeholder="Select Means of Identification"
              options={[
                "National ID",
                "International Passport",
                "Driver’s License",
                "Voter’s Card",
              ]}
              value={idType}
              onChange={setIdType}
            />
          </div>
          <div className="w-full  max-w-125 h-fit flex gap-10">
            <div className="w-full max-w-max-w-57.5">
              <label className="font-MontserratSemiBold text-base">
                Date of Issuance
              </label>
              <Input
                type="date"
                placeholder="Enter your country of residence"
                value={dateOfInsurance}
                onChange={(e) => setDateOfInsurance(e.target.value)}
                className="mt-2 cursor-pointer"
              />
            </div>
            <div className="w-full max-w-57.5">
              <label className="font-MontserratSemiBold text-base">
                Date of Expiration
              </label>
              <Input
                type="date"
                placeholder="Enter your country of residence"
                value={expiringDate}
                onChange={(e) => setExpiringDate(e.target.value)}
                className="mt-2 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className=" flex gap-20 w-full">
          <div className="w-full max-w-125">
            <label className="font-MontserratSemiBold text-base">
             ID/VIN/Passport Number
            </label>
            <Input
              type="text"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mt-2"
            />
          </div>
           <FileUpload
            label="Upload Valid ID"
            file={validId}
            inputRef={validIdInputRef}
            onFileSelect={(e) => handleFileSelect(e, setValidId)}
            onFileClear={() => handleFileClear(validIdInputRef, setValidId)}
          />
        </div>
        {/* Footer */}
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

// FileUpload subcomponent for cleaner code
function FileUpload({
  label,
  file,
  inputRef,
  onFileSelect,
  onFileClear,
}: {
  label: string;
  file: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileClear: () => void;
}) {
  return (
    <div className="w-full max-w-125">
      <label className="font-MontserratSemiBold text-base">{label}</label>
      <div className="w-full flex items-center mt-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => inputRef.current?.click()}
          className="flex items-center h-c56 w-full justify-center gap-2.5 px-3 rounded-tl-lg rounded-bl-lg text-ffffff max-w-c126 bg-6a0dad"
        >
          <Image src={UploadIcon} alt="upload icon" width={18} height={18} />
          <span className="font-MontserratSemiBold text-base">Add File</span>
        </motion.button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onFileSelect}
        />

        <div className="w-full relative">
          <Input
            type="text"
            readOnly
            value={file}
            placeholder="No file selected"
            className="h-c56 flex-1 rounded-tl-none rounded-bl-none border px-2"
          />
          {file && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onFileClear}
              className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3 rounded-full bg-000000/32 flex items-center justify-center"
            >
              <Image src={clearIcon} alt="delete" width={8} height={8} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
