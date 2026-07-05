"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ShopInformation from "@/components/admin-components/verifications/tabs/ShopInformation";
import BusinessInformation from "@/components/admin-components/verifications/tabs/BusinessInformation";
import ShippingInformation from "@/components/admin-components/verifications/tabs/ShippingInformation";
import RejectVerificationModal from "@/components/ui/Modals/admin/RejectVerificationModal";
import { Button } from "@/components/ui/Button/Button";

type TabType = "shop" | "business" | "shipping";

export default function VerificationDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("shop");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Hardcoded for mock, could be fetched from API based on params.id
  const storeName = "Shakara ankara";

  const handleNext = () => {
    if (activeTab === "shop") setActiveTab("business");
    else if (activeTab === "business") setActiveTab("shipping");
  };

  const handlePrev = () => {
    if (activeTab === "business") setActiveTab("shop");
    else if (activeTab === "shipping") setActiveTab("business");
  };

  const handleRejectConfirm = (reason: string) => {
    console.log("Rejected with reason:", reason);
    setIsRejectModalOpen(false);
    router.push("/dashboard/admin/verifications");
  };

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
        {/* Tabs Header */}
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

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "shop" && <ShopInformation />}
          {activeTab === "business" && <BusinessInformation />}
          {activeTab === "shipping" && <ShippingInformation />}
        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-4 mt-12">
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
              <Button className="bg-transparent border border-[#FFAC06] text-[#F5A623] hover:bg-yellow-50 px-6 h-11 max-w-[287px] text-xs">
                Request More Information
              </Button>
              <Button onClick={() => setIsRejectModalOpen(true)} className="bg-transparent border border-[#CA0202] text-[#CA0202] max-w-[142px] hover:bg-red-50 px-8 h-11 text-xs">
                Reject
              </Button>
              <Button onClick={() => {
                console.log("Approved");
                router.push("/dashboard/admin/verifications");
              }} className="bg-transparent border border-[#2D7565] text-[#2D7565] hover:bg-green-50 px-8 max-w-[157px] h-11 text-xs">
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      <RejectVerificationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
