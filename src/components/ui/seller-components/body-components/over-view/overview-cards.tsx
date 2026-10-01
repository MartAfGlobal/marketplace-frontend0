import CustomerCard from "./cards/customer-card";
import OrderCard from "./cards/order-card";
import ProductStockCard from "./cards/product-card";
import SalesCard from "./cards/sales-card";

export default function OverviewCards({ analytics }: { analytics: any }) {
  return (
    <div className="grid grid-cols-2 lg:flex w-full gap-4 lg:gap-c32 justify-center">
      <div className="col-span-2 lg:col-span-1 lg:flex-1">
        <SalesCard analytics={analytics} />
      </div>
      <div className="hidden lg:block lg:flex-1 ">
        <OrderCard analytics={analytics} />
      </div>
       <div className="col-span-1 lg:flex-1 lg:hidden">
        <CustomerCard analytics={analytics} />
      </div>
      <div className="col-span-1 lg:flex-1">
        <ProductStockCard analytics={analytics} />
      </div>
      <div className="col-span-1 lg:flex-1 hidden md:block">
        <CustomerCard analytics={analytics} />
      </div>
    </div>
  );
}
