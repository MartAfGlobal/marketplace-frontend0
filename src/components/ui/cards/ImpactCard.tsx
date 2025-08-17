import Image from "next/image";
import { motion } from "framer-motion";


import {ChooseCardProps} from "@/types/global"

export default function ImpactCard({ image, title, description }: ChooseCardProps) {
  return (
    <motion.div 
     initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    className="md:w-49.75 w-full max-w-c132-55 text-161616">
      <div className="flex justify-center ">
        <Image src={image} alt={title} width={120} height={120} className="w-20 h-20 md:w-30 md:h-30" />
      </div>
      <h2 className="font-MontserratSemiBold text-c24 md:text-[32px] pb-1 md:pb-2 pt-4 md:pt-5.75 text-161616">{title}</h2>
      <p className="md:text-base font-MontserratNormal text-c13-32">{description}</p>
    </motion.div>
  );
}


