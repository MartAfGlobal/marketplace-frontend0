import {FooterComponent} from "@/types/global"

export default function FooterCard({title, children}:FooterComponent){

return(
    <div className="w-full">
        <h2 className="text-f0f0f font-MontserratSemiBold text-c14 md:text-c20 pb-4 md:pb-c32">{title}</h2>
        <div className="flex flex-col  gap-3 text-sm text-f0f0f font-MontserratMedium ">
            {children}
        </div>
    </div>
)

}