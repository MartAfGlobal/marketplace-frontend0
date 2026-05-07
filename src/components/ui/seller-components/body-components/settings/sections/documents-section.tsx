"use client";

import React, { useState, useEffect } from "react";
import { Store, ChevronDown, Paperclip } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { useHttp } from "@/hooks/use-http";
import ResultModal from "@/components/ui/forms/resultModal";
import { sellerActions } from "@/store/user-data/seller/seller-slice";

const nigeriaStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
  "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
];

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

  const { loading: fetchingIndustries, sendHttpRequest: fetchIndustriesReq } = useHttp();
  const { loading: fetchingTypes, sendHttpRequest: fetchTypesReq } = useHttp();
  const { loading: updatingProfile, sendHttpRequest: updateProfileReq } = useHttp();

  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    business_type: profile?.business_type || "",
    business_registration_number: profile?.business_registration_number || "",
    cac_registration_number: profile?.cac_registration_number || "",
    tax_identification_number: profile?.tax_identification_number || "",
    company_address_line1: profile?.company_address_line1 || "",
    company_address_line2: profile?.company_address_line2 || "",
    company_city: profile?.company_city || "",
    company_state: profile?.company_state || "",
    company_country: profile?.company_country || "",
    company_postal_code: profile?.company_postal_code || "",
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

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        business_type: profile.business_type || "",
        business_registration_number: profile.business_registration_number || "",
        cac_registration_number: profile.cac_registration_number || "",
        tax_identification_number: profile.tax_identification_number || "",
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
  }, []);

  const handleUpdateProfile = () => {
    const formDataObj = new FormData();

    if (activeTab === "Shop information") {
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("business_type", businessType);
      formDataObj.append("business_industry", formData.business_industry);
    } else if (activeTab === "Business information") {
      formDataObj.append("business_registration_number", formData.business_registration_number);
      formDataObj.append("CAC_No", profile?.CAC_No || "");
      formDataObj.append("tax_identification_number", formData.tax_identification_number);
      formDataObj.append("vat_number", profile?.vat_number || "");
      
      formDataObj.append("city", formData.company_city);
      formDataObj.append("state", formData.company_state);
      formDataObj.append("country", formData.company_country);
      formDataObj.append("postal_code", formData.company_postal_code);
      formDataObj.append("address", formData.company_address_line1);
    } else if (activeTab === "Shipping information") {
      formDataObj.append("shipping_zone", formData.shipping_zone);
      formDataObj.append("shipping_address_line1", formData.shipping_address_line1);
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

    updateProfileReq({
      requestConfig: {
        url: `/accounts/manufacturer/profile-update/`,
        method: "PATCH",
        isAuth: true,
        token: token ?? undefined,
        body: formDataObj,
        userType: "seller",
      },
      successRes: (res: any) => {
        dispatch(sellerActions.updateSellerData({ profile: res.data }));
        setIsEditing(false);
        setShowWarningModal(false);
        setShowSuccessModal(true);
      },
    });
  };

  const [shippingSameAsBusiness, setShippingSameAsBusiness] = useState(false);
  const [returnSameAsBusiness, setReturnSameAsBusiness] = useState(false);

  const tabs = ["Shop information", "Business information", "Shipping information"];

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      type="button"
      disabled={!isEditing}
      onClick={onChange}
      className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${checked ? "bg-[#ff6b6b]" : "bg-[#f0f0f0]"} ${!isEditing ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  const FileInput = ({ placeholder, disabled = false, fileName = "" }: { placeholder: string, disabled?: boolean, fileName?: string }) => {
    if (fileName) {
      return (
        <div className="w-full h-12 border border-[#e5e5e5] rounded-xl p-1.5 flex items-center justify-between bg-white">
          <div className="bg-[#e5e5e5] px-4 h-full flex items-center rounded-lg text-[12px] text-[#666666] font-MontserratMedium">
            {fileName}
          </div>
          <button 
            type="button"
            className="bg-[#ff6b6b] text-white px-6 h-full rounded-lg text-[12px] font-MontserratMedium hover:bg-[#e55a5a] transition-colors"
          >
            {disabled ? "View" : "Upload"}
          </button>
        </div>
      );
    }
    
    return (
      <div className="relative">
        <input 
          type="text" 
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-12 border border-[#e5e5e5] rounded-xl px-4 pr-10 text-[13px] text-[#666666] font-MontserratMedium outline-none ${disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer bg-white'} placeholder:text-[#999999]`}
        />
        <Paperclip size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666]" />
        {!disabled && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />}
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
        value={value}
        onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
        disabled={disabled}
        className={`w-full h-12 border border-[#e5e5e5] rounded-xl px-4 text-[13px] text-[#161616] font-MontserratMedium outline-none focus:border-[#ff6b6b] placeholder:text-[#cccccc] ${disabled ? "bg-gray-50 text-[#999999]" : "bg-white"}`}
      />
    </div>
  );

  return (
    <div id="Documents">
      <ResultModal 
        isOpen={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
        onConfirm={handleUpdateProfile}
        result="warning"
        title="Warning"
        message="Your account will not be live until changes are approved. This process may take up to 48 hours."
        buttenText="Accept and Save"
        loading={updatingProfile}
      />

      <ResultModal 
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        result="success"
        title="Success"
        message="Profile update request submitted successfully!"
        buttenText="Okay"
      />

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
                className={`flex items-center gap-2 ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                onClick={() => isEditing && setBusinessType("Registered company")}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${businessType === "Registered company" ? "border-[#ff6b6b]" : "border-[#cccccc]"}`}>
                   {businessType === "Registered company" && <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />}
                </div>
                <span className={`text-[13px] font-MontserratMedium ${businessType === "Registered company" ? "text-[#333333]" : "text-[#666666]"}`}>
                  Registered company
                </span>
              </label>
              
              <label 
                className={`flex items-center gap-2 ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                onClick={() => isEditing && setBusinessType("Individual")}
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
            {/* Business Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-[#666666] font-MontserratMedium">Business name</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="e.g Acme"
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
          {/* Company registration */}
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
                name="CAC_No" 
                value={profile?.CAC_No || ""} 
                disabled={!isEditing} 
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">CAC02 & CAC07</label>
                <FileInput 
                  placeholder="upload as jpeg, jpg, png, pdf" 
                  disabled={!isEditing} 
                  fileName={profile?.CAC_No_file_url ? "CAC_Document.jpg" : ""} 
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
                  fileName={profile?.tax_certificate_url ? "Tax_Certificate.jpg" : ""} 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">Certificate of registration</label>
                <FileInput 
                  placeholder="upload as jpeg, jpg, png, pdf" 
                  disabled={!isEditing} 
                  fileName={profile?.certificate_of_registration_url ? "Registration_Certificate.jpg" : ""} 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">VAT number</label>
                <TextInput 
                  label="" 
                  name="vat_number" 
                  value={profile?.vat_number || ""} 
                  disabled={!isEditing} 
                />
              </div>
            </div>
          </div>

          {/* Company address */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Company address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Address line 1" name="company_address_line1" value={formData.company_address_line1} disabled={!isEditing} />
              <TextInput label="Address line 1" name="company_address_line2" value={formData.company_address_line2} disabled={!isEditing} />
              <TextInput label="City/Town" name="company_city" value={formData.company_city} disabled={!isEditing} />
              <TextInput label="State/Region" name="company_state" value={formData.company_state} disabled={!isEditing} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1"><TextInput label="Country" name="company_country" value={formData.company_country} disabled={!isEditing} /></div>
              <div className="md:col-span-1"><TextInput label="Postal code" name="company_postal_code" value={formData.company_postal_code} disabled={!isEditing} /></div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">Proof of address</label>
                <FileInput placeholder="" disabled={!isEditing} fileName={profile?.proof_of_address ? "proof_of_address.pdf" : ""} />
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
              setShowWarningModal(true);
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
