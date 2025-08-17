import { Input } from "../forms/Input";
import { Label } from "@radix-ui/react-label";
import { Select } from "../forms/auth/select";
import Image from "next/image";
import ChevronDownIcon from "@/assets/icons/Contact-us/fe_arrow-down.svg";
import Globally from "@/assets/icons/Contact-us/globally.png";
import { Textarea } from "../forms/auth/text-area";
import { Button } from "../Button/Button";
import Link from "next/link";
import Facebook from "@/assets/icons/Contact-us/social/facebook.png";
import Twitter from "@/assets/icons/Contact-us/social/twitter.png";
import Instagram from "@/assets/icons/Contact-us/social/instagram.png";
import Linkdin from "@/assets/icons/Contact-us/social/Linkdin.png";
import Telegram from "@/assets/icons/Contact-us/social/telegram.png";
import tictok from "@/assets/icons/Contact-us/social/ticktock.png";
import Yotube from "@/assets/icons/Contact-us/social/Youtube.png";

export default function ContactForm() {
  const options = [
    { value: "apple", label: "Apple" },
    { value: "orange", label: "Orange" },
    { value: "banana", label: "Banana" },
  ];
  return (
    <div className="w-full pl-c24">
      <div className="pb-c64">
        <h1 className="font-MontserratBold text-c32 leading-c100p text-center text-161616">
          Send Us a Message
        </h1>
        <p className="font-MontserratSemiBold text-c18 text-161616 text-center">
          Have a question? Fill out our form, and we’ll reply as soon possible!
        </p>
      </div>
      <form>
        <div className="flex flex-col gap-9">
          <div className="flex gap-c24">
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Full Name
              </Label>
              <Input
                className="font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Company Name (optional)
              </Label>
              <Input
                className="focus:border-6a0dad font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter company name"
              />
            </div>
          </div>
          <div className="flex gap-c24">
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Phone
              </Label>
              <Input
                className="font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter phone no"
              />
            </div>
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Email
              </Label>
              <Input
                className="font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full ">
            <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
              Subject
            </Label>
            <Select
              className="font-MontserratSemiBold text-c18 text-646464 leading-c100p cursor-pointer"
              options={options}
              icon={
                <Image
                  src={ChevronDownIcon}
                  alt="choosebutton"
                  width={24}
                  height={24}
                />
              }
              placeholder="Select your subject"
            />
          </div>
          <div className="flex flex-col gap-3 w-full ">
            <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
              Message
            </Label>
            <Textarea
              className="font-MontserratSemiBold text-c18 text-646464 leading-c100p cursor-pointer h-50"
              placeholder="Write your message..."
            />
          </div>
        </div>
        <Button className="rounded-c50 bg-6a0dad">Send Message</Button>
      </form>
      <div className="flex gap-c24 mt-25">
        <div className="rounded-full h-c64 w-c64 circle-shadow flex justify-center items-center">
          <Image src={Globally} alt="world" width={56} height={56} />
        </div>
        <div className="flex flex-col gap-c24">
          <div>
            <h1 className="font-MontserratBold text-c24 text-161616 leading-c100p">
              Follow Us on Social Media
            </h1>
            <p>
              Stay updated with our latest news, product launches, and special
              offers.
            </p>
          </div>
          <p className="w-full h-1 bg-f5f5f5"></p>
          <div className="flex gap-4 items-center">
            <Link href="/" className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={Facebook} alt="Facebook" width={32} height={32} />
            </Link>
            <Link href="/" className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={Twitter} alt="twitter" width={32} height={32} />
            </Link>
            <Link href="/" className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={Instagram} alt="instagram" width={32} height={32} />
            </Link>
            <Link href="/" className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={Linkdin} alt="Linkdin" width={32} height={32} />
            </Link>
            <Link href="/"className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={tictok} alt="tiktok" width={32} height={32} />
            </Link>
            <Link href="/"className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={Telegram} alt="telegram" width={32} height={32} />
            </Link>
            <Link href="/"className="rounded-full h-c48 w-c48 circle-shadow flex justify-center items-center">
              <Image src={Yotube} alt="youtube" width={32} height={32} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
