"use client";

import HeroPage from "@/components/ui/landindPage/HeroPage/HeroPage";
import MobileCategory from "@/components/ui/mobile/mobile-category";
import Gallary from "@/components/ui/mobile/gallary";
import ProductListPage from "@/components/ui/landindPage/ShoppingItems/Product-List";
import AboutPage from "@/components/ui/landindPage/AboutUs/AboutUs";
import JoinUsPage from "@/components/ui/landindPage/JoinUs/JoinUs";
import WireframeLoader from "@/components/ui/WireframeLoader";
import { useHttp } from "@/hooks/use-http";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "@/store/user-data/products/product-slice";
import { transformApiProduct } from "@/utils/transformApiProduct";

export default function Home() {
  const dispatch = useDispatch();
  const { sendHttpRequest } = useHttp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleProducts = (res: any) => {
      console.log("Raw API Response:", res);

      const apiResults = res?.data?.results || []; // drill into .data
      console.log("API Results:", apiResults);

      const products = apiResults.map(transformApiProduct);
      console.log("Mapped products:", products);

      dispatch(setProducts(products));
    };

    console.log("Sending HTTP request...");
    sendHttpRequest({
      requestConfig: {
        url: "/products/list/",
        method: "GET",
      },
      successRes: handleProducts,
    });
  }, [dispatch, sendHttpRequest]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WireframeLoader />;

  return (
    <main>
      <div className="md:px-15 pt-6">
        <HeroPage />
        <div className="md:hidden">
          <MobileCategory />
        </div>
        <div className="md:hidden">
          <Gallary />
        </div>
        <ProductListPage />
        <AboutPage />
      </div>
      <JoinUsPage />
    </main>
  );
}
