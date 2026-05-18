"use client";

import Image from "next/image";
import navBack from "@/assets/icons/navBacksmall.png";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SellerMobileHeaderProps {
  title: string;
  rightElement?: ReactNode;
  onBack?: () => void;
  showBorder?: boolean;
  showBackButton?: boolean;
}

export const SellerMobileHeader = ({
  title,
  rightElement,
  onBack,
  showBorder = true,
  showBackButton = true,
}: SellerMobileHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={`flex items-center lg:h-c64 justify-between  lg:px-0 ${showBorder ? "lg:border-b lg:border-000000/10" : ""}`}>
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center lg:mt-1.75"
          >
            <span className="h-6 w-6 flex items-center justify-center mr-4">
              <Image src={navBack} width={9} height={16.5} alt="Back" />
            </span>
          </button>
        )}
        <span className="text-c18 font-MontserratSemiBold text-000000">
          {title}
        </span>
      </div>
      {rightElement && (
        <div className="flex items-center flex-1 justify-end ml-4">
          {rightElement}
        </div>
      )}
    </div>
  );
};
