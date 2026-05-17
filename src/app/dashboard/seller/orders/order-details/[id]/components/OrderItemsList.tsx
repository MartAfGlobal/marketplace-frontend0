import Image from "next/image";
import productIcon from "@/assets/Seller/proccessed.svg";

interface OrderItemsListProps {
  order: any;
  mobileTab: "items" | "inventory";
  setMobileTab: (tab: "items" | "inventory") => void;
}

export const OrderItemsList = ({
  order,
  mobileTab,
  setMobileTab,
}: OrderItemsListProps) => {
  return (
    <>
      {/* Mobile view tabs */}
      <div className="lg:hidden flex border-b border-gray-200 mt-8 mb-4">
        <button
          onClick={() => setMobileTab("items")}
          className={`flex-1 pb-2 font-MontserratSemiBold text-sm border-b-2 transition-all ${mobileTab === "items" ? "border-[#6a0dad] text-[#6a0dad]" : "border-transparent text-gray-500"}`}
        >
          Order items
        </button>
        <button
          onClick={() => setMobileTab("inventory")}
          className={`flex-1 pb-2 font-MontserratSemiBold text-sm border-b-2 transition-all ${mobileTab === "inventory" ? "border-[#6a0dad] text-[#6a0dad]" : "border-transparent text-gray-500"}`}
        >
          Inventory
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-c48 lg:pt-8 mb-24 lg:mb-0">
        {/* Left: Items Table */}
        <div
          className={`${mobileTab === "items" ? "block" : "hidden"} lg:block w-full max-w-154 space-y-c32`}
        >
          <h3 className="font-MontserratSemiBold text-sm hidden lg:block">
            Order items
          </h3>
          
          {/* Mobile View: Cards */}
          <div className="lg:hidden flex flex-col gap-6">
            {order.items?.map((item: any, idx: number) => {
              const inStock = (item.product_stock || 0) >= item.quantity;
              const isLow = (item.product_stock || 0) > 0 && (item.product_stock || 0) < 5;
              
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col gap-3 w-[100px] flex-shrink-0">
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src={item.product_image || productIcon}
                        alt="item"
                        width={100}
                        height={100}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col text-c12 font-MontserratNormal bg-white rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center bg-[#ffffff] px-3 py-2 border-b border-gray-50">
                      <span className="text-[#161616] whitespace-nowrap">SKU</span>
                      <span className="font-MontserratSemiBold text-[#161616] truncate ml-4 text-right">
                        {item.variation_sku || item.product_sku || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#F8F8F8] px-3 py-2 border-b border-white">
                      <span className="text-[#161616]">Unit price</span>
                      <span className="font-MontserratSemiBold text-[#161616]">
                        ₦{Number(item.price_at_purchase || item.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#ffffff] px-3 py-2 border-b border-gray-50">
                      <span className="text-[#161616]">Quantity</span>
                      <span className="font-MontserratSemiBold text-[#161616]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#F8F8F8] px-3 py-2">
                      <span className="text-[#161616]">Total price</span>
                      <span className="font-MontserratSemiBold text-[#161616]">
                        ₦{(Number(item.price_at_purchase || item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    {( (item.fulfilled_quantity || 0) > 0 || (item.rejected_quantity || 0) > 0 ) && (
                      <div className="bg-[#ffffff] px-3 py-2 flex flex-col gap-1 border-t border-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="text-[#161616]">Accepted Qty</span>
                          <span className="font-MontserratSemiBold text-green-600">
                            {item.fulfilled_quantity || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#161616]">Rejected Qty</span>
                          <span className="font-MontserratSemiBold text-red-500">
                            {item.rejected_quantity || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#947fff] text-white font-MontserratSemiBold text-sm uppercase">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Items</th>
                  <th className="p-3 text-center">Unit price</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-MontserratNormal">
                {order.items?.map((item: any, idx: number) => (
                  <tr key={idx} className="">
                    <td className="pl-3 pr-1 py-3 text-sm font-MontserratNormal">
                      {item.variation_sku || item.product_sku || "N/A"}
                    </td>
                    <td className="pl-3 pr-1 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded bg-gray-50 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.product_image || productIcon}
                            alt="item"
                            width={64}
                            height={64}
                            unoptimized={true}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-MontserratNormal line-clamp-1">
                          {item.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="pl-3 pr-1 py-3 text-center text-sm">
                      ₦
                      {Number(
                        item.price_at_purchase || item.price
                      ).toLocaleString()}
                    </td>
                    <td className="pl-3 pr-1 py-3 text-center text-sm">
                      <div className="flex flex-col items-center">
                        <span>{item.quantity}</span>
                        {( (item.fulfilled_quantity || 0) > 0 ||
                          (item.rejected_quantity || 0) > 0) && (
                          <div className="text-[10px] flex flex-col items-center leading-tight">
                            <span className="text-green-600 font-MontserratMedium">
                              Acc: {item.fulfilled_quantity || 0}
                            </span>
                            <span className="text-red-500 font-MontserratMedium">
                              Rej: {item.rejected_quantity || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="pl-3 pr-1 py-3 text-right text-sm font-MontserratNormal">
                      <div className="flex flex-col items-end">
                        <span
                          className={
                            (item.fulfilled_quantity || 0) < item.quantity
                              ? "line-through text-gray-400 text-xs"
                              : ""
                          }
                        >
                          ₦
                          {(
                            Number(item.price_at_purchase || item.price) *
                            item.quantity
                          ).toLocaleString()}
                        </span>
                        {(item.fulfilled_quantity || 0) < item.quantity && (
                          <span className="text-green-600 font-MontserratSemiBold">
                            ₦
                            {(
                              Number(item.price_at_purchase || item.price) *
                              (item.fulfilled_quantity || 0)
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-[1px] bg-gray-100 self-stretch" />

        {/* Right: Inventory Overview */}
        <div
          className={`${mobileTab === "inventory" ? "block" : "hidden"} lg:block w-full lg:w-[568px] mt-8 lg:mt-0 space-y-8`}
        >
          <h3 className="font-MontserratSemiBold text-sm hidden lg:block">
            Inventory
          </h3>
          {/* Desktop View: Inventory */}
          <div className="hidden lg:block space-y-6">
            {order.items?.map((item: any, idx: number) => {
              const inStock = (item.product_stock || 0) >= item.quantity;
              const isLow =
                (item.product_stock || 0) > 0 && (item.product_stock || 0) < 5;

              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-25 h-25 overflow-hidden flex-shrink-0 ">
                    <Image
                      src={item.product_image || productIcon}
                      alt="thumb"
                      width={100}
                      height={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-MontserratSemiBold line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-c12 uppercase font-MontserratMedium">
                        SKU: {item.variation_sku || item.product_sku}
                      </p>
                      <p className="text-c12 font-MontserratMedium">
                        Size: {item.attributes?.Size?.value || "N/A"}
                      </p>
                      <p className="text-c12 font-MontserratMedium">
                        Color: {item.attributes?.Color?.value || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <span
                        className={`text-sm px-8 py-4 rounded-c12 font-MontserratMedium whitespace-nowrap ${
                          inStock
                            ? "bg-[#2D75651A] text-2d7565"
                            : isLow
                              ? "bg-[#FFAC061A] text-[#FFAC06]"
                              : "bg-red-50 text-ca0202"
                        }`}
                      >
                        {inStock
                          ? "In stock"
                          : isLow
                            ? "Low stock"
                            : "Out of stock"}
                      </span>
                      {!inStock && (
                        <button className="text-sm text-ff715b "> Restock </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile View: Inventory Cards */}
          <div className="lg:hidden flex flex-col gap-6">
            {order.items?.map((item: any, idx: number) => {
              const inStock = (item.product_stock || 0) >= item.quantity;
              const isLow =
                (item.product_stock || 0) > 0 && (item.product_stock || 0) < 5;

              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col gap-3 w-[100px] flex-shrink-0">
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src={item.product_image || productIcon}
                        alt="item"
                        width={100}
                        height={100}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`text-center text-[10px] py-1.5 rounded font-MontserratMedium whitespace-nowrap ${
                        inStock
                          ? "bg-[#2D75651A] text-[#2d7565]"
                          : isLow
                            ? "bg-[#FFAC061A] text-[#FFAC06]"
                            : "bg-red-50 text-ca0202"
                      }`}
                    >
                      {inStock ? "In stock" : isLow ? "Low stock" : "Out of stock"}
                    </span>
                    {/* {!inStock && (
                      <button className="text-[10px] text-ff715b text-center font-MontserratMedium">
                        Restock
                      </button>
                    )} */}
                  </div>
                  
                  <div className="flex-1 flex flex-col text-c12 font-MontserratNormal bg-white rounded-lg overflow-hidden">
                    <div className="bg-[#ffffff] hidden lg:block px-3 py-2 border-b border-gray-50">
                      <p className="font-MontserratSemiBold text-[#161616] line-clamp-1 text-sm">
                        {item.product_name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center bg-[#F8F8F8] px-3 py-2 border-b border-white">
                      <span className="text-[#161616] whitespace-nowrap">SKU</span>
                      <span className="font-MontserratSemiBold text-[#161616] truncate ml-4 text-right">
                        {item.variation_sku || item.product_sku || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#ffffff] px-3 py-2 border-b border-gray-50">
                      <span className="text-[#161616]">Size</span>
                      <span className="font-MontserratSemiBold text-[#161616]">
                        {item.attributes?.Size?.value || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#F8F8F8] px-3 py-2">
                      <span className="text-[#161616]">Color</span>
                      <span className="font-MontserratSemiBold text-[#161616]">
                        {item.attributes?.Color?.value || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
