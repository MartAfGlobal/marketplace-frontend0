"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import ResultModal from "@/components/ui/forms/resultModal";
import { sellerActions } from "@/store/user-data/seller/seller-slice";

import ShopInfoTab from "./documents/shop-info-tab";
import BusinessInfoTab, { IdEntry } from "./documents/business-info-tab";
import ShippingInfoTab from "./documents/shipping-info-tab";

// ── Validation helpers (mirrors business-info-tab.tsx) ────────────────────────
const BIZ_REG_REGEX = /^[A-Z0-9\/-]{6,20}$/i;
const CAC_REGEX = /^((RC|BN|IT|LP|LLP)[-\s]?\d{5,8}|\d{6,10})$/i;
const TIN_REGEX = /^\d{8}(-\d{4})?$/;
const VAT_REGEX = /^([A-Z]{2})?\d{8}(-\d{4})?$/i;

const ID_NUMBER_RULES: Record<string, { regex: RegExp; minLength: number; maxLength: number; label: string }> = {
  PASSPORT:       { regex: /^[A-Z]{1}\d{8}$/i, minLength: 9,  maxLength: 9,  label: "Passport (1 letter + 8 digits)" },
  NATIONAL_ID:    { regex: /^\d{11}$/,          minLength: 11, maxLength: 11, label: "NIN (11 digits)" },
  VOTERS_CARD:    { regex: /^[A-Z0-9]{11,19}$/i,minLength: 11, maxLength: 19, label: "Voter's Card (11–19 chars)" },
  DRIVERS_LICENCE:{ regex: /^[A-Z]{3}[0-9A-Z]{5,12}$/i, minLength: 8, maxLength: 15, label: "Driver's Licence (8–15 chars)" },
};

function validateBusinessInfoFields(formData: SellerFormData, businessType: string): string[] {
  const msgs: string[] = [];

  if (businessType === "Registered company") {
    if (
      formData.business_registration_number &&
      (!BIZ_REG_REGEX.test(formData.business_registration_number.trim()) ||
        formData.business_registration_number.trim().length < 6 ||
        formData.business_registration_number.trim().length > 20)
    )
      msgs.push("Business registration number must be 6–20 characters (letters, numbers, - or /).");
    if (
      formData.CAC_No &&
      (!CAC_REGEX.test(formData.CAC_No.trim()) ||
        formData.CAC_No.trim().length < 6 ||
        formData.CAC_No.trim().length > 14)
    )
      msgs.push("CAC registration number format is invalid (e.g. RC1234567 or BN1234567).");
  } else {
    // Individual: validate each ID number
    formData.ids.forEach((id, i) => {
      const rule = ID_NUMBER_RULES[id.means_of_id];
      if (!rule) return;
      const v = id.id_number.trim();
      if (v && (v.length < rule.minLength || v.length > rule.maxLength || !rule.regex.test(v)))
        msgs.push(`ID #${i + 1} number is invalid. Expected: ${rule.label}.`);
    });
  }

  if (formData.tax_identification_number && !TIN_REGEX.test(formData.tax_identification_number.trim()))
    msgs.push("TIN format is invalid. Expected: 8 digits or 12345678-0001.");
  if (formData.vat_number && !TIN_REGEX.test(formData.vat_number.trim()))
    msgs.push("VAT number format is invalid. Expected: 8 digits or 12345678-0001.");

  if (formData.company_postal_code && !/^\d{6}$/.test(formData.company_postal_code.trim()))
    msgs.push("Postal code must be exactly 6 digits.");

  return msgs;
}
// ─────────────────────────────────────────────────────────────────────────────

const TABS = ["Shop information", "Business information", "Shipping information"] as const;
type TabName = (typeof TABS)[number];

interface SellerFormData {
  company_name: string;
  business_type: string;
  business_registration_number: string;
  CAC_No: string;
  tax_identification_number: string;
  vat_number: string;
  company_address: string;
  company_address_line_2: string;
  company_city: string;
  company_state: string;
  company_country: string;
  company_postal_code: string;
  business_industry: string;
  fullname: string;
  // Shipping address — keys match nested API body
  shipping_zone: string;
  shipping_address_line_1: string;
  shipping_address_line_2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_postal_code: string;
  // Return address — keys match nested API body
  return_address_line_1: string;
  return_address_line_2: string;
  return_city: string;
  return_state: string;
  return_country: string;
  return_postal_code: string;
  ids: IdEntry[];
}

