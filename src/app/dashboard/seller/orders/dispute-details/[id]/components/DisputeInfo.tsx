import Image from "next/image";
import CopyIcon from "@/assets/icons/Copy.png";
import { Button } from "@/components/ui/Button/Button";
import { MobileInfoTable } from "@/components/ui/seller-components/tables/mobile-info-table";

interface DisputeInfoProps {
  dispute: any;
  id: string | string[];
  getStatusClass: (status: string) => string;
  handleCopy: (text: string) => void;
  onEscalate: () => void;
}

export const DisputeInfo = ({
  dispute,
  id,
  getStatusClass,
  handleCopy,
  onEscalate,
}: DisputeInfoProps) => {
  return (
    <>
      {/* Mobile Layout (lg:hidden) */}
      <div className="lg:hidden flex flex-col w-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-MontserratSemiBold text-sm text-[#161616]">
            Dispute details
          </h3>
          <div
            className={`px-4 py-1 rounded-full text-[10px] font-MontserratSemiBold ${getStatusClass(
              dispute.status_display || dispute.status
            )}`}
          >
            {dispute.status_display || dispute.status || "Open"}
          </div>
        </div>

        <MobileInfoTable
          rows={[
            {
              label: "Order date",
              value: dispute.created_at
                ? new Date(dispute.created_at).toLocaleDateString("en-GB")
                : "N/A",
            },
            {
              label: "Delivery date",
              value: dispute.resolved_at
                ? new Date(dispute.resolved_at).toLocaleDateString("en-GB")
                : "N/A",
            },
            {
              label: "Order amount",
              value: `₦${
                dispute.requested_refund_amount?.toLocaleString() || "0.00"
              }`,
            },
          ]}
        />
      </div>

      {/* Desktop Layout (hidden lg:block) */}
      <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-MontserratSemiBold">
              Order ID: {dispute.order_number || dispute.order_id || id}
            </span>
            <button
              onClick={() =>
                handleCopy(dispute.order_number || dispute.order_id || id as string)
              }
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Image src={CopyIcon} width={16} height={16} alt="Copy" />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-MontserratNormal flex items-center">
              <span className="w-32 text-gray-500">Order date:</span>
              <span className="font-MontserratMedium text-000000">
                {dispute.created_at
                  ? new Date(dispute.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </p>
            <p className="text-sm font-MontserratNormal flex items-center">
              <span className="w-32 text-gray-500">Delivery date:</span>
              <span className="font-MontserratMedium text-000000">
                {dispute.resolved_at
                  ? new Date(dispute.resolved_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </p>
            <p className="text-sm font-MontserratNormal flex items-center pt-1">
              <span className="w-32 text-gray-500">Order amount:</span>
              <span className="font-MontserratSemiBold text-base text-000000">
                ₦{dispute.requested_refund_amount?.toLocaleString() || "0.00"}
              </span>
            </p>
          </div>
          <div className="pt-2">
            <span
              className={`px-8 py-2 min-h-c32 w-full min-w-31 rounded-c16 text-xs font-MontserratSemiBold ${getStatusClass(
                dispute.status_display || dispute.status
              )}`}
            >
              {dispute.status_display || dispute.status || "Open"}
            </span>
          </div>
        </div>

        <Button
          className="max-w-84 disabled:bg-gray-200 disabled:text-gray-500"
          onClick={onEscalate}
          disabled={dispute.status === "ESCALATED" || dispute.is_escalated}
        >
          {dispute.status === "ESCALATED" || dispute.is_escalated
            ? "Escalated"
            : "Escalate"}
        </Button>
      </div>
    </>
  );
};
