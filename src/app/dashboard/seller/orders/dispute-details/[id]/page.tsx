"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import navBack from "@/assets/icons/navBacksmall.png";
import CopyIcon from "@/assets/icons/Copy.png";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import { toast } from "sonner";

export default function DisputeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { sendHttpRequest, loading } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const [dispute, setDispute] = useState<any>(null);

  useEffect(() => {
    if (!id || !token) return;

    sendHttpRequest({
      requestConfig: {
        url: `disputes/seller/${id}/`,
        method: "GET",
        token: token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        console.log("Dispute details fetched:", res.data);
        setDispute(res.data);
      },
      errorRes: (err) => {
        console.error("Failed to fetch dispute details:", err);
      },
    });
  }, [id, token, sendHttpRequest]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading && !dispute) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="p-8 text-center h-screen bg-white flex flex-col justify-center items-center">
        <p className="text-xl font-MontserratSemiBold text-ff715b">Dispute Not Found</p>
        <button onClick={() => router.back()} className="text-ff715b underline mt-4 font-MontserratMedium">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-c16 mx-auto p-4 md:p-8 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <button onClick={() => router.back()} className="flex items-center gap-4 group">
          <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-gray-50 transition-colors">
            <Image src={navBack} width={9} height={16.5} alt="Back" />
          </div>
          <h1 className="text-xl font-MontserratSemiBold text-000000">Dispute details</h1>
        </button>
        <button className="p-2.5 border border-ff715b/20 rounded-lg hover:bg-ff715b/5 transition-colors">
          <Image src={downloadIcon} alt="download" width={20} height={20} />
        </button>
      </div>

      {/* Info Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-MontserratSemiBold">Order ID: {dispute.order_number || dispute.order_id || id}</span>
            <button 
              onClick={() => handleCopy(dispute.order_number || dispute.order_id || id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Image src={CopyIcon} width={16} height={16} alt="Copy" />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-MontserratMedium">
              Order date: {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"}
            </p>
            <p className="text-sm text-gray-500 font-MontserratMedium">
              Delivery date: {dispute.resolved_at ? new Date(dispute.resolved_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"}
            </p>
            <p className="text-base font-MontserratSemiBold pt-1">
              Order amount: <span className="font-MontserratBold text-000000">₦{dispute.requested_refund_amount?.toLocaleString() || "0.00"}</span>
            </p>
          </div>
          <div className="pt-2">
            <span className="px-6 py-2 bg-[#0070E9]/10 text-[#0070E9] rounded-full text-xs font-MontserratSemiBold">
              {dispute.status_display || dispute.status || "Open"}
            </span>
          </div>
        </div>

        <button className="w-full lg:w-56 py-3.5 bg-[#FF715B] text-white rounded-xl font-MontserratSemiBold text-base hover:bg-[#FF715B]/90 transition-all shadow-lg shadow-ff715b/20">
          Escalate
        </button>
      </div>

      {/* Dispute Information */}
      <div className="space-y-6 pt-10 border-t border-gray-50">
        <h2 className="text-lg font-MontserratSemiBold text-000000">Dispute information</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-700 font-MontserratMedium leading-relaxed">
            <span className="text-gray-900 font-MontserratSemiBold">Buyer&apos;s Claim:</span> {dispute.cancellation_reason_title || dispute.reason || "N/A"}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-900 font-MontserratSemiBold">Evidence provided:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(dispute.evidence_images || dispute.evidence || []).map((img: any, idx: number) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <Image
                  src={img.file_url || img.image || (typeof img === 'string' ? img : "/placeholder.png")}
                  alt={`Evidence ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
            {!(dispute.evidence_images || dispute.evidence || [])?.length && (
              <p className="text-sm text-gray-400 font-MontserratMedium italic col-span-full">No evidence images provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
