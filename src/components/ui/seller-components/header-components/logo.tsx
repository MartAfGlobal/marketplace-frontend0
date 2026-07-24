"use client";
import Link from "next/link";
import Image from "next/image";

import Logo from "@/assets/images/logo.svg"

export default function DashBoardHeadrLogo() {
  return (
    <nav className="w-fit h-fit">
      <Link href={"/dashboard/seller/overview"} className="flex items-center gap-2 md:gap-3 w-full max-w-37.25">
        <Image src={Logo} alt="Logo" width={48} height={39.11}  className="hidden md:block"/>
        <Image src={Logo} alt="Logo" width={27.04} height={22.03} className="md:hidden"/>
        <p className="md:text-c20 text-c16 font-MontserratBold">MARTAF</p>
      </Link>
    </nav>
  );
}
