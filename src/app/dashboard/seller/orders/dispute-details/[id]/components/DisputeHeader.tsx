import Image from "next/image";
import { useRouter } from "next/navigation";
import navBack from "@/assets/icons/navBacksmall.png";
import downloadIcon from "@/assets/Seller/colourDownload.svg";

export const DisputeHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between  lg:border-b lg:border-gray-100">
      <button onClick={() => router.back()} className="flex items-center gap-4 group">
        <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-gray-50 transition-colors">
          <Image src={navBack} width={9} height={16.5} alt="Back" />
        </div>
        <h1 className="text-xl font-MontserratSemiBold text-000000">Dispute details</h1>
      </button>
      <button className="hidden lg:block p-2.5 border border-ff715b/20 rounded-lg hover:bg-ff715b/5 transition-colors">
        <Image src={downloadIcon} alt="download" width={20} height={20} />
      </button>
    </div>
  );
};
