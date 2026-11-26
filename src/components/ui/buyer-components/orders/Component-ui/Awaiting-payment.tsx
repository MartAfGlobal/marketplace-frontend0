"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import AddressModal from "@/components/ui/Modals/new-address-modal"; // adjust path
import { UserAddressProps, Address } from "@/types/global";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import { useFetchOrders } from "@/helpers/fetchOrders";
import OrderEditAddressModal from "@/components/ui/Modals/orders/edit-address-order-modal";
import CartWithBoxesIcon from "../CartWithBoxesIcon";
import { li } from "framer-motion/client";
import Link from "next/link";
import { getBuyerOrderDateLabel } from "@/utils/buyerOrderDisplay";
import OrdersListView from "./shared/OrdersListView";
import OrderLineItemSummary from "./shared/OrderLineItemSummary";
import OrderItemsGridSummary, {
  OrderPreviewItem,
} from "./shared/OrderItemsGridSummary";

interface OrdersProps {
  searchTerm: string;
}
export default function AwaitingOrders({ searchTerm }: OrdersProps) {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    Partial<Address> | undefined
  >(undefined);

  const router = useRouter();

  const token = useSelector((state: any) => state.token?.token);
  const { orders } = useSelector((state: any) => state.orders);
  const { fetchAwaitingPayments, loading: fetchingPayments } = useFetchOrders();

  useEffect(() => {
    if (token) {
      fetchAwaitingPayments();
    }
  }, [token]);

  const awaitingPayment = orders.filter((order: OrderItem) =>
    [
      "AWAITING_PAYMENT",
      "Processing",
      "Awaiting Payment",
      "awaiting_payment",
      "PENDING_PAYMENT",
    ].includes(order.status),
  );

  const filteredOrders = awaitingPayment.filter((order: OrderItem) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchesOrderId = (order.order_no || order.id || "")
      .toLowerCase()
      .includes(term);

    const matchesStore = (order.manufacturer || order.seller_name || "")
      .toLowerCase()
      .includes(term);

    const orderItems = order.order_items || (order as any).items || [];
    const matchesProduct = orderItems.some((item: any) =>
      item.product_name?.toLowerCase().includes(term),
    );

    return matchesOrderId || matchesStore || matchesProduct;
  });

  const handleEditAddress = (id: string) => {
    setSelectedId(id);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      router.push(`/dashboard/buyer/orders/edit-address/${id}`);
    } else {
      setTimeout(() => setIsOpen(true), 0);
    }
  };

  const { loading: repaying, sendHttpRequest: repayReq } = useHttp();

  const handleRepay = (order_id: any, expected_amount: any) => {
    console.log("checking item to pay", order_id, expected_amount);
    setSelectedId(order_id);
    const amountNum = Number(expected_amount) || 0;
    repayReq({
      requestConfig: {
        url: "/checkout/repay/",
        method: "POST",
        token,
        body: {
          payment_id: order_id,
          order_id: order_id,
          repay_order_id: order_id,
          expected_amount: amountNum.toFixed(2),
        },
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User tracking info:", res);
        const paymentUrl =
          res.data?.paystack_payment_url ||
          res.data?.payment_url ||
          res.data?.authorization_url ||
          res.data?.checkout_url ||
          res.data?.url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          return;
        }
      },
    });
  };

  return (
    <div className="space-y-c24 px-6 w-full">
      <OrdersListView
        hasOrders={awaitingPayment.length > 0}
        hasResults={filteredOrders.length > 0}
        emptyMessage="You haven’t made any orders yet"
        noResultsMessage="No matching orders found"
      >
        {filteredOrders.map((item: OrderItem) => {
                  const orderItems = item.order_items || (item as any).items || [];
                  const hasOrderItems = orderItems.length > 0;
                  const isSingleItemOrder = orderItems.length === 1;
                  const previewItems: OrderPreviewItem[] = orderItems.map(
                    (prod) => ({
                      id: prod.id,
                      productName: prod.product_name,
                      productImage: prod.product_image || "/placeholder.png",
                      quantity: prod.fulfilled_quantity ?? prod.quantity,
                    }),
                  );

                  const itemsCount =
                    (item as any).items_count ??
                    (hasOrderItems
                      ? orderItems.reduce(
                          (sum: number, i: any) =>
                            sum + (i.fulfilled_quantity ?? i.quantity ?? 1),
                          0,
                        )
                      : 1);

                  const totalPrice = Number(
                    item.total_price ??
                      (hasOrderItems
                        ? orderItems.reduce(
                            (sum: number, i: any) =>
                              sum +
                              (Number(i.price_at_purchase || 0) *
                                Number(i.fulfilled_quantity ?? i.quantity ?? 1)),
                            0,
                          )
                        : 0),
                  );

                  const orderNo =
                    (item as any).payment_no ||
                    item.order_no ||
                    (item as any).payment_reference ||
                    item.id;

                  const storeName =
                    item.manufacturer ||
                    item.seller_name ||
                    ((item as any).sellers_count
                      ? `${(item as any).sellers_count} Store${(item as any).sellers_count > 1 ? "s" : ""}`
                      : "MartAf Order");

                  const orderDate = getBuyerOrderDateLabel(item);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full flex justify-between mb-3 md:mb-c32">
                        <div>
                          <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                            Awaiting payment
                          </p>
                          {orderNo && (
                            <p className="text-c12 font-MontserratNormal text-000000/60 mt-1">
                              Order ID: {orderNo}
                            </p>
                          )}
                        </div>
                        {orderDate.date && (
                          <p className="text-c12 font-MontserratNormal leading-4 text-000000/60">
                            {orderDate.label}: {orderDate.date}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:justify-between flex-col pb-c32 flex md:flex-row">
                        {!hasOrderItems ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="flex flex-col md:flex-row gap-4 items-start flex-1"
                            >
                              <div className="flex gap-4 items-start w-full">
                                <CartWithBoxesIcon className="h-24 w-24" itemsCount={itemsCount} />
                                <div className="w-full">
                                  <p className="font-MontserratSemiBold text-base mb-1 text-000000">
                                    Order #{orderNo}
                                  </p>
                                  <p className="text-c12 font-MontserratMedium mb-2 text-000000/70">
                                    {storeName}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                    <p className="rounded-c12 bg-000000/10 text-000000/60 h-fit py-1.5 px-3 text-center font-MontserratSemiBold text-c12 flex items-center justify-center">
                                      {itemsCount} {itemsCount === 1 ? "Item" : "Items"}
                                    </p>
                                    {(item as any).shipping_cost > 0 && (
                                      <p className="text-c12 font-MontserratMedium text-000000/50">
                                        + ₦{Number((item as any).shipping_cost).toLocaleString()} Shipping
                                      </p>
                                    )}
                                  </div>
                                  <p className="font-MontserratSemiBold text-c16 pt-3 text-000000">
                                    ₦{totalPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            <div className="w-full gap-4 pl flex md:hidden mt-4 space-y-4">
                              <Button
                                disabled={repaying}
                                onClick={() => handleRepay(item.id, totalPrice)}
                                className="w-full"
                              >
                                {selectedId === item.id && repaying ? (
                                  <LoadingSpinner />
                                ) : (
                                  "Confirm & pay"
                                )}
                              </Button>
                            </div>
                          </>
                        ) : isSingleItemOrder ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                            >
                              <div className="flex flex-col md:flex-row gap-4 items-start  ">
                                {orderItems.map((prod) => (
                                  <OrderLineItemSummary
                                    key={prod.id}
                                    image={
                                      prod.product_image || "/placeholder.png"
                                    }
                                    imageAlt={
                                      prod.product_name || "Product Image"
                                    }
                                    productName={prod.product_name}
                                    sellerName={
                                      item.manufacturer || item.seller_name
                                    }
                                    details={
                                      <>
                                        {prod.fulfilled_quantity ?? prod.quantity}
                                        Pc, {prod.variation_name},
                                      </>
                                    }
                                    price={
                                      <>
                                        ₦
                                        {(
                                          (prod.price_at_purchase || 0) *
                                          (prod.fulfilled_quantity ??
                                            prod.quantity ??
                                            1)
                                        ).toLocaleString()}
                                      </>
                                    }
                                    imageClassName="h-24 w-24 object-cover "
                                    detailsClassName="rounded-c12 bg-000000/4 text-000000/68 py-2 px-4  w-fit font-MontserratSemiBold text-c10  md:text-c12 justify-center flex items-center"
                                  />
                                ))}
                              </div>
                            </Link>
                            <div className="w-full gap-4 pl flex md:hidden  mt-4 space-y-4">
                              <div className="w-full"></div>
                              <Button
                                disabled={repaying}
                                onClick={() => {
                                  handleRepay(item.id, totalPrice);
                                }}
                                className=""
                              >
                                {selectedId === item.id && repaying ? (
                                  <LoadingSpinner />
                                ) : (
                                  "Confirm & pay"
                                )}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                            >
                              <OrderItemsGridSummary
                                products={previewItems}
                                sellerName={item.manufacturer || item.seller_name}
                                itemCount={itemsCount}
                                totalPrice={totalPrice}
                                desktopImageClassName="w-24 h-24 object-cover rounded-lg"
                                mobileImageClassName="w-24 h-24 object-cover rounded-lg"
                                itemCountClassName="rounded-c12 bg-000000/10 h-fit py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60"
                                mobileExtra={
                                  <div className="w-full gap-4 text-c10 pl flex md:hidden  mt-4 space-y-4">
                                    <Button
                                      disabled={repaying}
                                      onClick={() =>
                                        handleRepay(item.id, totalPrice)
                                      }
                                      className="hidden"
                                    >
                                      {selectedId === item.id && repaying ? (
                                        <LoadingSpinner />
                                      ) : (
                                        "Confirm & pay"
                                      )}
                                    </Button>
                                  </div>
                                }
                              />
                            </Link>
                            <div className="w-full gap-4 pl flex md:hidden  mt-4 space-y-4">
                              <div className="w-full"></div>
                              <Button
                                disabled={repaying}
                                onClick={() => {
                                  handleRepay(item.id, totalPrice);
                                }}
                                className=""
                              >
                                {selectedId === item.id && repaying ? (
                                  <LoadingSpinner />
                                ) : (
                                  "Confirm & pay"
                                )}
                              </Button>
                            </div>
                          </>
                        )}

                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          <Button
                            disabled={repaying}
                            onClick={() => {
                              handleRepay(item.id, totalPrice);
                            }}
                            className=""
                          >
                            {selectedId === item.id && repaying ? <LoadingSpinner /> : "Confirm & pay"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
        })}
      </OrdersListView>
      {/* <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAddress={editingAddress}
        onSave={(newAddress) => {
          console.log("Saved Address:", newAddress);
          setIsModalOpen(false);
        }}
      />
      <OrderEditAddressModal onClose={()=>setIsOpen(false)} isOpen={isOpen} id={selectedId}/> */}
    </div>
  );
}
