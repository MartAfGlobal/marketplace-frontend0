"use client";

import Image from "next/image";

import Candy from "@/assets/icons/Contact-us/candy.svg";
import Support from "@/assets/icons/Contact-us/support.png";
import Clock from "@/assets/icons/Contact-us/clock.png";
import Chat from "@/assets/icons/Contact-us/mdi_chat-processing-outline.png";
import email from "@/assets/icons/Contact-us/mdi_email-outline.png";
import NewSpaper from "@/assets/icons/Contact-us/fa6-regular_newspaper.png";
import phone from "@/assets/icons/Contact-us/solar_phone-linear.png";
import HandShake from "@/assets/icons/Contact-us/handshake.png";
import timer1 from "@/assets/icons/Contact-us/time1.png";
import timer2 from "@/assets/icons/Contact-us/time2.png";
import timer3 from "@/assets/icons/Contact-us/time3.png";

export default function GetIntouch() {
  return (
    <div className=" w-full pr-c24" >
      <div className="pb-c64">
        <h1 className="font-MontserratBold text-c32 leading-c100p text-center text-161616">
          Get In Touch
        </h1>
        <p className="font-MontserratSemiBold text-c18 text-161616 text-center">
          Questions or support? Contact us for inquiries or partnerships!
        </p>
      </div>
      <div className="flex flex-col gap-c56">
        <div className="flex gap-c24 items-start">
          <div className="rounded-full bg-ffffff circle-shadow flex-shrink-0 h-c64 w-c64 flex items-center justify-center ">
            <Image src={Candy} alt="candy" width={27} height={48} />
          </div>
          <div>
            <h1 className="font-MontserratBold text-c24 text-161616 leading-c100p">
              Head Office:
            </h1>
            <p className="text-c18 font-MontserratSemiBold leading-9 text-646464">
              Martaf Headquarters, Kaura Modern Market, Opposite Prince and
              Princess Estate, Abuja, Nigeria.
            </p>
          </div>
        </div>
        <div className="flex gap-c24 items-start">
          <div className="rounded-full bg-ffffff circle-shadow h-c64 w-c64 flex items-center flex-shrink-0 justify-center ">
            <Image src={Support} alt="suppport" width={40} height={36.32} />
          </div>
          <div>
            <h1 className="font-MontserratBold text-c24 text-161616 leading-c100p">
              Customer Support:
            </h1>
            <p className=" text-161616 text-c18 font-MontserratSemiBold leading-9">
              Need help with orders, payments, or inquiries? Our team is here
              for you.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={phone} alt="phone" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                  Phone:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  +234 9122098928
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={email} alt="phone" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                  Email:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  martafglobaltech@gmail.com
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={Chat} alt="chat" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                  Live Chat:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  Available on WhatsApp 09122098928
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-c24 items-start">
          <div className="rounded-full bg-ffffff circle-shadow h-c64 w-c64 flex items-center justify-center ">
            <Image src={Clock} alt="clock" width={40} height={36.32} />
          </div>
          <div>
            <h1 className="font-MontserratBold text-c24 text-161616 leading-c100p">
              Support Hours:
            </h1>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={timer1} alt="time" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                  Monday – Friday:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  8:00 AM – 9:00 PM (WAT)
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={timer2} alt="time" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                  Saturday:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  12:00 PM – 7:00 PM (WAT)
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={timer3} alt="timer" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                  Sunday & Holidays:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                 12:00 PM – 7:00 PM (WAT)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-c24 items-start">
          <div className="rounded-full bg-ffffff circle-shadow h-c64 w-c64 flex items-center justify-center ">
            <Image src={HandShake} alt="handshake" width={40} height={36.32} />
          </div>
          <div>
            <h1 className="font-MontserratBold text-c24 text-161616 leading-c100p">
              Business & Partnership Inquiries:
            </h1>
            <p className=" text-161616 text-c18 font-MontserratSemiBold leading-9">
              Want to partner with MartAf or list your products? Let’s connect!
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={email} alt="email" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                 Email:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  partnerships@martaf.com
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-c24 items-start">
          <div className="rounded-full bg-ffffff circle-shadow h-c64 w-c64 flex items-center justify-center ">
            <Image src={NewSpaper} alt="newspaper" width={40} height={36.32} />
          </div>
          <div>
            <h1 className="font-MontserratBold text-c24 text-161616 leading-c100p">
              Press & Media Inquiries
            </h1>
            <p className=" text-161616 text-c18 font-MontserratSemiBold leading-9">
             For press, media, or collaborations, contact our PR team.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-3 items-center">
                <div className="rounded-full bg-ffffff circle-shadow h-9 w-9 flex items-center justify-center ">
                  <Image src={email} alt="email" width={24} height={44} />
                </div>
                <p className="text-base font-MontserratSemiBold leading-9 text-161616">
                 Email:
                </p>
                <span className="text-base font-MontserratSemiBold leading-9 text-646464">
                  partnerships@martaf.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
