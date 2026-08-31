"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ShopInformation from "@/components/admin-components/verifications/tabs/ShopInformation";
import BusinessInformation from "@/components/admin-components/verifications/tabs/BusinessInformation";
import ShippingInformation from "@/components/admin-components/verifications/tabs/ShippingInformation";
import RejectVerificationModal from "@/components/ui/Modals/admin/RejectVerificationModal";
import { Button } from "@/components/ui/Button/Button";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ResultModal from "@/components/ui/forms/resultModal";
import { toast } from "sonner";

type TabType = "shop" | "business" | "shipping";

export default function VerificationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("shop");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [successModalType, setSuccessModalType] = useState<
    "approve" | "reject" | "error" | null
  >(null);
  const [showAllInfo, setShowAllInfo] = useState(false);

  const token = useSelector((state: RootState) => state.token?.token);
  const seller = useSelector((state: RootState) => state.adminSellerById?.adminSellerById);
  const { fetchAdminSellerById, verifyAdminSeller, rejectAdminSeller, loading } = AdminDetails();

  useEffect(() => {
    if (token && id) {
      console.log(`Fetching KYC details for manufacturer ID: ${id}`);
      fetchAdminSellerById(id, (data) => {
        console.log("KYC details from /accounts/admin/manufacturers/id/: ", data);
      });
    }
  }, [token, id]);

  const storeName = seller?.company_name || "Loading...";

  const handleNext = () => {
    if (activeTab === "shop") setActiveTab("business");
    else if (activeTab === "business") setActiveTab("shipping");
  };

  const handlePrev = () => {
    if (activeTab === "business") setActiveTab("shop");
    else if (activeTab === "shipping") setActiveTab("business");
  };

  const handleRejectConfirm = (reason: string) => {
    if (!reason) {
      toast.error("Please select a reason for rejection");
      return;
    }
    rejectAdminSeller(
      id,
      { reason },
      () => {
        setIsRejectModalOpen(false);
        setSuccessModalType("reject");
        if (token && id) {
          fetchAdminSellerById(id);
        }
      },
      (err) => {
        setIsRejectModalOpen(false);
        setSuccessModalType("error");
        toast.error(err?.response?.data?.message || "Failed to reject verification");
      }
    );
  };

  const handleApproveConfirm = () => {
    verifyAdminSeller(
      id,
      () => {
        setShowApproveWarning(false);
        setSuccessModalType("approve");
        if (token && id) {
          fetchAdminSellerById(id);
        }
      },
      (err) => {
        setShowApproveWarning(false);
        setSuccessModalType("error");
        toast.error(err?.response?.data?.message || "Failed to approve verification");
      }
    );
  };

  const STEP_LABELS: Record<string, string> = {
    CAC_No: "CAC Registration Number",
    CAC_No_file: "CAC Document (CAC02 & CAC07)",
    certificate_of_registration: "Certificate of Registration",
    cac_02_07_file: "CAC Document (CAC02 & CAC07)",
    business_registration_location: "Business Registration Location",
    business_registration_number: "Business Registration Number",
    company_address: "Company Address",
    company_city: "Company City",
    company_country: "Company Country",
    company_name: "Company Name",
    company_state: "Company State",
    company_postal_code: "Company Postal Code",
    phone_verified: "Phone Verification",
    tax_identification_file: "TIN Document",
    tax_identification_number: "Tax Identification Number (TIN)",
    vat_number: "VAT Number",
    shipping_address: "Shipping Address",
    return_address: "Return Address",
    bank_details: "Bank Details",
    nin_file: "NIN Document",
    nin_number: "NIN Number",
    bvn: "BVN",
    id_document: "Identification Document",
  };

  const getMissingVerificationSteps = (sellerData: any): string[] => {
    if (!sellerData) return [];
    const steps =
      sellerData?.verification_progress?.steps ||
      sellerData?.steps ||
      {};

    const missing: string[] = [];
    for (const [key, value] of Object.entries(steps)) {
      if (value === false) {
        const label =
          STEP_LABELS[key] ||
          key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        missing.push(label);
      }
    }
    return missing;
  };

  const missingSteps = getMissingVerificationSteps(seller);

  const isApproveDisabled =
    !seller ||
    seller?.kyc_status === "VERIFIED" ||
    seller?.kyc_status === "REJECTED" ||
    !seller?.is_fully_verified;

  return (
    <div className="flex flex-col gap-8 w-full p-6 max-w-5xl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-MontserratMedium">
        <button 
          onClick={() => router.push("/dashboard/admin/verifications")}
          className="text-000000/44  transition-colors"
        >
          Verifications
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-000000/44" />
        <span className="">{storeName}</span>
      </div>

      <h1 className="text-c24 font-MontserratMedium text-[#000000]">{storeName}</h1>

      <div className="bg-white rounded-c16 p-6 flex flex-col min-h-[621px]">
        {/* Incomplete Verification / Missing Documents Banner */}
        {seller && !seller.is_fully_verified && missingSteps.length > 0 && (
          <div className="mb-6 p-4 rounded-c8 border border-ff715b text-xs font-MontserratMedium flex flex-col gap-1">
            <div className="font-MontserratSemiBold text-1a1a1a flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-1a1a1a inline-block" />
              Approval Disabled — Incomplete Verification Details ({seller?.is_registered_business ? "Registered Business" : "Individual Seller"})
            </div>
            <p className="text-ff715b/90">
              The Approve button is disabled because the following required document(s) / field(s) are incomplete:{" "}
              <span className="font-MontserratMedium text-000000/64">{missingSteps.join(", ")}</span>.
            </p>
          </div>
        )}

        {/* Tabs Header */}
        {!showAllInfo && (
          <div className="flex flex-col gap-6 mb-8">
            <h2 className="text-base font-MontserratSemiBold text-[#000000]">Business details</h2>
            <div className="flex border-b border-[#eef0f3]">
              <button
                onClick={() => setActiveTab("shop")}
                className={`px-4 py-3 text-xs font-MontserratMedium transition-colors relative ${
                  activeTab === "shop" ? "text-[#ff715b] font-MontserratSemiBold border border-ff715b" : "text-000000/68 hover:text-gray-700 border-b border-b-ff715b/36"
                }`}
              >
                Shop information
                {/* {activeTab === "shop" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.25 bg-[#ff715b] " />
                )} */}
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-4 py-3 text-xs font-MontserratMedium transition-colors relative ${
                  activeTab === "business" ? "text-[#ff715b] font-MontserratSemiBold border border-ff715b" : "text-00000/68 hover:text-gray-700 border-b border-b-ff715b/36"
                }`}
              >
                Business information
                {/* {activeTab === "business" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.25 bg-[#ff715b]" />
                )} */}
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`px-4 py-3 text-xs font-MontserratMedium transition-colors relative ${
                  activeTab === "shipping" ? "text-[#ff715b] font-MontserratSemiBold border border-ff715b " : "text-00000/68 hover:text-gray-700 border-b border-b-ff715b/36"
                }`}
              >
                Shipping information
                {/* {activeTab === "shipping" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.25 bg-[#ff715b]" />
                )} */}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1">
          {showAllInfo ? (
            <div className="flex flex-col gap-12">
              <div>
                <ShopInformation seller={seller} />
              </div>
              <hr className="border-[#eef0f3]" />
              <div>
                <BusinessInformation seller={seller} />
              </div>
              <hr className="border-[#eef0f3]" />
              <div>
                <ShippingInformation seller={seller} />
              </div>
            </div>
          ) : (
            <>
              {activeTab === "shop" && <ShopInformation seller={seller} />}
              {activeTab === "business" && <BusinessInformation seller={seller} />}
              {activeTab === "shipping" && <ShippingInformation seller={seller} />}
            </>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-4 mt-12">
          {showAllInfo ? (
            <div className="flex gap-4 w-full justify-end">
              <Button 
                onClick={() => setShowAllInfo(false)} 
                className="bg-transparent border border-[#FFAC06] text-[#F5A623] hover:bg-yellow-50 px-6 h-11 max-w-[287px] text-xs"
              >
                View Less
              </Button>
              <Button 
                onClick={() => setIsRejectModalOpen(true)} 
                disabled={seller?.kyc_status === "VERIFIED" || seller?.kyc_status === "REJECTED"}
                className={`max-w-[142px] px-8 h-11 text-xs transition-all ${
                  seller?.kyc_status === "REJECTED" 
                    ? "bg-[#CA0202]/12 border border-[#CA0202] text-[#CA0202] cursor-not-allowed opacity-60" 
                    : "bg-transparent border border-[#CA0202] text-[#CA0202] hover:bg-red-50"
                }`}
              >
                {seller?.kyc_status === "REJECTED" ? "Rejected" : "Reject"}
              </Button>
              <Button 
                onClick={() => setShowApproveWarning(true)} 
                disabled={isApproveDisabled}
                title={
                  !seller?.is_fully_verified
                    ? missingSteps.length > 0
                      ? `Cannot approve: incomplete ${missingSteps.join(", ")}`
                      : "Cannot approve: Seller KYC is not fully verified"
                    : seller?.kyc_status === "VERIFIED"
                    ? "Already Approved"
                    : seller?.kyc_status === "REJECTED"
                    ? "Already Rejected"
                    : undefined
                }
                className={`px-8 max-w-[157px] h-11 text-xs transition-all ${
                  seller?.kyc_status === "VERIFIED" 
                    ? "bg-[#2D7565]/12 border border-[#2D7565] text-[#2D7565] cursor-not-allowed opacity-60" 
                    : isApproveDisabled
                    ? "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed opacity-60 hover:bg-gray-100"
                    : "bg-transparent border border-[#2D7565] text-[#2D7565] hover:bg-green-50"
                }`}
              >
                {seller?.kyc_status === "VERIFIED" ? "Approved" : "Approve"}
              </Button>
            </div>
          ) : (
            <>
              {activeTab === "shop" && (
                <Button onClick={handleNext} className="bg-[#ff715b] hover:bg-[#e56550] text-white w-32 h-11">
                  Next
                </Button>
              )}

              {activeTab === "business" && (
                <>
                  <Button onClick={handlePrev} className="bg-transparent border border-[#ff715b] text-[#ff715b] hover:bg-red-50 w-32 h-11">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="bg-[#ff715b] hover:bg-[#e56550] text-white w-32 h-11">
                    Next
                  </Button>
                </>
              )}

              {activeTab === "shipping" && (
                <div className="flex gap-4 w-full justify-end">
                  <Button 
                    onClick={() => setShowAllInfo(true)} 
                    className="bg-transparent border border-[#FFAC06] text-[#F5A623] hover:bg-yellow-50 px-6 h-11 max-w-[287px] text-xs"
                  >
                    Request More Information
                  </Button>
                  <Button 
                    onClick={() => setIsRejectModalOpen(true)} 
                    disabled={seller?.kyc_status === "VERIFIED" || seller?.kyc_status === "REJECTED"}
                    className={`max-w-[142px] px-8 h-11 text-xs transition-all ${
                      seller?.kyc_status === "REJECTED" 
                        ? "bg-[#CA0202]/12 border border-[#CA0202] text-[#CA0202] cursor-not-allowed opacity-60" 
                        : "bg-transparent border border-[#CA0202] text-[#CA0202] hover:bg-red-50"
                    }`}
                  >
                    {seller?.kyc_status === "REJECTED" ? "Rejected" : "Reject"}
                  </Button>
                  <Button 
                    onClick={() => setShowApproveWarning(true)} 
                    disabled={isApproveDisabled}
                    title={
                      !seller?.is_fully_verified
                        ? missingSteps.length > 0
                          ? `Cannot approve: incomplete ${missingSteps.join(", ")}`
                          : "Cannot approve: Seller KYC is not fully verified"
                        : seller?.kyc_status === "VERIFIED"
                        ? "Already Approved"
                        : seller?.kyc_status === "REJECTED"
                        ? "Already Rejected"
                        : undefined
                    }
                    className={`px-8 max-w-[157px] h-11 text-xs transition-all ${
                      seller?.kyc_status === "VERIFIED" 
                        ? "bg-[#2D7565]/12 border border-[#2D7565] text-[#2D7565] cursor-not-allowed opacity-60" 
                        : isApproveDisabled
                        ? "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed opacity-60 hover:bg-gray-100"
                        : "bg-transparent border border-[#2D7565] text-[#2D7565] hover:bg-green-50"
                    }`}
                  >
                    {seller?.kyc_status === "VERIFIED" ? "Approved" : "Approve"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <RejectVerificationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        loading={loading}
      />

      {/* Warning Modal */}
      <ResultModal
        isOpen={showApproveWarning}
        result="warning"
        title="Approve Verification"
        message="Are you sure you want to approve this manufacturer's KYC verification?"
        onCancel={() => setShowApproveWarning(false)}
        onConfirm={handleApproveConfirm}
        loading={loading}
        buttenText="Approve"
      />

      {/* Success/Error Modal */}
      <ResultModal
        isOpen={successModalType !== null}
        onConfirm={() => {
          setSuccessModalType(null);
          router.push("/dashboard/admin/verifications");
        }}
        onCancel={() => setSuccessModalType(null)}
        result={successModalType === "error" ? "error" : "success"}
        title={
          successModalType === "error"
            ? "Action Failed"
            : successModalType === "approve"
            ? "Verification Approved"
            : "Verification Rejected"
        }
        message={
          successModalType === "error"
            ? "There was an error processing your request. Please try again."
            : successModalType === "approve"
            ? "The manufacturer's KYC verification has been successfully approved."
            : "The manufacturer's KYC verification has been rejected."
        }
        discRescription={
          successModalType === "error"
            ? "Please check your network and connection, then try again."
            : successModalType === "approve"
            ? "The manufacturer will be notified of their approved status."
            : "The manufacturer will be notified of the reason for rejection and can resubmit."
        }
        buttenText="Ok"
      />
    </div>
  );
}
