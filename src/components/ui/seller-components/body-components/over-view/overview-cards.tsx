import CustomerCard from "./cards/customer-card";
import OrderCard from "./cards/order-card";
import ProductStockCard from "./cards/product-card";
import SalesCard from "./cards/sales-card";

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:flex w-full gap-4 lg:gap-c32 justify-center">
      <div className="col-span-2 lg:col-span-1 lg:flex-1">
        <SalesCard />
      </div>
      <div className="hidden lg:block lg:flex-1 ">
        <OrderCard />
      </div>
       <div className="col-span-1 lg:flex-1 lg:hidden">
        <CustomerCard />
      </div>
      <div className="col-span-1 lg:flex-1">
        <ProductStockCard />
      </div>
      <div className="col-span-1 lg:flex-1 hidden md:block">
        <CustomerCard />
      </div>
    </div>
  );
}
