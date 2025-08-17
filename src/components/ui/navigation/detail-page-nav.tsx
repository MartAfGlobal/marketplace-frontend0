import Image from "next/image";
import Link from "next/link";
import NavIcon from "@/assets/icons/navIcon.svg";

export default function DetailPageNavbar() {
  return (
    <div className="flex gap-2 items-center w-full h-c32 mt-c24 mb-c32">
      <Link href="/" className="text-c12 font-MontserratMedium text-efefef">
        Home
      </Link>
      <div className="flex items-center justify-center h-4 w-4">
        <Image src={NavIcon} width={6} height={11} alt="nav icon" />
      </div>
      <p className="text-c12 font-MontserratSemiBold text-000000">
        Fashion & Apparel
      </p>
      <div className="flex items-center justify-center h-4 w-4">
        <Image src={NavIcon} width={6} height={11} alt="nav icon" />
      </div>
      <p className="text-c12 font-MontserratSemiBold text-000000">
        Men’s shoes
      </p>
      <div className="flex items-center justify-center h-4 w-4">
        <Image src={NavIcon} width={6} height={11} alt="nav icon" />
      </div>
      <p className="text-c12 font-MontserratSemiBold text-000000">
        Nike’s supreme - xl
      </p>
    </div>
  );
}
