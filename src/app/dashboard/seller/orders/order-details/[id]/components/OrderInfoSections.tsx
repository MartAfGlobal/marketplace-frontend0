interface OrderInfoSectionsProps {
  order: any;
}

export const OrderInfoSections = ({ order }: OrderInfoSectionsProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 pt-4 ">
      <div className="space-y-3">
        <h3 className="font-MontserratSemiBold text-sm text-[#161616]">Buyer details</h3>
        
        {/* Mobile View */}
        <div className="lg:hidden flex flex-col text-c12 font-MontserratNormal bg-white">
          <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-t-lg">
            <span className="text-[#161616]">Buyer name</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {order.buyer?.first_name || order.buyer?.last_name
                ? `${order.buyer.first_name} ${order.buyer.last_name}`.trim()
                : order.shipping_address?.first_name
                  ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}`.trim()
                  : order.shipping_address_snapshot?.full_name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#ffffff] px-4 py-3 rounded-b-lg">
            <span className="text-[#161616]">Email address</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {order.buyer?.email || order.shipping_address_snapshot?.email || "N/A"}
            </span>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block space-y-3">
          <p className="font-MontserratNormal text-sm">
            Buyer name:{" "}
            {order.buyer?.first_name || order.buyer?.last_name
              ? `${order.buyer.first_name} ${order.buyer.last_name}`.trim()
              : order.shipping_address?.first_name
                ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}`.trim()
                : order.shipping_address_snapshot?.full_name || "N/A"}
          </p>
          <p className="font-MontserratNormal text-sm">
            Email address:{" "}
            {order.buyer?.email || order.shipping_address_snapshot?.email || "N/A"}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="font-MontserratSemiBold text-sm text-[#161616]">Shipping details</h3>
        
        {/* Mobile View */}
        <div className="lg:hidden flex flex-col text-c12 font-MontserratNormal bg-white">
          <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-t-lg">
            <span className="text-[#161616] min-w-[100px]">Shipping address</span>
            <span className="font-MontserratSemiBold text-[#161616] text-right line-clamp-2">
              {order.shipping_address?.address || order.shipping_address_snapshot?.address || "N/A"}, {order.shipping_address?.state || order.shipping_address_snapshot?.state || ""} {order.shipping_address?.city || ""}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#ffffff] px-4 py-3">
            <span className="text-[#161616]">Shipping method</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {order.delivery_partner || order.shipping_method || "Null"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-b-lg">
            <span className="text-[#161616]">Tracking number</span>
            <span className="font-MontserratSemiBold text-[#161616]">
              {order?.tracking_number || "Null"}
            </span>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block space-y-3">
          <p className="font-MontserratNormal text-sm line-clamp-2">
            Shipping address:{" "}
            {order.shipping_address?.address ||
              order.shipping_address_snapshot?.address ||
              "N/A"}
            ,{" "}
            {order.shipping_address?.state ||
              order.shipping_address_snapshot?.state ||
              ""}{" "}
            {order.shipping_address?.city || ""}
          </p>
          <p className="font-MontserratNormal text-sm">
            Shipping method:{" "}
            {order.delivery_partner || order.shipping_method || "N/A"}
          </p>
          <p className="font-MontserratNormal text-sm">
            Tracking number:{" "}
            <span className="text-ff715b">
              {order?.tracking_number || "To be provided"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
