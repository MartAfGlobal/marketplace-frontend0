"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import EscalateDisputeModal from "@/components/ui/Modals/EscalateDisputeModal";
import { Button } from "@/components/ui/Button/Button";
import { DisputeHeader } from "./components/DisputeHeader";
import { DisputeInfo } from "./components/DisputeInfo";
import { DisputeEvidence } from "./components/DisputeEvidence";

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "text-[#0070E9] bg-[#0070E9]/10";
    case "resolved":
      return "text-[#2D7565] bg-[#2D7565]/10";
    case "escalated":
      return "text-[#CA0202] bg-[#CA0202]/10";
    case "pending":
    case "requested":
      return "text-[#FFAC06] bg-[#FFAC06]/10";
    default:
      return "text-gray-500 bg-gray-100";
  }
};

export default function DisputeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { sendHttpRequest, loading } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const [dispute, setDispute] = useState<any>(null);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  const fetchDisputeDetails = () => {
    if (!id || !token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/seller/${id}/`,
        method: "GET",
        token: token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        setDispute(res.data);
      },
      errorRes: (err) => {
        console.error("Failed to fetch dispute details:", err);
      },
    });
  };

  useEffect(() => {
    fetchDisputeDetails();
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
    <div className="w-full lg:rounded-c16 mx-auto lg:p-8 lg:space-y-8 lg:bg-white min-h-screen  py-6 lg:py-4 space-y-6">
      <DisputeHeader />

      <div className="bg-white rounded-[16px] p-[24px] lg:p-0 lg:rounded-none">
        <DisputeInfo 
          dispute={dispute}
          id={id as string}
          getStatusClass={getStatusClass}
          handleCopy={handleCopy}
          onEscalate={() => setIsEscalateModalOpen(true)}
        />
        
        <DisputeEvidence dispute={dispute} />
      </div>

      {/* Mobile Sticky Escalate Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.1)] z-40 border-t border-gray-100">
        <Button 
          className="w-full py-3 bg-ff715b text-white rounded-xl transition-all shadow-lg shadow-ff715b/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setIsEscalateModalOpen(true)}
          disabled={dispute.status === "ESCALATED" || dispute.is_escalated}
        >
          {dispute.status === "ESCALATED" || dispute.is_escalated ? "Escalated" : "Escalate"}
        </Button>
      </div>

      <EscalateDisputeModal
        isOpen={isEscalateModalOpen}
        disputeId={id as string}
        onClose={() => setIsEscalateModalOpen(false)}
        onSuccess={fetchDisputeDetails}
      />
    </div>
  );
}
