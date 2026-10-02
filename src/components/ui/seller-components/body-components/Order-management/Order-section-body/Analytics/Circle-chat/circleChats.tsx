import BestSelling    from "../best-selling";
import FulfilmentRates from "./fulfilment-rate";
import SecondChat      from "../../../../over-view/chat-section/second-chat";

interface OrderByCategoryProps {
  /** Shared time-window from the parent Analytics page (same as the trend chart). */
  period?: string;
}

export default function OrderByCategory({ period }: OrderByCategoryProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-c32 h-auto lg:h-c460-69">
      {/* Category donut — uses the same period as the trend chart */}
      <div className="w-full lg:max-w-c519-28">
        <SecondChat externalPeriod={period} />
      </div>

      <div className="w-full lg:max-w-c495-72 space-y-2.5">
        <FulfilmentRates />
        <BestSelling />
      </div>
    </div>
  );
}
