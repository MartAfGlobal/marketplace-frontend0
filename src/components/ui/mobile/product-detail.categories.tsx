"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CategoryD } from "@/types/global";
import { motion, Variants } from "framer-motion";

import CartRight from "@/assets/mobile/CaretRight.png";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";

export default function ProductDetailCategory({ slug }: { slug: string })  {
   const router = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [hasOpenedRatings, setHasOpenedRatings] = useState(false);

  const Categories: CategoryD[] = [
    {
      name: "Product details",
      subcategories:
        "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016  Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support Carbonite web goalkeeper gloves are ergonomically designed to give easy fit",
    },
    {
      name: "Product Specifications",
      subcategories: (
        <div className="text-161616 space-y-4">
          <h1 className="font-MontserratSemiBold text-sm">
            What’s in the box?
          </h1>
          <div className="font-MontserratSemiBold text-sm space-y-2">
            <p>. 1 pair of shoes</p>
            <p>. 1 pair of shoelaces</p>
          </div>
        </div>
      ),
    },
    {
      name: "Ratings & Reviews",
      subcategories: (
        <div className="space-y-4.5">
          <div className="mt-3 flex items-center gap-3">
            <p className="font-MontserratMedium text-base text-161616">4.5/5</p>
            <div className="flex gap-0.5 items-center">
              <Image
                src={YellowStar}
                alt="yellow star"
                height={18.95}
                width={20}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                height={18.95}
                width={20}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                height={18.95}
                width={20}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                height={18.95}
                width={20}
              />
              <Image src={Star} alt="yellow star" height={18.95} width={20} />
            </div>
          </div>
          <div className="space-y-2">
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
              <p className="font-MontserratNormal text-c12 leading-4 mt-2 text-000000">there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.</p>
            </div>
          </div>
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
    <div className="w-full px-6">
      <div className="space-y-4">
        {Categories.map((cat) => (
          <div key={cat.name} className=" pb-4">
            <button
              onClick={() => toggleCategory(cat.name)}
              className="w-full text-left font-MontserratSemiBold text-base flex justify-between items-center"
            >
              {cat.name}
              <span>
                {openCategory === cat.name && cat.name !== "Ratings & Reviews" ? ( 
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
