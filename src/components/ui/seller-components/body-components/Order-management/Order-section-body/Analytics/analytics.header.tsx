"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { useMemo } from "react";

import TotalOrderIcon from "@/assets/Seller/plane.png";
import Unprocessed from "@/assets/Seller/unprocessedIcon.png";
import FufilledIcon from "@/assets/Seller/fufilledIcon.png";
import CancelIcon from "@/assets/Seller/cancelledIcon.png";
import FaintDropIcon from "@/assets/Seller/faint-drop.svg";
import FaintInreaseIcon from "@/assets/Seller/faint-increase.svg";
import FaintOrderAirplaneIcon from "@/assets/Seller/faintAiplane.svg";

export default function AnalyticsHeader({
  period = "This Year",
}: {
  period?: string;
}) {
  const orders = useSelector((state: any) => state.orders.orders);

  const stats = useMemo(() => {
    const now = new Date();

    // Filter orders by period
    const filteredByPeriod = orders.filter((order: any) => {
      const d = new Date(order.created_at);
      if (period === "This Year") {
        return d.getFullYear() === now.getFullYear();
      }
      if (period === "This Month") {
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth()
        );
      }
      if (period === "This Week") {
        const diffMs = now.getTime() - d.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      return true;
    });

    const total = filteredByPeriod.length;

    const unprocessed = filteredByPeriod.filter((o: any) => {
      const stage = (o.order_timeline_stage || o.status || "").toLowerCase();
      return (
        stage === "unprocessed" ||
        stage === "pending" ||
        stage === "awaiting acceptance"
      );
    }).length;

    const fulfilled = filteredByPeriod.filter((o: any) => {
      const stage = (o.order_timeline_stage || o.status || "").toLowerCase();
      return (
        stage === "fulfilled" || stage === "shipped" || stage === "in transit"
      );
    }).length;

    const delivered = filteredByPeriod.filter((o: any) => {
      const stage = (o.order_timeline_stage || o.status || "").toLowerCase();
      return stage === "delivered";
    }).length;

    const cancelled = filteredByPeriod.filter((o: any) => {
      const stage = (o.order_timeline_stage || o.status || "").toLowerCase();
      return (
        stage === "cancelled" || stage === "rejected" || stage === "returned"
      );
    }).length;

    return { total, unprocessed, fulfilled, delivered, cancelled };
  }, [orders, period]);

  const items = [
    {
      title: "Total orders",
      price: String(stats.total),
      icon: TotalOrderIcon,
    },
    {
      title: "Unprocessed orders",
      price: String(stats.unprocessed),
      icon: Unprocessed,
    },
    {
      title: "Fulfilled orders",
      price: String(stats.fulfilled),
      icon: FufilledIcon,
    },
    {
      title: "Delivered orders",
      price: String(stats.delivered),
      icon: TotalOrderIcon,
    },
    {
      title: "Cancelled orders",
      price: String(stats.cancelled),
      icon: CancelIcon,
    },
  ];

  return (
    <>
      <div className="w-full hidden   md:flex md:items-center md:bg-ffffff md:p-6 md:gap-c32 md:justify-center md:rounded-c16">
        {items.map((item, index) => (
          <div
            key={item.title}
            className={`
            bg-ffffff md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 flex flex-col justify-between relative min-h-[120px] md:min-h-0
            ${index === 0 ? "col-span-2 max-md:min-h-[160px] max-md:p-5 max-md:circle-shadow overflow-hidden md:overflow-visible" : "col-span-1 max-md:min-h-[130px] max-md:p-4 max-md:circle-shadow overflow-hidden md:overflow-visible"}
            ${index !== items.length - 1 ? "md:border-r md:border-r-000000/20 md:pr-c32" : ""}
          `}
          >
            <p className="font-MontserratNormal text-000000/32 text-sm max-md:text-[#161616]/30 max-md:text-[11px] z-10">
              {item.title}
            </p>
            <div className="flex md:items-center gap-2 mt-4 md:mt-2 z-10 max-md:mt-0">
              <div className="hidden md:block">
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.title}
                />
              </div>
              <div className="flex items-center gap-1">
                <p
                  className={`font-MontserratNormal text-c32 max-md:text-[#161616]/80 ${index === 0 ? "max-md:text-4xl" : "max-md:text-3xl"}`}
                >
                  {item.price}
                </p>
                <span className="md:hidden flex flex-col leading-none text-[#161616]/15 text-xl ml-1">
                  <span style={{ fontSize: "10px" }}>▲</span>
                  <span style={{ fontSize: "10px" }}>▼</span>
                </span>
              </div>
            </div>
            <div className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 opacity-10 z-0 pointer-events-none">
              <Image
                src={item.icon}
                width={index === 0 ? 100 : 72}
                height={index === 0 ? 100 : 72}
                alt={item.title}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="md:hidden  ">
        <div className="w-full relative bg-ffffff h-69.25 rounded-c16 p-6 md:hidden">
          <div>
            <p
              className="font-MontserratNormal text-base text-000000/12
         "
            >
              Total orders
            </p>
          </div>
          <div className="mt-3 flex gap-3 items-center">
            <span className="font-MontserratMedium text-c32 ">
              {orders.length}
            </span>
            <div className="flex flex-col gap-1">
              <Image
                src={FaintInreaseIcon}
                alt="high"
                width={16.5}
                height={16}
              />
              <Image src={FaintDropIcon} alt="low" width={16.5} height={16} />
            </div>
          </div>
          <div className="absolute z-10 h-fit w-fit right-0 bottom-0">
            <Image
              src={FaintOrderAirplaneIcon}
              alt="orders"
              width={112.51}
              height={112.51}
              className="opacity-20"
            />
          </div>
        </div>
        <div className ="flex gap-4 mt-6 items-center h-fit ">
          <div className=" w-full relative bg-ffffff h-42 rounded-c16 p-6 md:hidden">
            <div className="">
              <p
                className="font-MontserratNormal text-base text-000000/12
         "
              >
                Unprocessed
              </p>

              <div className="mt-3 flex gap-3 items-center">
                <span className="font-MontserratMedium text-c32 ">
                  {stats.unprocessed}
                </span>
                <div className="flex flex-col gap-1">
                  <Image
                    src={FaintInreaseIcon}
                    alt="high"
                    width={16.5}
                    height={16}
                  />
                  <Image
                    src={FaintDropIcon}
                    alt="low"
                    width={16.5}
                    height={16}
                  />
                </div>
              </div>
            </div>
            <div className="absolute z-10 right-5 bottom-[23.5px]">
              <Image
                src={Unprocessed}
                alt="unprocessed"
                width={48}
                height={48}
                className="opacity-20"
              />
            </div>
          </div>
          <div className=" mt-6 w-full relative bg-ffffff h-42 rounded-c16 p-6 md:hidden">
            <div className="">
              <p
                className="font-MontserratNormal text-base text-000000/12
         "
              >
                Fulfilled
              </p>

              <div className="mt-3 flex gap-3 items-center">
                <span className="font-MontserratMedium text-c32 ">
                  {stats.fulfilled}
                </span>
              
              </div>
            </div>
            <div className="absolute z-10 right-5 bottom-[23.5px]">
              <Image
                src={FufilledIcon}
                alt="unprocessed"
                width={48}
                height={48}
                className="opacity-20"
              />
            </div>
          </div>
        </div>
        <div className ="flex gap-4 mt-6items-center h-fit">
          <div className=" w-full relative bg-ffffff h-42 rounded-c16 p-6 md:hidden">
            <div className="">
              <p
                className="font-MontserratNormal text-base text-000000/12
         "
              >
                Unprocessed
              </p>

              <div className="mt-3 flex gap-3 items-center">
                <span className="font-MontserratMedium text-c32 ">
                  {stats.unprocessed}
                </span>
                <div className="flex flex-col gap-1">
                  <Image
                    src={FaintInreaseIcon}
                    alt="high"
                    width={16.5}
                    height={16}
                  />
                  <Image
                    src={FaintDropIcon}
                    alt="low"
                    width={16.5}
                    height={16}
                  />
                </div>
              </div>
            </div>
            <div className="absolute z-10 right-5 bottom-[23.5px]">
              <Image
                src={Unprocessed}
                alt="unprocessed"
                width={48}
                height={48}
                className="opacity-20"
              />
            </div>
          </div>
          <div className=" mt-6 w-full relative bg-ffffff h-42 rounded-c16 p-6 md:hidden">
            <div className="">
              <p
                className="font-MontserratNormal text-base text-000000/12
         "
              >
                Fulfilled
              </p>

              <div className="mt-3 flex gap-3 items-center">
                <span className="font-MontserratMedium text-c32 ">
                  {stats.fulfilled}
                </span>
              
              </div>
            </div>
            <div className="absolute z-10 right-5 bottom-[23.5px]">
              <Image
                src={FufilledIcon}
                alt="unprocessed"
                width={48}
                height={48}
                className="opacity-20"
              />
            </div>
          </div>
        </div>
      </div> 
    </>
  );
}
