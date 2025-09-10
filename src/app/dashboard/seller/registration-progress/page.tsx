"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Logo from "@/assets/images/logo.svg";
import warning from "@/assets/icons/warning.png";
import ProgressStatus from "@/components/ui/forms/auth/sellers/registrastionSteps/progress-status";
import AccountDetailsStep from "@/components/ui/forms/auth/sellers/registrastionSteps/step1";
import RegisteredBusinessStep1 from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/step2";
import DocumentUploadForm from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/step3";
import RegisteredSumibted from "@/components/ui/forms/auth/sellers/registrastionSteps/registration-successful";
import RegisteredIndividualStep1 from "@/components/ui/forms/auth/sellers/registrastionSteps/registration-individual-seller/step2-individual";
import RegisteredIndividualStep3 from "@/components/ui/forms/auth/sellers/registrastionSteps/registration-individual-seller/step3-individual";


export default function RegistrationProgress() {
  const router = useRouter()
  const steps = [
    "Account Details",
    "Business Information",
    "Compliance & Documents",
    "Successful Registration",
  ];

  const titleP = [
    "Your Account Details",
    "Complete Your Basic Business Details",
    "Upload Your Business, Compliance & Legal Documents",
    "",
  ];

  const formOptions = [
    "Registered Business – For legally registered companies",
    "Individual Seller – For freelancers or personal brands",
  ];

  const [activeStep, setActiveStep] = useState(steps[0]);
  const [selectedForm, setSelectedForm] = useState(formOptions[0]); 
  const currentIndex = steps.indexOf(activeStep);

  
  const goToNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };
  const goToPrevStep = () => {
    if (currentIndex > 0) {
      
      setActiveStep(steps[currentIndex - 1]);
    }
  };

 
  const renderStep = () => {
    switch (activeStep) {
      case "Account Details":
        return <AccountDetailsStep onContinue={goToNextStep} />;

      case "Business Information":
        return (
          <div className="w-full mt-c42 ">
            <p className="font-MontserratSemiBold text-c18 h-c48 mb-2 flex items-center">
              Select your registration type:
            </p>
            <div className="flex flex-col mb-6">
              {formOptions.map((option) => (
                <div key={option} className="flex items-center gap-4 h-16 ">
                  <button
                    type="button"
                    onClick={() => setSelectedForm(option)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      selectedForm === option
                        ? "border-[#6A0DAD]"
                        : "border-gray-400"
                    }`}
                  >
                    <div>
                    
                      {selectedForm === option && (
                        <div className="w-4 h-4 rounded-full bg-[#6A0DAD]" />
                      )}
                    </div>

                    
                  </button>
                  <span className="text-c18 font-MontserratMedium text-161616">
                    {option}
                  </span>
                </div>
              ))}
            </div>

            {selectedForm === formOptions[0] ? (
              <div>
                <RegisteredBusinessStep1
                  goBack={goToPrevStep}
                  onContinue={goToNextStep}
                />
              </div>
            ) : (
              <div>
                <RegisteredIndividualStep1
                  goBack={goToPrevStep}
                  onContinue={goToNextStep}
                />
              </div>
            )}
          </div>
        );

      case "Compliance & Documents":
        return (
          <div className="w-full ">
            {selectedForm === formOptions[0] ? (
              <div className="mt-c48">
                <div className="flex gap-6 ">
                  <div className="w-fit h-fit flex-shrink-0">
                    <Image
                      src={warning}
                      alt="warning"
                      width={24}
                      height={24}
                      className=""
                    />
                  </div>
                  <p className="text-161616 font-MontserratNormal text-c18">
                    Accepted file formats: PDF, PNG, JPG, or JPEG. Maximum file
                    size: 10MB per document. Please ensure all uploads are clear
                    and valid for successful verification.
                  </p>
                </div>
                <DocumentUploadForm
                  goBack={goToPrevStep}
                  onContinue={goToNextStep}
                />
              </div>
            ) : (
              <div>
                <RegisteredIndividualStep3
                  goBack={goToPrevStep}
                  onContinue={goToNextStep}
                />
              </div>
            )}
          </div>
        );

      case "Successful Registration":
        return (
          <div>
            <RegisteredSumibted />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="w-full h-fit min-h-screen flex flex-col px-25 py-10 justify-center items-center bg-6a0dad">

      <div className="w-full flex justify-between bg-6a0dad mb-c80-48 px-25 h-fit fixed top-0 py-5 z-50 items-center max-w-full">
        <div>
          <Link href={"/"}>
            <div>
              <Image
                src={Logo}
                alt="Logo"
                width={64.47}
                height={50.38}
                className="m-auto"
              />
            </div>
            <p className="mt-3 font-MontserratBold text-center text-c24 text-ffffff">
              MARTAF
            </p>
          </Link>
        </div>
        <div>
          <button onClick={()=>router.push("/dashboard/seller")}
            className="text-base font-MontserratSemiBold text-ffffff border-b-2 border-b-ffffff"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex flex-col   items-center rounded-c24 mt-25 py-16 px-20 bg-ffffff w-full">
        <div className="pb-c56">
          <p className="text-c32 font-MontserratSemiBold m-0">
            Seller’s Registration Process
          </p>
        </div>
        <ProgressStatus
          tabs={steps}
          activeTab={activeStep}
          pageTitle={titleP[currentIndex]}
        />

        {/* Step Content */}
        <div className="w-full flex justify-center">{renderStep()}</div>
      </div>
    </main>
  );
}
