"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CloseModal from "@/assets/headerIcon/closeModal.png";
import Sad from "@/assets/mobile/sad.png";
import Happy from "@/assets/mobile/happy.png";
import { useRouter } from "next/navigation";
import { Button } from "../../Button/Button";

export default function ResponseModal({
  isOpen,
  id,
  onClose,
  type,
}: {
  id: string
  isOpen: boolean;
  onClose: () => void;
  type: "yes" | "no";
}) {
  const router = useRouter();
  if (!isOpen) return null;

  const description =
    type === "no"
      ? "We’re sorry! Please contact support for help."
      : "Thanks for confirming your delivery!";

  const primaryButtonLabel = type === "no" ? "Live Chat" : "Leave a review";
  const primaryButtonAction =
    type === "no"
      ? () => alert("Starting live chat...")
      :   () => router.push(`/dashboard/buyer/orders/leave-review/${id}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Backdrop (click to close) */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-lg pt-6 p-6 text-center space-y-9.75 z-10">
        {/* Close button */}
        <div className="w-full flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Image
              src={CloseModal}
              alt="Close"
              width={15}
              height={15}
              className="p-0.5"
            />
          </button>
        </div>

        {/* Dynamic description */}
        <p className="text-sm font-MontserratNormal">{description}</p>

        {/* Animated emoji */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="flex justify-center items-center"
        >
          {type === "no" ? (
            <Image src={Sad} alt="Sad" width={200} height={200} />
          ) : (
            <Image src={Happy} alt="Happy" width={200} height={200} />
          )}
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col gap-6 text-c12 font-MontserratSemiBold">
          <Button
          variant="secondary"
            className=" "
            onClick={primaryButtonAction}
          >
            {primaryButtonLabel}
          </Button>
          <Button
            className=""
            onClick={() => alert("Continuing shopping...")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
