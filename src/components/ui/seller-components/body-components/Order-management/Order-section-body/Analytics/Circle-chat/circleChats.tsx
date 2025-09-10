
import BestSelling from "../best-selling";
import FulfilmentRates from "./fulfilment-rate";
import CategoryChat from "./order-by-category";

export default function OrderByCategory() {
  return (
    <div className="w-full flex gap-c32 h-c460-69 ">
      <div className="w-full  max-w-c519-28 ">
        <CategoryChat/>
      </div>
      <div className="w-full max-w-c495-72 space-y-2.5">
        <FulfilmentRates />
         <BestSelling/>
      </div>
    </div>
  );
}
