import Image from "next/image";
import CopyIcon from "@/assets/icons/Copy.png";
import { getSellerStatusColor as getStatusColor } from "@/helpers/sellers/sellerOrderStatusHelper";

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
  const currentStatus = getMappedStatus(order);

  return (
    <>
      {/* Mobile View: Order Details Table */}
      <div className="lg:hidden mt-2 mb-2 w-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-MontserratSemiBold text-sm text-[#161616]">Order details</h3>
          <div className={`px-4 py-1 rounded-full text-[10px] font-MontserratSemiBold ${getStatusBadgeClass(currentStatus)}`}>
            {currentStatus}
          </div>
        </div>
        
        <div className="flex flex-col text-c12 font-MontserratNormal bg-white">
          <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-t-lg">
            <span className="text-[#161616]">Order date</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {new Date(order.created_at).toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#ffffff] px-4 py-3">
            <span className="text-[#161616]">Amount</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              ₦{Number(order.total || order.subtotal).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3">
            <span className="text-[#161616]">Items</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {order.items?.length > 1 ? "Multiple items" : (order.items?.[0]?.product_name || "1 item")}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#ffffff] px-4 py-3">
            <span className="text-[#161616]">Country</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {order.shipping_address?.country || order.shipping_address_snapshot?.country || "Nigeria"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-b-lg">
            <span className="text-[#161616]">Status</span>
            <span className="font-MontserratSemiBold text-[#161616] flex items-center gap-2 capitalize">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(currentStatus) }}></span>
              {currentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop View: Order Summary */}
      <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-MontserratSemiBold text-sm">
              Order ID: {order.order_id}
            </span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(order.order_id || order.id)
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
            {order.status === "REJECTED" || order.order_timeline_stage === "REJECTED" ? (
              <>
                <p className="font-MontserratNormal text-sm text-gray-500">
                  Original Order amount:{" "}
                  <span className="text-sm font-MontserratMedium line-through">
                    ₦{Number(order.total || order.subtotal).toLocaleString()}
                  </span>
                </p>
                <p className="font-MontserratNormal text-sm">
                  Order amount:{" "}
                  <span className="text-base font-MontserratSemiBold text-red-500">
                    ₦0
                  </span>
                </p>
              </>
            ) : order.items?.reduce(
              (acc: number, item: any) =>
                acc +
                Number(item.price_at_purchase || item.price) *
                  (item.accepted_quantity ?? (order.accepted_at ? (item.fulfilled_quantity ?? item.quantity) : 0)),
              0
            ) !== Number(order.total || order.subtotal) && order.accepted_at ? (
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
                            (item.accepted_quantity ?? item.fulfilled_quantity ?? 0),
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
            className={`inline-block px-4 py-1 rounded-full text-c12 font-MontserratSemiBold ${getStatusBadgeClass(currentStatus)}`}
          >
            {currentStatus}
          </div>
        </div>
      </div>
    </>
  );
};
