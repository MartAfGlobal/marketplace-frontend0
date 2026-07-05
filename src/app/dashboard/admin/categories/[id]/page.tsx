"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download, MoreVertical, CheckCircle2, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";
import ProductImage from "@/assets/admin/productMainImage.svg";

// Mock subcategories for the table
const mockSubcategories = Array.from({ length: 5 }, (_, i) => ({
  id: `SUB-${i}`,
  name: "Men's Wear",
  attributes: "Size • Colour • +1",
  productsCount: 12,
  status: i % 2 === 0 ? "Active" : "Hidden",
  date: "18/9/2016",
}));

export default function AdminCategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const isSubcategory = categoryId.startsWith("SUB");
  const name = isSubcategory ? "Men's Wear" : "Category Name";
  const [isActive, setIsActive] = useState(true);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors"
        >
          <span className="h-6 w-6 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-black" />
          </span>
          <h1 className="text-c18 font-MontserratMedium">Category Details</h1>
        </button>
        <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-[#df6b62]">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white p-6 rounded-c16 ">
        {/* Left Column: Image & View All */}
        <div className={`flex flex-col lg:flex-row gap-8 ${isSubcategory ? "mb-c48": "mb-6 "}`}>
          <div className="w-full lg:w-[50%] flex flex-col gap-8">
            <div className=" w-full h-90 max-w-128  overflow-hidden relative">
              {/* Fallback dummy image since we don't have the exact asset */}
              <Image
                src={ProductImage}
                alt="category image"
                width={512}
                height={360}
                className="object-cover h-90"
              />
            </div>
            <div className="border h-19 border-000000/12 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-MontserratSemiBold leading-5 pb-4">
                  Products Count <span className="text-000000/44 ">(24)</span>
                </p>
                <p className="text-c12  font-MontserratNormal">
                  View all products in the category
                </p>
              </div>
              <Button variant="secondary" className="max-w-30">
                View all
              </Button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full lg:w-[50%] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="font-MontserratSemiBold text-c18 ">
                  {name}
                </span>
                <span
                  className={`px-4 py-1.5 w-20 h-8 flex items-center justify-center rounded-c16 text-xs font-MontserratSemiBold ${isActive ? "bg-2d7565/12 text-2d7565" : "bg-ca0202/12 text-ca0202"}`}
                >
                  {isActive ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-MontserratSemiBold text-base ">Hide</span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`w-11.5 h-6 rounded-[64px] flex items-center p-0.5 transition-colors ${!isActive ? "bg-gray-300" : "bg-gray-100"}`}
                >
                  <motion.div
                    animate={{ x: !isActive ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-[0px_3px_8px_0px_#6A0DAD14]"
                  />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-MontserratSemiBold text-sm leading-5 text-black mb-3">
                Category Description
              </h3>
              <p className="text-c12 font-MontserratNormal leading-4">
                Lorem ipsum dolor sit amet consectetur. Et id in non arcu eu
                elit facilisi ut tellus. Habitant pellentesque turpis turpis vel
                vitae vestibulum. Congue nunc tempus eget mi. Placerat laoreet
                in ultricies at. Lorem hac pharetra ullamcorper maecenas purus.
                Et ornare sollicitudin eget est volutpat fames dictumst
                scelerisque mattis. Dui scelerisque fermentum sapien cras id
                dignissim aenean. Etiam ultrices sed diam odio ligula ornare
                augue posuere. Consequat morbi platea viverra ut aliquet
                commodo.
              </p>
            </div>

            <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6">
              {isSubcategory && (
                <div className=" px-4 flex flex-col gap-4 py-3 lg:flex-shrink-0 border-r border-gray-200 max-w-[170.67px]">
                  <h4 className="text-base font-MontserratSemiBold ">
                    Parent Category
                  </h4>
                  <p className="text-c12 font-MontserratNormal ">Fashion</p>
                </div>
              )}

              <div className= {`w-full max-w-66 px-4 py-3 flex flex-col gap-4 border-r-2 border-r-000000/12 ${isSubcategory ? "max-w-[170.67px]": "max-w-66 "}`}>
                <h4 className="text-base font-MontserratSemiBold ">
                  Date Created
                </h4>
                <p className="text-c12 font-MontserratNormal ">
                  12/12/2025
                </p>
              </div>
              <div className={`w-full px-4 py-3 flex flex-col gap-4 ${isSubcategory ? "max-w-[170.67px]": "max-w-66 "}`}>
                <h4 className="text-base font-MontserratSemiBold ">
                  Last Updated
                </h4>
                <p className="text-c12 font-MontserratNormal ">
                  12/12/2025
                </p>
              </div>
            </div>

            <div className=" text-c12 font-MontserratNormal flex border border-000000/12 rounded-c4 mb-5">
              <div className=" flex flex-col gap-4 w-full max-w-50 border-r  px-4 py-3 border-r-000000/12">
                <h1 className="font-MontserratSemiBold text-sm leading-5">
                  Attributes
                </h1>
                <p>Colour</p>
                <p>Size</p>
                <p>Material</p>
              </div>
              <div className="w-full px-4 py-3 flex-col flex gap-4">
                <h1 className="font-MontserratSemiBold text-sm ">
                  Value
                </h1>
                <div className="">Red • Blue • Blue • Blue</div>
                <div className="">37 • 38 • 39 • 40</div>
                <div className="">Silk • Polyester • Cotton • Wool</div>
              </div>
            </div>
          </div>
        </div>
        {!isSubcategory && (
          <div className="bg-white rounded-[4px] px-4 py-3  border border-000000/12  max-w-228 mb-c48">
            <h3 className="font-MontserratSemiBold text-lg text-black mb-6">
              Subcategory{" "}
              <span className="text-gray-500 font-MontserratMedium text-base">
                (8)
              </span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
                    <th className="p-3 font-MontserratNormal text-sm">Subcategory Name</th>
                    <th className="p-3 font-MontserratNormal text-sm">Attributes</th>
                    <th className="p-3 font-MontserratNormal text-sm">Products Count</th>
                    <th className="p-3 font-MontserratNormal text-sm">Status</th>
                    <th className="p-3 font-MontserratNormal text-sm">Date Created</th>
                    <th className="p-3 font-MontserratNormal text-sm text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[11px] text-gray-700 font-MontserratMedium">
                  {mockSubcategories.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-gray-50/50 transition-colors h-14"
                    >
                      <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=80"
                              alt={sub.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="block truncate" title={sub.name}>
                            {sub.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <span className="block max-w-[10rem] truncate" title={sub.attributes}>{sub.attributes}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {sub.productsCount}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {sub.status === "Active" ? (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 text-green-600 bg-green-50 text-[10px] font-MontserratMedium w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50 text-[10px] font-MontserratMedium w-fit">
                              <EyeOff className="w-3 h-3" /> Hidden
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{sub.date}</td>
                      <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer ml-auto mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRowId(activeRowId === sub.id ? null : sub.id);
                          }}
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        <AnimatePresence>
                          {activeRowId === sub.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute right-8 mt-2 w-36 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-50 py-2 flex flex-col items-start font-MontserratMedium text-xs text-[#161616] overflow-hidden"
                            >
                              <Link
                                href={`/dashboard/admin/categories/${sub.id}`}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Details
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 justify-end mt-auto">
          <button className="h-12 w-40 border border-[#df6b62] text-[#df6b62] rounded-xl font-MontserratSemiBold hover:bg-red-50 transition-colors">
            Edit
          </button>
          <button className="h-12 w-40 bg-[#cc0b0b] text-white rounded-xl font-MontserratSemiBold hover:bg-[#b00909] transition-colors">
            Delete
          </button>
        </div>
      </div>

      {/* Conditional Subcategory Table (Only for Main Categories) */}
    </div>
  );
}
