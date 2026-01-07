"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CategoryD, ProductDetail } from "@/types/global";
import { motion, Variants } from "framer-motion";

import CartRight from "@/assets/mobile/CaretRight.png";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ProductProps {
  ProductDetail: ProductDetail | null;
  slug: string;
}

export default function ProductDetailCategory({
  slug,
  ProductDetail,
}: ProductProps) {
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [hasOpenedRatings, setHasOpenedRatings] = useState(false);
  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );

  const Categories: CategoryD[] = [
    {
      name: "Product details",
      subcategories: productDetails?.description,
    },
    {
      name: "Product Specifications",
      subcategories: (
        <div className="text-161616 space-y-4">
          <div className="font-MontserratSemiBold text-sm space-y-2">
            {ProductDetail?.specifications &&
            ProductDetail.specifications.length > 0 ? (
              <ul className="list-disc pl-5 space-y-3">
                {ProductDetail.specifications.map((spec: any) => (
                  <li key={spec.id} className="text-sm text-gray-700">
                    {spec.title}: {spec.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No specifications available.
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Ratings & Reviews",
      subcategories: (
        <div className="space-y-4.5">
          <div className="mt-3 flex items-center gap-3">
            <p className="font-MontserratMedium text-base text-161616">
              {productDetails?.rating_average}/5
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={
                    i <= Math.floor(Number(ProductDetail?.rating_average))
                      ? YellowStar
                      : Star
                  }
                  alt="star rate"
                  width={32}
                  height={30.32}
                  className="h-4 w-4 md:h-[30.32px] md:w-8"
                />
              ))}
            </div>
          </div>
          {/* <div className="space-y-2">
            <div className="text-161616 flex justify-between">
              <p className="text-sm font-MontserratSemiBold">Customer Name</p>
              <p className=" font-MontserratNormal text-c12 text-646464">
                Jan 02, 2024{" "}
              </p>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="flex gap-0.5 items-center">
                  <Image
                    src={YellowStar}
                    alt="yellow star"
                    height={15.16}
                    width={16}
                  />
                  <Image
                    src={YellowStar}
                    alt="yellow star"
                    height={15.16}
                    width={16}
                  />
                  <Image
                    src={YellowStar}
                    alt="yellow star"
                    height={15.16}
                    width={16}
                  />
                  <Image
                    src={YellowStar}
                    alt="yellow star"
                    height={15.16}
                    width={16}
                  />
                  <Image
                    src={Star}
                    alt="yellow star"
                    height={18.95}
                    width={20}
                  />
                </div>
                <p className="text-128807 font-MontserratSemiBold text-c12">
                  Verified Purchase
                </p>
              </div>
              <p className="font-MontserratNormal text-c12 leading-4 mt-2 text-000000">
                there should probably something nice this guy will write that
                will sound sweet in the ear for people to buy the product.
              </p>
            </div>
          </div> */}
        </div>
      ),
    },
  ];

  const expandVariants: Variants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const toggleCategory = (name: string) => {
    if (name === "Ratings & Reviews") {
      if (openCategory === name && hasOpenedRatings) {
        // ✅ navigate to the full review page using slug
        router.push(`/product/${slug}/review`);
      } else {
        setOpenCategory(name);
        setHasOpenedRatings(true);
      }
    } else {
      setOpenCategory((prev) => (prev === name ? null : name));
    }
  };
  return (
    <div className="w-full ">
      <div className="space-y-4">
        {Categories.map((cat) => (
          <div key={cat.name} className=" pb-4">
            <button
              onClick={() => toggleCategory(cat.name)}
              className="w-full text-left font-MontserratSemiBold text-base flex justify-between items-center"
            >
              {cat.name}
              <span>
                {openCategory === cat.name &&
                cat.name !== "Ratings & Reviews" ? (
                  <Image
                    src={CartRight}
                    alt="open"
                    width={20}
                    height={20}
                    className="rotate-90"
                  />
                ) : (
                  <Image src={CartRight} alt="open" width={20} height={20} />
                )}
              </span>
            </button>

            {/* Expandable Content */}
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate={openCategory === cat.name ? "expanded" : "collapsed"}
              className="overflow-hidden text-sm text-gray-600 mt-2"
            >
              {typeof cat.subcategories === "string" ? (
                <div>
                  <p className="font-MontserratNormal text-sm leading-5">
                    {cat.subcategories}
                  </p>
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="mt-4 font-MontserratSemiBold text-c12 text-6a0dad"
                  >
                    Read less
                  </button>
                </div>
              ) : (
                cat.subcategories
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
