"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AfricaMap from "@/assets/icons/mapping.svg";
import customer from "@/assets/icons/customer.svg";
import delivery from "@/assets/icons/truck22.svg";
import support from "@/assets/icons/support.svg";
import security from "@/assets/icons/ContactlessPayment.svg";

export default function MapSection() {
  return (
    <section className="py-20 md:py-c64 px-6 md:px-18 bg-000000 text-white relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-c32 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full lg:max-w-191.5 md:pl-10 lg:pl-c64 "
        >
          <h2 className="text-3xl md:text-5xl font-MontserratNormal mb-6 leading-[150%]">
            Martaf is not just a marketplace
          </h2>
          <div className="space-y-6 text-base text-white/68">
            <p>
              We are the infrastructure that makes African commerce work —
              globally. We verify sellers, standardize quality, handle export
              logistics, process international payments, and present African
              products to the world with the branding and trust they deserve.
            </p>
            <p>
              By building the infrastructure for global logistics and secure
              payments, we empower local creators to compete on a world stage
              without boundaries.
            </p>
          </div>
          <Link
            href="#"
            className="inline-block bg-6a0dad text-white py-4 px-c48 mt-10 rounded-[48px] font-MontserratSemiBold hover:bg-[#5a0c9d] transition-colors duration-300"
          >
            Learn more
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex justify-center -mr-18"
        >
          <Image
            src={AfricaMap}
            alt="Africa Tech Map"
            width={827}
            height={794}
            className="max-w-full "
          />
        </motion.div>
      </div>

      {/* We are building with Section */}
      <div className="mt-c56 md:px-16">
        <p className="text-white/68 text-c18 font-MontserratNormal mb-8">
          We are building with:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[
            {
              icon: customer,
              title: "Verified Sellers",
              desc: "Verified African sellers across fashion, beauty, food, and craft",
            },
            {
              icon: delivery,
              title: "Logistics framework",
              desc: "Export logistics partnerships for reliable global delivery",
            },
            {
              icon: security,
              title: "Secured payments",
              desc: "Secure international payment processing",
            },
            {
              icon: support,
              title: "Quality products",
              desc: "Quality assurance standards for every product category",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3 max-w-[288px]">
              <div className="flex items-center gap-2.5">
                <Image
                  src={item.icon}
                  alt={`${item.title} icon`}
                  width={26}
                  height={26}
                />
                <h4 className="text-white/68 text-c18 font-MontserratNormal">
                  {item.title}
                </h4>
              </div>
              <p className="text-white/60 text-c18 leading-[26px] font-MontserratSemiBold">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
