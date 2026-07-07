import Image from "next/image";
import PaymentPendingIcon from "@/assets/admin/progress1.svg";
import AwaitingSellersConfrirmationIcon from "@/assets/admin/progress2.svg";
import SentFromSellerIcon from "@/assets/admin/progress3.svg";
import RecievedAtWarehouseIcon from "@/assets/admin/progress4.svg";
import ShippedWarehouseIcon from "@/assets/admin/progress5.svg";
import DeliveredToBuyerIcon from "@/assets/admin/progress6.svg";
import DisputeIcon from "@/assets/admin/progress7.svg";

export default function OrderProgressBar() {
  return (
    <main>
      <div className="bg-white h-37.5 mt-4 space-y-6 max-w-182 rounded-2xl p-6 mb-6 mx-auto animate-in fade-in duration-300">
        <h3 className="text-sm text-000000/68 font-MontserratNormal">
          Order progress
        </h3>

        <div className="flex overflow-x-auto scrollbar-hide py-2">
          <div className="h-15 max-w-21.5">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={PaymentPendingIcon}
                  alt="pending"
                  height={12}
                  width={12}
                />
              </div>
              <div className="w-14.5 border border-000000/12" />
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              Payment pending
            </span>
          </div>
          <div className="h-15 max-w-32.25">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={AwaitingSellersConfrirmationIcon}
                  alt="Awaiting seller confirmation"
                  height={12}
                  width={12}
                />
              </div>
              <div className="w-25.25 border border-000000/12" />
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              Awaiting seller’s confirmationF
            </span>
          </div>
          <div className="h-15 max-w-21.5 ">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={SentFromSellerIcon}
                  alt="Sent from seller"
                  height={12}
                  width={12}
                />
              </div>
              <div className="w-15.25 border border-000000/12" />
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              Sent from seller
            </span>
          </div>
          <div className="h-15 max-w-21.5 ">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={RecievedAtWarehouseIcon}
                  alt="Received at warehouse"
                  height={12}
                  width={12}
                />
              </div>
              <div className="w-15.25 border border-000000/12" />
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              Received at warehouse
            </span>
          </div>
          <div className="h-15 max-w-25.75 ">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={ShippedWarehouseIcon}
                  alt="Shipped from warehouse"
                  height={12}
                  width={12}
                />
              </div>
              <div className="w-18.75 border border-000000/12" />
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              Shipped from warehouse
            </span>
          </div>
          <div className="h-15 max-w-23.75 ">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={DeliveredToBuyerIcon}
                  alt="Delivered to buyer"
                  height={12}
                  width={12}
                />
              </div>
              <div className="w-16.75 border border-000000/12" />
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              Delivered to buyer
            </span>
          </div>
          <div className="h-15 max-w-18.25 ">
            <div className="w-full   gap-1 flex items-center">
              <div className="w-6 h-6  rounded-full flex justify-center items-center bg-6a0dad">
                <Image
                  src={DisputeIcon}
                  alt="Indispute"
                  height={7.5}
                  width={7.5}
                />
              </div>
            </div>
            <span className="font-MontserratNormal text-c10 text-6a0dad/68  tracking-[2%]">
              In dispute
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
