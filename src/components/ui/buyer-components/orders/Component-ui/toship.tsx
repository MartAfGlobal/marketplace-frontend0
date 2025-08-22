"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Copy from "@/assets/icons/Copy.png";

import AddressModal from "@/components/ui/Modals/new-address-modal"; // adjust path
import { UserAddressProps, Address } from "@/types/global";

export default function ToShip() {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    Partial<Address> | undefined
  >(undefined);

  const [copied, setCopied] = useState(false);
  const trackOrders: TrackOrders[] = [
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
  const orderId = "304657846532";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
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
                     <div className="w-full flex items-center gap-32 justify-center md:gap-0 md:justify-between mb-3 md:mb-c32">
                      <div>
                        <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                          Order is being processed
                        </p>
                        <div className="md:flex hidden gap-2 mt-2">
                          <p className="text-c12  font-MontserratNormal">
                            Order ID: {orderId}
                          </p>
                          <button onClick={handleCopy}>
                            <Image
                              src={Copy}
                              alt="copy"
                              width={16}
                              height={16}
                            />
                          </button>
                          {copied && (
                            <span className="text-green-600 text-c12 font-MontserratMedium">
                              Copied!
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                        {item.date}
                      </p>
                    </div>

                    <div className="w-full md:justify-between flex-col pb-c32 flex md:flex-row">
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
                             
                              className="bg-transparent border h-c40 rounded-c8 w-full text-c10 border-ff715b text-ff715b"
                            > 
                             Cancel order
                            </button>
                            <button className="text-c10 text-ffffff bg-ff715b w-full h-c40 rounded-lg ">
                              Edit address
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="w-full gap-4 pl hidden md:flex md:flex-col  md:max-w-70 space-y-4">
                        <Button
                          
                          className="bg-transparent border border-ff715b text-ff715b"
                        >
                          Track order
                        </Button>
                        <Button >
                          Confirm delivery
                        </Button>
                       
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
