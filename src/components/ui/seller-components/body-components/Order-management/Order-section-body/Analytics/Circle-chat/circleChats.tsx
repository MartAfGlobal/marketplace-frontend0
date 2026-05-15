
import BestSelling from "../best-selling";
import FulfilmentRates from "./fulfilment-rate";
import SecondChat from "../../../../over-view/chat-section/second-chat";

export default function OrderByCategory() {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-c32 h-auto lg:h-c460-69 ">
      <div className="w-full  lg:max-w-c519-28 ">
        <SecondChat />
      </div>
      <div className="w-full lg:max-w-c495-72 space-y-2.5">
        <FulfilmentRates />
         <BestSelling/>
      </div>
    </div>
  );
}
