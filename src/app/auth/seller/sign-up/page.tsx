import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/images/logo.svg";
import Amico from "@/assets/icons/amico.png";
import SellerSignUp from "@/components/ui/forms/auth/sellers/sign-up";
import type { Metadata } from "next";

// 🔹 Metadata for SEO
export const metadata: Metadata = {
  title: "Seller Sign Up | MARTAF",
  description:
    "Create your MARTAF seller account and start reaching more buyers. Join today to manage your products, track sales, and grow your business online.",
  keywords: [
    "MARTAF seller sign up",
    "create seller account",
    "online marketplace",
    "sell products online",
    "business registration",
  ],
  openGraph: {
    title: "Seller Sign Up | MARTAF",
    description:
      "Join MARTAF as a seller and expand your business online. Register now to manage your store and reach more buyers.",
    url: "https://yourdomain.com/seller/sign-up", // update with real domain
    siteName: "MARTAF",
    images: [
      {
        url: "/og-image.png", // put an OG image in public/
        width: 1200,
        height: 630,
        alt: "MARTAF Seller Sign Up",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function SellerSignUpPage() {
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
          <SellerSignUp />
        </div>
      </div>
    </div>
  );
}
