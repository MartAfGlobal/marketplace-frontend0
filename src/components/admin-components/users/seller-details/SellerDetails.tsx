import React, { useState } from "react";
import Image from "next/image";
import Phonicon from "@/assets/admin/phone.svg";
import { Mail, User } from "lucide-react";
import BusinessInformationTab from "./BusinessInformationTab";
import OrderHistoryTab from "./OrderHistoryTab";
import PayoutHistoryTab from "./PayoutHistoryTab";
import ProductsTab from "./ProductsTab";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface SellerDetailsProps {
  userId: string;
}

type TabType = "business" | "order" | "payout" | "products";

export default function SellerDetails({ userId }: SellerDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("business");
  const seller = useSelector(
    (state: RootState) => state.adminSellerById?.adminSellerById,
  );

  const phone = seller?.phone || seller?.phone2 || (seller as any)?.phone_number;
  const email = seller?.company_email || seller?.user_email || (seller as any)?.email;

  const renderKycStatus = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className=" items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 px-6 py-2 rounded-c4 w-25.25 h-8 inline-block">
            Verified
          </span>
        );
      case "PENDING":
        return (
          <span className=" items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12  px-6 py-2 rounded-c4 w-25.25 h-8 inline-block">
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className=" items-center gap-1 text-[#CA0202] bg-[#CA0202]/12  px-6 py-2 rounded-c4 w-25.25 h-8 inline-block">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-8 justify-center rounded-c16 items-start bg-ffffff pr-6 min-h-[598px]">
      {/* Left Sidebar: Profile Summary & Tabs */}
      <div className="bg-000000/1 justify-between pl-6 py-6 text-center flex flex-col items-center min-h-[598px] h-full w-full max-w-61 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="w-full flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-49 h-49 overflow-hidden mb-4 rounded-full">
            {seller?.company_logo ? (
              <Image
                src={seller.company_logo}
                alt="avatar"
                width={244}
                height={244}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-[#f0f2f5] flex items-center justify-center">
                <User className="w-24 h-24 text-[#b0b8c1]" strokeWidth={1.2} />
              </div>
            )}
          </div>

          <div className="w-full flex flex-col items-center">
            {/* Profile Info */}
            <h2 className="text-c18 font-MontserratSemiBold mb-1">
              {seller?.company_name || "—"}
            </h2>
            <span className="text-sm font-MontserratNormal w-full truncate px-3 text-000000/44 mb-3">
              {seller?.user_id}
            </span>
            <span className="text-[12px] text-center font-MontserratMedium mb-3">
              {renderKycStatus(seller?.kyc_status)}
            </span>

            {/* Contact Details */}
            {(phone || email) && (
              <div className="w-full space-y-2.5 my-2">
                {phone && (
                  <div className="flex items-center gap-2 w-full justify-center text-c12 font-MontserratNormal text-000000/68">
                    <Image
                      src={Phonicon}
                      alt="Phone"
                      width={11.5}
                      height={17.5}
                      className="w-4 h-4 shrink-0"
                    />
                    <span className="truncate">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center justify-center w-full gap-2 text-c12 font-MontserratNormal text-000000/68">
                    <Mail className="w-4 h-4 text-[#343330] shrink-0" />
                    <span className="truncate max-w-[180px]" title={email}>
                      {email}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Vertical Tabs */}
        <div className="w-full flex flex-col gap-2.5 mt-4">
          <button
            onClick={() => setActiveTab("business")}
            className={`w-full py-3 px-4 h-12 text-center text-c12 transition-colors ${
              activeTab === "business"
                ? "text-ff715b  font-MontserratSemiBold"
                : "text-000000/68  font-MontserratMedium"
            }`}
          >
            Business information
          </button>
          <button
            onClick={() => setActiveTab("order")}
            className={`w-full py-3 px-4 text-center  h-12 text-c12  transition-colors ${
              activeTab === "order"
                ? "text-ff715b  font-MontserratSemiBold"
                : "text-000000/68 font-MontserratMedium "
            }`}
          >
            Order history
          </button>
          <button
            onClick={() => setActiveTab("payout")}
            className={`w-full py-3 px-4 text-center  h-12 text-c12 transition-colors ${
              activeTab === "payout"
                ? "text-ff715b  font-MontserratSemiBold"
                : "text-000000/68 font-MontserratMedium "
            }`}
          >
            Payout history
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full py-3 px-4 text-center  h-12 text-c12  transition-colors ${
              activeTab === "products"
                ? "text-ff715b  font-MontserratSemiBold"
                : "text-000000/68 font-MontserratMedium "
            }`}
          >
            Products
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="bg-ffffff py-6 relative w-full flex-1 h-full animate-in fade-in duration-500 delay-100">
        {activeTab === "business" && <BusinessInformationTab />}
        {activeTab === "order" && <OrderHistoryTab />}
        {activeTab === "payout" && <PayoutHistoryTab />}
        {activeTab === "products" && <ProductsTab />}
      </div>
    </div>
  );
}
