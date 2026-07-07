export default function OrderDetailsSummary() {
  return (
    <div className="bg-ffffff rounded-2xl p-6 w-full animate-in fade-in duration-300">
      <div className="space-y-6">
        <h3 className="text-sm text-000000/68 font-MontserratNormal">
          Order details
        </h3>

        
          <div className="flex gap-4 md:justify-between items-center">
            <div className="w-31.25">
              <span className="block text-xs  mb-1 font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44">
                Order date
              </span>
              <span className="text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/68">
                May 15, 2025
              </span>
            </div>

            <div className="min-w-0">
              <span className="block text-xs  mb-1 font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44 ">
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
              <span className="block text-xs  mb-1 font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44 ">
                Total amount
              </span>
              <span className="text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/68">
                N54,000
              </span>
            </div>

            <div>
              <span className="block text-xs  mb-1 font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44">
                Status
              </span>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-MontserratMedium px-3 py-1 rounded-full w-fit text-[#FFAC06] bg-[#FFAC06]/10">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 2h8M3 12h8M4.5 2v2.5C4.5 6.5 7 7 7 7s-2.5.5-2.5 2.5V12M9.5 2v2.5C9.5 6.5 7 7 7 7s2.5.5 2.5 2.5V12"
                    stroke="#FFAC06"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Ongoing
              </div>
            </div>
          </div>
     

        <div className="pt-2">
          <span className="block text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44 ">
            Shipping address
          </span>
          <span className="text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/68">
            B23 Global estate HQ, Abuja.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 pt-2">
          <div>
            <span className="block text-xs   font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44 ">
              Shipping method
            </span>
            <span className="text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/68">
              Redstar express
            </span>
          </div>

          <div className="min-w-0">
            <span className="block text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/44 mb-1">
              Tracking number
            </span>
            <span
              className="block text-xs font-MontserratNormal leading-[2px] tracking-[2%] text-000000/68 w-full overflow-hidden truncate"
              title="NGN951395139753"
            >
              NGN951395139753
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-MontserratSemiBold text-[#161616]">
          <span>Order summary</span>
          <span className="text-xs text-gray-400 font-MontserratNormal">
            Amount
          </span>
        </div>

        <div className="space-y-3 pt-2 text-sm text-[#161616] font-MontserratNormal">
          <div className="flex justify-between">
            <span className="text-gray-500">Total items</span>
            <span>8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Discounts</span>
            <span>-N2,500</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>N20,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping fees</span>
            <span>N500</span>
          </div>
        </div>

        <hr className="border-gray-100 pt-2" />

        <div className="flex justify-between items-baseline pt-1">
          <span className="text-base font-MontserratSemiBold text-[#161616]">
            Total
          </span>
          <span className="text-2xl font-MontserratBold text-[#161616]">
            N20,500
          </span>
        </div>
      </div>
    </div>
  );
}
