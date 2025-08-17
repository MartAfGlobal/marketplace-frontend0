import Link from "next/link";
import Image from "next/image";
import Cart from "@/assets/headerIcon/cart.svg";

export default function HeroBaground() {
  return (
    <div className="max-w-[970px] w-full h-[582px] bg-hero flex items-center pl-[34px]">
      <div className="max-w-[458px] h-[302px]">
        <h1 className="font-MontserratSemiBold text-5xl leading-[56px] text-[#131313] pb-4">Discover the best of Africa</h1>
        <p className="font-MontserratNormal text-4 text-[#131313] pb-[48px]">
          Explore a world of quality products across Africa at Martaf. From
          electronics to fashion and home goods, we offer something for
          everyone.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/" className="w-[179px] h-[44px] rounded-[8px] border border-[#FF715B] text-[#FF715B] flex items-center justify-center">Become a seller</Link>
          <button className="w-[179px] h-[44px] rounded-[8px] bg-[#FF715B] text-ffffff flex items-center justify-center gap-3">
            <Image
              src={Cart}
              alt="cart"
              width={24.15}
              height={24.15}
              className="w-[24.15px] h-[24.15px]"
            />
            <p>Shop now</p>
          </button>
        </div>
      </div>
    </div>
  );
}
