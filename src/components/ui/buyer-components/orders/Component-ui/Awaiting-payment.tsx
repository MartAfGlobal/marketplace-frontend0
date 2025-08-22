"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import AddressModal from "@/components/ui/Modals/new-address-modal"; // adjust path
import { UserAddressProps, Address } from "@/types/global";

export default function AwaitingOrders() {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    Partial<Address> | undefined
  >(undefined);

  const trackOrders: TrackOrders[] = [
    // Uncomment to test non-empty state
    {
      id: 1,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
    {
      id: 2,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
    {
      id: 3,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
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
    <div className="space-y-c24 px-6 w-full">
      <div className="w-full">
        <div className="w-full space-y-c24 mt-c32">
          <AnimatePresence mode="wait">
            {trackOrders.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="w-full text-center max-w-41.25 text-000000/60 font-MontserratMedium text-c18 leading-6.5">
                  You haven’t made any orders yet
                </p>
                <Button className="w-51">Start shopping</Button>
              </motion.div>
            ) : (
              <motion.div
                key="orders-list"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, height: 0 },
                  visible: {
                    opacity: 1,
                    height: "auto",
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-c24"
              >
                {trackOrders.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-full flex justify-between mb-3 md:mb-c32">
                      <div>
                        <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                          Awaiting payment
                        </p>
                      </div>
                    </div>

                    <div className="w-full justify-between pb-c32 flex">
                      <div className="flex gap-4 items-start">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={96}
                          height={96}
                        />
                        <div className="w-full max-w-143.75">
                          <p className="font-MontserratSemiBold text-base leading-c24 pb-1 text-000000">
                            {item.title}
                          </p>
                          <p className="font-MontserratMedium text-c12 leading-c16 pb-3 text-000000">
                            {item.discription}
                          </p>
                          <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                            <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                              {item.totalQuantity}PC, {item.colour}
                            </span>
                          </div>
                          <p className="font-MontserratSemiBold text-c16 pt-3 leading-6.5">
                            ₦{item.totalAmount}
                          </p>
                          <div className="w-full gap-4 pl flex md:hidden  mt-4 space-y-4">
                            <button
                              onClick={() => {
                                setEditingAddress(undefined);
                                setIsModalOpen(true);
                              }}
                              className="bg-transparent border h-c40 w-full rounded-c8 text-c10 border-ff715b text-ff715b"
                            >
                              Edit address
                            </button>
                            <button
                              className="text-c10 text-ffffff bg-ff715b w-full h-c40 rounded-lg "
                            >
                              Confirm & pay
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="w-full hidden md:block max-w-70 space-y-4">
                        <Button
                          onClick={() => {
                            setEditingAddress(undefined);
                            setIsModalOpen(true);
                          }}
                          className="bg-transparent border border-ff715b text-ff715b"
                        >
                          Edit address
                        </Button>
                        <Button>Confirm & pay</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
