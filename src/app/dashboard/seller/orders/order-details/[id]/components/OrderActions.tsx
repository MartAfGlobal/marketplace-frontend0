import { Button } from "@/components/ui/Button/Button";

interface OrderActionsProps {
  order: any;
  getMappedStatus: (order: any) => string;
  onAcceptClick: () => void;
  onRejectClick: () => void;
  onFulfillClick: () => void;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  isDesktop?: boolean;
  className?: string;
}

export const OrderActions = ({
  order,
  getMappedStatus,
  onAcceptClick,
  onRejectClick,
  onFulfillClick,
  timeLeft,
  formatTime,
  isDesktop = true,
  className = "",
}: OrderActionsProps) => {
  const mappedStatus = (getMappedStatus(order) || "").toLowerCase().trim();
  const rawStatus = (order?.status || "").toLowerCase().trim();
  const timelineStage = (order?.order_timeline_stage || "")
    .toLowerCase()
    .trim();
  const isTrackingSubmitted =
    String(order?.status ?? "")
      .trim()
      .toUpperCase() === "TRACKING_SUBMITTED" ||
    mappedStatus === "tracking submitted" ||
    mappedStatus === "tracking_submitted";

  const isUnprocessed =
    mappedStatus === "unprocessed" ||
    mappedStatus === "pending" ||
    mappedStatus === "awaiting acceptance" ||
    mappedStatus === "awaiting_acceptance" ||
    rawStatus === "pending" ||
    rawStatus === "unprocessed" ||
    timelineStage === "pending";

  const isProcessingOrAccepted =
    (mappedStatus === "processing" ||
      mappedStatus === "processed" ||
      mappedStatus === "accepted" ||
      mappedStatus === "partially accepted" ||
      mappedStatus === "partially_accepted" ||
      rawStatus === "accepted" ||
      rawStatus === "processed" ||
      rawStatus === "processing" ||
      rawStatus === "partially_accepted") &&
    !isTrackingSubmitted;

  const canAccept =
    order?.can_accept !== false &&
    (timeLeft > 0 || !order?.time_remaining_to_accept);

  if (isDesktop) {
    return (
      <div className={`hidden lg:flex flex-col min-w-[305px] ${className}`}>
        {/* Status-specific actions */}
        {isUnprocessed && (
          <div className=" flex flex-col gap-4">
            <Button
              disabled={!canAccept}
              onClick={onAcceptClick}
              className={` ${!canAccept ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:bg-ff715b/90"}`}
            >
              Accept order
            </Button>
            <Button
              variant="secondary"
              disabled={!canAccept}
              onClick={onRejectClick}
              className={` ${!canAccept ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-red-50"}`}
            >
              Reject order
            </Button>
            <div className="pt-4 space-y-2 flex items-center gap-2">
              <p className=" font-MontserratNormal text-sm ">
                Time left for accepting order:
              </p>
              <div className="flex justify-center">
                <span
                  className={`px-4 min-w-[93px] h-10 flex justify-center items-center rounded-c8 font-MontserratSemiBold text-base ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <p className="text-c12 font-MontserratNormal text-000000/68">
              {timeLeft > 0
                ? "N/B: The order will automatically be cancelled after time elapses"
                : "The order has been cancelled"}
            </p>
          </div>
        )}

        {isProcessingOrAccepted && (
          <div className="hidden md:flex flex-col gap-4">
            <Button
              disabled={timeLeft <= 0}
              onClick={onFulfillClick}
              className={`w-full  ${timeLeft > 0 ? "bg-ff715b shadow-ff715b/20 hover:bg-ff715b/90" : "opacity-50 cursor-not-allowed bg-gray-400"}`}
            >
              Submit tracking number
            </Button>
            <div className="pt-4 space-y-2 flex items-center gap-2">
              <p className=" font-MontserratNormal text-sm ">
                Time left to fulfill order:
              </p>
              <div className="flex justify-center">
                <span
                  className={`px-4 min-w-[93px] h-10 flex justify-center items-center rounded-c8 font-MontserratSemiBold text-base ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <p className="text-c12 font-MontserratNormal text-000000/68">
              {timeLeft > 0
                ? "N/B: The order will automatically be cancelled after time elapses"
                : "The order has been cancelled"}
            </p>
          </div>
        )}

        {isTrackingSubmitted && (
          <div className="w-full py-4 bg-blue-50 text-[#0070E9] rounded-c8 flex items-center justify-center font-MontserratSemiBold text-sm text-center px-4">
            Tracking submitted (Awaiting hub confirmation)
          </div>
        )}

        {(mappedStatus === "fulfilled" ||
          mappedStatus === "in_transit_to_hub") && (
          <div className="w-full py-4 bg-[#0070E9]/12 text-[#0070E9] rounded-c8 flex items-center justify-center font-MontserratSemiBold text-sm">
            Order at warehouse
          </div>
        )}
      </div>
    );
  }

  const hasMobileActions =
    isUnprocessed ||
    isProcessingOrAccepted ||
    isTrackingSubmitted ||
    mappedStatus === "fulfilled" ||
    mappedStatus === "in_transit_to_hub";

  if (!hasMobileActions) {
    return null;
  }

  // Mobile In-page Actions Card or Sticky View
  return (
    <div
      className={`lg:hidden ${className || "fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.1)] z-40 border-t border-gray-100"}`}
    >
      <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
        {isUnprocessed && (
          <>
            <Button
              disabled={!canAccept}
              onClick={onAcceptClick}
              
            >
              Accept order
            </Button>
            <Button
              variant="secondary"
              disabled={!canAccept}
              onClick={onRejectClick}
            >
              Reject order
            </Button>
          </>
        )}
        {isProcessingOrAccepted && (
          <Button
            disabled={timeLeft <= 0}
            onClick={onFulfillClick}
            
          >
            Submit tracking number
          </Button>
        )}
        {isTrackingSubmitted && (
          <div className="w-full py-3 bg-blue-50 text-[#0070E9] rounded-xl flex items-center justify-center font-MontserratSemiBold text-sm text-center px-4">
            Tracking submitted (Awaiting hub confirmation)
          </div>
        )}
        {(mappedStatus === "fulfilled" ||
          mappedStatus === "in_transit_to_hub") && (
          <div className="w-full py-3 bg-[#0070E9]/12 text-[#0070E9] rounded-xl flex items-center justify-center font-MontserratSemiBold text-sm">
            Order at warehouse
          </div>
        )}
      </div>
    </div>
  );
};
