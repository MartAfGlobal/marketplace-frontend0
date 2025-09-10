import Image from "next/image";

import { Button } from "@/components/ui/Button/Button";

import BabyIcon from "@/assets/Seller/babyIcon.png";
import Payin from "@/assets/Seller/Payin.png"
import Payout from "@/assets/Seller/payout2.png"
import Pending from "@/assets/Seller/pending.png"
import RefundIcon from "@/assets/Seller/refund.png"

import FilterDropdown from "../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../over-view/Filter-components/filterOptions";

const moneyFlow =[
    { label:"Sales", amount:"N70,000.00", icon:  Payin },
    { label:"Payouts", amount:"N20,000.00", icon:  Payout },
    { label:"Pending sales", amount:"N30,000.00", icon:  Pending },
    { label:"Refunds", amount:"N15,000.00", icon: RefundIcon },
]

export default function OverViewHeader() {
  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between  pb-6 border-b border-b-000000/10 mb-8 ">
        <div className=" flex gap-3 items-end">
          <div className="w-c32 h-9 flex items-center justify-center">
            <Image src={BabyIcon} alt="balance" width={31} height={24} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-MontserratNormal">Balance</p>
            <span className="text-c32 font-MontserratNormal">N50,000.00</span>
          </div>
        </div>
        <div className="w-full max-w-86.25 flex gap-6">
          <Button className="w-full max-w-38.25">Withdraw</Button>
          <Button variant={"secondary"} className="w-full max-w-38.25">
            Deposit
          </Button>
        </div>
      </div>
      <div className="w-full space-y-6 ">
        <div className="flex justify-between items-center">
        <p className="font-MontserratNormal text-c18">Money flow</p>
        <FilterDropdown
          options={filterOptions}
          onChange={(value) => console.log("Selected:", value)}
        />
      </div>
      <div className="w-full flex gap-8">
        {moneyFlow.map((item)=>(
            <div key={item.label} className="flex gap-2 items-end w-full max-w-58">
                <div className="pb-3.25">
                    <Image src={item.icon} alt={item.label} width={19} height={18}/>
                </div>
                <div className="space-y-3">
                    <p className="text-sm font-MontserratNormal">{item.label}</p>
                    <p className="text-c32 font-MontserratNormal">{item.amount}</p>
                </div>
            </div>
        ))}
      </div>
      </div>
    </div>
  );
}
