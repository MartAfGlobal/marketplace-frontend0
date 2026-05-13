interface OrderInfoSectionsProps {
  order: any;
}

export const OrderInfoSections = ({ order }: OrderInfoSectionsProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 pt-4 ">
      <div className="space-y-3">
        <h3 className="font-MontserratSemiBold text-sm">Buyer details</h3>
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
      <div className="space-y-3">
        <h3 className="font-MontserratSemiBold text-sm">Shipping details</h3>
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
  );
};
