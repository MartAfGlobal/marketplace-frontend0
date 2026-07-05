"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Download,
  Copy,
  CheckCircle2,
  MoreVertical,
  Edit,
} from "lucide-react";
import editIcon from "@/assets/admin/editIcon.svg";
import VerifiedIcon from "@/assets/admin/verified.svg";
import { Button } from "@/components/ui/Button/Button";
import copyIcon from "@/assets/admin/copyIcon.svg";
import Image from "next/image";
import { OrderProgress } from "@/app/dashboard/seller/orders/order-details/[id]/components/OrderProgress";

// Dummy product image
const dummyImg =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=80";

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = (params.id as string) || "304657846532";

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className=" bg-white rounded-2xl p-6   mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors"
        >
          <span className="h-6 w-6 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-black" />
          </span>
          <h1 className="text-c18 font-MontserratMedium">Order details</h1>
        </button>
        <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-[#df6b62]">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between lg:gap-c64 mb-c64 w-ful ">
        <div className="flex flex-col gap-3 w-full max-w-[309.33px] text-sm font-MontserratSemiBold">
          <div className="flex items-center gap-2 ">
            <span className="text-000000/68">Order ID:</span>
            <div className="flex items-center gap-2 font-MontserratSemiBold ">
              {orderId}{" "}
              <button
                onClick={() => handleCopy(orderId, "orderId")}
                className="h-4 w-4 flex items-center justify-center"
              >
                {copiedId === "orderId" ? (
                  <span className="text-xs  text-000000/68 font-MontserratNormal">
                    Copied!
                  </span>
                ) : (
                  <Image src={copyIcon} alt="Product" width={12} height={12} />
                )}
              </button>
            </div>
          </div>
          <div className=" font-MontserratNormal flex items-center md:justify-between gap-6">
            <span className="">Order date:</span>
            <span className="">May 15, 2025</span>
          </div>
          <div className="font-MontserratNormal flex items-center md:justify-between gap-6">
            <span className="">Total amount:</span>
            <span className="font-MontserratSemiBold ">₦15,000.00</span>
          </div>
          <div className="font-MontserratNormal flex items-center md:justify-between gap-6">
            <span className="">Order Status:</span>
            <span className="text-[12px] font-MontserratSemiBold bg-[#FFAC06]/12 text-000000/68 px-4 py-2 rounded-c16 w-fit">
              Unprocessed
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm font-MontserratNormal w-full max-w-[309.33px]">
          <div className="font-MontserratNormal flex items-center gap-2">
            <span className="font-MontserratSemiBold text-000000/68">
              Transaction ID:
            </span>
            <div className="flex items-center gap-2 font-MontserratSemiBold ">
              TNX-{orderId}{" "}
              <button
                onClick={() => handleCopy(`TNX-${orderId}`, "txId")}
                className="h-4 w-4 flex items-center justify-center"
              >
                {copiedId === "txId" ? (
                  <span className="text-xs  text-000000/68 font-MontserratNormal">
                    Copied!
                  </span>
                ) : (
                  <Image src={copyIcon} alt="Product" width={12} height={12} />
                )}
              </button>
            </div>
          </div>
          <div className="font-MontserratNormal flex items-center md:justify-between gap-6">
            <span className="">Payment date:</span>
            <span className="">May 15, 2025</span>
          </div>
          <div className="font-MontserratNormal flex items-center md:justify-between gap-6">
            <span className="">Payment Method:</span>
            <span className="">Card</span>
          </div>
          <div className="font-MontserratNormal flex items-center md:justify-between gap-6">
            <span className="">Payment Status:</span>
            <span className="text-[12px] font-MontserratSemiBold bg-[#2D7565]/12 text-[#2D7565] px-4 py-2 rounded-c16 w-fit">
              Paid
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-[309.33px] text-sm font-MontserratNormal">
          <Button className="">Track Order</Button>
          <Button className=" bg-[#C70000] hover:bg-[#a60000]  font-MontserratMedium text-sm transition-colors">
            Cancel order
          </Button>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Buyer Details */}
        <div className="flex flex-col w-full max-w-[309.33px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-MontserratSemiBold text-sm ">Buyer Details</h3>
            <button className="text-[12px] text-ff715b flex items-center gap-1 font-MontserratMedium">
              <span>Edit Address</span>{" "}
              <span className="w-6 h-6 flex justify-center items-center">
                <Image src={editIcon} alt="Edit" width={12} height={12} />
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 ">
            <div className="w-8 h-8 rounded-full  overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
                alt="Buyer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-MontserratSemiBold text-base ">
                Damian Chinonso
              </span>
              <div className="flex items-center gap-1 ">
                <span className="text-[12px]  font-MontserratSemiBold  text-2d7565">
                  Verified
                </span>
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={VerifiedIcon}
                    alt="Verified"
                    width={16}
                    height={20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm font-MontserratNormal  mt-3">
            <p>Email Address: deminonso@gmail.com</p>
            <p>Phone: +234 806 123 4567</p>
            <p className="">Delivery Address: 12 Umunna Street, Enugu</p>
          </div>

          <div className="flex gap-3 mt-3">
            <button className="flex-1 h-9 rounded-lg border border-[#df6b62] text-[#df6b62] font-MontserratMedium text-xs hover:bg-red-50 transition-colors">
              View Profile
            </button>
            <button className="flex-1 h-9 rounded-lg bg-[#0070E9] hover:bg-[#005bb5] text-white font-MontserratMedium text-xs transition-colors">
              Message Buyer
            </button>
          </div>
        </div>

        {/* Shipping details */}
        <div className="flex flex-col w-full max-w-[309.33px]">
          <h3 className="font-MontserratSemiBold text-sm mb-8">
            Shipping details
          </h3>

          <div className="flex flex-col gap-4 text-sm font-MontserratNormal ">
            <div className="flex  gap-1">
              <span className="text-nowrap">Shipping Address:</span>
              <span className="leading-relaxed">
                B23 Global estate HQ, Abuja.
              </span>
            </div>
            <div className="flex  gap-1">
              <span className="">Shipping Method:</span>
              <span>MartAf Express</span>
            </div>
            <div className="flex  gap-2">
              <span className="">Tracking Number:</span>
              <span className="text-ff715b font-MontserratSemiBold">
                NGN4829424982
              </span>
            </div>
          </div>
        </div>

        {/* Seller Details */}
        <div className="flex flex-col w-full max-w-[309.33px]">
          <h3 className="font-MontserratSemiBold text-sm mb-6">
            Seller Details
          </h3>

          <div className="flex items-center gap-3 mt-1">
            <div className="w-8 h-8 border-[0.27px] border-[#A2A2A2] rounded-full bg-[#F89F1C] flex items-center justify-center  overflow-hidden p-0.5 text-center">
              <span className="text-[3.2px] leading-[100%] font-MontserratBold">
                COMPANY LOGO
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-MontserratSemiBold text-base ">
                Chijoke LTD
              </span>
              <div className="flex items-center gap-1 ">
                <span className="text-[12px]  font-MontserratSemiBold  text-2d7565">
                  Verified
                </span>
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={VerifiedIcon}
                    alt="Verified"
                    width={16}
                    height={20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm font-MontserratNormal  mt-3">
            <p>Email Address: deminonso@gmail.com</p>
            <p>Phone: +234 806 123 4567</p>
            <p className="">Contact Address: 12 Umunna Street, Enugu</p>
          </div>

          <div className="flex gap-3 mt-3">
            <button className="flex-1 h-9 rounded-lg border border-[#df6b62] text-[#df6b62] font-MontserratMedium text-xs hover:bg-red-50 transition-colors">
              View Profile
            </button>
            <button className="flex-1 h-9 rounded-lg bg-[#0070E9] hover:bg-[#005bb5] text-white font-MontserratMedium text-xs transition-colors">
              Message Seller
            </button>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      <div className="mb-16">
        <OrderProgress order={{}} getMappedStatus={() => "unprocessed"} />
      </div>

      <div className="">
        {/* Order items */}
        <div>
          <h3 className="font-MontserratSemiBold text-sm  mb-8 leading-c20">
            Order items
          </h3>
          <div className="w-full flex gap-c56">
            <table className="w-full text-left max-w-[680px]">
              <thead>
                <tr className="bg-947fff text-white text-[12px] font-MontserratSemiBold h-10">
                  <th className="px-3 font-normal">SKU</th>
                  <th className="px-3 font-normal">Items</th>
                  <th className="px-3 font-normal">Unit price</th>
                  <th className="px-3 font-normal text-center">Qty</th>
                  <th className="px-3 font-normal">Total</th>
                  <th className="px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[11px] font-MontserratMedium">
                {[
                  {
                    sku: "NKB-XL",
                    img: dummyImg,
                    name: "Nike shoes xl fine blue",
                    price: "N1500",
                    qty: 2,
                    total: "N3000",
                  },
                  {
                    sku: "NKB-XL",
                    img: dummyImg,
                    name: "Cap red/black",
                    price: "N700",
                    qty: 2,
                    total: "N1400",
                  },
                  {
                    sku: "NKB-XL",
                    img: dummyImg,
                    name: "Earring diamond studded",
                    price: "N3500",
                    qty: 2,
                    total: "N7000",
                  },
                  {
                    sku: "HTB-XL",
                    img: dummyImg,
                    name: "Earring diamond studded",
                    price: "N3500",
                    qty: 2,
                    total: "N7000",
                  },
                ].map((item, index) => (
                  <tr
                    key={index}
                    className="h-[72px] text-sm font-MontserratNormal"
                  >
                    <td className="px-3 font-MontserratMedium ">{item.sku}</td>
                    <td className="px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md overflow-hidden  flex-shrink-0">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-3 ">{item.price}</td>
                    <td className="px-3 text-center ">{item.qty}</td>
                    <td className="px-3 font-MontserratSemiBold ">
                      {item.total}
                    </td>
                    <td className="px-3 text-gray-400">
                      <button className="0">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-2 w-full max-w-[320px]">
              <h3 className="font-MontserratSemiBold text-sm  mb-6">
                Order Summary
              </h3>
              <div className="flex flex-col gap-3 text-sm font-MontserratNormal">
                <div className="flex justify-between items-center">
                  <span>Total Amount</span>
                  <span className="">N18,400</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total items</span>
                  <span className="">8</span>
                </div>
                <div className="flex justify-between items-center text-ca0202">
                  <span>Discounts</span>
                  <span>-N2,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="">N16,400</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Fee</span>
                  <span className="">N5,000</span>
                </div>

                <div className="pt-6 mt-2">
                  <div className="flex justify-between items-center">
                    <span>Grand Total</span>
                    <span className="text-[32px] font-MontserratSemiBold ">
                      N21,400
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
      </div>
    </div>
  );
}
