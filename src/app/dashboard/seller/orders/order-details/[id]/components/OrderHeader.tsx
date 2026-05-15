import Image from "next/image";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";

interface OrderHeaderProps {
  onDownload: () => void;
  isDownloading: boolean;
}

export const OrderHeader = ({ onDownload, isDownloading }: OrderHeaderProps) => {
  return (
    <SellerMobileHeader
      title="Order details"
      rightElement={
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
      }
    />
  );
};
