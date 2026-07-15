import Image from "next/image";
import inActiveIcon from "@/assets/admin/suspend.svg";

export default function OrderDetailsSummary() {
  return (
    <div className="bg-ffffff rounded-2xl p-6 w-full animate-in fade-in duration-300">
      <div className="space-y-6">
        <h3 className="text-sm text-000000/68 font-MontserratNormal">
          Order details
        </h3>

        <div className="flex gap-4 md:justify-between items-center h-12">
          <div className="w-31.25 space-y-1">
            <span className="block text-xs   font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              Order date
            </span>
            <span className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              May 15, 2025
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <span className="block text-xs   font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64 ">
              Transaction ID
            </span>
            <span
              className="block text-base text-ff715b font-MontserratNormal w-full overflow-hidden truncate"
              title="TXN-472475245"
            >
              TXN-472475245
            </span>
          </div>
        </div>
        <div className="flex gap-4 md:justify-between items-center">
          <div>
            <span className="block text-xs  mb-1 font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68 ">
              Total amount
            </span>
            <span className="text-base font-MontserratNormal leading-[24px] tracking-[2%] text-000000/68">
              N54,000
            </span>
          </div>

          <div className="w-31">
            <span className="block text-xs  mb-1 font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64">
              Status
            </span>
            <div className="flex items-center gap-1 w-25.25 h-6.5 rounded-c32 py-1 px-4 text-[#FFAC06] bg-[#FFAC06]/12 text-xs font-MontserratNormal ">
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <Image
                  src={inActiveIcon}
                  alt="Ongoing"
                  width={7.88}
                  height={11.38}
                />
              </div>
              Ongoing
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64 ">
            Shipping address
          </span>
          <span className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
            B23 Global estate HQ, Abuja.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 pt-2">
          <div>
            <span className="block text-xs   font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64 ">
              Shipping method
            </span>
            <span className="ext-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              Redstar express
            </span>
          </div>

          <div className="min-w-0">
            <span className="block text-xs font-MontserratNormal leading-[20px] tracking-[2%] text-000000/64 mb-1">
              Tracking number
            </span>
            <span
              className="text-base font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68 truncate"
        
            >
              NGN951395139753
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6 mt-6  ">
        <div className="flex border-b py-4 border-b-000000/4 justify-between items-center text-sm font-MontserratNormal text-000000/68">
          <span>Order summary</span>
          <span className="text-base  font-MontserratNormal text-000000/68">
            Amount
          </span>
        </div>

        <div className=" space-y-3 text-sm font-MontserratNormal text-000000/68">
          <div className="flex justify-between py-0.5">
            <span >Total items</span>
            <span className="text-base  font-MontserratNormal text-000000/68">8</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="">Discounts</span>
            <span className="text-base  font-MontserratNormal text-000000/68">-N2,500</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="">Subtotal</span>
            <span className="text-base  font-MontserratNormal text-000000/68">N20,000</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="">Shipping fees</span>
            <span className="text-base  font-MontserratNormal text-000000/68">N500</span>
          </div>
        </div>

    

        <div className="flex justify-between items-baseline ">
          <span className="text-c20 font-MontserratMedium leading-[28px]">
            Total
          </span>
          <span className="text-c20 font-MontserratMedium leading-[28px]">
            N20,500
          </span>
        </div>
      </div>
    </div>
  );
}
