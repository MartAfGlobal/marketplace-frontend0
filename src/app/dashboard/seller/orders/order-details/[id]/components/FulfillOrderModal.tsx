import Image from "next/image";
import { motion } from "framer-motion";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/auth/text-area";

interface FulfillOrderModalProps {
  isOpen: boolean;
  notes: string;
  setNotes: (note: string) => void;
  onClose: () => void;
  onFulfill: (e: any) => void;
  seller_tracking_id_to_hub: string;
  setSeller_tracking_id_to_hub: (id: string) => void;
  fulfilling: boolean;
  recievingLocation?: string;
  selectedWarehouse?: any;
  loadingWarehouses?: boolean;
  setSelectedWarehouse?: (w: any) => void;
  warehouses?: any[];
}

export const FulfillOrderModal = ({
  isOpen,
  onClose,
  setSeller_tracking_id_to_hub,
  setNotes,
  notes,
  onFulfill,
  recievingLocation,
  seller_tracking_id_to_hub,
  fulfilling,
}: FulfillOrderModalProps) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-[426px] shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
        >
          <Image src={XIcon} alt="close" width={20} height={20} />
        </button>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-c18 font-MontserratMedium text-000000 leading-[26px]">
              Submit tracking details
            </h2>
            <p className="text-xs text-000000/68 font-MontserratNormal leading-[16px]">
              Enter the details received from the logistics partner used to send
              the goods
            </p>
          </div>

          <form onSubmit={onFulfill} className="space-y-4 ">
            <div className="space-y-2">
              <Label>Tracking/waybill no.</Label>
              <Input
                type="text"
                value={seller_tracking_id_to_hub}
                onChange={(e) => setSeller_tracking_id_to_hub(e.target.value)}
                placeholder="e.g. SELLER-TRK-001243"
                required
              />
            </div>
            <div>
              <Label>Receiving warehouse location</Label>
              <Input value={recievingLocation || "Designated Hub"} disabled />
            </div>
            <div>
              <Label>Extra details</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. GIGM courier, pickup at 5pm"
                className="h-[160px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="w-[142px]"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={fulfilling} className="w-[204px]">
                {fulfilling ? <LoadingSpinner /> : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
