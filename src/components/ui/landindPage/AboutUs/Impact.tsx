import ImpactCard from "../../cards/ImpactCard";
import Help from "@/assets/images/help.svg";
import ProductList from "@/assets/images/productList.svg";
import HelpWorld from "@/assets/images/helpworld.svg";
import Average from "@/assets/images/average.svg";

export default function Impact() {
  return (
    <div className="text-center pt-c48 md:pt-28">
      <h1 className="font-MontserratSemiBold text-base md:text-c32 text-161616 md:pb-c64  pb-c48">
        Our impact in Numbers
      </h1>
      <div className="text-center  md:pt-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-c32 md:gap-25 px-c32 justify-items-center">
          <ImpactCard
            image={Help}
            title="1.5M"
            description="Satisfied Customers"
          />
          <ImpactCard
            image={ProductList}
            title="500K"
            description="Products Listed"
          />
          <ImpactCard
            image={Average}
            title="4.7/5"
            description="Average Rating"
          />
          <ImpactCard
            image={HelpWorld}
            title="100+"
            description="Countries Served"
          />
        </div>
      </div>
    </div>
  );
}
