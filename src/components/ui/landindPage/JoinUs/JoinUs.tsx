import Image from "next/image";
import JoinUs from "@/assets/images/JoinImage.svg";
import { motion } from "framer-motion";

export default function JoinUsPage() {
  return (
    <div className="flex flex-col items-center lg:flex-row mt-[112px] w-ful">
      {/* Left: Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 h-c500 relative"
      >
        <Image
          src={JoinUs}
          alt="Join Martaf"
          width={720}
          height={520}
          className="object-cover w-full h-full brightness-20"
        />
         <div className="w-full md:hidden text-center px-c24 absolute top-0  translate-y-1/2">
          <p className="font-MontserratSemiBold text-c12 text-f0f0f pb-4">
            Empowering African Commerce
          </p>
          <h1 className="text-c32 font-MontserratBold text-f0f0f  pb-4">
            Join Martaf Today
          </h1>
          <p className="font-MontserratMedium text-sm  text-f0f0f">
            Become a part of Africa’s largest e-commerce marketplace. Whether
            you’re a buyer or a seller, we offer the tools and support you need
            to succeed.
          </p>
          <button className="w-c192  bg-ff715b h-c48 rounded-c8 font-MontserratSemiBold text-c12 text-ffffff mt-c32">
            Register now
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 h-c500 bg-6a0dad md:flex items-center pl-6 md:pl-20 hidden"
      >
        <div className="w-full max-w-c506">
          <p className="font-MontserratSemiBold text-base text-f0f0f pb-4">
            Empowering African Commerce
          </p>
          <h1 className="text-c32 font-MontserratBold text-f0f0f  pb-4">
            Join Martaf Today
          </h1>
          <p className="font-MontserratMedium text-sm text-f0f0f">
            Become a part of Africa’s largest e-commerce marketplace. Whether
            you’re a buyer or a seller, we offer the tools and support you need
            to succeed.
          </p>
          <button className="w-c192 border border-ffffff h-c44 rounded-c8 font-MontserratSemiBold text-sm text-ffffff mt-c32">
            Register now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
