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
}: OrderActionsProps) => {
  const mappedStatus = getMappedStatus(order);

  if (isDesktop) {
    return (
      <div className="hidden lg:flex flex-col min-w-[305px]">
        {/* Status-specific actions */}
        {mappedStatus === "unprocessed" && (
          <div className="flex flex-col gap-4">
            <Button
              disabled={!order.can_accept}
              onClick={onAcceptClick}
              className={`w-full py-4 bg-ff715b text-white rounded-xl transition-all shadow-lg shadow-ff715b/20 ${!order.can_accept ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:bg-ff715b/90"}`}
            >
              Accept order
            </Button>
            <Button
              disabled={!order.can_accept}
              onClick={onRejectClick}
              className={`w-full py-4 bg-white border border-ca0202 text-ca0202 rounded-xl transition-all ${!order.can_accept ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-red-50"}`}
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

        {(mappedStatus === "processed" || mappedStatus === "partially accepted") && (
          <div className="flex flex-col gap-4">
            <button
              disabled={timeLeft <= 0}
              onClick={onFulfillClick}
              className={`w-full py-4 text-white rounded-xl font-MontserratSemiBold transition-all shadow-lg ${timeLeft > 0 ? "bg-ff715b shadow-ff715b/20 hover:bg-ff715b/90" : "opacity-50 cursor-not-allowed bg-gray-400"}`}
            >
              Mark as shipped
            </button>
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

        {mappedStatus === "fulfilled" && (
          <div className="w-full py-4 bg-000000/12 text-ffffff rounded-c8 flex items-center justify-center font-MontserratSemiBold text-sm">
            Order at warehouse
          </div>
        )}
      </div>
    );
  }

  // Mobile Sticky View
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.1)] z-40 border-t border-gray-100">
      <div className="flex gap-4 max-w-md mx-auto">
        {mappedStatus === "unprocessed" && (
          <>
            <Button
              disabled={!order.can_accept}
              onClick={onRejectClick}
              className={`flex-1 py-3 bg-white border border-ca0202 text-ca0202 rounded-xl transition-all ${!order.can_accept ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-red-50"}`}
            >
              Reject
            </Button>
            <Button
              disabled={!order.can_accept}
              onClick={onAcceptClick}
              className={`flex-1 py-3 bg-ff715b text-white rounded-xl transition-all shadow-lg shadow-ff715b/20 ${!order.can_accept ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:bg-ff715b/90"}`}
            >
              Accept
            </Button>
          </>
        )}
        {(mappedStatus === "processed" || mappedStatus === "partially accepted") && (
          <button
            disabled={timeLeft <= 0}
            onClick={onFulfillClick}
            className={`w-full py-3 text-white rounded-xl font-MontserratSemiBold transition-all shadow-lg ${timeLeft > 0 ? "bg-ff715b shadow-ff715b/20 hover:bg-ff715b/90" : "opacity-50 cursor-not-allowed bg-gray-400"}`}
          >
            Mark as shipped
          </button>
        )}
      </div>
    </div>
  );
};
