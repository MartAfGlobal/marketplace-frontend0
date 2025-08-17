import { Input } from "./Input";
import Image from "next/image";
import Envelope from "@/assets/images/envelop.svg";

export default function NewsLater() {
  return (
    <div className="font-MontserratSemiBold text-c20 w-full md:min-w-c400 ">
      <h1 className="font-MontserratSemiBold text-c20 text-f0f0f mb-4">
        Newsletter
      </h1>
      <form>
        {/* Email input with icon */}
        <div className="relative w-full mb-4">
          <Input
            placeholder="Your email address"
            className="bg-white w-full h-10 pr-10"
          />
          <Image
            src={Envelope}
            alt="Envelope"
            height={15}
            width={19.5}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="agree"
            className="h-4 w-4  border-ffffff  rounded-c4 cursor-pointer"
          />
          <label htmlFor="agree" className="text-c14 text-white">
           i agree with privacy terms and policy
          </label> 
        </div>

        {/* Submit button */}
       <div className="w-full flex justify-end">
         <button 
          type="submit"
          className=" text-ffffff w-c126 font-MontserratMedium text-c12 rounded-c24 border border-ffffff h-c40 "
        >
          Subscribe
        </button>
       </div>
      </form>
    </div>
  );
}
