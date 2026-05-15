import Image from "next/image";
import navBack from "@/assets/icons/navBacksmall.png";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import { useRouter } from "next/navigation";

interface OrderHeaderProps {
  onDownload: () => void;
  isDownloading: boolean;
}

export const OrderHeader = ({ onDownload, isDownloading }: OrderHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-start h-c64 lg:border-b lg:border-000000/10 justify-between">
      <button
        onClick={() => router.back()}
        className="flex items-center mt-1.75"
      >
        <span className="h-6 w-6 flex items-center justify-center mr-4 ">
          <Image src={navBack} width={9} height={16.5} alt="Back" />
        </span>
        <span className="text-base font-MontserratMedium">
          Order details
        </span>
      </button>
      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="hidden lg:block p-2 border border-ff715b h-10 w-10 rounded-lg hover:bg-ff715b/5 disabled:opacity-50"
      >
        <Image
          src={downloadIcon}
          alt="download"
          width={10.67}
          height={10.67}
          className="w-5 h-5"
        />
      </button>
    </div>
  );
};
