"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserAddressProps } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";

// icons

import NavBack from "@/assets/icons/navBacksmall.png";

export default function AllAddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddressProps[]>([
    {
      id: 1,
      icon: "/icons/home.svg", // ✅ add a valid path or value
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 2,
      icon: "/icons/work.svg", // ✅ also add here
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 3,
      icon: "/icons/work.svg", // ✅ also add here
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 4,
      icon: "/icons/work.svg", // ✅ also add here
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 5,
      icon: "/icons/work.svg", // ✅ also add here
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 6,
      icon: "/icons/work.svg", // ✅ also add here
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 7,
      icon: "/icons/work.svg", // ✅ also add here
      name: "Chisom Ebube Chris",
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(
    addresses.length > 0 ? addresses[0].id : null
  );

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div className="w-full px-c24 flex flex-col gap-7">
      <button
        onClick={router.back}
        className="flex items-center gap-4 mt-3 md:mt-c32"
      >
        <Image
          src={NavBack}
          alt="<"
          width={9}
          height={16.5}
          className="brightness-20 w-2.25 h-[16.5px]"
        />
        <p className="font-MontserratSemiBold text-c16 text-161616">
          Shipping addresses
        </p>
      </button>
     <div className=" w-full pb-25 space-y-3">
       {addresses.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <motion.div
            key={item.id}
            onClick={() => handleSelect(item.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`w-full p-4  h-39.5 rounded-2xl border border-000000/20  circle-shadow  shadow-sm cursor-pointer transition-colors flex  items-center ${
              isSelected ? "bg-6a0dad text-white" : "b text-black"
            }`}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid",
                  borderImageSource:
                    "linear-gradient(0deg, #000000, #000000), linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88))",
                }}
                animate={{
                  backgroundColor: isSelected ? "" : "transparent",
                }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-ffffff text-c10 font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex-1">
                <p className="font-MontserratSemiBold text-c12">{item.name}</p>
                <p className="text-c12 font-MontserratNormal">{item.phoneNo}</p>
                <p className="text-c12 font-MontserratNormal">{item.address}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    className={`text-ffaco6 text-c12 font-MontserratSemiBold ${
                      isSelected ? "text-ffffff" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/addresses/edit/${item.id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={`text-c12 font-MontserratSemiBold text-ca0202 ${
                      isSelected ? "text-ffffff" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
     </div>
      
      <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
        <Button
          onClick={() => router.push("/cart/mobile/addresses/add-address")}
          className="border-0"
        >
          + Add new address
        </Button>
      </div>
    </div>
  );
}
