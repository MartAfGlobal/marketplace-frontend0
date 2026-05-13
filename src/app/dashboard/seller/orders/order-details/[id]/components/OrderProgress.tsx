import Image from "next/image";
import { Fragment } from "react";
import UnprocessedIcon from "@/assets/Seller/unprocessed.svg";
import FufilledIcon from "@/assets/Seller/fufilledIcon.png";
import PlaneIcon from "@/assets/Seller/AirplaneTilt.svg";
import PackageIcon from "@/assets/Seller/fufilledIcon.svg";
import productIcon from "@/assets/Seller/proccessed.svg";
import truckIcon from "@/assets/Seller/delivered.svg";

interface OrderProgressProps {
  order: any;
  getMappedStatus: (order: any) => string;
}

export const OrderProgress = ({ order, getMappedStatus }: OrderProgressProps) => {
  const steps = [
    {
      label: "Unprocessed",
      icon: UnprocessedIcon,
      Width: 11.25,
      Height: 16.25,
    },
    { label: "Processed", icon: productIcon, Width: 20, Height: 20 },
    { label: "Fulfilled", icon: PackageIcon, Width: 20, Height: 20 },
    { label: "Shipped", icon: PlaneIcon, Width: 20, Height: 20 },
    { label: "Delivered", icon: truckIcon, Width: 20, Height: 20 },
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.label.toLowerCase() === getMappedStatus(order)
  );

  return (
    <div className="space-y-6 pt-8 pb-4">
      <h3 className="font-MontserratSemiBold text-sm">Order progress</h3>
      <div className="flex items-start w-full min-w-[500px] lg:max-w-3xl mt-4">
        {steps.map((step, idx) => {
          const isActive = idx <= currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          const isProcessing = idx === currentStepIndex;

          return (
            <Fragment key={idx}>
              <div className="flex flex-col items-center gap-2 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? "bg-6a0dad/68" : "bg-gray-200"}`}
                >
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={step.Width || 20}
                    height={step.Height || 20}
                    className={isActive ? "brightness-200" : "opacity-40"}
                  />
                </div>
                <span
                  className={`text-xs font-MontserratSemiBold whitespace-nowrap absolute top-12 ${
                    idx === 0
                      ? "left-0"
                      : idx === steps.length - 1
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2"
                  } ${isActive ? "text-6a0dad/68" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mt-5 relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-6a0dad transition-all duration-500"
                    style={{
                      width: isCompleted ? "100%" : isProcessing ? "40%" : "0%",
                    }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
