"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { increment, decrement } from "@/store/slices/counterSlice";
import Image from "next/image";
import Minus from "@/assets/icons/minus.svg";
import Plus from "@/assets/icons/plus.svg";
export default function Counter() {
  const dispatch: AppDispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-MontserratSemiBold text-c12 text-000000">Quantity</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(decrement())}
          className="h-7.5 w-7.5 rounded-full border border-ff715b flex items-center justify-center"
        >
          <Image src={Minus} alt="-" height={1.5} width={12} />
        </button>
        <span className="font-MontserratMedium text-161616 text-c17-5">{count}</span>
        <button
          onClick={() => dispatch(increment())}
          className="h-7.5 w-7.5 rounded-full bg-ff715b flex items-center justify-center"
        >
          <Image src={Plus} alt="+" height={12} width={12} />
        </button>
      </div>
      <p className="font-MontserratMedium text-c12 text-gray-600">182 available</p>
    </div>
  );
}
