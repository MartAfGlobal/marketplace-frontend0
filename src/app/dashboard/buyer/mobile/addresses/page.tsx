"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Address, UserAddressProps } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import type { RootState } from "@/store";
import Cookies from "js-cookie";

// icons

import NavBack from "@/assets/icons/navBacksmall.png";

export default function AllAddressesPage() {
  const router = useRouter();

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  // const token = useSelector((state: RootState) => state.token?.token);
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses
  );

  const [selectedCardId, setSelectedCardId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<Address>>();

  useEffect(() => {
    const defaultAddr = buyerAddresses.find((a) => a.is_default);
    setSelectedCardId(defaultAddr?.id ?? buyerAddresses[0]?.id ?? 0);
  }, [buyerAddresses]);

  const handleDelete = (id: number) => {
    return;
  };

  const handleSelectDefaultAddress = async (addressId: number) => {
    setSelectedCardId(addressId);
    dispatch(buyerActions.setDefaultBuyerAddress(addressId));

    if (!token) return;

    try {
      const response = await fetch(
        `/shipping/shipping-addresses/${addressId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_default: true }),
        }
      );

      if (!response.ok) throw new Error("Failed to update default address");
      const updatedAddress = await response.json();
      console.log("Default address updated:", updatedAddress);
    } catch (err) {
      console.error(err);
    }
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
        {buyerAddresses.map((item) => {
          const isSelected = item.id === selectedCardId;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleSelectDefaultAddress(item.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`w-full  h-39.5 rounded-2xl border border-000000/20  circle-shadow  shadow-sm cursor-pointer transition-colors flex  py-6 px-4 ${
                isSelected ? "bg-6a0dad text-white" : " text-black"
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
                  <p className="font-MontserratSemiBold text-c12">
                    {item.full_name}
                  </p>
                  <p className="text-c12 font-MontserratNormal">{item.phone}</p>
                  <p className="text-c12 font-MontserratNormal">
                    {item.address}
                  </p>

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
          onClick={() =>
            router.push("/dashboard/buyer/mobile/addresses/add-address")
          }
          className="border-0"
        >
          + Add new address
        </Button>
      </div>
    </div>
  );
}
