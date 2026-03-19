
import CustomerCard from "./cards/customer-card";
import OrderCard from "./cards/order-card";
import ProductStockCard from "./cards/product-card";
import SalesCard from "./cards/sales-card";


export default function OverviewCards(){
    

return(
    <div className="flex  w-full gap-c32 justify-center">
        <SalesCard/>
         <OrderCard/>
         <ProductStockCard/>
         <CustomerCard/>
    </div>
)

}