"use client";

import Image from "next/image"
import Logo from "@/assets/images/logo.svg"
import Link from "next/link"
import Twitter from "@/assets/socialIcons/twitter.svg"
import Tiktok from "@/assets/socialIcons/TiktokLogo.png"
import Facebbok from "@/assets/socialIcons/facebook.svg"
import Instagram from "@/assets/socialIcons/instagram.svg"
import Linkdin from "@/assets/socialIcons/linkdin.svg"
import { usePublicSettings, toHref } from "@/helpers/usePublicSettings"

export default function FooterTCard (){
    // Social links come from admin General settings (single source of truth).
    // A blank link falls back to "#" so the icon still renders harmlessly.
    const settings = usePublicSettings();
    const href = (v?: string | null) => toHref(v) || "#";

    const socials = [
        { src: Twitter, alt: "twitter", url: href(settings?.twitter_url) },
        { src: Tiktok, alt: "Tiktok", url: href(settings?.tiktok_url) },
        { src: Facebbok, alt: "facebook", url: href(settings?.facebook_url) },
        { src: Instagram, alt: "instagram", url: href(settings?.instagram_url) },
        { src: Linkdin, alt: "linkdin", url: "#" },
    ];

    return(
        <div className="flex justify-between mb-c32 items-center">
            <div className="flex gap-2 md:gap-c24 ">
                <Image src={Logo} height={49.8} width={40.58} alt="logo" className="hidden md:flex"/>
                <Image src={Logo} height={32} width={26.08} alt="logo" className="md:hidden"/>
                <h1 className="font-MontserratBold text-c17 md:text-c28  text-f0f0f ">MARTAF</h1>
            </div>
             <div className="flex items-center gap-c32 ">
                <p className="font-MontserratSemiBold text-c20 hidden md:flex text-f0f0f">Follow Us:</p>
                <div className="items-center gap-c24 hidden md:flex">
                    {socials.map((s) => (
                        <Link key={s.alt} href={s.url} target={s.url === "#" ? undefined : "_blank"} rel="noopener noreferrer">
                            <Image src={s.src} alt={s.alt} width={22.5} height={22.5}/>
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-2.75 md:hidden">
                    {socials.map((s) => (
                        <Link key={s.alt} href={s.url} target={s.url === "#" ? undefined : "_blank"} rel="noopener noreferrer">
                            <Image src={s.src} alt={s.alt} width={19.5} height={19.5}/>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
