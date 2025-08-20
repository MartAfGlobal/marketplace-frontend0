import Image from "next/image";
import {ChooseCardProps} from "@/types/global"
import { motion } from "framer-motion";

export default function ChooseCard({ image, title, description }: ChooseCardProps) {
  return (
    <motion.div 
     initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    className="md:w-[312px] w-full">
      <div className="flex justify-center ">
        <Image src={image} alt={title} width={64} height={64} className="w-c48 h-c48 md:w-c64 md:h-c64" />
      </div>
      <h2 className="fontN-MontserratMedium md:text-c18 text-3 md:pb-2  pb-2 mt-4 md:pt-6 ">{title}</h2>
      <p className="text-c12 md:text-base font-MontserratNormal">{description}</p>
    </motion.div>
  );
}