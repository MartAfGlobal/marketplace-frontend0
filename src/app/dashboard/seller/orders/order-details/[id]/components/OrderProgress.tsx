import Image from "next/image";
import React, { Fragment } from "react";
import UnprocessedIcon from "@/assets/Seller/unprocessed.svg";
import PlaneIcon from "@/assets/Seller/AirplaneTilt.svg";
import PackageIcon from "@/assets/Seller/fufilledIcon.svg";
import DeliveredIcon from "@/assets/icons/admin/orders-progress/delivered.svg";
import ItemReturnIcon from "@/assets/icons/item return.svg";

interface OrderProgressProps {
  order: any;
  getMappedStatus: (order: any) => string;
}

interface StepItem {
  key: string;
  label: string;
  icon?: any;
  customRenderIcon?: () => React.ReactNode;
  width?: number;
  height?: number;
  highlightColor?: "purple" | "orange" | "green";
}

export const OrderProgress = ({
  order,
  getMappedStatus,
}: OrderProgressProps) => {
  const rawStatus = (order?.status || "").toUpperCase();
  const sellerStatus = (order?.seller_status || "").toLowerCase();
  const mappedStatus = getMappedStatus(order).toLowerCase();

  const disputeObj = order?.dispute || order?.disputes?.[0];
  const disputeStatus = (
    order?.dispute_status ||
    disputeObj?.status ||
    disputeObj?.status_display ||
    ""
  ).toUpperCase();

  const isClosed =
    rawStatus === "CLOSED" ||
    disputeStatus === "CLOSED" ||
    disputeStatus.includes("CLOSED") ||
    mappedStatus === "closed" ||
    order?.status?.toLowerCase() === "closed";

  const hasDispute =
    order?.has_dispute === true ||
    Boolean(disputeObj) ||
    mappedStatus === "dispute raised" ||
    mappedStatus === "dispute ongoing" ||
    rawStatus === "RETURN_REQUESTED" ||
    rawStatus === "RETURN_ACCEPTED" ||
    rawStatus === "RETURN_APPROVED" ||
    rawStatus === "DISPUTE_RAISED" ||
    rawStatus === "DISPUTE_ONGOING" ||
    disputeStatus.length > 0;

  const resType = (
    order?.resolution_type ||
    disputeObj?.resolution_type ||
    disputeObj?.resolution_type_display ||
    disputeObj?.dispute_type ||
    order?.dispute_type ||
    ""
  ).toUpperCase();

  const isRefundBothParties =
    resType === "REFUND_BOTH_PARTIES" || resType.includes("BOTH");

  const isReturnInvolved =
    !isRefundBothParties &&
    (resType === "REFUND_AND_RETURN" ||
      resType === "RETURN_ONLY" ||
      resType.includes("RETURN") ||
      rawStatus.includes("RETURN") ||
      Boolean(order?.return_method) ||
      Boolean(order?.return_tracking_number) ||
      Boolean(order?.has_return) ||
      (hasDispute && !isRefundBothParties));

  const isReturnConfirmed = Boolean(
    order?.return_delivery_confirmed ||
      disputeObj?.return_delivery_confirmed ||
      rawStatus === "ITEM_RETURNED" ||
      rawStatus === "RETURN_RECEIVED" ||
      (isClosed && isReturnInvolved)
  );

  const isReturnInProgress =
    !isReturnConfirmed &&
    !isClosed &&
    (rawStatus === "RETURN_ACCEPTED" ||
      rawStatus === "RETURN_APPROVED" ||
      rawStatus === "IN_TRANSIT" ||
      rawStatus === "ITEM_RETURNED" ||
      disputeStatus === "APPROVED" ||
      disputeStatus === "IN_TRANSIT" ||
      disputeStatus === "RESOLVED" ||
      mappedStatus === "dispute ongoing");

  // Base 6 steps for every seller order
  const baseSteps: StepItem[] = [
    {
      label: "Unprocessed",
      key: "unprocessed",
      icon: UnprocessedIcon,
      width: 11.25,
      height: 16.25,
    },
    {
      label: "Processing",
      key: "processing",
      icon: UnprocessedIcon,
      width: 11.25,
      height: 16.25,
    },
    {
      label: "Processed",
      key: "processed",
      icon: PackageIcon,
      width: 20,
      height: 20,
    },
    {
      label: "Received at Hub",
      key: "received_at_hub",
      icon: PackageIcon,
      width: 20,
      height: 20,
    },
    {
      label: "Shipped",
      key: "shipped",
      icon: PlaneIcon,
      width: 20,
      height: 20,
    },
    {
      label: "Delivered",
      key: "delivered",
      icon: DeliveredIcon,
      width: 18,
      height: 18,
    },
  ];

  let steps: StepItem[] = [...baseSteps];
  let currentStepIndex = 0;

  if (hasDispute) {
    if (isReturnInvolved) {
      if (isReturnConfirmed || isClosed) {
        // Image 3: 9 steps (Delivered -> Dispute raised -> Items to be returned -> Item returned)
        steps.push(
          {
            label: "Dispute raised",
            key: "dispute_raised",
            customRenderIcon: () => (
              <span className="text-white text-[16px] font-MontserratBold leading-none">
                !
              </span>
            ),
            highlightColor: "orange",
          },
          {
            label: "Items to be returned",
            key: "items_to_be_returned",
            icon: ItemReturnIcon,
            width: 17,
            height: 14,
            highlightColor: "orange",
          },
          {
            label: "Item returned",
            key: "item_returned",
            customRenderIcon: () => (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ),
            highlightColor: "green",
          }
        );
        currentStepIndex = 8; // Item returned (Active / Completed)
      } else if (isReturnInProgress) {
        // Image 2: 8 steps (Delivered -> Dispute raised -> Items to be returned)
        steps.push(
          {
            label: "Dispute raised",
            key: "dispute_raised",
            customRenderIcon: () => (
              <span className="text-white text-[16px] font-MontserratBold leading-none">
                !
              </span>
            ),
            highlightColor: "orange",
          },
          {
            label: "Items to be returned",
            key: "items_to_be_returned",
            icon: ItemReturnIcon,
            width: 17,
            height: 14,
            highlightColor: "orange",
          }
        );
        currentStepIndex = 7; // Items to be returned (Active)
      } else {
        // Image 1: 7 steps (Delivered -> Dispute raised)
        steps.push({
          label: "Dispute raised",
          key: "dispute_raised",
          customRenderIcon: () => (
            <span className="text-white text-[16px] font-MontserratBold leading-none">
              !
            </span>
          ),
          highlightColor: "orange",
        });
        currentStepIndex = 6; // Dispute raised (Active)
      }
    } else {
      // Dispute with NO return involved (e.g. REFUND_BOTH_PARTIES) -> jumps to Paid out when closed
      if (isClosed) {
        steps.push(
          {
            label: "Dispute raised",
            key: "dispute_raised",
            customRenderIcon: () => (
              <span className="text-white text-[16px] font-MontserratBold leading-none">
                !
              </span>
            ),
            highlightColor: "orange",
          },
          {
            label: "Paid out",
            key: "paid_out",
            customRenderIcon: () => (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ),
            highlightColor: "green",
          }
        );
        currentStepIndex = 7; // Paid out (Active / Completed)
      } else {
        steps.push({
          label: "Dispute raised",
          key: "dispute_raised",
          customRenderIcon: () => (
            <span className="text-white text-[16px] font-MontserratBold leading-none">
              !
            </span>
          ),
          highlightColor: "orange",
        });
        currentStepIndex = 6;
      }
    }
  } else {
    // Normal order without dispute
    const isCompleted =
      rawStatus === "DELIVERED" ||
      rawStatus === "COMPLETED" ||
      rawStatus === "PAID_OUT" ||
      mappedStatus === "delivered" ||
      mappedStatus === "completed" ||
      mappedStatus === "paid out";

    if (isCompleted) {
      steps.push({
        label: "Paid out",
        key: "paid_out",
        customRenderIcon: () => (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ),
        highlightColor: "green",
      });

      if (
        rawStatus === "PAID_OUT" ||
        rawStatus === "COMPLETED" ||
        mappedStatus === "paid out"
      ) {
        currentStepIndex = 6; // Paid out
      } else {
        currentStepIndex = 5; // Delivered
      }
    } else {
      let normalizedStatus: string;
      if (sellerStatus === "processing") {
        normalizedStatus = "processing";
      } else if (sellerStatus === "processed") {
        normalizedStatus = "processed";
      } else {
        const raw = getMappedStatus(order)?.toLowerCase();
        normalizedStatus =
          raw === "tracking submitted" || raw === "partially accepted"
            ? "processed"
            : raw;
      }

      const foundIdx = baseSteps.findIndex(
        (s) => s.label.toLowerCase() === normalizedStatus
      );
      currentStepIndex = foundIdx >= 0 ? foundIdx : 0;
    }
  }

  const getCircleBg = (idx: number, step: StepItem) => {
    if (idx < currentStepIndex) {
      return "bg-6a0dad/68 text-white";
    }
    if (idx === currentStepIndex) {
      if (step.highlightColor === "green") {
        return "bg-[#2D7565] text-white shadow-sm";
      }
      if (step.highlightColor === "orange") {
        return "bg-[#FFAC06] text-white shadow-sm";
      }
      return "bg-6a0dad/68 text-white shadow-sm";
    }
    return "bg-gray-200 text-gray-400";
  };

  const getTextClass = (idx: number, step: StepItem) => {
    if (idx < currentStepIndex) {
      return "text-6a0dad/68 font-MontserratSemiBold";
    }
    if (idx === currentStepIndex) {
      if (step.highlightColor === "green") {
        return "text-[#2D7565] font-MontserratSemiBold";
      }
      if (step.highlightColor === "orange") {
        return "text-[#FFAC06] font-MontserratSemiBold";
      }
      return "text-6a0dad/68 font-MontserratSemiBold";
    }
    return "text-gray-400 font-MontserratNormal";
  };

  const getLeftLineColor = (idx: number) => {
    if (idx < currentStepIndex) {
      return "bg-6a0dad/68";
    }
    return "bg-gray-200";
  };

  const getRightLineColor = (idx: number) => {
    const nextIdx = idx + 1;
    if (nextIdx < currentStepIndex) {
      return "bg-6a0dad/68";
    }
    if (nextIdx === currentStepIndex) {
      const nextStep = steps[nextIdx];
      if (nextStep?.highlightColor === "green") {
        return "bg-[#2D7565]";
      }
      if (nextStep?.highlightColor === "orange") {
        return "bg-[#FFAC06]";
      }
      return "bg-6a0dad/68";
    }
    return "bg-gray-200";
  };

  return (
    <div className="space-y-6 pt-8 pb-4">
      <h3 className="font-MontserratSemiBold text-sm">Order progress</h3>
      <div className="w-full overflow-x-auto hcustom-scroll pb-14">
        <div
          className={`flex items-start ${
            steps.length >= 8
              ? "min-w-[860px]"
              : steps.length === 7
              ? "min-w-[740px]"
              : "min-w-[620px]"
          } lg:max-w-5xl mt-4 px-8`}
        >
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;

            return (
              <Fragment key={step.key || idx}>
                <div className="flex flex-col items-center gap-2 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${getCircleBg(
                      idx,
                      step
                    )}`}
                  >
                    {step.customRenderIcon ? (
                      step.customRenderIcon()
                    ) : (
                      <Image
                        src={step.icon}
                        alt={step.label}
                        width={step.width || 20}
                        height={step.height || 20}
                        className={
                          idx <= currentStepIndex
                            ? "brightness-200"
                            : "opacity-40"
                        }
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs text-center leading-tight absolute top-12 left-1/2 -translate-x-1/2 w-max max-w-[80px] sm:max-w-[88px] break-words ${getTextClass(
                      idx,
                      step
                    )}`}
                  >
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <div className="flex-1 h-0.5 mt-5 relative flex items-center min-w-[36px] sm:min-w-[44px]">
                    <div
                      className={`flex-1 h-full transition-all duration-300 ${getLeftLineColor(
                        idx
                      )}`}
                    />
                    <div
                      className={`flex-1 h-full transition-all duration-300 ${getRightLineColor(
                        idx
                      )}`}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
