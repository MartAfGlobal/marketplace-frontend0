"use client";

import Image from "next/image";
import CustomersIcocn from "@/assets/Seller/customer.png";
import inactiveCustomersIcon from "@/assets/Seller/customerWhite.png";
import UsableCard from "./cardUse";
import greenPointerIcon from "@/assets/Seller/greenPointer.png";
import Custermer1 from "@/assets/Seller/customer1.png";
import Custermer2 from "@/assets/Seller/customer2.png";
import PointerUp from "@/assets/Seller/WhitePointer.png";
import Custermer3 from "@/assets/Seller/customer3.png";
import Custermer4 from "@/assets/Seller/customer4.png";
import { useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { getChangeDirection, getChangeValue, getMetricArray, getMetricChange, getMetricSection, getMetricTotal, toMetricNumber } from "../overview-data";

export default function CustomerCard({ analytics }: { analytics: any }) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const customerSection = getMetricSection(analytics, "customers");
  const totalCustomers = getMetricTotal(analytics, "customers", ["distinct_paying_customers", "paying_customer_count"]);
  const change = getMetricChange(analytics, "customers");
  const topCustomers = getMetricArray(customerSection, "top_customers", "topCustomers", "customers").slice(0, 4);
  const overflowCount = Math.max(
    0,
    toMetricNumber(
      customerSection.overflow_count ??
        customerSection.overflowCount ??
        analytics?.overflow_count ??
        totalCustomers - topCustomers.length,
    ),
  );
  const customerAvatars = [Custermer1, Custermer2, Custermer3, Custermer4];
  const getCustomerAvatar = (customer: any, index: number) =>
    customer?.avatar_url ?? customer?.avatar ?? customer?.profile_image ?? customer?.image_url ?? customerAvatars[index];
  const getCustomerName = (customer: any) => customer?.name ?? customer?.full_name ?? customer?.customer_name ?? "Top customer";

  return (
    <>
      {/* Mobile Card */}
      <div className="lg:hidden bg-white rounded-c16 p-4  flex flex-col justify-between h-fit min-h-42 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-000000 text-base font-MontserratNormal mb-4">Customers</p>
          <div className="flex items-center gap-2 ">
            <h2 className="text-000000 text-2xl font-MontserratSemiBold">{totalCustomers.toLocaleString()}</h2>
            <div className="flex items-center justify-center ">
              <Image
                src={getChangeDirection(change) === "up" ? greenPointerIcon : PointerUp}
                alt={`Customers ${getChangeDirection(change)} ${getChangeValue(change)} vs yesterday`}
                width={16}
                height={9}
                className={getChangeDirection(change) === "down" ? "rotate-180" : ""}
              />
            </div>
          </div>
        </div>
        <div className="absolute h-26 w-26  -bottom-10 right-0 opacity-[0.08]">
          <Image src={CustomersIcocn} alt="customers" width={100} height={100} />
        </div>
      </div>

      {/* Desktop Card */}
      <div className="hidden lg:block">
        {isIncomplete ? (
          <UsableCard title="Customers">
            <div className="flex gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-fit w-fit flex-shrink-0">
                  <Image src={inactiveCustomersIcon} alt="box" width={19.5} height={19.5} />
                </div>
                <p className="text-c32 font-MontserratSemiBold text-000000/10">0</p>
              </div>
              <div className="w-fit h-fit flex-shrink-0 mt-4">
                <Image src={PointerUp} alt="green pointer" width={18} height={10} />
              </div>
            </div>
            <div className="w-40 h-19 relative mt-6 text-000000/10">
              <h1 className="font-MontserratMedium text-c12">Top customers</h1>
              <div className="h-12 w-12 text-c12 font-MontserratMedium rounded-full flex items-center justify-center bg-gray-100 text-000000/10 left-0 z-30 absolute bottom-0 ">
                <span>0</span>
              </div>
            </div>
          </UsableCard>
        ) : (
          <UsableCard title="Customers">
            <div className="flex gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-fit w-fit flex-shrink-0">
                  <Image src={CustomersIcocn} alt="box" width={19.5} height={19.5} />
                </div>
                <p className="text-c32 font-MontserratSemiBold">{totalCustomers.toLocaleString()}</p>
              </div>
              <div className="w-fit h-fit flex-shrink-0 mt-4">
                <Image
                  src={getChangeDirection(change) === "up" ? greenPointerIcon : PointerUp}
                  alt={`Customers ${getChangeDirection(change)} ${getChangeValue(change)} vs yesterday`}
                  width={18}
                  height={10}
                  className={getChangeDirection(change) === "down" ? "rotate-180" : ""}
                />
              </div>
            </div>
            <div className="w-40 h-19 relative mt-6">
              <h1 className="font-MontserratMedium text-c12">Top customers</h1>
              {topCustomers.map((customer: any, index: number) => (
                <div
                  key={customer.id ?? customer.customer_id ?? index}
                  className={`h-fit w-fit rounded-full absolute bottom-0 ${["z-30", "left-7 z-20", "left-14 z-10", "right-7"][index]}`}
                >
                  <Image
                    src={getCustomerAvatar(customer, index)}
                    alt={getCustomerName(customer)}
                    height={48}
                    width={48}
                    unoptimized
                  />
                </div>
              ))}
              <div className="h-12 w-12 text-c12 font-MontserratMedium rounded-full flex items-center justify-center bg-gray-200 text-000000 right-0 z-30 absolute bottom-0 ">
                <span>+{overflowCount}</span>
              </div>
            </div>
          </UsableCard>
        )}
      </div>
    </>
  );
}
