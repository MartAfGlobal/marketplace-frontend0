"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import AddressModal from "@/components/ui/Modals/new-address-modal"; // adjust path
import { UserAddressProps, Address } from "@/types/global";
import { twMerge } from "tailwind-merge";

// Example icons
import AddcardBtn from "@/assets/icons/user-dashboard/atm-cards/plus.png";
import ActiveCardBtn from "@/assets/icons/user-dashboard/atm-cards/activeButton.png";
import SelectorBtn from "@/assets/icons/user-dashboard/atm-cards/SelectorButton.png";

export default function UserAddress({ className }: { className?: string }) {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    Partial<Address> | undefined
  >(undefined);

  const addressProp: UserAddressProps[] = [
    {
      id: 1,
      name: "Chisom Ebube Chris",
      icon: ActiveCardBtn,
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 2,
      name: "Chisom Ebube Chris",
      icon: ActiveCardBtn,
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
    {
      id: 3,
      name: "Chisom Ebube Chris",
      icon: ActiveCardBtn,
      phoneNo: "+2347034562314",
      address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    },
  ];

  const cardVariants: Variants[] = [
    {
      hidden: { x: -100, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    {
      hidden: { y: 100, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    {
      hidden: { x: 100, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
  ];

  const handleSelectBtn = (id: number) => setSelectedCardId(id);

  const handleEditAddress = (item: UserAddressProps) => {
    setEditingAddress({
      fullName: item.name,
      mobile: item.phoneNo,
      street: item.address,
      // add other fields if needed
      defaultAddress: false,
      country: "",
      state: "",
      city: "",
      zip: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="pb-c32 flex justify-between">
        <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
          Addresses
        </p>
          <button className="font-MontserratSemiBold text-sm text-ff715b">View all</button>
      </div>
      <div className={`flex w-full gap-6 flex-wrap `}>
        {addressProp.map((item, idx) => {
          const isSelected = item.id === selectedCardId;
          const variant = cardVariants[idx % cardVariants.length];

          return (
            <motion.div
              key={item.id}
              onClick={() => handleEditAddress(item)}
              variants={variant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={twMerge(
                "p-c24 h-34.5 w-80.75 rounded-c12 flex gap-2 bg-gree flex-col cursor-pointer relative transition-colors duration-300",
                isSelected
                  ? "bg-black text-ffffff shadow-inner"
                  : "bg-black/20 text-black shadow",
                className 
              )}
            >
              <div className="flex justify-between items-center">
                <p className="font-MontserratSemiBold text-c12 leading-c16">
                  {item.name}
                </p>
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={isSelected ? ActiveCardBtn : SelectorBtn}
                    alt="Select"
                    width={20}
                    height={20}
                  />
                </motion.div>
              </div>
              <p className="text-c12 leading-4 font-MontserratNormal">
                {item.address}
              </p>
            </motion.div>
          );
        })}

        <motion.div
          key="add-address"
          onClick={() => {
            setEditingAddress(undefined);
            setIsModalOpen(true);
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{
            scale: 1,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: false, amount: 0.3 }}
          className={twMerge("p-c24 w-81 h-45.5 rounded-c12 flex flex-col justify-center items-center cursor-pointer bg-black/2 gap-c3 border-black text-black transition-colors duration-300", className )}
        >
          <Image src={AddcardBtn} width={20} height={20} alt="Add card" />
          <p className="text-center font-MontserratNormal text-base">
            Add new address
          </p>
        </motion.div>
      </div>
      
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAddress={editingAddress}
        onSave={(newAddress) => {
          console.log("Saved Address:", newAddress);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
