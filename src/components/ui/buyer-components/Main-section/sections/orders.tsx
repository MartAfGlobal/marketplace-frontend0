"use client";

import Image from "next/image";
import Icon1 from "@/assets/icons/user-dashboard/orderHistory/icon1.svg";
import Icon2 from "@/assets/icons/user-dashboard/orderHistory/icon2.png";
import Icon3 from "@/assets/icons/user-dashboard/orderHistory/icon3.png";
import Icon4 from "@/assets/icons/user-dashboard/orderHistory/icon4.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";


import { useState } from "react";
import { OrderHistoryItem } from "@/types/global";
import { TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";


export default function Orders() {

  const [isOpen, setIsOpen] = useState(false)
 
  const Orderahistory: OrderHistoryItem[] = [
    {
      title: "Unpaid",
      icon: Icon1, // if Icon1 is imported image, use StaticImageData type
      total: "1",
    },
    {
      title: "To be shipped",
      icon: Icon2, // if Icon1 is imported image, use StaticImageData type
      total: "2",
    },
    {
      title: "Shipped",
      icon: Icon3, // if Icon1 is imported image, use StaticImageData type
      total: "12",
    },
    {
      title: "Awaiting review",
      icon: Icon4, // if Icon1 is imported image, use StaticImageData type
      total: "4",
    },
  ];

  const trackOrders: TrackOrders[] = [
    {
      id: 1,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
    {
      id: 2,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
  ];

  return (
    <div className="space-y-c24">
      <div className="flex justify-between">
        <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
          Orders
        </p>
        <Link href="/dashboard/buyer/orders" className="font-MontserratSemiBold text-ff715b text-sm leading-c20">
          view all
        </Link>
      </div>
      <div className="flex gap-c48">
        {Orderahistory.map((item) => (
          <div key={item.title} className="h-fit w-fit relative  ">
            <div className="w-37.5 h-31.25 flex flex-col items-center justify-center gap-4 border border-ff715b rounded-c4 opacity-60">
              <Image src={item.icon} alt={item.title} />
              <p>{item.title}</p>
            </div>
            <div className="absolute -right-4 -top-3 w-10.25 h-10.25 rounded-full flex items-center justify-center bg-f50000 opacity-60  ">
              <p className="font-MontserratSemiBold text-base leading-c24 text-ffffff">
                {item.total}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full">
        <h1 className="text-sm font-MontserratSemiBold leading-6.5 text-000000 opacity-32">
          Last orders
        </h1>
        <div className="w-full space-y-c24 mt-c32">
          {trackOrders.map((item) => (
            <div key={item.id}>
              <div className="w-full flex justify-between mb-c32">
                <p className="text-sm font-MontserratNormal leading-c20 text-000000">
                  Order on its way
                </p>
                <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                  {item.date}
                </p>
              </div>
              <div className="w-full justify-between flex">
                <div className="flex gap-4 items-start">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={96}
                    height={96}
                  />
                  <div className="w-full max-w-143.75">
                    <p className="font-MontserratSemiBold text-base leading-c24 pb-1 text-000000">
                      {item.title}
                    </p>
                    <p className="font-MontserratMedium text-c12 leading-c16 pb-3 text-000000">
                      {item.discription}
                    </p>
                    <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                      <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                        {item.totalQuantity}PC, {item.colour}
                      </span>
                    </div>
                    <p className="font-MontserratSemiBold text-c16 pt-3 leading-6.5">
                      ₦{item.totalAmount}
                    </p>
                  </div>
                </div>
                <div className="w-full max-w-70 space-y-4">
                  <Button className="bg-transparent border border-ff715b text-ff715b">
                    Track order
                  </Button>
                  <Button onClick={()=> setIsOpen(true)}> Confirm delivery</Button>
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
