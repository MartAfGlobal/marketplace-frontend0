import { MoreVertical } from "lucide-react";

export interface OrderDetailItem {
  id?: string;
  sku?: string;
  product_sku?: string;
  name?: string;
  title?: string;
  product_name?: string;
  image?: string;
  thumbnail?: string;
  product?: {
    title?: string;
    name?: string;
    sku?: string;
    image?: string;
    thumbnail?: string;
    images?: Array<{ image?: string } | string>;
  };
  unit_price?: number | string;
  price?: number | string;
  quantity?: number;
  qty?: number;
  total_price?: number | string;
  total?: number | string;
  status?: string;
  is_cancelled?: boolean;
}

interface OrderDetailsTableProps {
  items?: OrderDetailItem[];
}

export default function OrderDetailsTable({ items = [] }: OrderDetailsTableProps) {
  const acceptedItems = items.filter(
    (item) =>
      !item.is_cancelled &&
      (item.status || "").toUpperCase() !== "CANCELLED" &&
      (item.status || "").toUpperCase() !== "CANCELED"
  );

  const cancelledItems = items.filter(
    (item) =>
      item.is_cancelled ||
      (item.status || "").toUpperCase() === "CANCELLED" ||
      (item.status || "").toUpperCase() === "CANCELED"
  );

  const getItemSku = (item: OrderDetailItem) => {
    return item.sku || item.product_sku || item.product?.sku || "N/A";
  };

  const getItemName = (item: OrderDetailItem) => {
    return (
      item.name ||
      item.title ||
      item.product_name ||
      item.product?.title ||
      item.product?.name ||
      "N/A"
    );
  };

  const getItemImage = (item: OrderDetailItem) => {
    const rawImage =
      item.image ||
      item.thumbnail ||
      item.product?.image ||
      item.product?.thumbnail ||
      (typeof item.product?.images?.[0] === "string"
        ? item.product.images[0]
        : item.product?.images?.[0]?.image);
    return rawImage || "";
  };

  const getItemUnitPrice = (item: OrderDetailItem) => {
    const raw = item.unit_price ?? item.price;
    if (raw != null && raw !== "" && !isNaN(Number(raw))) {
      return `₦${Number(raw).toLocaleString()}`;
    }
    return "N/A";
  };

  const getItemQty = (item: OrderDetailItem) => {
    const raw = item.quantity ?? item.qty;
    return raw != null ? String(raw) : "N/A";
  };

  const getItemTotal = (item: OrderDetailItem) => {
    const raw = item.total_price ?? item.total;
    if (raw != null && raw !== "" && !isNaN(Number(raw))) {
      return `₦${Number(raw).toLocaleString()}`;
    }
    const unitPrice = item.unit_price ?? item.price;
    const qty = item.quantity ?? item.qty;
    if (
      unitPrice != null &&
      qty != null &&
      !isNaN(Number(unitPrice)) &&
      !isNaN(Number(qty))
    ) {
      return `₦${(Number(unitPrice) * Number(qty)).toLocaleString()}`;
    }
    return "N/A";
  };

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 pb-8 animate-in fade-in duration-300">
      <h3 className="text-sm text-000000/68 font-MontserratNormal">
        Order items
      </h3>

      {/* Accepted Items */}
      <div className="space-y-4">
        <p className="text-xs text-[#00BE5C] font-MontserratMedium">
          Accepted items
        </p>
        <div className="overflow-x-auto adminXcustom-scroll">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="bg-[#947FFF] text-white text-[12px] font-MontserratSemiBold h-10">
                <th className="p-3">SKU</th>
                <th className="p-3">Items</th>
                <th className="p-3">Unit price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="text-sm font-MontserratNormal">
              {acceptedItems.length > 0 ? (
                acceptedItems.map((item, index) => {
                  const image = getItemImage(item);
                  return (
                    <tr key={item.id || index} className="h-16">
                      <td className="px-3 font-MontserratMedium text-xs">
                        {getItemSku(item)}
                      </td>
                      <td className="px-3">
                        <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            {image ? (
                              <img
                                src={image}
                                alt={getItemName(item)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                N/A
                              </span>
                            )}
                          </div>
                          <span>{getItemName(item)}</span>
                        </div>
                      </td>
                      <td className="px-3">{getItemUnitPrice(item)}</td>
                      <td className="px-3 text-center">{getItemQty(item)}</td>
                      <td className="px-3 font-MontserratSemiBold">
                        {getItemTotal(item)}
                      </td>
                      <td className="px-3 text-center">
                        <button className="hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-xs text-000000/44 font-MontserratMedium"
                  >
                    No items (N/A)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancelled Items */}
      {cancelledItems.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-ca0202 font-MontserratNormal">
            Cancelled items
          </p>
          <div className="overflow-x-auto adminXcustom-scroll">
            <table className="w-full text-left min-w-[650px]">
              <thead>
                <tr className="bg-[#947FFF] text-white text-[12px] font-MontserratSemiBold h-10">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Unit price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm font-MontserratNormal">
                {cancelledItems.map((item, index) => {
                  const image = getItemImage(item);
                  return (
                    <tr key={item.id || index} className="h-16 bg-ca0202/12">
                      <td className="px-3 font-MontserratMedium text-xs">
                        {getItemSku(item)}
                      </td>
                      <td className="px-3">
                        <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            {image ? (
                              <img
                                src={image}
                                alt={getItemName(item)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                N/A
                              </span>
                            )}
                          </div>
                          <span>{getItemName(item)}</span>
                        </div>
                      </td>
                      <td className="px-3">{getItemUnitPrice(item)}</td>
                      <td className="px-3 text-center">{getItemQty(item)}</td>
                      <td className="px-3 font-MontserratSemiBold">
                        {getItemTotal(item)}
                      </td>
                      <td className="px-3 text-center">
                        <button className="hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
