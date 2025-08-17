"use client";

import AboutNav from "@/components/ui/landindPage/AboutUs/about-us-nav";
import AboutHero from "@/components/ui/landindPage/AboutUs/aboutaHero";

import { useState, useEffect, useMemo } from "react";
import WireframeLoader from "@/components/ui/WireframeLoader";
import IconButtonCarousel from "@/components/ui/others/Fags/IconButtonCarousel";
import Bulb from "@/assets/icons/fags/bulb.png"
import Cart from "@/assets/icons/fags/material-symbols_orders-outline.png"
import Wallet from "@/assets/icons/fags/fluent_payment-32-regular.png"
import Shipping from "@/assets/icons/fags/mdi_truck-shipping.png"
import Refund from "@/assets/icons/fags/hugeicons_return-request.png"
import Checkoutcart from "@/assets/icons/fags/f7_cart.png"
import Security from "@/assets/icons/fags/security.png"
import Image from "next/image";
import GeneralInformationUI from "@/components/ui/others/Fags/Section/GeneralInfo";
import ShoppingOrdersUI from "@/components/ui/others/Fags/Section/ShoppingOrdersUI";
import PaymentsBillingUI from "@/components/ui/others/Fags/Section/PaymentsBillingUI";
import ShippingDeliveryUI from "@/components/ui/others/Fags/Section/ShippingDeliveryUI";
import ReturnsRefundsUI from "@/components/ui/others/Fags/Section/ReturnsRefundsUI";
import SellingOnMartAfUI from "@/components/ui/others/Fags/Section/SellingOnMartAfUI";
import SecurityPrivacyUI from "@/components/ui/others/Fags/Section/SecurityPrivacyUI";
import ContactUsUI from "@/components/ui/others/Fags/Section/ContactUsUI";


import BgImage from "@/assets/images/FagsLanding.png"

export default function FagsPage() {
  const [loading, setLoading] = useState(true);

const items = useMemo(
    () => [
      {
        id: 1,
        icon: <Image src={Bulb} alt="General Information" width={48} height={48} />,
        label: "General Information",
        component: <GeneralInformationUI />,
      },
      {
        id: 2,
        icon: <Image src={Cart} alt="Shopping & Orders" width={48} height={48} />,
        label: "Shopping & Orders",
        component: <ShoppingOrdersUI />,
      },
      {
        id: 3,
        icon: <Image src={Wallet} alt="Payments & Billing" width={48} height={48} />,
        label: "Payments & Billing",
        component: <PaymentsBillingUI />,
      },
      {
        id: 4,
        icon: <Image src={Shipping} alt="Shipping & Delivery" width={48} height={48} />,
        label: "Shipping & Delivery",
        component: <ShippingDeliveryUI />,
      },
      {
        id: 5,
        icon: <Image src={Refund} alt="Returns & Refunds" width={48} height={48} />,
        label: " Returns & Refunds",
        component: <ReturnsRefundsUI />,
      },

        {
        id: 6,
        icon: <Image src={Checkoutcart} alt="Selling on MartAf" width={48} height={48} />,
        label: "Selling on MartAf",
        component: <SecurityPrivacyUI />,
      },
      {
        id: 7,
        icon: <Image src={Security} alt="Security & Privacy" width={48} height={48} />,
        label: "Security & Privacy",
        component: <SellingOnMartAfUI />,
      },
    
      {
        id: 8,
        icon: <Image src={Refund} alt="Contact Us" width={48} height={48} />,
        label: "Contact Us",
        component: <ContactUsUI />,
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div>
      <AboutNav />
      <AboutHero
        bgImage={BgImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQs" }, // no href means just text
        ]}
        smallTitle="FAQs"
        mainTitle="How Can We Help?"
        description="Find quick answers to common questions about shopping, payments, shipping, and more."
      />
      
      <IconButtonCarousel options={items} />
      
    </div>
  );
}
