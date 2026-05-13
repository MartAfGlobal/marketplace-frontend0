import Image from "next/image";
import CopyIcon from "@/assets/icons/Copy.png";

interface OrderSummaryProps {
  order: any;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  getStatusBadgeClass: (status: string) => string;
  getMappedStatus: (order: any) => string;
}

export const OrderSummary = ({
  order,
  timeLeft,
  formatTime,
  getStatusBadgeClass,
  getMappedStatus,
}: OrderSummaryProps) => {
  return (
    <>
      {/* Mobile Top Time Left */}
      <div className="lg:hidden w-full flex justify-between items-center bg-[#f9f9ff] p-4 rounded-xl -mt-4 mb-4 border border-[#e5e5f5]">
        <p className="font-MontserratSemiBold text-sm text-[#161616]">
          Time left for processing:
        </p>
        <span
          className={`font-MontserratSemiBold text-sm px-3 py-1 rounded-md ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-MontserratSemiBold text-sm">
              Order ID: {order.order_no || order.id}
            </span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(order.order_no || order.id)
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Image src={CopyIcon} alt="copy" width={16} height={16} />
            </button>
          </div>
          <p className="text-sm font-MontserratNormal">
            Order date:{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="space-y-1">
            {order.items?.reduce(
              (acc: number, item: any) =>
                acc +
                Number(item.price_at_purchase || item.price) *
                  (item.fulfilled_quantity || 0),
              0
            ) !== Number(order.total || order.subtotal) ? (
              <>
                <p className="font-MontserratNormal text-sm text-gray-500">
                  Original Order amount:{" "}
                  <span className="text-sm font-MontserratMedium line-through">
                    ₦{Number(order.total || order.subtotal).toLocaleString()}
                  </span>
                </p>
                <p className="font-MontserratNormal text-sm">
                  Order amount:{" "}
                  <span className="text-base font-MontserratSemiBold ">
                    ₦
                    {(
                      order.items?.reduce(
                        (acc: number, item: any) =>
                          acc +
                          Number(item.price_at_purchase || item.price) *
                            (item.fulfilled_quantity || 0),
                        0
                      ) || 0
                    ).toLocaleString()}
                  </span>
                </p>
              </>
            ) : (
              <p className="font-MontserratNormal text-sm">
                Order amount:{" "}
                <span className="text-base font-MontserratSemiBold">
                  ₦{Number(order.total || order.subtotal).toLocaleString()}
                </span>
              </p>
            )}
          </div>
          <div
            className={`inline-block px-4 py-1 rounded-full text-c12 font-MontserratSemiBold ${getStatusBadgeClass(order.status?.toLowerCase() || getMappedStatus(order))}`}
          >
            {order.status === "PARTIALLY_ACCEPTED"
              ? "Partial Accept"
              : getMappedStatus(order).charAt(0).toUpperCase() +
                getMappedStatus(order).slice(1)}
          </div>
        </div>
      </div>
    </>
  );
};
