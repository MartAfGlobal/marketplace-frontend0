import Image from "next/image";

import TotalOrderIcon from "@/assets/Seller/plane.png";
import Unprocessed from "@/assets/Seller/unprocessedIcon.png";
import FufilledIcon from "@/assets/Seller/fufilledIcon.png";
import CancelIcon from "@/assets/Seller/cancelledIcon.png";

export default function AnalyticsHeader() {
  const items = [
    {
      title: "Total orders",
      price: "400",
      icon: TotalOrderIcon,
    },
    {
      title: "Unprocessed orders",
      price: "200",
      icon: Unprocessed,
    },
    {
      title: "Fulfilled orders",
      price: "50",
      icon: FufilledIcon,
    },
    {
      title: "Delivered orders",
      price: "400",
      icon: TotalOrderIcon,
    },
    {
      title: "Cancelled orders",
      price: "400",
      icon: CancelIcon,
    },
  ];

  return (
    <div className="w-full flex items-center bg-ffffff p-6 gap-c32 justify-center rounded-c16">
      {items.map((item, index) => (
        <div
          key={item.title}
          className={`pr-c32 w-fit h-17 space-y-2 ${
            index !== items.length - 1 ? "border-r border-r-000000/20" : ""
          }`}
        >
          <p className="font-MontserratNormal text-000000/32 text-sm">
            {item.title}
          </p>
          <div className="flex items-center gap-2">
            <div>
              <Image src={item.icon} width={24} height={24} alt={item.title} />
            </div>
            <p className="font-MontserratNormal text-c32">{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
