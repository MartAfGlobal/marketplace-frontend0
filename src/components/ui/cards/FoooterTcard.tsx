import Image from "next/image"
import Logo from "@/assets/images/logo.svg"
import Link from "next/link"
import Twitter from "@/assets/socialIcons/twitter.svg"
import Tiktok from "@/assets/socialIcons/TiktokLogo.png"
import Facebbok from "@/assets/socialIcons/facebook.svg"
import Instagram from "@/assets/socialIcons/instagram.svg"
import Linkdin from "@/assets/socialIcons/linkdin.svg"

export default function FooterTCard (){



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
                    <Link href=""><Image src={Twitter} alt="twitter" width={22.5} height={22.5}/></Link>
                    <Link href=""><Image src={Tiktok} alt="Tiktok" width={22.5} height={22.5}/></Link>
                    <Link href=""><Image src={Facebbok} alt="facebook" width={22.5} height={22.5}/></Link>
                    <Link href=""><Image src={Instagram} alt="instagram" width={22.5} height={22.5}/></Link>
                    <Link href=""><Image src= {Linkdin} alt="linkdin" width={22.5} height={22.5}/></Link>
                </div>
                <div className="flex items-center gap-2.75 md:hidden">
                    <Link href=""><Image src={Twitter} alt="twitter" width={16.51} height={18.01}/></Link>
                    <Link href=""><Image src={Tiktok} alt="Tiktok" width={19.05} height={20.25}/></Link>
                    <Link href=""><Image src={Facebbok} alt="facebook" width={19.05} height={20.25}/></Link>
                    <Link href=""><Image src={Instagram} alt="instagram" width={19.5} height={19.5}/></Link>
                    <Link href=""><Image src= {Linkdin} alt="linkdin" width={19.5} height={19.5}/></Link>
                </div>
            </div>
        </div>
    )
}