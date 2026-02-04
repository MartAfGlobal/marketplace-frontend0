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
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useHttp } from "@/hooks/use-http";
import UserAddress from "@/components/ui/buyer-components/Main-section/sections/address-selector";

export default function AllAddressesPage() {
  const router = useRouter();
  const selectedAddressId = useSelector(
    (state: RootState) => state.buyer.selectedAddressId
  );
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  // const token = useSelector((state: RootState) => state.token?.token);
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sendHttpRequest: updateAddressReq } = useHttp();

  const [selectedCardId, setSelectedCardId] = useState<string>();

  const [editingAddress, setEditingAddress] = useState<Partial<Address>>();

  useEffect(() => {
    if (buyerAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = buyerAddresses.find((a) => a.is_default);
      dispatch(
        buyerActions.setSelectedAddress(defaultAddr?.id ?? buyerAddresses[0].id)
      );
    }
  }, [buyerAddresses, selectedAddressId, dispatch]);

  const handleSelectAddress = (addressId: string) => {
    dispatch(buyerActions.setSelectedAddress(addressId));
  };

  useEffect(() => {
    const defaultAddr = buyerAddresses.find((a) => a.is_default);
    setSelectedCardId(defaultAddr?.id ?? buyerAddresses[0]?.id ?? "");
  }, [buyerAddresses]);

  const handleDelete = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`/shipping/shipping-addresses/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(buyerActions.removeBuyerAddress(id));
      setIsModalOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error(error);
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
      <div className="pb-c32 mb-15 border-b border-b-000000/5">
        <UserAddress
          mobile={true}
          selectedAddressId={selectedAddressId ?? undefined}
          onSelectAddress={handleSelectAddress}
          className="md:w-64.25 min-w-full h-fit"
        />
      </div>

      <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-30 flex items-center gap-4">
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