function buildInitialForm(profile: any): SellerFormData {
  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const fullname = profile?.fullname || [firstName, lastName].filter(Boolean).join(" ") || "";

  return {
    company_name: profile?.company_name || "",
    business_type: profile?.business_type || "",
    business_registration_number: profile?.business_registration_number || "",
    CAC_No: profile?.CAC_No || "",
    tax_identification_number: profile?.tax_identification_number || "",
    vat_number: profile?.vat_number || "",
    company_address: profile?.company_address || profile?.address || "",
    company_address_line_2: profile?.company_address_line_2 || "",
    company_city: profile?.company_city || profile?.city || "",
    company_state: profile?.company_state || profile?.state || "",
    company_country: profile?.company_country || profile?.country || "",
    company_postal_code: profile?.company_postal_code || profile?.postal_code || "",
    business_industry: profile?.business_industry || "",
    fullname,
    shipping_zone: profile?.shipping_zone && typeof profile.shipping_zone === "object"
      ? String(profile.shipping_zone.id)
      : profile?.shipping_zone || "",
    shipping_address_line_1: "",
    shipping_address_line_2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "",
    shipping_postal_code: "",
    return_address_line_1: "",
    return_address_line_2: "",
    return_city: "",
    return_state: "",
    return_country: "",
    return_postal_code: "",
    ids: (profile?.identification_verifications || []).map((id: any) => ({
      means_of_id: id.type || id.means_of_id || "",
      id_number: id.id_number || "",
      id_front_image_url: id.id_front_image_url || "",
      id_back_image_url: id.id_back_image_url || "",
    })),
  };
}

