import Image from "next/image";
import { motion } from "framer-motion";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Dropdown } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";

interface AcceptOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (e: any) => void;
  warehouses: any[];
  loadingWarehouses: boolean;
  selectedWarehouse: any;
  setSelectedWarehouse: (w: any) => void;
  deliveryPartners: any[];
  loadingDeliveryPartners: boolean;
  selectedDeliveryPartner: any;
  setSelectedDeliveryPartner: (d: any) => void;
  accepting: boolean;
}

export const AcceptOrderModal = ({
  isOpen,
  onClose,
  onAccept,
  warehouses,
  loadingWarehouses,
  selectedWarehouse,
  setSelectedWarehouse,
  deliveryPartners,
  loadingDeliveryPartners,
  selectedDeliveryPartner,
  setSelectedDeliveryPartner,
  accepting,
}: AcceptOrderModalProps) => {
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
              Accept this order?
            </h2>
            <p className="text-c12 text-000000/68 font-MontserratNormal px-4">
              You agree to fulfil and send this order to the closest MartAf
              warehouse to your location
            </p>
          </div>

          <form onSubmit={onAccept} className="space-y-6 pt-4">
            <div className="space-y-4">
              <Dropdown
                label="Select warehouse location"
                selected={selectedWarehouse?.name}
                onSelect={(item) => setSelectedWarehouse(item)}
                fetchItems={() => {}}
                items={warehouses}
                loading={loadingWarehouses}
                placeholder="Select warehouse location"
              />

              <Dropdown
                label="Select delivery partner"
                selected={selectedDeliveryPartner?.name}
                onSelect={(item) => setSelectedDeliveryPartner(item)}
                fetchItems={() => {}}
                items={deliveryPartners}
                loading={loadingDeliveryPartners}
                placeholder="Select delivery partner"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={accepting}
                className=" disabled:cursor-not-allowed"
              >
                {accepting ? <LoadingSpinner /> : "Yes, I accept"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
