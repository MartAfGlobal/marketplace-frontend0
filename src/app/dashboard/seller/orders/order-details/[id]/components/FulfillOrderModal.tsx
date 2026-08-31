import Image from "next/image";
import { motion } from "framer-motion";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";

interface FulfillOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFulfill: (e: any) => void;
  parcelId: string;
  setParcelId: (id: string) => void;
  fulfilling: boolean;
}

export const FulfillOrderModal = ({
  isOpen,
  onClose,
  onFulfill,
  parcelId,
  setParcelId,
  fulfilling,
}: FulfillOrderModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
        >
          <Image src={XIcon} alt="close" width={20} height={20} />
        </button>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-c18 font-MontserratMedium text-000000">
              Mark Order as Shipped
            </h2>
            <p className="text-xs text-000000/68 font-MontserratNormal ">
              You can optionally provide a parcel ID to track this shipment
            </p>
          </div>

          <form onSubmit={onFulfill} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="">
                Parcel ID <span className="text-xs text-gray-400 font-MontserratNormal">(Optional)</span>
              </Label>
              <Input
                type="text"
                value={parcelId}
                onChange={(e) => setParcelId(e.target.value)}
                placeholder="e.g. PARCEL-67890"
                className=""
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={fulfilling}
                className="disabled:cursor-not-allowed"
              >
                {fulfilling ? <LoadingSpinner /> : "Confirm Shipment"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
