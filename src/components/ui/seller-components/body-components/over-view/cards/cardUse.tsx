

import { UsableCardProps } from "@/types/global";
import { useSelector } from "react-redux";


export default function UsableCard({ title, children }: UsableCardProps) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  return (
    <div className="seller-overview-panel p-6 h-fit min-h-56 w-full max-w-78 rounded-c16 circle-shadow bg-white">
      <h3 className={`text-base font-MontserratNormal pl-5.5 ${isIncomplete ? "text-000000/12" :"text-000000"}`}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
