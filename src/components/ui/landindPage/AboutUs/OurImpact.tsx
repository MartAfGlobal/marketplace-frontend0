import Image from "next/image";
import BgImage from "@/assets/images/ImapactBg.png";
import Globe from "@/assets/icons/globe.png";
import map from "@/assets/icons/map.png";
import Briefcase from "@/assets/icons/briefcase.png";
import Laptop from "@/assets/icons/laptop.png";
import { motion, easeOut } from "framer-motion";
import ImactImage from "@/assets/images/ImapctImage.png"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: easeOut },
  }),
};

export default function OurImpact() {
  const pointList = [
    {
      title: "Expanding Market Access",
      image: Globe,
      discription:
        "Providing market access to African businesses, allowing them to scale beyond local markets.",
    },
    {
      title: "Creating Job Opportunities",
      image: Briefcase,
      discription:
        "Boosting employment in e-commerce, logistics, and digital marketing.",
    },
    {
      title: "Preserving African Heritage",
      image: map,
      discription:
        "Promoting African heritage by making high-quality, locally made products available to a global audience.",
    },
    {
      title: "Empowering Digital Inclusion",
      image: Laptop,
      discription:
        "Providing tools and resources for businesses to thrive online.",
    },
  ];

  return (
    <div className="w-full h-c953 relative">
      <Image
        src={BgImage}
        alt="background image"
        width={500}
        height={953}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center ">
        <div className="text-ffffff text-center m w-full">
          <div>
            <h1 className="font-MontserratBold text-c40 leading-c100p pb-8 ">
              Our Impact
            </h1>
            <p className="font-MontserratSemiBold text-c18 x-auto">
              We believe in economic empowerment, digital inclusion, and
              cultural preservation. Through Martaf, we are:
            </p>
          </div>
          <div className="flex gap-c60 items-center justify-center mt-c56 w-full px-c60 ">
            <div className="h-150 w-full  max-w-115">
                <Image src={ImactImage} alt="group picture" height={600} width={460} className="object-cover"/>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
            {pointList.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-ffffff rounded-md p-6 h-70 w-87 flex flex-col"
              >
                <div className="flex  gap-4">
                  <div className="rounded-full bg-ffffff circle-shadow flex-shrink-0 h-c80 w-c80 flex justify-center items-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={40}
                      height={40}
                    />
                  </div>
                  <h2 className="text-161616 font-MontserratBold text-c24 text-xl">
                    {item.title}
                  </h2>
                </div>
                <p className="text-[#161616] mt-6 text-base leading-relaxed">
                  {item.discription}
                </p>
              </motion.div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
