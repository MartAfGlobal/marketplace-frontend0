import React, { useState } from 'react';
import Image from "next/image";
import CustomerImage from "@/assets/admin/customerImage.svg";
import BusinessInformationTab from './BusinessInformationTab';
import OrderHistoryTab from './OrderHistoryTab';
import PayoutHistoryTab from './PayoutHistoryTab';
import ProductsTab from './ProductsTab';

interface SellerDetailsProps {
  userId: string;
}

type TabType = 'business' | 'order' | 'payout' | 'products';

export default function SellerDetails({ userId }: SellerDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('business');

  return (
    <div className="flex gap-8 justify-center rounded-c16 items-start bg-ffffff pr-6  h-[598px]">
      {/* Left Sidebar: Profile Summary & Tabs */}
      <div className="bg-000000/1 justify-between pl-6  py-6 text-center flex flex-col  items-center h-full w-full max-w-61 animate-in fade-in slide-in-from-left-4 duration-500 ">
        <div className="w-full flex flex-col items-center ">
          {/* Profile Image */}
          <div className="w-49 h-49 overflow-hidden mb-4 rounded-full ">
            <Image
              src={CustomerImage}
              alt="avatar"
              width={244}
              height={244}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="w-full flex flex-col items-center">
            {/* Profile Info */}
            <h2 className="text-c18 font-MontserratSemiBold mb-1">Obioma Gertrude</h2>
            <span className="text-sm font-MontserratNormal text-000000/44 mb-3">SEL-135273</span>
            <span className="text-[12px] text-center font-MontserratMedium text-[#FFAC06] bg-[#FFAC06]/12 px-6 py-2 rounded-c4 w-25.25 h-8 inline-block">
              Pending
            </span>
          </div>
        </div>

        {/* Vertical Tabs */}
        <div className="w-full flex flex-col gap-2.5 mt-4">
          <button
            onClick={() => setActiveTab('business')}
            className={`w-full py-3 px-4 h-12 text-center text-c12 transition-colors ${
              activeTab === 'business'
                ? 'text-ff715b  font-MontserratSemiBold'
                : 'text-000000/68  font-MontserratMedium'
            }`}
          >
            Business information
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`w-full py-3 px-4 text-center  h-12 text-c12  transition-colors ${
              activeTab === 'order'
                ? 'text-ff715b  font-MontserratSemiBold'
                : 'text-000000/68 font-MontserratMedium '
            }`}
          >
            Order history
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`w-full py-3 px-4 text-center  h-12 text-c12 transition-colors ${
              activeTab === 'payout'
                ? 'text-ff715b  font-MontserratSemiBold'
                : 'text-000000/68 font-MontserratMedium '
            }`}
          >
            Payout history
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full py-3 px-4 text-center  h-12 text-c12  transition-colors ${
              activeTab === 'products'
                ? 'text-ff715b  font-MontserratSemiBold'
                : 'text-000000/68 font-MontserratMedium '
            }`}
          >
            Products
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="bg-ffffff py-6   relative w-full flex-1 h-full  animate-in fade-in duration-500 delay-100 ">
        {activeTab === 'business' && <BusinessInformationTab />}
        {activeTab === 'order' && <OrderHistoryTab />}
        {activeTab === 'payout' && <PayoutHistoryTab />}
        {activeTab === 'products' && <ProductsTab />}
      </div>
    </div>
  );
}
