"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { AtmCardProps, CardDetails } from "@/types/global";
import AddcardBtn from "@/assets/icons/user-dashboard/atm-cards/plus.png";
import AtmIcon from "@/assets/icons/user-dashboard/atm-cards/atmIcon.png";
import ActiveCardBtn from "@/assets/icons/user-dashboard/atm-cards/activeButton.png";
import SelectorBtn from "@/assets/icons/user-dashboard/atm-cards/SelectorButton.png";
import AddCardModal from "@/components/ui/Modals/new-card-modal";
import { twMerge } from "tailwind-merge";

export default function UserCard({ className }: { className?: string }) {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const atmCards: AtmCardProps[] = [
    { id: 1, icon: ActiveCardBtn, accountNo: "***7167" },
    { id: 2, icon: ActiveCardBtn, accountNo: "***2345" },
    { id: 3, icon: ActiveCardBtn, accountNo: "***9876" },
  ];

  const handleSelectBtn = (id: number) => setSelectedCardId(id);

  const handleAddCard = (details: CardDetails) => {
    console.log("New card added:", details);
    // Here you could update your atmCards state or call API
  };

  const cardVariants: Variants[] = [
    {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
    },
    {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
    },
    {
      hidden: { x: 100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-c32 flex justify-between">
        <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
          Cards
        </p>
        <button className="font-MontserratSemiBold text-sm text-ff715b">
          View all
        </button>
      </div>

      <div className="flex w-full gap-6 flex-wrap">
        {atmCards.map((item, idx) => {
          const isSelected = item.id === selectedCardId;
          const variant = cardVariants[idx % cardVariants.length];

          return (
            <motion.div
              key={item.id}
              onClick={() => handleSelectBtn(item.id)}
              variants={variant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={twMerge(
                "p-c24 w-81 h-45.5 rounded-c12 flex justify-between flex-col cursor-pointer relative transition-colors duration-300",
                isSelected
                  ? "bg-black text-ffffff shadow-inner"
                  : "bg-black/20 text-black shadow",
                className
              )}
            >
              <div className="flex justify-between items-center">
                <p className="font-MontserratNormal text-c16 leading-6">
                  {item.accountNo}
                </p>
                <Image
                  src={AtmIcon}
                  alt="Atm"
                  width={40}
                  height={26.69}
                  className="w-10 h-[26.69px]"
                />
              </div>

              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex justify-end"
              >
                {isSelected ? (
                  <Image
                    src={ActiveCardBtn}
                    alt="Active"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src={SelectorBtn}
                    alt="Select"
                    width={20}
                    height={20}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Add Card Button */}
        <motion.div
          key="add-card"
          onClick={() => setIsAddModalOpen(true)}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1, transition: { duration: 0.6 } }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: false, amount: 0.3 }}
          className={twMerge(
            "p-c24 w-81 h-45.5 rounded-c12 flex flex-col justify-center items-center cursor-pointer bg-black/2 gap-c3 border-black text-black transition-colors duration-300",
            className
          )}
        >
          <Image src={AddcardBtn} width={20} height={20} alt="Add card" />
          <p className="text-center font-MontserratNormal text-base">
            Add new card
          </p>
        </motion.div>
      </div>

      {/* Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCard}
      />
    </div>
  );
}
