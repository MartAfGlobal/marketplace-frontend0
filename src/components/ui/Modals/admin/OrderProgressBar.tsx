import Image from "next/image";
import PaymentPendingIcon from "@/assets/admin/progress1.svg";
import AwaitingSellersConfrirmationIcon from "@/assets/admin/progress2.svg";
import SentFromSellerIcon from "@/assets/admin/progress3.svg";
import RecievedAtWarehouseIcon from "@/assets/admin/progress4.svg";
import ShippedWarehouseIcon from "@/assets/admin/progress5.svg";
import DeliveredToBuyerIcon from "@/assets/admin/progress6.svg";
import DisputeIcon from "@/assets/admin/progress7.svg";

interface OrderProgressBarProps {
  status?: string;
  paymentStatus?: string;
}

export default function OrderProgressBar({
  status,
  paymentStatus,
}: OrderProgressBarProps) {
  const normStatus = (status || "").toUpperCase();
  const normPayStatus = (paymentStatus || "").toUpperCase();
  const isDispute = normStatus.includes("DISPUT");

  let currentStep = 2; // Default
  if (
    normPayStatus === "PENDING" ||
    normStatus === "PAYMENT_PENDING" ||
    normStatus === "UNPAID"
  ) {
    currentStep = 1;
  } else if (
    normStatus === "PENDING" ||
    normStatus === "UNPROCESSED" ||
    normStatus === "AWAITING_CONFIRMATION" ||
    normStatus === "CONFIRMATION_PENDING"
  ) {
    currentStep = 2;
  } else if (
    normStatus === "PROCESSED" ||
    normStatus === "ACCEPTED" ||
    normStatus === "SENT_FROM_SELLER" ||
    normStatus === "TO_SHIP" ||
    normStatus === "SHIPPED_BY_SELLER" ||
    normStatus === "PROCESSING"
  ) {
    currentStep = 3;
  } else if (
    normStatus === "RECEIVED_AT_WAREHOUSE" ||
    normStatus === "AT_WAREHOUSE" ||
    normStatus === "WAREHOUSE"
  ) {
    currentStep = 4;
  } else if (
    normStatus === "SHIPPED" ||
    normStatus === "SHIPPED_FROM_WAREHOUSE" ||
    normStatus === "IN_TRANSIT"
  ) {
    currentStep = 5;
  } else if (normStatus === "DELIVERED" || normStatus === "COMPLETED") {
    currentStep = 6;
  }

  const getCircleClass = (step: number) => {
    if (isDispute) return "bg-gray-300";
    return step <= currentStep ? "bg-6a0dad" : "bg-gray-300";
  };

  const getLineClass = (step: number) => {
    if (isDispute) return "border-000000/12";
    return step < currentStep ? "border-6a0dad" : "border-000000/12";
  };

  const getTextClass = (step: number) => {
    if (isDispute) return "text-000000/44";
    return step <= currentStep
      ? "text-6a0dad font-MontserratMedium"
      : "text-000000/44";
  };

  return (
    <main>
      <div className="bg-white h-37.5 mt-4 space-y-6 max-w-182 rounded-2xl p-6 mb-6 mx-auto animate-in fade-in duration-300">
        <h3 className="text-sm text-000000/68 font-MontserratNormal">
          Order progress
        </h3>

        <div className="flex overflow-x-auto scrollbar-hide py-2">
          {/* Step 1 */}
          <div className="h-15 max-w-21.5 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${getCircleClass(
                  1
                )}`}
              >
                <Image
                  src={PaymentPendingIcon}
                  alt="pending"
                  height={12}
                  width={12}
                />
              </div>
              <div className={`w-14.5 border ${getLineClass(1)}`} />
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${getTextClass(
                1
              )}`}
            >
              Payment pending
            </span>
          </div>

          {/* Step 2 */}
          <div className="h-15 max-w-32.25 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${getCircleClass(
                  2
                )}`}
              >
                <Image
                  src={AwaitingSellersConfrirmationIcon}
                  alt="Awaiting seller confirmation"
                  height={12}
                  width={12}
                />
              </div>
              <div className={`w-25.25 border ${getLineClass(2)}`} />
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${getTextClass(
                2
              )}`}
            >
              Awaiting seller’s confirmation
            </span>
          </div>

          {/* Step 3 */}
          <div className="h-15 max-w-21.5 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${getCircleClass(
                  3
                )}`}
              >
                <Image
                  src={SentFromSellerIcon}
                  alt="Sent from seller"
                  height={12}
                  width={12}
                />
              </div>
              <div className={`w-15.25 border ${getLineClass(3)}`} />
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${getTextClass(
                3
              )}`}
            >
              Sent from seller
            </span>
          </div>

          {/* Step 4 */}
          <div className="h-15 max-w-21.5 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${getCircleClass(
                  4
                )}`}
              >
                <Image
                  src={RecievedAtWarehouseIcon}
                  alt="Received at warehouse"
                  height={12}
                  width={12}
                />
              </div>
              <div className={`w-15.25 border ${getLineClass(4)}`} />
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${getTextClass(
                4
              )}`}
            >
              Received at warehouse
            </span>
          </div>

          {/* Step 5 */}
          <div className="h-15 max-w-25.75 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${getCircleClass(
                  5
                )}`}
              >
                <Image
                  src={ShippedWarehouseIcon}
                  alt="Shipped from warehouse"
                  height={12}
                  width={12}
                />
              </div>
              <div className={`w-18.75 border ${getLineClass(5)}`} />
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${getTextClass(
                5
              )}`}
            >
              Shipped from warehouse
            </span>
          </div>

          {/* Step 6 */}
          <div className="h-15 max-w-23.75 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${getCircleClass(
                  6
                )}`}
              >
                <Image
                  src={DeliveredToBuyerIcon}
                  alt="Delivered to buyer"
                  height={12}
                  width={12}
                />
              </div>
              <div className={`w-16.75 border ${getLineClass(6)}`} />
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${getTextClass(
                6
              )}`}
            >
              Delivered to buyer
            </span>
          </div>

          {/* Step 7 (Dispute) */}
          <div className="h-15 max-w-18.25 flex-shrink-0">
            <div className="w-full gap-1 flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex justify-center items-center transition-colors ${
                  isDispute ? "bg-[#E8334A]" : "bg-gray-300"
                }`}
              >
                <Image
                  src={DisputeIcon}
                  alt="Indispute"
                  height={7.5}
                  width={7.5}
                />
              </div>
            </div>
            <span
              className={`font-MontserratNormal text-c10 tracking-[2%] ${
                isDispute
                  ? "text-[#E8334A] font-MontserratMedium"
                  : "text-000000/44"
              }`}
            >
              In dispute
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
