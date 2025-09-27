"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import AddressModal from "@/components/ui/Modals/new-address-modal";
import { Address } from "@/types/global";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

import AddcardBtn from "@/assets/icons/user-dashboard/atm-cards/plus.png";
import ActiveCardBtn from "@/assets/icons/user-dashboard/atm-cards/activeButton.png";
import SelectorBtn from "@/assets/icons/user-dashboard/atm-cards/SelectorButton.png";

import { useDispatch, useSelector } from "react-redux";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import type { RootState } from "@/store";

export default function UserAddress({ className }: { className?: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token?.token);
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses
  );

  const [selectedCardId, setSelectedCardId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<Address>>();
  const [showAll, setShowAll] = useState(false);

  // Automatically select default address when buyerAddresses updates
  useEffect(() => {
    const defaultAddr = buyerAddresses.find((a) => a.is_default);
    setSelectedCardId(defaultAddr?.id ?? (buyerAddresses[0]?.id ?? 0));
  }, [buyerAddresses]);

  const cardVariants: Variants[] = [
    { hidden: { x: -100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.6 } } },
    { hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6 } } },
    { hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.6 } } },
  ];

  const handleSelectDefaultAddress = async (addressId: number) => {
    setSelectedCardId(addressId);
    dispatch(buyerActions.setDefaultBuyerAddress(addressId));

    if (!token) return;

    try {
      const response = await fetch(`/shipping/shipping-addresses/${addressId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_default: true }),
      });

      if (!response.ok) throw new Error("Failed to update default address");
      const updatedAddress = await response.json();
      console.log("Default address updated:", updatedAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const getVisibleAddresses = () => {
    if (showAll) return buyerAddresses;
    return buyerAddresses.filter((_, idx) => (window.innerWidth >= 1024 ? idx < 3 : idx < 2));
  };

  return (
    <div className="w-full">
      <div className="pb-c32 flex justify-between items-center">
        <p className="font-MontserratSemiBold text-base leading-c24 hidden md:flex text-000000">
          Addresses
        </p>
       {buyerAddresses.length > 3 && (<button
          className="font-MontserratSemiBold text-sm hidden md:flex text-ff715b"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "See less" : "See more"}
        </button>)}
      </div>

      <div className="flex flex-col gap-3 md:flex-row w-full md:gap-6 md:flex-wrap">
        {getVisibleAddresses().map((item, idx) => {
          const isSelected = item.id === selectedCardId;
          const variant = cardVariants[idx % cardVariants.length];

          return (
            <motion.div
              key={item.id}
              onClick={() => handleSelectDefaultAddress(item.id)}
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
                <p className="font-MontserratSemiBold text-c12 leading-c16">{item.full_name}</p>
                <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Image src={isSelected ? ActiveCardBtn : SelectorBtn} alt="Select" width={20} height={20} />
                </motion.div>
              </div>
              <div className="w-full max-w-51">
                <p className="text-c12 leading-4 font-MontserratNormal">{item.phone}</p>
                <p className="text-c12 leading-4 font-MontserratNormal">{item.address} {item.state} {item.city}</p>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          key="add-address"
          onClick={() => { setEditingAddress(undefined); setIsModalOpen(true); }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: false, amount: 0.3 }}
          className={twMerge(
            "p-c24 w-full hidden md:w-81 md:flex h-34.5 rounded-c12 flex-col justify-center items-center cursor-pointer bg-black/2 gap-c3 border-black text-black transition-colors duration-300",
            className
          )}
        >
          <Image src={AddcardBtn} width={20} height={20} alt="Add address" />
          <p className="text-center font-MontserratNormal text-base">Add new address</p>
        </motion.div>
      </div>

      {buyerAddresses.length > 3 && (
        <div className="w-full flex pt-6 justify-end md:hidden">
          <button
            className="font-MontserratSemiBold text-sm text-ff715b"
            onClick={() => router.push("/dashboard/buyer/mobile/addresses")}
          >
            See more
          </button>
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAddress={editingAddress}
        onSave={(newAddress) => { console.log("Saved Address:", newAddress); setIsModalOpen(false); }}
      />
    </div>
  );
}
