"use client";

import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import OwnerImage from "@/assets/images/Owner.png";
import houseImage from "@/assets/icons/house.png";
import truck from "@/assets/icons/truck2.png";
import wallet from "@/assets/icons/wallet.png";
import Chart from "@/assets/icons/chart.svg";
import AccessLock from "@/assets/icons/accesslock.png";
import HandShake from "@/assets/icons/handshake.png";
import Earth from "@/assets/icons/earth.png";
import ArrowTarget from "@/assets/icons/target-arrow.png";


// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: easeOut },
  }),
};

export default function OurMission() {
  return (
    <div className="w-full bg-f4f4f4">
      {/* Header */}
      <motion.div
        className="w-full px-30 pt-c48"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="font-MontserratBold text-c40 text-center"
          variants={fadeUp}
          custom={0}
        >
          Our Mission & Vision
        </motion.h1>
        <motion.p
          className="font-MontserratSemiBold text-center mt-c32 leading-9 text-c18"
          variants={fadeUp}
          custom={1}
        >
          At Martaf, our mission and vision guide us in connecting manufacturers
          and consumers, driving growth, innovation, and global recognition for
          African craftsmanship.
        </motion.p>
      </motion.div>

      {/* Mission & Vision Section */}
      <div className="px-c80 py-c48 flex gap-c40 justify-center items-center lg:flex-nowrap flex-wrap">
        {[
          {
            title: "Our Mission",
            text: "Bridging the gap between manufacturers and consumers by empowering businesses, creating opportunities, and showcasing African craftsmanship globally",
            bg: "bg-ffffff",
            textColor: "text-6a0dad",
          },
          {
            image: OwnerImage,
            isImage: true,
          },
          {
            title: "Our Vision",
            text: "To become Africa’s leading digital marketplace, fostering trade and economic empowerment while making African-made goods accessible to global markets.",
            bg: "bg-ffffff",
            textColor: "text-6a0dad",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={
              item.isImage
                ? "h-c480 w-c400 flex items-center justify-center"
                : `h-c400 w-c400 ${item.bg} rounded-c24 flex flex-col items-center justify-center`
            }
          >
            {item.isImage ? (
              <Image
                src={item.image}
                alt="owner image"
                width={400}
                height={480}
                className="object-cover h-full w-full rounded-c24 NewShadow"
              />
            ) : (
              <>
                <h1 className={`text-c32 font-MontserratBold ${item.textColor}`}>
                  {item.title}
                </h1>
                <p className="text-base text-center p-c28 font-MontserratSemiBold leading-9 text-161616">
                  {item.text}
                </p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Why Choose Us */}
      <motion.div
        className="pt-c48"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="w-full px-30">
          <motion.h1
            className="font-MontserratBold text-c40 text-center"
            variants={fadeUp}
            custom={0}
          >
            Why Choose Us
          </motion.h1>
          <motion.p
            className="font-MontserratSemiBold text-center leading-9 mt-c32 text-c18"
            variants={fadeUp}
            custom={1}
          >
            At Martaf, we connect you with authentic African goods while
            empowering local businesses. We ensure ethical sourcing, fair trade,
            and a seamless shopping experience.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="px-18 py-c48 flex flex-wrap lg:flex-nowrap  gap-9 justify-center">
          {[
            {
              icon: houseImage,
              title: "E-commerce Marketplace",
              text: "A digital hub for African manufacturers, artisans, and retailers to showcase and sell their products.",
              bg: "bg-6a0dad",
              textColor: "text-f0f0f",
            },
            {
              icon: truck,
              title: "Logistics & Delivery Solutions",
              text: "Reliable shipping and fulfillment services to ensure seamless transactions.",
              bg: "bg-ffffff",
              textColor: "text-6a0dad",
            },
            {
              icon: wallet,
              title: "Secure Payment Processing",
              text: "Multiple payment options, including mobile money, bank transfers, and digital wallets.",
              bg: "bg-6a0dad",
              textColor: "text-f0f0f",
            },
            {
              icon: Chart,
              title: "Marketing & Analytics",
              text: "Tools to help sellers grow their businesses and reach a wider audience.",
              bg: "bg-ffffff",
              textColor: "text-6a0dad",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="relative w-c303 h-c400"
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex absolute z-10 top-0 left-1/2 -translate-x-1/2 items-center justify-center bg-white circle-shadow h-30 w-30 rounded-full">
                <Image src={card.icon} alt={card.title} width={56} height={52} />
              </div>
              <div
                className={`circle-shadow absolute left-1/2 -translate-x-1/2 bottom-0 pt-18.5 ${card.bg} w-c303 rounded-c24 h-c340`}
              >
                <h1
                  className={`font-MontserratBold text-c24 leading-c100p ${card.textColor} text-center`}
                >
                  {card.title}
                </h1>
                <p
                  className={`font-MontserratSemiBold leading-9 mt-c24 px-3 text-base ${card.textColor} text-center`}
                >
                  {card.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What We Offer */}
      <motion.div
        className="w-full px-30 pt-c48"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="font-MontserratBold text-c40 text-center"
          variants={fadeUp}
          custom={0}
        >
          What We Offer
        </motion.h1>
        <motion.p
          className="font-MontserratSemiBold text-center leading-9 mt-c32 text-c18"
          variants={fadeUp}
          custom={1}
        >
          At Martaf, we connect you with authentic African goods while
          empowering local businesses. We ensure ethical sourcing, fair trade,
          and a seamless shopping experience.
        </motion.p>

        <div className="flex flex-col gap-c80 py-14">
          {[
            [
              {
                icon: AccessLock,
                title: "Direct Access to African-Made Goods",
                text: "Shop directly from African businesses and discover unique, high-quality products.",
              },
              {
                icon: HandShake,
                title: "Empowering Local Entrepreneurs",
                text: "We help small and medium enterprises (SMEs) expand their market reach.",
              },
            ],
            [
              {
                icon: Earth,
                title: "Fair Trade & Ethical Sourcing",
                text: "Supporting sustainable business practices and fair compensation for producers.",
              },
              {
                icon: ArrowTarget,
                title: "User-Friendly Experience",
                text: "Our platform is designed for seamless navigation, making online shopping easy and secure.",
              },
            ],
          ].map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex w-full gap-25 justify-center lg:flex-nowrap flex-wrap"
            >
              {row.map((item, i) => (
                <motion.div
                  key={i}
                  className="w-140 h-35 flex gap-c32 items-center"
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="flex flex-shrink-0 items-center justify-center bg-white circle-shadow h-35 w-35 rounded-full">
                    <Image src={item.icon} alt={item.title} width={80} height={80} />
                  </div>
                  <div>
                    <h1 className="font-MontserratBold text-c24 leading-c100p text-6a0dad">
                      {item.title}
                    </h1>
                    <p className="font-MontserratSemiBold text-base text-161616 mt-c24">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
