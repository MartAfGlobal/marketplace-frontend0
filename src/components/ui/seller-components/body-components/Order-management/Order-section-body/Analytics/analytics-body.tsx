import AnalyticsHeader from "./analytics.header";
import OrderByCategory from "./Circle-chat/circleChats";
import OrderQuantityChart from "./order-chat";

export default function Analytics(){
    return(
        <div className="w-full space-y-c32">
           < AnalyticsHeader/>
           
          < OrderQuantityChart/>
          <OrderByCategory/>
        </div>
    )
}