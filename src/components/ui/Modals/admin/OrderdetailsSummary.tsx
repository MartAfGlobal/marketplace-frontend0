import Image from "next/image";
import inActiveIcon from "@/assets/admin/suspend.svg";

interface OrderDetailsSummaryProps {
  order?: any;
}

export default function OrderDetailsSummary({ order }: OrderDetailsSummaryProps) {
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : order?.date || "N/A";

  const transactionId =
    order?.payment_reference ||
    order?.payment_no ||
    order?.transaction_id ||
    order?.reference ||
    "N/A";

  const rawTotal =
    order?.total_price ??
    order?.total_amount ??
    order?.amount ??
    (order?.subtotal != null && order?.shipping_cost != null
      ? Number(order.subtotal) + Number(order.shipping_cost)
      : null);

  const formattedTotal =
    rawTotal != null && rawTotal !== "" && !isNaN(Number(rawTotal))
      ? `₦${Number(rawTotal).toLocaleString()}`
      : "N/A";

  const rawStatus = (order?.status ?? order?.order_status ?? "").toLowerCase();
  let statusLabel = order?.status ?? order?.order_status ?? "N/A";
  let statusBadgeStyle = "text-[#FFAC06] bg-[#FFAC06]/12";

  if (rawStatus === "delivered" || rawStatus === "completed") {
    statusLabel = "Delivered";
    statusBadgeStyle = "text-[#2ea37d] bg-[#2ea37d]/12";
  } else if (rawStatus === "disputed" || rawStatus === "dispute") {
    statusLabel = "Disputed";
    statusBadgeStyle = "text-[#E8334A] bg-[#E8334A]/12";
  } else if (rawStatus === "cancelled" || rawStatus === "canceled") {
    statusLabel = "Cancelled";
    statusBadgeStyle = "text-[#E8334A] bg-[#E8334A]/12";
  } else if (order?.status) {
    statusLabel =
      order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase();
  }

  // Shipping Address
  const buyerCountry =
    typeof order?.buyer?.country === "object" && order?.buyer?.country !== null
      ? (order.buyer.country.name || order.buyer.country.code || "")
      : (typeof order?.buyer?.country === "string" ? order.buyer.country : "");

  const deliveryAddress =
    order?.shipping_address?.address ||
    order?.delivery_address?.address ||
    order?.shipping_address_snapshot?.address;

  const locationParts = [
    order?.shipping_address?.city || order?.delivery_address?.city,
    order?.shipping_address?.state || order?.delivery_address?.state,
    buyerCountry,
  ].filter(Boolean);

  const shippingAddress =
    deliveryAddress ||
    (locationParts.length > 0 ? locationParts.join(", ") : null) ||
    "N/A";

  // Shipping Method
  const shippingMethod =
    order?.shipping_method ||
    order?.delivery_partner ||
    order?.courier ||
    (order?.fulfillment_preference === 1
      ? "Standard Shipping"
      : order?.fulfillment_preference
      ? `Preference ${order.fulfillment_preference}`
      : "N/A");

  // Tracking Number
  const trackingNumber =
    order?.tracking_number ||
    order?.tracking_no ||
    order?.tracking_code ||
    order?.payment_no ||
    "N/A";

  // Summary Metrics
  const totalItems =
    order?.items_count ??
    (Array.isArray(order?.order_items)
      ? order.order_items.length
      : Array.isArray(order?.items)
      ? order.items.length
      : "N/A");

  const discounts =
    order?.discount != null && Number(order.discount) > 0
      ? `-₦${Number(order.discount).toLocaleString()}`
      : order?.discount === 0
      ? "₦0"
      : "N/A";

  const subtotal =
    order?.subtotal != null && order?.subtotal !== "" && !isNaN(Number(order.subtotal))
      ? `₦${Number(order.subtotal).toLocaleString()}`
      : "N/A";

  const shippingFees =
    order?.shipping_cost != null &&
    order?.shipping_cost !== "" &&
    !isNaN(Number(order.shipping_cost))
      ? `₦${Number(order.shipping_cost).toLocaleString()}`
      : order?.shipping_fee != null &&
        order?.shipping_fee !== "" &&
        !isNaN(Number(order.shipping_fee))
      ? `₦${Number(order.shipping_fee).toLocaleString()}`
      : "N/A";

  return (
    <div className="bg-ffffff rounded-2xl p-6 w-full animate-in fade-in duration-300">
      <div className="space-y-6">
        <h3 className="text-sm text-000000/68 font-MontserratNormal">
          Order details
        </h3>

        <div className="flex gap-4 md:justify-between items-center h-12">
          <div className="w-31.25 space-y-1">
            <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              Order date
            </span>
            <span className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              {formattedDate}
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64">
              Transaction ID
            </span>
            <span
              className="block text-base text-ff715b font-MontserratNormal w-full overflow-hidden truncate"
              title={transactionId}
            >
              {transactionId}
            </span>
          </div>
        </div>

        <div className="flex gap-4 md:justify-between items-center">
          <div>
            <span className="block text-xs mb-1 font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              Total amount
            </span>
            <span className="text-base font-MontserratNormal leading-[24px] tracking-[2%] text-000000/68">
              {formattedTotal}
            </span>
          </div>

          <div className="w-31">
            <span className="block text-xs mb-1 font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64">
              Status
            </span>
            <div
              className={`flex items-center gap-1 w-fit min-w-[90px] h-6.5 rounded-c32 py-1 px-3 text-xs font-MontserratNormal ${statusBadgeStyle}`}
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <Image
                  src={inActiveIcon}
                  alt={statusLabel}
                  width={7.88}
                  height={11.38}
                />
              </div>
              {statusLabel}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64">
            Shipping address
          </span>
          <span className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
            {shippingAddress}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 pt-2">
          <div>
            <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64">
              Shipping method
            </span>
            <span className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              {shippingMethod}
            </span>
          </div>

          <div className="min-w-0">
            <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64 mb-1">
              Tracking number
            </span>
            <span
              className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68 truncate block"
              title={trackingNumber}
            >
              {trackingNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6 mt-6">
        <div className="flex border-b py-4 border-b-000000/4 justify-between items-center text-sm font-MontserratNormal text-000000/68">
          <span>Order summary</span>
          <span className="text-base font-MontserratNormal text-000000/68">
            Amount
          </span>
        </div>

        <div className="space-y-3 text-sm font-MontserratNormal text-000000/68">
          <div className="flex justify-between py-0.5">
            <span>Total items</span>
            <span className="text-base font-MontserratNormal text-000000/68">
              {totalItems}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Discounts</span>
            <span className="text-base font-MontserratNormal text-000000/68">
              {discounts}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Subtotal</span>
            <span className="text-base font-MontserratNormal text-000000/68">
              {subtotal}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Shipping fees</span>
            <span className="text-base font-MontserratNormal text-000000/68">
              {shippingFees}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-2">
          <span className="text-c20 font-MontserratMedium leading-[28px]">
            Total
          </span>
          <span className="text-c20 font-MontserratMedium leading-[28px]">
            {formattedTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
