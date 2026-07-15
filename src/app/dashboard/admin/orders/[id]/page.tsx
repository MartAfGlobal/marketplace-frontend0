"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button/Button";
import OrderProgressBar from "@/components/ui/Modals/admin/OrderProgressBar";
import OrderDetailsTable from "@/components/ui/Modals/admin/orderDetailsTable";
import OrderDetailsSummary from "@/components/ui/Modals/admin/OrderdetailsSummary";
import UpdateOrderStatusModal from "@/components/ui/Modals/admin/UpdateOrderStatusModal";

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = (params.id as string) || "ORD-235235";

  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

  const handleUpdateTracking = () => {
    setUpdateStatusOpen(true);
  };

  const handleConfirmStatusUpdate = async (newStatus: string) => {
    setUpdateStatusLoading(true);
    try {
      // TODO: wire to your real API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Order status updated to "${newStatus}" successfully.`);
      setUpdateStatusOpen(false);
    } catch {
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const handleCancelOrder = () => {
    toast.error("Order has been cancelled.");
  };

  const handleDownload = () => {
    toast.info("Downloading order details...");
  };

  return (
    <div className="mb-12 box-border w-full animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div className="bg-white min-h-36 h-auto p-6 mb-6  rounded-2xl animate-in fade-in duration-300 ">
        <div className="text-xs text-000000/44 font-MontserratMedium mb-8 flex items-center gap-1">
          <span>Orders</span>
          <ChevronRight className="w-4 h-4 text-000000/44 stroke-[2]" />
          <span className="font-MontserratNormal leading-[2%]">{orderId}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center py-1.5 justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 transition-colors hover:opacity-80 group text-left"
          >
            <ChevronLeft className="w-6 h-6 text-black stroke-[2.5]" />
            <h1 className="text-c20 font-MontserratMedium ">{orderId}</h1>
          </button>

          <div className="flex items-center gap-4 w-full max-w-106.5 flex-wrap sm:flex-nowrap justify-start sm:justify-end">
            <Button onClick={handleUpdateTracking} className=" text-nowrap">Update tracking status</Button>
            <button
              onClick={handleCancelOrder}
              className="border w-full max-w-35 border-ca0202 text-ca0202 hover:bg-ca0202/5 px-5 py-2.5 rounded-lg text-sm font-MontserratSemiBold transition-colors"
            >
              Cancel order
            </button>
            <button
              onClick={handleDownload}
              className="w-10 h-10 border border-ff715b rounded-c8 flex-shrink-0 flex items-center justify-center  transition-colors"
            >
              <Download className="w-4 h-4 text-[#ff715b]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid split into Details (Left) and Order Details Column (Right) */}
      <div className="flex flex-col lg:flex-row gap-6 w-full  ">
        {/* Left Column (8/12 width) */}
        <div className="flex-1 min-w-0 max-w-182 admincustom-scroll h-162.5 overflow-y-auto ">
          <div className="w-full   pr-2 ">
            {/* Buyer & Seller Details Row */}
            <div className="flex gap-4 ">
              {/* Buyer Details */}
              <div className="space-y-6 flex-1 min-w-0 min-h-73.5 p-6  bg-ffffff rounded-c16 ">
                <h3 className="text-sm font-MontserratNormal tracking-[1%] text-000000/68 leading-[18px] mb-6 ">
                  Buyer's details
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
                      alt="Buyer Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center w-full justify-between">
                    <span className="text-base font-MontserratNormal leading-[24px] text-ff715b">
                      Kelvin Emeka
                    </span>
                    <a
                      href="mailto:demisolaankara@gmail.com"
                      className="text-[#FF6D5B] hover:opacity-80"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="space-y-4 ">
                  <div className="flex-col flex">
                    <span className=" text-xs  mb-1 font-MontserratNormal leading-[16px] tracking-[2%] text-000000/44">
                      Address
                    </span>
                    <span className="text-xs font-MontserratNormal leading-[16px] tracking-[2%] text-000000/68">
                      12 demisoa street, Enugu, Nigeria
                    </span>
                  </div>
                  <div className="flex-col flex">
                    <span className=" text-xs  mb-1 font-MontserratNormal leading-[16px] tracking-[2%] text-000000/44">
                      Phone number
                    </span>
                    <span className="text-xs font-MontserratNormal leading-[16px] tracking-[2%] text-000000/68">
                      +234965857434
                    </span>
                  </div>
                  <div className="flex-col flex">
                    <span className="block text-xs  mb-1 font-MontserratNormal leading-[16px] tracking-[2%] text-000000/44">
                      Email address
                    </span>
                    <span className="text-xs font-MontserratNormal leading-[16px] tracking-[2%] text-000000/68">
                      demisolaankara@gmail.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Details */}
              <div className="space-y-6 flex-1 min-w-0 min-h-73.5 p-6 bg-ffffff rounded-c16">
                <h3 className=" block text-sm font-MontserratNormal tracking-[1%] text-000000/68 leading-[18px] ">
                  Seller's details
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=80"
                      alt="Seller Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base font-MontserratNormal leading-[24px] text-ff715b">
                      Ankara Co.
                    </span>
                    <a
                      href="mailto:demisolaankara@gmail.com"
                      className="text-[#FF6D5B] hover:opacity-80"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="space-y-4 ">
                  <div className="flex-col flex">
                    <span className="block text-xs  mb-1 font-MontserratNormal leading-[16px] tracking-[2%] text-000000/44">
                      Address
                    </span>
                    <span className="text-xs font-MontserratNormal leading-[16px] tracking-[2%] text-000000/68">
                      12 demisoa street, Enugu, Nigeria
                    </span>
                  </div>
                  <div className="flex-col flex">
                    <span className="text-xs  mb-1 font-MontserratNormal leading-[16px] tracking-[2%] text-000000/44">
                      Phone number
                    </span>
                    <span className="text-xs font-MontserratNormal leading-[16px] tracking-[2%] text-000000/68">
                      +234965857434
                    </span>
                  </div>
                  <div className="flex-col flex">
                    <span className="block text-xs  mb-1 font-MontserratNormal leading-[16px] tracking-[2%] text-000000/44">
                      Email address
                    </span>
                    <span className="text-xs font-MontserratNormal leading-[16px] tracking-[2%] text-000000/68">
                      demisolaankara@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Progress Stepper */}
            <OrderProgressBar />

            {/* Order Items Section */}
            <OrderDetailsTable />
          </div>
        </div>

        {/* Right Column (4/12 width) - Details and Summary */}
        <div className="w-full lg:w-84.5 h-auto lg:h-162.5 flex-shrink-0">
          <OrderDetailsSummary />
        </div>
      </div>

      {/* Update Order Status Modal */}
      <UpdateOrderStatusModal
        isOpen={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
        loading={updateStatusLoading}
      />
    </div>
  );
}
