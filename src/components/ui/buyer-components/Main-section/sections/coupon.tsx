import { Coupons } from "@/types/global";

const coupons: Coupons[] = [
  {
    id: 1,
    title: "RF385424",
    discription: "50% OFF",
  },

  {
    id: 2,
    title: "RF385424",
    discription: "50% OFF",
  },

  {
    id: 3,
    title: "RF385424",
    discription: "50% OFF",
  },
];

export default function Coupon() {
  return (
    <div>
      <div className="flex justify-between">
        <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
          Coupons
        </p>
        <button className="font-MontserratSemiBold text-ff715b text-sm leading-c20">
          view all
        </button>
      </div>
      <div className="flex gap-c32 justify-baseline">
        {coupons.map((item) => (
          <div key={item.id} className="relative w-fit h-fit mt-c24">
            <div className="rounded-full absolute -left-6 w-[47.2px] translate-y-1/2 top-0 bg-ffffff h-[47.2px]"></div>
            <div className="w-65 h-26 bg-black/10 rounded-c8 flex flex-col items-center gap-1 justify-center">
              <h1 className="text-c32 text-black/78 font-MontserratSemiBold leading-c40">{item.title}</h1>
              <p className="text-c12 text-black/78 font-MontserratMedium leading-4">{item.discription}</p>
            </div>
            <div className="rounded-full absolute -right-6 w-[47.2px] translate-y-1/2 top-0 bg-ffffff h-[47.2px]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
