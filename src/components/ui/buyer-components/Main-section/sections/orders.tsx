"use client";

import Image from "next/image";
import Icon1 from "@/assets/icons/user-dashboard/orderHistory/icon1.svg";
import Icon2 from "@/assets/icons/user-dashboard/orderHistory/icon2.png";
import Icon3 from "@/assets/icons/user-dashboard/orderHistory/icon3.png";
import Icon4 from "@/assets/icons/user-dashboard/orderHistory/icon4.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";

import { useState } from "react";
import { OrderHistoryItem, OrderItem } from "@/types/global";
import { TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Orders() {
  const { orders, loading } = useSelector((state: any) => state.orders);
  const oneItem = orders.filter((order: any) => order.items?.length === 1);
  console.log("Orders with only one item:", oneItem);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const totalToShip = orders.filter(
    (order: any) => order.status === "To Ship"
  ).length;
  const totalShipped = orders.filter(
    (order: any) => order.status === "Shipped"
  ).length;
  const totalDelivered = orders.filter(
    (order: any) => order.status === "Delivered"
  ).length;
  const totalAwaitingPayment = orders.filter(
    (order: any) => order.status === "Awaiting Payment"
  ).length;
  const totalCancelled = orders.filter(
    (order: any) => order.status === "Cancelled"
  ).length;

  const [isOpen, setIsOpen] = useState(false);

  const handleTrackOrder = (orderId: string) => {
    router.push(`/dashboard/buyer/orders/tracking/${orderId}`);
  };

  const Orderahistory: OrderHistoryItem[] = [
    {
      title: "Unpaid",
      icon: Icon1,
      total: totalAwaitingPayment,
    },
    {
      title: "To be shipped",
      icon: Icon2,
      total: totalToShip,
    },
    {
      title: "Shipped",
      icon: Icon3,
      total: totalShipped,
    },
    {
      title: "Awaiting review",
      icon: Icon4,
      total: totalDelivered,
    },
  ];

  return (
    <div className="space-y-c24">
      <div className="flex justify-between">
        <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
          Orders
        </p>
        <Link
          href="/dashboard/buyer/orders"
          className="font-MontserratSemiBold text-ff715b text-sm leading-c20"
        >
          view all
        </Link>
      </div>
      <div className="flex gap-c48">
        {Orderahistory.map((item) => (
          <div key={item.title} className="h-fit w-fit relative  ">
            <div className="w-37.5 h-31.25 flex flex-col items-center justify-center gap-4 border border-ff715b rounded-c4 opacity-60">
              <Image
                src={item.icon}
                alt={item.title}
                width={30}
                height={30}
                className="h-7.5 w-7.5"
              />
              <p>{item.title}</p>
            </div>
            {item.total > 0 && (
              <div className="absolute -right-4 -top-3 w-10.25 h-10.25 rounded-full flex items-center justify-center bg-f50000 opacity-60">
                <p className="font-MontserratSemiBold text-base leading-c24 text-ffffff">
                  {item.total}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full">
        <h1 className="text-sm font-MontserratSemiBold leading-6.5 text-000000 opacity-32">
          Last orders
        </h1>
        <div className="w-full space-y-c24 mt-c32">
          {orders.slice(-2).map((item: OrderItem) => (
            <div key={item.id}>
              <div className="w-full flex justify-between mb-c32">
                <p className="text-sm font-MontserratNormal leading-c20 text-000000">
                  {item.status === "To Ship"
                    ? "Order is being processed"
                    : item.status === "Shipped"
                    ? "Order on its way"
                    : item.status === "Delivered"
                    ? "Order delivered"
                    : item.status === "Confirmed"
                    ? "Delivered"
                    : item.status === "Awaiting Confirmation"
                    ? "Awaiting payment"
                    : item.status}
                </p>
                <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                  {item.estimated_delivery_date || "pending"}
                </p>
              </div>
              <div className="w-full justify-between flex">
                <div className="flex gap-4 items-start">
                  <Image
                    src={item.items?.[0]?.product?.image || "/placeholder.png"}
                    alt={item.items?.[0]?.product?.name || "Product Image"}
                    width={96}
                    height={96}
                    className="rounded-lg"
                  />

                  <div className="w-full max-w-143.75">
                    <p className="font-MontserratSemiBold text-base leading-c24 pb-1 text-000000">
                      {item.items?.[0]?.product?.name}
                    </p>
                    <p className="font-MontserratMedium text-c12 leading-c16 pb-3 text-000000">
                      {item.manufacturer}
                    </p>
                    <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                      <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                        {item.items.length}PC, {item.items?.[0]?.variant?.color}
                      </span>
                    </div>
                    <p className="font-MontserratSemiBold text-c16 pt-3 leading-6.5">
                      ₦{item.total_price}
                    </p>
                  </div>
                </div>
                <div className="w-full max-w-70 space-y-4">
                  {item.status === "Shipped" && (
                    <>
                      <Button
                        variant="secondary"
                        key={item.id}
                        onClick={() => handleTrackOrder(item.id)}
                      >
                        Track order
                      </Button>
                      <Button onClick={() => setOpen(true)}>
                        Confirm delivery
                      </Button>
                    </>
                  )}

                  {item.status === "To Ship" && (
                    <>
                      <Button variant="secondary" className="">
                        Edit address
                      </Button>
                      <Button className="bg-red-500 text-white hover:bg-red-600">
                        Cancel order
                      </Button>
                    </>
                  )}

                  {item.status === "Delivered" && (
                    <>
                      <Button className="">Add to cart</Button>
                      <Button variant="secondary" className="">
                        Leave a review
                      </Button>
                    </>
                  )}

                  {item.status === "Awaiting Confirmation" && (
                    <>
                      <Button variant="secondary" className="">
                        Edit address
                      </Button>
                      <Button className="">Confirm & pay</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Did you receive this package?"
        description="Confirming helps us complete your order and improve service."
        onYes={() => console.log("Confirmed")}
        onNo={() => console.log("Cancelled")}
        yesText="Delete"
        noText="Cancel"
        className="w-full max-w-106.5 text-center"
      />
    </div>
  );
}
