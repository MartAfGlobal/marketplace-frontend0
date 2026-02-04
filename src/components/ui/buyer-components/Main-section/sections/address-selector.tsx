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

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useHttp } from "@/hooks/use-http";

interface UserAddressProps {
  className?: string;
  selectedAddressId?: string; // optional external control
  onSelectAddress?: (id: string) => void;
  mobile?: true | false;
}

export default function UserAddress({
  className,
  selectedAddressId,
  mobile,
  onSelectAddress,
}: UserAddressProps) {
  const router = useRouter();
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses,
  );

  const [selectedCardId, setSelectedCardId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<Address>>();
  const [showAll, setShowAll] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const token = useSelector((state: RootState) => state.token.token);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { sendHttpRequest: deleteAddressReq, loading: deleting } = useHttp();
  const [deletedSuccessfull, setDeletedSuccessfull] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [addressId, setAddressId] = useState<string>();

  // Track window width for responsive "See More / See Less"
  useEffect(() => {
    setWindowWidth(typeof window !== "undefined" ? window.innerWidth : 1024);
    const handleResize = () =>
      setWindowWidth(typeof window !== "undefined" ? window.innerWidth : 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  useEffect(() => {
    if (selectedAddressId) {
      setSelectedCardId(selectedAddressId);
    } else if (buyerAddresses.length > 0) {
      const defaultAddr = buyerAddresses.find((a) => a.is_default);
      setSelectedCardId(defaultAddr?.id ?? buyerAddresses[0].id);
    }
  }, [buyerAddresses, selectedAddressId]);

  const handleEdit = (id: string) => {
    setIsEdit(true);
    setAddressId(id);
    if (isMobile) {
      router.push(`/dashboard/buyer/mobile/addresses/edit-address/${id}`);
    } else{
      setIsModalOpen(true)
    }

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

  const handleSelectAddress = (addressId: string) => {
    // Notify parent if controlled
    if (onSelectAddress) onSelectAddress(addressId);

    // Update internal state if not controlled
    if (!selectedAddressId) setSelectedCardId(addressId);
  };

  const handleDelete = (addressId: string) => {
    if (!token) return;

    deleteAddressReq({
      requestConfig: {
        url: `/shipping/shipping-addresses/delete/${addressId}/`,
        method: "DELETE",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res: any) => {
        console.log(" updated:", res?.data);
        setDeletedSuccessfull(true);
      },
    });
  };

  // Show first 3 on desktop, 2 on mobile by default
  const getVisibleAddresses = () => {
    if (showAll) return buyerAddresses;
    const limit = windowWidth >= 768 ? 3 : 2;
    return buyerAddresses.slice(0, limit);
  };

  return (
    <div className="w-full">
      <div className="pb-c32 flex justify-between items-center">
        <p className="font-MontserratSemiBold text-base leading-c24 hidden md:flex text-000000">
          Addresses
        </p>
        {buyerAddresses.length > 3 && (
          <button
            className="font-MontserratSemiBold text-sm hidden md:flex text-ff715b"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "See less" : "See more"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row w-full md:gap-6 md:flex-wrap">
        {getVisibleAddresses().map((item, idx) => {
          const isSelected = item.id === selectedCardId;
          const variant = cardVariants[idx % cardVariants.length];

          return (
            <motion.div
              key={item.id}
              onClick={() => handleSelectAddress(item.id)}
              variants={variant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={twMerge(
                "p-c24 h-40 w-full md:w-80.75 md:h-40 rounded-c12 flex flex-col gap-2 cursor-pointer relative transition-colors duration-300",
                isSelected
                  ? "md:bg-black bg-6a0dad text-ffffff shadow-inner"
                  : "bg-black/20 text-black shadow",
                className,
              )}
            >
              <div className="flex justify-between items-center">
                <p className="font-MontserratSemiBold text-c12 leading-c16">
                  {item.first_name} {item.last_name}
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
              <div className="w-full max-w-51">
                <p className="text-c12 leading-4 font-MontserratNormal">
                  {item.phone}
                </p>
                <p className="text-c12 leading-4 font-MontserratNormal">
                  {item.address} {item.state}
                </p>
              </div>
              <div className="flex gap-3 ">
                {/* <button
                  className={`text-ffaco6 text-c12 font-MontserratSemiBold ${
                    isSelected ? "text-ffffff" : ""
                  }`}
                  onClick={() => handleEdit(item.id)}
                >
                  Edit
                </button> */}
                <button
                  className={`text-c12 font-MontserratSemiBold text-ca0202 ${
                    isSelected ? "text-ffffff" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();

                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          key="add-address"
          onClick={() => {
            setEditingAddress(undefined);
             setIsEdit(false)
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
            "p-c24 w-full hidden md:w-81 md:flex h-34.5 rounded-c12 flex-col justify-center items-center cursor-pointer bg-black/2 gap-c3 border-black text-black transition-colors duration-300",
            className,
          )}
        >
          <Image src={AddcardBtn} width={20} height={20} alt="Add address" />
          <p className="text-center font-MontserratNormal text-base">
            Add new address
          </p>
        </motion.div>
      </div>

      {buyerAddresses.length > 2 && !mobile && (
        <div className="w-full flex pt-6 justify-end md:hidden">
          <button
            className="font-MontserratSemiBold text-sm text-ff715b"
            onClick={() => router.push("/dashboard/buyer/mobile/addresses")}
          >
            {showAll ? "See less" : "See more"}
          </button>
        </div>
      )}
      {buyerAddresses.length > 2 && mobile && (
        <div className="w-full flex pt-6 justify-end md:hidden">
          <button
            className="font-MontserratSemiBold text-sm text-ff715b"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "See less" : "See more"}
          </button>
        </div>
      )}
      <AddressModal
        id={addressId}
        isEdit = {isEdit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAddress={editingAddress}
        onSave={(newAddress) => {
          console.log("Saved Address:", newAddress);
          setIsModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Address"
        description="are you sure you want to delete address?"
        onNo={() => setDeleteModalOpen(false)}
        onYes={() => {
          if (selectedAddressId !== null) {
            handleDelete(selectedCardId || "");
          }
        }}
        success={deletedSuccessfull}
        loading={deleting}
        yesText="Confirm Delete"
        noText="Cancel"
      />
    </div>
  );
}
