"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "../Button/Button";
interface EmptyCartProps {
  className?: string;
  title?: string;
  description?: string;
  ButtonText?: string;
  onClick?: () => void;
}

export default function EmptyCartIcon({
  className = "w-24 h-24 text-ff715b",
  title = "Your cart is empty",
  description = "Looks like you haven’t added any items yet. Start exploring our products to fill your cart!",
  ButtonText = "Continue Shopping",
  onClick,
}: EmptyCartProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // default behavior
      router.push("/#production-section");
    }
  };
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Animated Cart SVG */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
        animate={{
          rotate: [0, -5, 5, -5, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      >
        <motion.g
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ y: 0 }}
          animate={{ y: [0, -2, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path d="M8 8h6l6 36h28l6-24H20" />
          <path d="M26 28h18" />
          <path d="M24 20h22" />
        </motion.g>

        {/* Spinning wheels */}
        <motion.circle
          cx="26"
          cy="52"
          r="3"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.circle
          cx="46"
          cy="52"
          r="3"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.svg>

      <h2 className="text-lg font-MontserratSemiBold mt-6 text-gray-800">
        {title}
      </h2>
      <p className="text-gray-500 text-sm mt-2 mb-6 max-w-sm">{description}</p>

      <div className=" w-full max-w-44.75">
        <Button
          onClick={handleClick}
          variant="primary"
          className=" w-full max-w-44.75"
        >
          {ButtonText}
        </Button>
      </div>
    </div>
  );
}
