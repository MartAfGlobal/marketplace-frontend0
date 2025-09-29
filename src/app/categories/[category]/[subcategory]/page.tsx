"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import navright from "@/assets/icons/CaretRight.svg";
import { categories } from "@/utils/data/categories";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ProductSection from "@/components/ui/landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import adBanner1 from "@/assets/images/adbanner1.svg";
import adBanner2 from "@/assets/images/adbanner2.svg";

export default function SubCategoryPage() {
  const { category, subcategory } = useParams();
  const products = useSelector((state: RootState) => state.products.items);

  if (!products || products.length === 0) return <p>Loading products...</p>;

  const grouped = products.reduce(
    (acc: Record<string, typeof products>, product) => {
      const section = product.section || "Today";
      if (!acc[section]) acc[section] = [];
      acc[section].push(product);
      return acc;
    },
    {} as Record<string, typeof products>
  );

  const sectionOrder = ["Today", "Trending", "Popular Search", "Discount"];
  // Find category
  const foundCategory = categories.find(
    (cat) => cat.label === decodeURIComponent(category as string)
  );

  // Find subcategory
  const foundSub = foundCategory?.subcategories.find(
    (sub) => sub.title === decodeURIComponent(subcategory as string)
  );

  if (!foundCategory || !foundSub) {
    return <p className="p-10">Subcategory not found.</p>;
  }

  return (
    <div className="px-15">
      {/* Breadcrumb */}
      <div className="py-8 flex items-center gap-1 text-sm text-161616  font-semibold font-MontserratMedium text-c12">
        <Link href="/" className="text-000000/10">
          Home
        </Link>{" "}
        <Image src={navright} alt="nav" width={16} height={16} />
        <Link
          className=" text-161616 "
          href="/"
        >
          {foundCategory.label}
        </Link>
        <Image src={navright} alt="nav" width={16} height={16} />
        <span className="font-semibold font-MontserratMedium text-c12">
          {foundSub.title}
        </span>
      </div>

      {/* Hero */}
      <div
        className="h-70 flex items-center justify-center text-white text-3xl font-bold bg-cover bg-center  relative rounded-c30 overflow-hidden"
        style={{
          backgroundImage: `url(${foundSub.image.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black/5"></div>
        <h1 className="relative z-10">{foundSub.title}</h1>
      </div>

      {/* Content */}
      <div className="pt-c64 py-c48">
        <div className="w-full px-4.75 mx-auto pt-12">
          {sectionOrder.map((title) =>
            grouped[title] ? (
              <ProductSection
                key={title}
                title={title}
                products={grouped[title]}
              />
            ) : null
          )}
        </div>
        <div className="flex gap-8 justify-center w-full">
          <div className="w-full">
             <Image src={adBanner1} alt="ad" width={640} height={300} className="w-full" />
          </div>
          <div className="w-full">
             <Image src={adBanner1} alt="ad" width={640} height={300} className="w-full" />
          </div>
         
      
        </div>
      </div>
    </div>
  );
}
