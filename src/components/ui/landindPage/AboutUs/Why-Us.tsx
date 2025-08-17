import ChooseCard from "../../cards/ChooseCard";
import Globe from "@/assets/images/globe.svg"
import Security from "@/assets/images/security.svg"
import Delivery from "@/assets/images/delivery.svg"
import Trust from "@/assets/images/trustus.svg"
import Mobile from "@/assets/images/mobile.png"
import keyImage from "@/assets/images/key.svg"


export default function WhyChooseUs() {
  return (
   <div className="text-center md:pt-c64 px-5 ">
  <h1 className="font-MontserratSemiBold text-base md:text-c32 m-auto">
    Why Choose Martaf?
  </h1>
  <p className="font-MontserratNormal text-sm md:text-base mb-8">
    Connecting you to the heart of African Commerce
  </p>

  

  <div className=" w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-[56px] gap-c24 md:mx-auto">
    <ChooseCard
      image={Globe}
      title="Pan-African Reach"
      description="Connecting buyers and sellers across Africa."
    />
    <ChooseCard
      image={Security}
      title="Secure Transactions"
      description="Ensuring safe and secure transactions to all users."
    />
    <ChooseCard
      image={Delivery}
      title="Fast Delivery"
      description="Quick and reliable delivery services."
    />
    <ChooseCard
      image={Trust}
      title="Trusted by Millions"
      description="A platform trusted by millions of users users."
    />
    <ChooseCard
      image={ Mobile}
      title="Mobile Friendly"
      description="Our platform is optimized for mobile devices."
    />
    <ChooseCard
      image={keyImage}
      title="Secure"
      description="We prioritize security to protect your data."
    />
  </div>
</div>

  );
}
