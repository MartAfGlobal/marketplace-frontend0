"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import CustomersIcocn from "@/assets/Seller/customer.png";
import Custermer1 from "@/assets/Seller/customer1.png";

export default function CustomersCards() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);

  const items = [
    { id: "total", title: "Total Customers", value: isIncomplete ? "0" : "400", icon: CustomersIcocn },
    { id: "active", title: "Active Customers", value: isIncomplete ? "0" : "200", icon: CustomersIcocn },
    { id: "repeat", title: "Repeat Customers", value: isIncomplete ? "0" : "50", icon: CustomersIcocn },
    { id: "new", title: "New Customers", value: isIncomplete ? "0" : "20", icon: CustomersIcocn },
    { id: "top", title: "Top Spenders", value: isIncomplete ? "₦0" : "₦400,000", avatar: Custermer1 },
  ];

  return (
    <>
      {/* Desktop Metrics Bar (Orders Analytics pattern) */}
      <div className="w-full hidden lg:flex lg:items-center lg:bg-ffffff lg:py-8 lg:px-c48 lg:gap-c48 lg:justify-center lg:rounded-c16 circle-shadow">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`
              flex-1 flex flex-col justify-between relative min-h-[90px]
              ${index !== items.length - 1 ? "lg:border-r lg:border-r-000000/10 lg:pr-c32" : ""}
            `}
          >
            <p className="font-MontserratNormal text-000000/68 text-sm leading-none">
              {item.title}
            </p>
            <div className="flex items-center gap-2.5 mt-4">
              {item.avatar ? (
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={item.avatar} alt="avatar" width={48} height={48} className="object-cover" />
                </div>
              ) : (
                <div className="h-fit w-fit flex-shrink-0">
                  <Image src={item.icon!} alt="icon" width={19.5} height={19.5} />
                </div>
              )}
              <p className={`text-c32 font-MontserratNormal leading-none ${isIncomplete ? "text-000000/10" : "text-000000"}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet Metrics Grid (Clean, responsive and space-efficient) */}
      <div className="grid grid-cols-2 lg:hidden w-full gap-4 justify-center">
        {items.map((item, index) => {
          const isTopSpender = item.id === "top";
          return (
            <div
              key={item.id}
              className={`
                bg-white p-5 rounded-c16 circle-shadow flex flex-col justify-between
                ${isTopSpender ? "col-span-2 flex-row items-center gap-4 py-4" : "col-span-1 min-h-[120px]"}
              `}
            >
              <div>
                <p className="font-MontserratNormal text-000000/32 text-sm">
                  {item.title}
                </p>
                {!isTopSpender && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-fit w-fit flex-shrink-0">
                      <Image src={item.icon!} alt="icon" width={19.5} height={19.5} />
                    </div>
                    <p className={`text-2xl font-MontserratSemiBold ${isIncomplete ? "text-000000/10" : "text-000000"}`}>
                      {item.value}
                    </p>
                  </div>
                )}
              </div>
              {isTopSpender && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={item.avatar!} alt="avatar" width={40} height={40} className="object-cover" />
                  </div>
                  <p className={`text-xl font-MontserratSemiBold ${isIncomplete ? "text-000000/10" : "text-000000"}`}>
                    {item.value}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
