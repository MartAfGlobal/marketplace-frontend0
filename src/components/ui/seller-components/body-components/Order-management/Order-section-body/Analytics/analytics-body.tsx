import { useState } from "react";
import AnalyticsHeader from "./analytics.header";
import OrderByCategory from "./Circle-chat/circleChats";
import OrderQuantityChart from "./order-chat";
import FilterDropdown from "../../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../../over-view/Filter-components/filterOptions";

export default function Analytics(){
    const [period, setPeriod] = useState("This Week");

    return(
        <div className="w-full space-y-c32">
           {/* Mobile Header: Overview + Filter */}
           <div className="flex lg:hidden justify-between items-center">
              <p className="text-c18 font-MontserratMedium text-000000">Overview</p>
              <FilterDropdown 
                options={filterOptions}
                onChange={(value: string) => setPeriod(value)}
              />
           </div>

           < AnalyticsHeader period={period} />
           
          < OrderQuantityChart externalPeriod={period} />
          <OrderByCategory/>
        </div>
    )
}