import Link from "next/link";


export default function MobileHeroBaground() {
  return (
    <div className="relative w-full h-95 mobilebg-hero flex mt-3.75 px-c32 items-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/64 z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <h1 className="font-MontserratSemiBold text-c24 text-ffffff leading-c32 pb-4">
          Shop from the best of African products.
        </h1>
        <p className="font-MontserratNormal text-sm text-ffffff pb-6">
          Explore a world of quality products across Africa at Martaf. From
          electronics to fashion and home goods, we offer something for
          everyone.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-full h-c48 rounded-c8 border border-ff715b text-ffffff text-c12 text-shadow-ff715b flex items-center justify-center"
          >
            Become a seller
          </Link>
          <button className="w-full h-c48 rounded-c8 bg-ff715b text-ffffff text-c12 flex items-center justify-center gap-3">
            Shop now
          </button>
        </div>
      </div>
    </div>
  );
}
