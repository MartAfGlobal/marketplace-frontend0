"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import AddressModal from "@/components/ui/Modals/new-address-modal";
import { UserAddressProps, Address } from "@/types/global";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

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
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();

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
    {
      id: 4,
      name: "Chisom Ebube Chris",
      icon: ActiveCardBtn,
      phoneNo: "+2347034562314",
      address: "Another address example",
    },
    {
      id: 5,
      name: "Chisom Ebube Chris",
      icon: ActiveCardBtn,
      phoneNo: "+2347034562314",
      address: "Another address example",
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
      defaultAddress: false,
      country: "",
      state: "",
      city: "",
      zip: "",
    });
    setIsModalOpen(true);
  };

  // Determine how many addresses to show initially
  const getVisibleAddresses = () => {
    if (showAll) return addressProp;
    return addressProp.filter((_, idx) => {
      // lg screens show max 3
      // mobile show max 2
      if (window.innerWidth >= 1024) return idx < 3;
      return idx < 2;
    });
  };

  return (
    <div className="w-full">
      <div className="pb-c32 flex justify-between items-center">
        <p className="font-MontserratSemiBold text-base leading-c24 hidden md:flex text-000000">
          Addresses
        </p>
        <button
          className="font-MontserratSemiBold text-sm  hidden md:flex text-ff715b"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "See less" : "See more"}
        </button>
      </div>

      <div className="flex  flex-col gap-3 md:flex-row w-full md:gap-6 md:flex-wrap">
        {getVisibleAddresses().map((item, idx) => {
          const isSelected = item.id === selectedCardId;
          const variant = cardVariants[idx % cardVariants.length];

          return (
            <motion.div
              key={item.id}
              onClick={() =>handleSelectBtn(item.id)}
              variants={variant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={twMerge(
                "p-c24 h-31 w-full md:w-80.75 md:h-34.5 rounded-c12 flex flex-col gap-2 cursor-pointer relative transition-colors duration-300",
                isSelected
                  ? "md:bg-black bg-6a0dad text-ffffff shadow-inner"
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
          className={twMerge(
            "p-c24 w-full hidden md:w-81 md:flex h-45.5 rounded-c12 flex-col justify-center items-center cursor-pointer bg-black/2 gap-c3 border-black text-black transition-colors duration-300",
            className
          )}
        >
          <Image src={AddcardBtn} width={20} height={20} alt="Add card" />
          <p className="text-center font-MontserratNormal text-base">
            Add new address
          </p>
        </motion.div>
      </div>

      <div className="w-full flex pt-6 justify-end md:hidden">
        <button
          className="font-MontserratSemiBold text-sm text-ff715b"
          onClick={() => { 
            router.push("/cart/mobile/addresses");
          }}
        >
          See more
        </button>
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
