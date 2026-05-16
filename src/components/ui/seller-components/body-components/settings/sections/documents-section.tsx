"use client";

import React, { useState, useEffect } from "react";
import { Store, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { useHttp } from "@/hooks/use-http";
import ResultModal from "@/components/ui/forms/resultModal";
import { sellerActions } from "@/store/user-data/seller/seller-slice";
import { motion, AnimatePresence } from "framer-motion";
import UploadIcon from "@/assets/FormIcon/Vector.svg";
import Image from "next/image";

const nigeriaStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
  "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
];

let updateFormData: React.Dispatch<React.SetStateAction<any>> | null = null;
let updateViewerImage: React.Dispatch<React.SetStateAction<any>> | null = null;

const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
  <button 
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${checked ? "bg-[#ff6b6b]" : "bg-[#f0f0f0]"} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

const FileInput = ({
  placeholder,
  disabled = false,
  fileName = "",
  fileUrl = "",
  onFileSelect,
}: {
  placeholder: string,
  disabled?: boolean,
  fileName?: string,
  fileUrl?: string,
  onFileSelect?: (file: File) => void,
}) => {
  const handleButtonClick = () => {
    if (disabled && fileUrl && updateViewerImage) {
      updateViewerImage(fileUrl);
    }
  };

  return (
    <div className="w-full h-12 border border-[#e5e5e5] rounded-xl p-1.5 flex items-center justify-between bg-white">
      <div className={`px-4 h-full flex items-center rounded-lg text-[12px] font-MontserratMedium truncate max-w-[70%] ${fileName || fileUrl ? "bg-[#e5e5e5] text-[#666666]" : "bg-transparent text-[#cccccc]"}`}>
        {fileName || (fileUrl ? "Document.jpg" : placeholder)}
      </div>
      <div className="relative inline-block">
        <button
          type="button"
          onClick={handleButtonClick}
          className={
            disabled
              ? "w-[57px] h-[24px] rounded-[4px] bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0] flex items-center justify-center text-[11px] font-MontserratMedium"
              : "w-[57px] h-[24px] rounded-[4px] bg-transparent flex items-center justify-center"
          }
        >
          {disabled ? (
            "View"
          ) : (
            <Image src={UploadIcon} alt="Upload" className="w-4 h-4" />
          )}
        </button>
        {!disabled && (
          <input
            type="file"
            className="absolute inset-0 w-[57px] h-[24px] opacity-0 cursor-pointer"
            onChange={(e) => e.target.files?.[0] && onFileSelect?.(e.target.files[0])}
          />
        )}
      </div>
    </div>
  );
};

const TextInput = ({ label, placeholder, value, name, disabled = false }: { label: string, placeholder?: string, value?: string, name: string, disabled?: boolean }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[12px] text-[#666666] font-MontserratMedium">{label}</label>
    <input 
      type="text" 
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => updateFormData && updateFormData((prev: any) => ({ ...prev, [name]: e.target.value }))}
      disabled={disabled}
      className={`w-full h-12 border border-[#e5e5e5] rounded-xl px-4 text-[13px] text-[#161616] font-MontserratMedium outline-none focus:border-[#ff6b6b] placeholder:text-[#cccccc] ${disabled ? "bg-gray-50 text-[#999999]" : "bg-white"}`}
    />
  </div>
);

