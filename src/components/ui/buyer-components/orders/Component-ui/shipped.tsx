"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import Copy from "@/assets/icons/Copy.png";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useSelector } from "react-redux";
import { getBuyerOrderTrackingPath } from "@/utils/buyerOrderTracking";
import { getBuyerOrderDateLabel } from "@/utils/buyerOrderDisplay";
import OrdersListView from "./shared/OrdersListView";
import OrderLineItemSummary from "./shared/OrderLineItemSummary";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { useHttp } from "@/hooks/use-http";

interface OrdersProps {
  searchTerm: string;
}

export default function Shipped({ searchTerm }: OrdersProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { fetchOrders } = useFetchOrders();
  const [itemId, setItemId] = useState("")
  const { loading: comfirming, sendHttpRequest: ComfirmReq } = useHttp();
  const token = useSelector((state: any) => state.token?.token);
  const { orders, loading } = useSelector((state: any) => state.orders);

  const shipped = orders.filter((order: OrderItem) =>
    ["SHIPPED", "shipped-buyer", "Shipped"].includes(order.buyer_status),
  );

  const filteredOrders = shipped.filter((order: OrderItem) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchesOrderId = order.order_no?.toLowerCase().includes(term);

    const matchesStore = order.manufacturer?.toLowerCase().includes(term);

    const matchesProduct = order.order_items?.some((item) =>
      item.product_name?.toLowerCase().includes(term),
    );

    return matchesOrderId || matchesStore || matchesProduct;
  });
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // adjust breakpoint as needed
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTrackOrder = (orderId: string) => {
    router.push(getBuyerOrderTrackingPath(orderId));
  };
  console.log(
    "tracking id:",
    orders.filter((order: any) => order.id),
  );

  const handleClick = (id: string) => {
    if (isMobile) {
      router.push(`/dashboard/buyer/orders/confirm-delivery/${id}`); // redirect on mobile
    } else {
      setItemId(id)
      setOpen(true); // open modal on desktop
    }
  };
  const handleComfirmOder = (order_id: any) => {
    console.log("checking item to pay", order_id);
    ComfirmReq({
      requestConfig: {
        url: `/orders/buyer/${order_id}/confirm-delivery/`,
        method: "POST",
        token,
        body: {
          confirmed: true,
        },
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User tracking info:", res);
        fetchOrders();
        setOpen(false);
        
      },
    });
  };
  const handleCopy = (orderId: string) => {
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="space-y-c24 w-full px-6">
      <OrdersListView
        hasOrders={shipped.length > 0}
        hasResults={filteredOrders.length > 0}
        emptyMessage="You haven’t made any orders yet"
        noResultsMessage="No matching orders found"
      >
        {filteredOrders.map((item: OrderItem) => {
                  const orderItems =
                    item.order_items || (item as any).items || [];
                  const isSingleItemOrder = orderItems.length === 1;
                  const orderDate = getBuyerOrderDateLabel(item);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full flex items-center gap-32 justify-center md:gap-0 md:justify-between mb-3 md:mb-c32">
                        <div>
                          <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                            Order on its way
                          </p>
                          <div className="md:flex hidden gap-2 mt-2">
                            <p className="text-c12  font-MontserratNormal">
                              Order ID: {item.order_id}
                            </p>
                            <button
                              onClick={() => handleCopy(item.order_id || "")}
                            >
                              <Image
                                src={Copy}
                                alt="copy"
                                width={16}
                                height={16}
                              />
                            </button>
                            {copied && (
                              <span className="text-green-600 text-c12 font-MontserratMedium">
                                Copied!
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                          {orderDate.label}: {orderDate.date}
                        </p>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="flex flex-col md:flex-row gap-4 items-start  "
                            >
                              {orderItems.map((prod: any) => (
                                <OrderLineItemSummary
                                  key={prod.id}
                                  image={prod.product_image}
                                  imageAlt={
                                    prod.product_name || "Product Image"
                                  }
                                  productName={prod.product_name}
                                  sellerName={
                                    item.seller_name || item.manufacturer
                                  }
                                  details={
                                    <>
                                      {prod.fulfilled_quantity ?? prod.quantity}
                                      Pc, {prod.variation_name || prod.product_name}
                                    </>
                                  }
                                  price={
                                    <>
                                      ₦
                                      {(
                                        prod.price_at_purchase *
                                        (prod.fulfilled_quantity ??
                                          prod.quantity ??
                                          0)
                                      ).toLocaleString()}
                                    </>
                                  }
                                  imageClassName="h-24 w-24 "
                                  detailsClassName="rounded-c12 bg-000000/4 text-000000/68 py-2 px-4  w-fit font-MontserratSemiBold text-c10  md:text-c12 justify-center flex items-center"
                                />
                              ))}
                            </Link>
                            <div className="w-full gap-4 pl md:hidden flex  md:max-w-70 ">
                              <Button
                                onClick={() => {
                                  handleClick(item.id);
                                }}
                              >Confirm delivery</Button>
                              <Button
                                variant="secondary"
                                key={item.id}
                                onClick={() => handleTrackOrder(item.id)}
                              >
                                Track order
                              </Button>
                              <div className="w-full hidden md:flex justify-center">
                                <Link
                                  href={`/dashboard/buyer/orders/${item.id}?mode=${item.buyer_status.toLowerCase()}`}
                                  className="text-c14 font-MontserratSemiBold text-ff715b"
                                >
                                  Order details
                                </Link>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="flex gap-4 w-full"
                            >
                              <div className="hidden sm:flex gap-4">
                                <div
                                  className={`grid gap-4 ${
                                    orderItems.length === 1
                                      ? "grid-cols-1"
                                      : orderItems.length === 2
                                        ? "grid-cols-2"
                                        : "grid-cols-3"
                                  }`}
                                >
                                  {orderItems.slice(0, 3).map((prod: any) => (
                                    <div
                                      key={prod.id}
                                      className="flex flex-col items-center"
                                    >
                                      <div className="w-24 h-24 relative">
                                        <Image
                                          src={
                                            prod.product_image ||
                                            "/placeholder.png"
                                          }
                                          alt={
                                            prod.product_name || "Product Image"
                                          }
                                          width={96}
                                          height={96}
                                          className="w-24 h-24 object-cover"
                                        />
                                        <p className="absolute bottom-2 text-c12 font-MontserratNormal flex items-center justify-center left-4 translate-x-1/2 text-center bg-000000 rounded-c12 text-ffffff  w-7.5 h-6">
                                          x
                                          {prod.fulfilled_quantity ??
                                            prod.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div>
                                  <p className="font-MontserratSemiBold text-base mb-2 flex flex-wrap gap-1">
                                    {orderItems
                                      ?.slice(0, 3)
                                      .map((prod, index) => (
                                        <span
                                          key={prod.id}
                                          className="flex items-center"
                                        >
                                          <span
                                            className="max-w-[110px] truncate inline-block align-middle"
                                            title={prod.product_name}
                                          >
                                            {prod.product_name}
                                          </span>
                                          {index <
                                            Math.min(orderItems.length, 3) -
                                              1 && <span>,&nbsp;</span>}
                                        </span>
                                      ))}
                                    {orderItems.length > 3 && <span>...</span>}
                                  </p>

                                  <p className="text-c12 font-MontserratMedium mb-3">
                                    {item.seller_name || item.manufacturer}
                                  </p>

                                  <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                    {orderItems.reduce(
                                      (sum: number, i: any) =>
                                        sum +
                                        (i.fulfilled_quantity ??
                                          i.quantity ??
                                          0),
                                      0,
                                    )}{" "}
                                    <span className="pl-0.5">Items</span>
                                  </p>

                                  <p className="font-MontserratSemiBold text-c16 pt-3">
                                    ₦
                                    {orderItems
                                      .reduce(
                                        (sum: number, i: any) =>
                                          sum +
                                          i.price_at_purchase *
                                            (i.fulfilled_quantity ??
                                              i.quantity ??
                                              0),
                                        0,
                                      )
                                      .toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex sm:hidden w-full items-start gap-4">
                                {orderItems[0] && (
                                  <Image
                                    src={
                                      orderItems[0].product_image ||
                                      "/placeholder.png"
                                    }
                                    alt={
                                      orderItems[0].product_name ||
                                      "Product Image"
                                    }
                                    width={96}
                                    height={96}
                                    className="w-24 h-24"
                                  />
                                )}

                                <div className="w-full ">
                                  <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
                                    {orderItems[0]?.product_name}
                                  </p>

                                  <p className="text-c12 font-MontserratMedium mb-2">
                                    {item.seller_name || item.manufacturer}
                                  </p>

                                  <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                    {orderItems.length}{" "}
                                    <span className="pl-0.5">Items</span>
                                  </p>

                                  <p className="font-MontserratSemiBold text-c16 pt-2">
                                    ₦
                                    {orderItems
                                      .reduce(
                                        (sum: number, i: any) =>
                                          sum +
                                          i.price_at_purchase *
                                            (i.fulfilled_quantity ??
                                              i.quantity ??
                                              0),
                                        0,
                                      )
                                      .toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            <div className="w-full gap-4 pl md:hidden flex  md:max-w-70 ">
                              <div className="w-full">
                                <Button
                                  onClick={() => {
                                    handleClick(item.id);
                                  }}
                                >Confirm delivery</Button>
                              </div>
                              <Button
                                variant="secondary"
                                key={item.id}
                                onClick={() => handleTrackOrder(item.id)}
                              >
                                Track order
                              </Button>
                              <div className="w-full hidden md:flex justify-center">
                                <Link
                                  href={`/dashboard/buyer/orders/${item.id}?mode=${item.buyer_status.toLowerCase()}`}
                                  className="text-c14 font-MontserratSemiBold text-ff715b"
                                >
                                  Order details
                                </Link>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          <Button
                            onClick={() => {
                              handleClick(item.id);
                            }}
                          >Confirm delivery</Button>

                          <Button
                            variant="secondary"
                            key={item.id}
                            onClick={() => handleTrackOrder(item.id)}
                          >
                            Track order
                          </Button>
                          <div className="w-full hidden md:flex justify-center">
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="text-c14 font-MontserratSemiBold text-ff715b"
                            >
                              Order details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
        })}
      </OrdersListView>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Did you receive this package?"
        description="Confirming helps us complete your order and improve service."
        onNo={() => setOpen(false)}
        onYes={() => handleComfirmOder(itemId)}
      />
    </div>
  );
}