export default function DocumentsSection() {
  const dispatch = useDispatch();
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const profile = sellerData?.profile || ({} as any);
  const token = useSelector((state: RootState) => state.token.token);
  console.log("Seller profile token:", token);


  const [activeTab, setActiveTab] = useState<TabName>("Shop information");
  const [businessType, setBusinessType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [shippingZones, setShippingZones] = useState<{ label: string; value: string }[]>([]);
  const [shippingSameAsBusiness, setShippingSameAsBusiness] = useState(false);
  const [returnSameAsBusiness, setReturnSameAsBusiness] = useState(false);
  const [newFiles, setNewFiles] = useState<Record<string, File>>({});
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<SellerFormData>(() => buildInitialForm(profile));

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { loading: fetchingIndustries, sendHttpRequest: fetchIndustriesReq } = useHttp();
  const { loading: updatingProfile, sendHttpRequest: updateProfileReq } = useHttp();
  const { loading: docLoading, sendHttpRequest: updateDocReq } = useHttp();
  const { loading: updatingAddresses, sendHttpRequest: updateAddressesReq } = useHttp();
  const { sendHttpRequest: fetchUserDetailsReq } = useHttp();
  const { sendHttpRequest: fetchTypesReq } = useHttp();
  const { sendHttpRequest: fetchShippingZonesReq } = useHttp();
  const { sendHttpRequest: fetchAddressesReq } = useHttp();

  /* ── Sync profile from Redux ──────────────────────────────────────── */
  useEffect(() => {
    if (profile) {
      // Merge only the non-address profile fields so we don't overwrite shipping/return
      // address data that fetchAddressesReq may have already loaded into state.
      setFormData((prev) => ({
        ...buildInitialForm(profile),
        // Preserve shipping & return fields that were populated by the addresses endpoint
        shipping_zone: prev.shipping_zone || (
          profile?.shipping_zone && typeof profile.shipping_zone === "object"
            ? String(profile.shipping_zone.id)
            : profile?.shipping_zone || ""
        ),
        shipping_address_line_1: prev.shipping_address_line_1,
        shipping_address_line_2: prev.shipping_address_line_2,
        shipping_city: prev.shipping_city,
        shipping_state: prev.shipping_state,
        shipping_country: prev.shipping_country,
        shipping_postal_code: prev.shipping_postal_code,
        return_address_line_1: prev.return_address_line_1,
        return_address_line_2: prev.return_address_line_2,
        return_city: prev.return_city,
        return_state: prev.return_state,
        return_country: prev.return_country,
        return_postal_code: prev.return_postal_code,
      }));
      setBusinessType(profile.is_registered_business ? "Registered company" : "Individual");
    }
  }, [profile]);

  /* ── Initial data fetches ─────────────────────────────────────────── */
  useEffect(() => {
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

    fetchIndustriesReq({
      requestConfig: {
        url: "/accounts/manufacturer/business-industries/",
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
        userType: "seller",
      },
      successRes: (res: any) => {
        setIndustries(res.data.map((item: any) => item.value));
      },
    });

    fetchTypesReq({
      requestConfig: {
        url: "/accounts/manufacturer/business-types/",
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
        userType: "seller",
      },
      successRes: () => {},
    });

    fetchShippingZonesReq({
      requestConfig: {
        url: "/shippingcalculator/zones/active/",
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
        userType: "seller",
      },
      successRes: (res: any) => {
        setShippingZones(
          res.data.map((item: any) => ({ label: item.name, value: String(item.id) }))
        );
      },
    });

    // Fetch existing shipping & return addresses from the dedicated endpoint
    fetchAddressesReq({
      requestConfig: {
        url: "/accounts/manufacturer/addresses/",
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
        userType: "seller",
      },
      successRes: (res: any) => {
        const data = res.data || {};
        const sa = data.shipping_address || {};
        const ra = data.return_address || {};

        console.log("📦 [/accounts/manufacturer/addresses/] Full response:", res.data);
        console.log("📦 shipping_zone:", data.shipping_zone);
        console.log("📦 shipping_address:", sa);
        console.log("📦 return_address:", ra);
        console.log("📦 same_as_business (shipping):", sa.same_as_business_address);
        console.log("📦 same_as_business (return):", ra.same_as_business_address);

        // shipping_zone comes back as an object { id, name, code } — extract the UUID string
        const rawZone = data.shipping_zone;
        const shippingZoneId =
          rawZone && typeof rawZone === "object"
            ? String(rawZone.id)
            : rawZone || "";

        setFormData((prev) => ({
          ...prev,
          shipping_zone: shippingZoneId || prev.shipping_zone || "",
          shipping_address_line_1: sa.address_line_1 || "",
          shipping_address_line_2: sa.address_line_2 || "",
          shipping_city: sa.city || "",
          shipping_state: sa.state || "",
          shipping_country: sa.country || "",
          shipping_postal_code: sa.postal_code || "",
          return_address_line_1: ra.address_line_1 || "",
          return_address_line_2: ra.address_line_2 || "",
          return_city: ra.city || "",
          return_state: ra.state || "",
          return_country: ra.country || "",
          return_postal_code: ra.postal_code || "",
        }));
        setShippingSameAsBusiness(sa.same_as_business_address ?? false);
        setReturnSameAsBusiness(ra.same_as_business_address ?? false);
      },
    });
  }, [token]);

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const setField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = (key: string, file: File) =>
    setNewFiles((prev) => ({ ...prev, [key]: file }));

  const handleViewImage = (url: string) => {
    if (!url) return;
    if (
      url.toLowerCase().endsWith(".pdf") ||
      url.toLowerCase().includes(".pdf") ||
      url.startsWith("data:application/pdf")
    ) {
      window.open(url, "_blank");
    } else {
      setViewerImage(url);
    }
  };

  const refreshProfile = () => {
    fetchUserDetailsReq({
      requestConfig: {
        url: "/accounts/manufacturer/user-details/",
        method: "GET",
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        if (res?.data) {
          dispatch(sellerActions.updateSellerData(res.data));
        }
      },
    });
  };

  /* ── Submit ───────────────────────────────────────────────────────── */
  const handleUpdateProfile = () => {
    const fd = new FormData();

    if (activeTab === "Shop information") {
      fd.append("fullname", formData.fullname);
      fd.append("company_name", formData.company_name);
      fd.append("is_registered_business", String(businessType === "Registered company"));
      fd.append("business_industry", formData.business_industry);
    } else if (activeTab === "Business information") {
      if (businessType === "Registered company") {
        fd.append("business_registration_number", formData.business_registration_number);
        fd.append("CAC_No", formData.CAC_No);
      } else {
        // fullname is required by the personal-documents endpoint
        fd.append("fullname", formData.fullname);
        formData.ids.forEach((id, idx) => {
          if (id.means_of_id) fd.append(`ids[${idx}][means_of_id]`, id.means_of_id);
          if (id.id_number) fd.append(`ids[${idx}][id_number]`, id.id_number);
          if (id.id_front_image && ((id.id_front_image as any) instanceof File || (id.id_front_image as any) instanceof Blob)) {
            fd.append(`ids[${idx}][id_front_image]`, id.id_front_image);
          }
          if (id.id_back_image && ((id.id_back_image as any) instanceof File || (id.id_back_image as any) instanceof Blob)) {
            fd.append(`ids[${idx}][id_back_image]`, id.id_back_image);
          }
        });
      }
      fd.append("tax_identification_number", formData.tax_identification_number);
      fd.append("vat_number", formData.vat_number);
      fd.append("city", formData.company_city);
      fd.append("company_city", formData.company_city);
      fd.append("state", formData.company_state);
      fd.append("company_state", formData.company_state);
      fd.append("country", formData.company_country);
      fd.append("company_country", formData.company_country);
      fd.append("postal_code", formData.company_postal_code);
      fd.append("company_postal_code", formData.company_postal_code);
      fd.append("address", formData.company_address);
      fd.append("company_address", formData.company_address);
      fd.append("company_address_line_2", formData.company_address_line_2);
      fd.append("business_registration_location", formData.company_country);
      
      Object.entries(newFiles).forEach(([key, file]) => {
        fd.append(key, file);
      });
    }

    const submitMainProfile = () => {
      updateProfileReq({
        requestConfig: {
          url: "/accounts/manufacturer/basic-info/",
          method: "PATCH",
          token: token ?? undefined,
          isAuth: true,
          userType: "seller",
          body: fd,
        },
        successRes: (res: any) => {
          const updatedProfile = res?.data?.profile || res?.data;
          if (updatedProfile) {
            dispatch(sellerActions.updateSellerData({ profile: updatedProfile }));
          }

          // If individual seller and fullname is provided, send to /personal-documents/
          // which splits fullname into first_name and last_name in backend DB
          if (businessType !== "Registered company" && formData.fullname) {
            const personalFd = new FormData();
            personalFd.append("fullname", formData.fullname);

            const userAddress = profile?.address || profile?.company_address || formData.company_address || "";
            if (userAddress) personalFd.append("address", userAddress);

            const userPhone = profile?.phone || "";
            if (userPhone) personalFd.append("phone", userPhone);

            if (profile?.dob) personalFd.append("dob", profile.dob);
            if (profile?.nationality) personalFd.append("nationality", profile.nationality);
            if (profile?.residence_country) personalFd.append("residence_country", profile.residence_country);

            updateDocReq({
              requestConfig: {
                url: "/accounts/manufacturer/personal-documents/",
                method: "PATCH",
                token: token ?? undefined,
                isAuth: true,
                userType: "seller",
                body: personalFd,
              },
              successRes: (personalRes: any) => {
                console.log("📦 [/accounts/manufacturer/personal-documents/] Response:", personalRes);
                const pProf = personalRes?.data?.profile || personalRes?.data;
                if (pProf) {
                  dispatch(sellerActions.updateSellerData({ profile: pProf }));
                }
                refreshProfile();
                setShowWarningModal(false);
                setShowSuccessModal(true);
                setIsEditing(false);
                setNewFiles({});
              },
              errorRes: (err: any) => {
                console.error("❌ [/accounts/manufacturer/personal-documents/] Error:", err);
                refreshProfile();
                setShowWarningModal(false);
                setShowSuccessModal(true);
                setIsEditing(false);
                setNewFiles({});
              },
            });
          } else {
            refreshProfile();
            setShowWarningModal(false);
            setShowSuccessModal(true);
            setIsEditing(false);
            setNewFiles({});
          }
        },
      });
    };

    const submitAddresses = () => {
      const addressBody: Record<string, any> = {
        shipping_zone: formData.shipping_zone || null,
      };

      if (!shippingSameAsBusiness) {
        addressBody.shipping_address = {
          same_as_business_address: false,
          address_line_1: formData.shipping_address_line_1,
          address_line_2: formData.shipping_address_line_2,
          city: formData.shipping_city,
          state: formData.shipping_state,
          country: formData.shipping_country,
          postal_code: formData.shipping_postal_code,
        };
      } else {
        addressBody.shipping_address = { same_as_business_address: true };
      }

      if (!returnSameAsBusiness) {
        addressBody.return_address = {
          same_as_business_address: false,
          address_line_1: formData.return_address_line_1,
          address_line_2: formData.return_address_line_2,
          city: formData.return_city,
          state: formData.return_state,
          country: formData.return_country,
          postal_code: formData.return_postal_code,
        };
      } else {
        addressBody.return_address = { same_as_business_address: true };
      }

      updateAddressesReq({
        requestConfig: {
          url: "/accounts/manufacturer/addresses/",
          method: "PATCH",
          token: token ?? undefined,
          isAuth: true,
          userType: "seller",
          body: addressBody,
        },
        successRes: () => {
          refreshProfile();
          setShowWarningModal(false);
          setShowSuccessModal(true);
          setIsEditing(false);
        },
      });
    };

    if (activeTab === "Business information") {
      const docUrl =
        businessType === "Registered company"
          ? "/accounts/manufacturer/business-documents/"
          : "/accounts/manufacturer/personal-documents/";

      updateDocReq({
        requestConfig: {
          url: docUrl,
          method: "PATCH",
          token: token ?? undefined,
          isAuth: true,
          userType: "seller",
          body: fd,
        },
        successRes: (res: any) => {
          const pProf = res?.data?.profile || res?.data;
          if (pProf) {
            dispatch(sellerActions.updateSellerData({ profile: pProf }));
          }
          refreshProfile();
          setShowWarningModal(false);
          setShowSuccessModal(true);
          setIsEditing(false);
          setNewFiles({});
        },
      });
    } else if (activeTab === "Shipping information") {
      submitAddresses();
    } else {
      submitMainProfile();
    }
  };

  const handleSaveClick = () => {
    if (isEditing) {
      // Run validation before showing the confirm modal
      if (activeTab === "Business information") {
        const validationErrors = validateBusinessInfoFields(formData, businessType);
        if (validationErrors.length > 0) {
          setErrorMessage(validationErrors.join("\n"));
          setShowErrorModal(true);
          return;
        }
      }
      setShowWarningModal(true);
    } else {
      setIsEditing(true);
    }
  };

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div id="Documents">
      {/* Modals */}
      <ResultModal
        isOpen={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
        onConfirm={handleUpdateProfile}
        result="warning"
        title="Warning"
        message="Your account will not be live until changes are approved. This process may take up to 48 hours."
        buttenText="Save"
        loading={updatingProfile || docLoading || updatingAddresses}
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

      {/* Image Viewer Lightbox */}
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

      <h2 className="text-c18 font-MontserratMedium text-000000 mb-6 lg:block hidden">
        Business details
      </h2>

      {/* Tab bar */}
      <div className="flex border-b border-[#f0f0f0] mb-8 overflow-x-auto hcustom-scroll">
        {TABS.map((tab) => (
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

      {/* Tab content */}
      {activeTab === "Shop information" && (
        <ShopInfoTab
          isEditing={isEditing}
          businessType={businessType}
          fullName={profile?.fullname || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || ""}
          formData={{ company_name: formData.company_name, business_industry: formData.business_industry, fullname: formData.fullname }}
          industries={industries}
          fetchingIndustries={fetchingIndustries}
          onChange={setField}
        />
      )}

      {activeTab === "Business information" && (
        <BusinessInfoTab
          isEditing={isEditing}
          businessType={businessType}
          formData={formData}
          profile={profile}
          newFiles={newFiles}
          onFieldChange={setField}
          onIdChange={(ids) => setFormData((prev) => ({ ...prev, ids }))}
          onFileSelect={handleFileSelect}
          onViewImage={handleViewImage}
        />
      )}

      {activeTab === "Shipping information" && (
        <ShippingInfoTab
          isEditing={isEditing}
          formData={formData}
          shippingZones={shippingZones}
          shippingSameAsBusiness={shippingSameAsBusiness}
          returnSameAsBusiness={returnSameAsBusiness}
          onShippingSameToggle={() => setShippingSameAsBusiness((p) => !p)}
          onReturnSameToggle={() => setReturnSameAsBusiness((p) => !p)}
          onFieldChange={setField}
        />
      )}

      {/* Save / Update button */}
      <div className="mt-16 flex justify-end">
        <button
          onClick={handleSaveClick}
          className="px-12 h-10 bg-[#ff6b6b] text-white rounded-lg text-[13px] font-MontserratMedium hover:bg-[#e55a5a] transition-all shadow-sm"
        >
          {isEditing ? "Save changes" : "Update"}
        </button>
      </div>
    </div>
  );
}
