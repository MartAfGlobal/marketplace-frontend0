import Image from "next/image";
import JoinUs from "@/assets/images/AboutJoin.png";
import { motion } from "framer-motion";

export default function JoinU() {
  return (
    <div className="flex flex-col items-center lg:flex-row  w-ful">
      {/* Left: Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 h-c500"
      >
        <Image
          src={JoinUs}
          alt="Join Martaf"
          width={720}
          height={520}
          className="object-cover w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 h-c500 bg-[#6A0DAD] flex items-center pl-6 md:pl-20"
      >
        <div className="w-full max-w-c506">
         
          <h1 className="text-c40 font-MontserratBold leading-c100p pb-c32 text-f0f0f ">
            Join Us & Be Part of the Martaf Community
          </h1>
          <p className="font-MontserratMedium text-c18 leading-c28 text-f0f0f">
            Whether you're a business looking to expand or a shopper seeking
            unique African products, Martaf connects you to the best of African
            commerce.
          </p>
          <button className="w-54.5 bg-50ad0d h-c44 rounded-c50 font-MontserratSemiBold text-base text-000000  mt-c32">
            Explore Marketplace
          </button>
        </div>
      </motion.div>
    </div>
  );
}
