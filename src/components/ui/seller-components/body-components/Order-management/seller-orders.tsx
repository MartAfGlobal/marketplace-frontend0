import SearchInput from "../../../landindPage/Header/SearchInput";
import OrderSecions from "./Order-section-body/order-section-body";

export default function SelleOrderspage() {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between ">
        <p className="text-c18 font-MontserratSemiBold">Orders</p>

        <div className="w-full max-w-87.5">
          <SearchInput placeholder="" className="w-full max-w-87.5" />
        </div>
      </div>
      <OrderSecions />
    </div>
  );
}
