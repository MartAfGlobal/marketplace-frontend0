import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/images/logo.svg";
import Amico from "@/assets/icons/amico.png";

import SellerLogin from "@/components/ui/forms/auth/sellers/login";
import type { Metadata } from "next";

// 🔹 Metadata for SEO
export const metadata: Metadata = {
  title: "Seller Login | MARTAF",
  description:
    "Log in to your MARTAF seller account to manage your store, track sales, and connect with buyers. Secure access for MARTAF marketplace sellers.",
  keywords: [
    "MARTAF seller login",
    "seller account login",
    "MARTAF marketplace",
    "manage store online",
    "business dashboard",
  ],
  openGraph: {
    title: "Seller Login | MARTAF",
    description:
      "Access your MARTAF seller account. Manage your products, view orders, and grow your business on MARTAF.",
    url: "https://yourdomain.com/seller/login", // update with your real domain
    siteName: "MARTAF",
    images: [
      {
        url: "/og-image.png", // add this image in your public/ folder
        width: 1200,
        height: 630,
        alt: "MARTAF Seller Login",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seller Login | MARTAF",
    description:
      "Securely log in to your MARTAF seller account and manage your business online.",
    images: ["/og-image.png"],
  },
};

export default function SellerLogingPage() {
  return (
    <div className="h-screen w-full flex justify-center">
      <div className="bg-6a0dad  w-full flex flex-col items-center justify-center ">
        <div className="w-full max-w-125.5">
          <div className="w-full flex justify-center ">
            <Link href={"/"} className="m-auto">
              <Image
                src={Logo}
                alt="Logo"
                width={142.6}
                height={115}
                className="m-auto"
              />
              <p className="text-center font-MontserratBold text-c56-55 text-ffffff">
                MARTAF
              </p>
            </Link>
          </div>
          <div className="w-full flex justify-center mt-c67">
            <Image src={Amico} alt="Amico" width={360} height={350} />
          </div>
        </div>
      </div>

      <div className="w-full ">
        <div className="w-full h-full flex justify-center items-center">
          <SellerLogin />
        </div>
      </div>
    </div>
  );
}
