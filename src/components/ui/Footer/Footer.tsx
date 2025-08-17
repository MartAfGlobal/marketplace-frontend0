import Link from "next/link";
import Image from "next/image";
import FooterCard from "../cards/FooterCard";
import NewsLater from "../forms/Newslater";
import FooterTCard from "../cards/FoooterTcard";
import { usePathname } from "next/navigation";
import OtherNewsLater from "../others/OtherNewsLater";
import Location from "@/assets/socialIcons/location.png";
import customerCare from "@/assets/socialIcons/customerCare.png";
import emailUs from "@/assets/socialIcons/emailUS.png";
import Send from "@/assets/socialIcons/PaperPlaneTilt.png";

export default function FooterPage() {
  const pathname = usePathname();

  const isSearch = pathname?.startsWith("/others");

  return (
    <div className="bg-212121 w-full h-fit pt-6 px-6 md:pt-c67 md:px-c60">
      <FooterTCard />
      <p className="w-full bg-b1b1b1 h-c1 mb-c48"></p>
      <div className="md:flex hidden gap-c56 justify-center">
        <FooterCard title="Company Info">
          <>
            <Link href="/others/about-us">About Us</Link>
            <Link href="/others/contact-us">Contact Us</Link>
            <Link href="/">Blog</Link>
            <Link href="/">Return Policy</Link>
          </>
        </FooterCard>
        <FooterCard title="Help">
          <>
            <Link href="/">Support center</Link>
            <Link href="/others/fags">FAQ</Link>
            <Link href="/">Purchase Protection</Link>
            <Link href="/">Sitemap</Link>
          </>
        </FooterCard>

        <FooterCard title="Selling on MartAf">
          <>
            <Link href="/">Become a Seller</Link>
            <Link href="/">Login to Seller Panel</Link>
            <Link href="/">MartAf Seller Policy</Link>
          </>
        </FooterCard>
        <FooterCard title="Contacts">
          <>
            <Link href="/">Contacts</Link>
            <Link href="/">Address :</Link>
            <Link href="/">
              No 333 you and I street, Ikeja, Lagos State, Nigeria
            </Link>
            <Link href="/">Phone :</Link>
            <Link href="/">+234 80123456789</Link>
            <Link href="/">Email :</Link>
            <Link href="/">info@martaf.com.ng</Link>
          </>
        </FooterCard>

        {isSearch ? <OtherNewsLater /> : <NewsLater />}
      </div>

      {/* mobile */}
      <div className=" md:hidden w-full ">
        <div className="flex justify-between mb-c32">
          <FooterCard title="Company Info ">
            <>
              <Link href="/others/about-us">About Us</Link>
              <Link href="/others/contact-us">Contact Us</Link>
              <Link href="/">Blog</Link>
              <Link href="/">Return Policy</Link>
            </>
          </FooterCard>
          <FooterCard title="Help">
            <>
              <Link href="/">Support center</Link>
              <Link href="/others/fags">FAQ</Link>
              <Link href="/">Purchase Protection</Link>
              <Link href="/">Sitemap</Link>
            </>
          </FooterCard>
        </div>

        {/* <FooterCard title="Selling on MartAf">
          <>
            <Link href="/">Become a Seller</Link>
            <Link href="/">Login to Seller Panel</Link>
            <Link href="/">MartAf Seller Policy</Link>
          </>
        </FooterCard> */}
        <FooterCard title="Contacts">
          <>
            <div className="flex w-full gap-4 mt-2">
              <div className="w-6">
                <Image src={Location} alt="location" width={24} height={24} />
              </div>
              <span>No 333 you and I street, Ikeja, Lagos State, Nigeria</span>
            </div>
            <div className="flex gap-4">
              <Image
                src={customerCare}
                alt="location"
                width={21}
                height={20.25}
              />

              <span>+234 80123456789</span>
            </div>
            <div className="flex gap-4">
              <Image src={emailUs} alt="location" width={21} height={20.25} />
              <span>info@martaf.com.ng</span>
            </div>
          </>
        </FooterCard>

        <div className="pt-c32">
          <p className="text-ffffff text-sm font-MontserratSemiBold pb-4">
            Newsletter
          </p>
          <div>
            <label className="text-c12 font-MontserratNormal text-ffffff mb-2">
              Input your email
            </label>
            <div className="w-full h-c48 mt-2 flex items-center">
              <input
                type="text"
                className="bg-ffffff h-full w-full rounded-tl-c8 rounded-bl-c8  px-4"
                placeholder="input"
              />
              <button className="h-full w-fit py-3 px-4 bg-ff715b rounded-tr-c8 rounded-br-c8">
                <Image src={Send} alt="send" width={24.15} height={24.15} />
              </button>
            </div>
            <div className="flex items-center gap-3 justify-center pt-4.5">
              <input
                type="checkbox"
                id="remember"
                className="appearance-none w-5 h-5 rounded-c4 border border-white bg-transparent checked:bg-transparent checked:border-white checked:before:content-['✔'] checked:before:text-white checked:before:block checked:before:text-xs checked:before:leading-none flex items-center justify-center"
              />
              <label htmlFor="remember" className="font-MontserratSemiBold text-sm text-white">
                i agree with privacy terms and policy
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="w-full bg-b1b1b1 h-c1  mt-c32 md:mt-c61"></p>
        <p className=" mb-c32 pt-c32 text-center text-f0f0f">
          © Martaf 2025. All rights Reserved
        </p>
      </div>
    </div>
  );
}