export default function DocumentsSection() {
  const dispatch = useDispatch();
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const profile = sellerData?.profile || ({} as any);
  const token = useSelector((state: RootState) => state.token.token);

  const [activeTab, setActiveTab] = useState("Shop information");
  const [businessType, setBusinessType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<Record<string, File>>({});

  const { loading: fetchingIndustries, sendHttpRequest: fetchIndustriesReq } = useHttp();
  const { loading: fetchingTypes, sendHttpRequest: fetchTypesReq } = useHttp();
  const { loading: updatingProfile, sendHttpRequest: updateProfileReq } = useHttp();
  const { loading: fetchingUserDetails, sendHttpRequest: fetchUserDetailsReq } = useHttp();

  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    business_type: profile?.business_type || "",
    business_registration_number: profile?.business_registration_number || "",
    cac_registration_number: profile?.CAC_No || "",
    tax_identification_number: profile?.tax_identification_number || "",
    vat_number: profile?.vat_number || "",
    company_address_line1: profile?.company_address_line1 || profile?.address || "",
    company_address_line2: profile?.company_address_line2 || "",
    company_city: profile?.company_city || profile?.city || "",
    company_state: profile?.company_state || profile?.state || "",
    company_country: profile?.company_country || profile?.country || "",
    company_postal_code: profile?.company_postal_code || profile?.postal_code || "",
    business_industry: profile?.business_industry || "",
    shipping_zone: profile?.shipping_zone || "",
    shipping_address_line1: profile?.shipping_address_line1 || "",
    shipping_address_line2: profile?.shipping_address_line2 || "",
    shipping_city: profile?.shipping_city || "",
    shipping_state: profile?.shipping_state || "",
    shipping_country: profile?.shipping_country || "",
    shipping_postal_code: profile?.shipping_postal_code || "",
    return_address_line1: profile?.return_address_line1 || "",
    return_address_line2: profile?.return_address_line2 || "",
    return_city: profile?.return_city || "",
    return_state: profile?.return_state || "",
    return_country: profile?.return_country || "",
    return_postal_code: profile?.return_postal_code || "",
  });

  updateFormData = setFormData;
  updateViewerImage = setViewerImage;

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        business_type: profile.business_type || "",
        business_registration_number: profile.business_registration_number || "",
        cac_registration_number: profile.cac_registration_number || "",
        tax_identification_number: profile.tax_identification_number || "",
        vat_number: profile.vat_number || "",
        company_address_line1: profile.company_address_line1 || "",
        company_address_line2: profile.company_address_line2 || "",
        company_city: profile.company_city || "",
        company_state: profile.company_state || "",
        company_country: profile.company_country || "",
        company_postal_code: profile.company_postal_code || "",
        business_industry: profile.business_industry || "",
        shipping_zone: profile.shipping_zone || "",
        shipping_address_line1: profile.shipping_address_line1 || "",
        shipping_address_line2: profile.shipping_address_line2 || "",
        shipping_city: profile.shipping_city || "",
        shipping_state: profile.shipping_state || "",
        shipping_country: profile.shipping_country || "",
        shipping_postal_code: profile.shipping_postal_code || "",
        return_address_line1: profile.return_address_line1 || "",
        return_address_line2: profile.return_address_line2 || "",
        return_city: profile.return_city || "",
        return_state: profile.return_state || "",
        return_country: profile.return_country || "",
        return_postal_code: profile.return_postal_code || "",
      });
      
      // Auto-select business type based on is_registered_business flag
      if (profile.is_registered_business) {
        setBusinessType("Registered company");
      } else {
        setBusinessType("Individual");
      }
    }
  }, [profile]);

  useEffect(() => {
    // Fetch User Details to auto-fill
    fetchUserDetailsReq({
      requestConfig: {
        url: "/accounts/manufacturer/user-details/",
        method: "GET",
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        dispatch(sellerActions.updateSellerData(res.data));
      },
    });

    // Fetch Business Industries
    fetchIndustriesReq({
      requestConfig: {
        url: `/accounts/manufacturer/business-industries/`,
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
        userType: "seller",
      },
      successRes: (res: any) => {
        const industryList = res.data.map((item: any) => item.value);
        setIndustries(industryList);
      },
    });

    // Fetch Business Types
    fetchTypesReq({
      requestConfig: {
        url: `/accounts/manufacturer/business-types/`,
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
        userType: "seller",
      },
      successRes: (res: any) => {
        const typeList = res.data.map((item: any) => item.value);
        setBusinessTypes(typeList);
      },
    });
  }, [token]);

  const validateForm = () => {
    if (activeTab === "Shop information") {
      if (!formData.company_name || !formData.business_industry) {
        return "Please fill in all required shop information fields.";
      }
    } else if (activeTab === "Business information") {
      if (businessType === "Registered company") {
        const requiredText = [
          formData.business_registration_number,
          formData.cac_registration_number,
          formData.tax_identification_number,
          formData.company_address_line1,
          formData.company_city,
          formData.company_state,
          formData.company_country,
          formData.company_postal_code,
        ];
        if (requiredText.some((t) => !t)) return "Please fill in all required text fields.";

        const requiredDocs = [
          { key: "CAC_No_file", url: profile?.CAC_No_file_url },
          { key: "tax_identification_file", url: profile?.tax_certificate_url },
          { key: "certificate_of_registration", url: profile?.certificate_of_registration_url },
          { key: "proof_of_address", url: profile?.proof_of_address },
        ];
        const missing = requiredDocs.filter((doc) => !doc.url && !newFiles[doc.key]);
        if (missing.length > 0) return "Please upload all required business documents.";
      } else {
        const requiredText = [
          formData.tax_identification_number,
          formData.company_address_line1,
          formData.company_city,
          formData.company_state,
          formData.company_country,
          formData.company_postal_code,
        ];
        if (requiredText.some((t) => !t)) return "Please fill in all required text fields.";

        const requiredDocs = [
          { key: "tax_identification_file", url: profile?.tax_certificate_url },
          { key: "proof_of_address", url: profile?.proof_of_address },
        ];
        const missingDocs = requiredDocs.filter((doc) => !doc.url && !newFiles[doc.key]);
        if (missingDocs.length > 0) return "Please upload all required business documents.";
      }
    } else if (activeTab === "Shipping information") {
      if (!formData.shipping_zone) return "Please select a shipping zone.";
      if (!shippingSameAsBusiness) {
        const req = [formData.shipping_address_line1, formData.shipping_city, formData.shipping_state, formData.shipping_country, formData.shipping_postal_code];
        if (req.some((t) => !t)) return "Please fill in all shipping address fields.";
      }
      if (!returnSameAsBusiness) {
        const req = [formData.return_address_line1, formData.return_city, formData.return_state, formData.return_country, formData.return_postal_code];
        if (req.some((t) => !t)) return "Please fill in all return address fields.";
      }
    }
    return null;
  };

  const handleUpdateProfile = () => {

    const formDataObj = new FormData();

    if (activeTab === "Shop information") {
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("is_registered_business", String(businessType === "Registered company"));
      formDataObj.append("business_industry", formData.business_industry);
    } else if (activeTab === "Business information") {
      formDataObj.append("business_registration_number", formData.business_registration_number);
      formDataObj.append("CAC_No", formData.cac_registration_number);
      formDataObj.append("tax_identification_number", formData.tax_identification_number);
      formDataObj.append("vat_number", formData.vat_number);
      formDataObj.append("city", formData.company_city);
      formDataObj.append("state", formData.company_state);
      formDataObj.append("country", formData.company_country);
      formDataObj.append("postal_code", formData.company_postal_code);
      formDataObj.append("address", formData.company_address_line1);
      // Append new files (or keep existing URLs on backend side)
      Object.entries(newFiles).forEach(([key, file]) => {
        formDataObj.append(key, file);
      });
    } else if (activeTab === "Shipping information") {
      formDataObj.append("shipping_zone", formData.shipping_zone);
      formDataObj.append("shipping_address_line1", formData.shipping_address_line1);
      formDataObj.append("shipping_address_line2", formData.shipping_address_line2);
      formDataObj.append("shipping_city", formData.shipping_city);
      formDataObj.append("shipping_state", formData.shipping_state);
      formDataObj.append("shipping_country", formData.shipping_country);
      formDataObj.append("shipping_postal_code", formData.shipping_postal_code);
      
      formDataObj.append("return_address_line1", formData.return_address_line1);
      formDataObj.append("return_city", formData.return_city);
      formDataObj.append("return_state", formData.return_state);
      formDataObj.append("return_country", formData.return_country);
      formDataObj.append("return_postal_code", formData.return_postal_code);
    }

    // Send the request
    updateProfileReq({
      requestConfig: {
        url: "/accounts/manufacturer/profile-update/",
        method: "PATCH",
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
        body: formDataObj,
      },
      successRes: (res: any) => {
        dispatch(sellerActions.updateSellerData({ profile: res.data }));
        setShowWarningModal(false);
        setShowSuccessModal(true);
        setIsEditing(false);
      },
    });
  };

  const [shippingSameAsBusiness, setShippingSameAsBusiness] = useState(false);
  const [returnSameAsBusiness, setReturnSameAsBusiness] = useState(false);

  const tabs = ["Shop information", "Business information", "Shipping information"];

  return (
    <div id="Documents">
      <ResultModal 
        isOpen={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
        onConfirm={handleUpdateProfile}
        result="warning"
        title="Warning"
        message="Your account will not be live until changes are approved. This process may take up to 48 hours."
        buttenText="Save"
        loading={updatingProfile}
      />

      <ResultModal 
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        result="success"
        title="Success"
        message="Profile update request submitted successfully!"
        discRescription="Your changes are pending admin approval."
        buttenText="Okay"
      />

      <ResultModal 
        isOpen={showErrorModal}
        onConfirm={() => setShowErrorModal(false)}
        result="error"
        title="Incomplete Form"
        message={errorMessage}
        buttenText="Okay"
      />

      <AnimatePresence>
        {viewerImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setViewerImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full h-auto max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute -top-10 right-0 text-white hover:text-gray-300 font-MontserratMedium text-sm"
                onClick={() => setViewerImage(null)}
              >
                Close
              </button>
              <img 
                src={viewerImage} 
                alt="Document" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-c18 font-MontserratMedium text-000000 mb-6">Business details</h2>

      {/* Tabs */}
      <div className="flex border-b border-[#f0f0f0] mb-8 overflow-x-auto hcustom-scroll">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-[12px] font-MontserratMedium transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? "bg-[#ff6b6b] text-white" 
                : "text-[#666666] hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Shop information" && (
        <div className="flex flex-col gap-8">
          {/* Business Type */}
          <div className="flex flex-col gap-4">
            <label className="text-[12px] text-[#666666] font-MontserratMedium">Business type</label>
            <div className="flex items-center gap-6">
              <label 
                className={`flex items-center gap-2 cursor-not-allowed opacity-70`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${businessType === "Registered company" ? "border-[#ff6b6b]" : "border-[#cccccc]"}`}>
                   {businessType === "Registered company" && <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />}
                </div>
                <span className={`text-[13px] font-MontserratMedium ${businessType === "Registered company" ? "text-[#333333]" : "text-[#666666]"}`}>
                  Registered company
                </span>
              </label>
              
              <label 
                className={`flex items-center gap-2 cursor-not-allowed opacity-70`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${businessType === "Individual" ? "border-[#ff6b6b]" : "border-[#cccccc]"}`}>
                   {businessType === "Individual" && <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />}
                </div>
                <span className={`text-[13px] font-MontserratMedium ${businessType === "Individual" ? "text-[#333333]" : "text-[#666666]"}`}>
                  Individual
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name / Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-[#666666] font-MontserratMedium">
                {businessType === "Registered company" ? "Business name" : "Full legal name"}
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  disabled={!isEditing}
                  placeholder={businessType === "Registered company" ? "e.g Acme" : "Enter your full name"}
                  className={`w-full h-12 border border-[#e5e5e5] rounded-xl px-4 pr-10 text-[13px] text-[#161616] font-MontserratMedium outline-none focus:border-[#ff6b6b] placeholder:text-[#cccccc] ${!isEditing ? "bg-gray-50 text-[#999999]" : "bg-white"}`}
                />
                <Store size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cccccc]" />
              </div>
            </div>

            {/* Business Industry */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-[#666666] font-MontserratMedium">Business Industry</label>
              <div className="relative">
                 <DropdownInput 
                   disabled={!isEditing}
                   loading={fetchingIndustries}
                   placeholder="Select business industry"
                   options={industries}
                   value={formData.business_industry}
                   onChange={(val) => setFormData(prev => ({ ...prev, business_industry: val }))}
                 />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Business information" && (
        <div className="flex flex-col gap-10">
          {/* Company registration - Only for Registered Company */}
          {businessType === "Registered company" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company registration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput 
                  label="Business registration number*" 
                  name="business_registration_number" 
                  value={formData.business_registration_number} 
                  disabled={!isEditing} 
                />
                <TextInput 
                  label="CAC registration number*" 
                  name="cac_registration_number" 
                  value={formData.cac_registration_number} 
                  disabled={!isEditing} 
                />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#666666] font-MontserratMedium">CAC02 & CAC07</label>
                  <FileInput 
                    placeholder="upload as jpeg, jpg, png, pdf" 
                    disabled={!isEditing} 
                    fileName={newFiles["CAC_No_file"]?.name || (profile?.CAC_No_file_url ? "CAC_Document.jpg" : "")}
                    fileUrl={profile?.CAC_No_file_url}
                    onFileSelect={(file) => setNewFiles(prev => ({ ...prev, CAC_No_file: file }))}
                  />
                </div>

                <TextInput 
                  label="TIN (tax identification number)" 
                  name="tax_identification_number" 
                  value={formData.tax_identification_number} 
                  disabled={!isEditing} 
                />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#666666] font-MontserratMedium">Upload TIN (tax identification number)</label>
                  <FileInput 
                    placeholder="upload as jpeg, jpg, png, pdf" 
                    disabled={!isEditing} 
                    fileName={newFiles["tax_identification_file"]?.name || (profile?.tax_certificate_url ? "Tax_Certificate.jpg" : "")}
                    fileUrl={profile?.tax_certificate_url}
                    onFileSelect={(file) => setNewFiles(prev => ({ ...prev, tax_identification_file: file }))}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#666666] font-MontserratMedium">Certificate of registration</label>
                  <FileInput 
                    placeholder="upload as jpeg, jpg, png, pdf" 
                    disabled={!isEditing} 
                    fileName={newFiles["certificate_of_registration"]?.name || (profile?.certificate_of_registration_url ? "Registration_Certificate.jpg" : "")}
                    fileUrl={profile?.certificate_of_registration_url}
                    onFileSelect={(file) => setNewFiles(prev => ({ ...prev, certificate_of_registration: file }))}
                  />
                </div>

                <TextInput 
                  label="VAT number" 
                  name="vat_number" 
                  value={formData.vat_number} 
                  disabled={!isEditing} 
                />
              </div>
            </div>
          )}

          {/* Personal Identification - Only for Individual */}
          {businessType === "Individual" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Personal identification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile?.identification_verifications?.map((id: any, index: number) => (
                  <div key={index} className="flex flex-col gap-4 p-4 border border-[#f0f0f0] rounded-xl bg-gray-50/30">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] font-MontserratSemiBold text-[#333333]">{id.type || "ID Document"} {index + 1}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <TextInput 
                        label="ID Number" 
                        name={`id_number_${index}`} 
                        value={id.id_number} 
                        disabled 
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] text-[#666666] font-MontserratMedium">Front view</label>
                          <FileInput 
                            placeholder="Front view" 
                            disabled={!isEditing} 
                            fileName={id.id_front_image_url ? `Front_ID_${index + 1}.jpg` : ""}
                            fileUrl={id.id_front_image_url}
                            onFileSelect={(file) => setNewFiles(prev => ({ ...prev, [`ids[${index}][id_front_image]`]: file }))}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] text-[#666666] font-MontserratMedium">Back view</label>
                          <FileInput 
                            placeholder="Back view" 
                            disabled={!isEditing} 
                            fileName={id.id_back_image_url ? `Back_ID_${index + 1}.jpg` : ""}
                            fileUrl={id.id_back_image_url}
                            onFileSelect={(file) => setNewFiles(prev => ({ ...prev, [`ids[${index}][id_back_image]`]: file }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(!profile?.identification_verifications || profile.identification_verifications.length === 0) && (
                  <p className="text-[13px] text-[#999999] font-MontserratMedium col-span-2 text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                    No identification documents found.
                  </p>
                )}
              </div>

              {/* Individual TIN/VAT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <TextInput 
                  label="TIN (tax identification number)" 
                  name="tax_identification_number" 
                  value={formData.tax_identification_number} 
                  disabled={!isEditing} 
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#666666] font-MontserratMedium">Upload TIN</label>
                  <FileInput 
                    placeholder="Upload TIN" 
                    disabled={!isEditing} 
                    fileName={newFiles["tax_identification_file"]?.name || (profile?.tax_certificate_url ? "Tax_Certificate.jpg" : "")}
                    fileUrl={profile?.tax_certificate_url}
                    onFileSelect={(file) => setNewFiles(prev => ({ ...prev, tax_identification_file: file }))}
                  />
                </div>
                <TextInput 
                  label="VAT number" 
                  name="vat_number" 
                  value={formData.vat_number} 
                  disabled={!isEditing} 
                />
              </div>
            </div>
          )}

          {/* Company address */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Address line 1" name="company_address_line1" value={formData.company_address_line1} disabled={!isEditing} />
              <TextInput label="Address line 2" name="company_address_line2" value={formData.company_address_line2} disabled={!isEditing} />
              <TextInput label="City/Town" name="company_city" value={formData.company_city} disabled={!isEditing} />
              <TextInput label="State/Region" name="company_state" value={formData.company_state} disabled={!isEditing} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1"><TextInput label="Country" name="company_country" value={formData.company_country} disabled={!isEditing} /></div>
              <div className="md:col-span-1"><TextInput label="Postal code" name="company_postal_code" value={formData.company_postal_code} disabled={!isEditing} /></div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">Proof of address</label>
                <FileInput 
                  placeholder="" 
                  disabled={!isEditing} 
                  fileName={newFiles["proof_of_address"]?.name || (profile?.proof_of_address ? "proof_of_address.pdf" : "")} 
                  fileUrl={profile?.proof_of_address}
                  onFileSelect={(file) => setNewFiles(prev => ({ ...prev, proof_of_address: file }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Shipping information" && (
        <div className="flex flex-col gap-10">
          
          {/* Shipping zone */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 w-full md:max-w-md">
              <label className="text-[12px] text-[#666666] font-MontserratMedium">Shipping zone</label>
              <div className="relative">
                 <DropdownInput 
                   disabled={!isEditing}
                   placeholder="Enter shipping zone"
                   options={nigeriaStates}
                   value={formData.shipping_zone}
                   onChange={(val) => setFormData(prev => ({ ...prev, shipping_zone: val }))}
                 />
              </div>
            </div>
          </div>

          {/* Shipping information */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Shipping information</h3>
            
            <div className="flex items-center gap-3">
              <ToggleSwitch 
                checked={shippingSameAsBusiness} 
                onChange={() => setShippingSameAsBusiness(!shippingSameAsBusiness)} 
                disabled={!isEditing}
              />
              <span className="text-[13px] text-[#666666] font-MontserratMedium">Same as business address</span>
            </div>

            {!shippingSameAsBusiness && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <TextInput label="Address line 1" name="shipping_address_line1" value={formData.shipping_address_line1} disabled={!isEditing} />
                <TextInput label="Address line 1" name="shipping_address_line2" value={formData.shipping_address_line2} disabled={!isEditing} />
                <TextInput label="City/Town" name="shipping_city" value={formData.shipping_city} disabled={!isEditing} />
                <TextInput label="State/Region" name="shipping_state" value={formData.shipping_state} disabled={!isEditing} />
                <TextInput label="Country" name="shipping_country" value={formData.shipping_country} disabled={!isEditing} />
                <TextInput label="Postal code" name="shipping_postal_code" value={formData.shipping_postal_code} disabled={!isEditing} />
              </div>
            )}
          </div>

          {/* Return address */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-[16px] font-MontserratMedium text-[#161616] mb-1">Return address</h3>
              <p className="text-[12px] text-[#999999] font-MontserratMedium">Address used for good returns</p>
            </div>
            
            <div className="flex items-center gap-3">
              <ToggleSwitch 
                checked={returnSameAsBusiness} 
                onChange={() => setReturnSameAsBusiness(!returnSameAsBusiness)} 
                disabled={!isEditing}
              />
              <span className="text-[13px] text-[#666666] font-MontserratMedium">Same as business address</span>
            </div>

            {!returnSameAsBusiness && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <TextInput label="Address line 1" name="return_address_line1" value={formData.return_address_line1} disabled={!isEditing} />
                <TextInput label="Address line 1" name="return_address_line2" value={formData.return_address_line2} disabled={!isEditing} />
                <TextInput label="City/Town" name="return_city" value={formData.return_city} disabled={!isEditing} />
                <TextInput label="State/Region" name="return_state" value={formData.return_state} disabled={!isEditing} />
                <TextInput label="Country" name="return_country" value={formData.return_country} disabled={!isEditing} />
                <TextInput label="Postal code" name="return_postal_code" value={formData.return_postal_code} disabled={!isEditing} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-16 flex justify-end">
        <button 
          onClick={() => {
            if (isEditing) {
              const error = validateForm();
              if (error) {
                setErrorMessage(error);
                setShowErrorModal(true);
              } else {
                setShowWarningModal(true);
              }
            } else {
              setIsEditing(true);
            }
          }}
          className="px-12 h-10 bg-[#ff6b6b] text-white rounded-lg text-[13px] font-MontserratMedium hover:bg-[#e55a5a] transition-all shadow-sm"
        >
          {isEditing ? "Save changes" : "Update"}
        </button>
      </div>
    </div>
  );
}
