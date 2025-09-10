"use client";
import Link from "next/link";
import Image from "next/image";

import Logo from "@/assets/images/logo.svg"

export default function DashBoardHeadrLogo() {
  return (
    <nav className="w-fit h-fit">
      <Link href={"/"} className="flex items-center gap-3 w-full max-w-37.25">
        <Image src={Logo} alt="Logo" width={48} height={39.11} />
        <p className="text-c20 font-MontserratBold">MARTAF</p>
      </Link>
    </nav>
  );
}
