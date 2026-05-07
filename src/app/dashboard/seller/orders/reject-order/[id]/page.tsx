"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import ProductSkeleton from "@/components/reloadSpinner/ProductsSkeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import navBack from "@/assets/icons/navBacksmall.png";
import { Button } from "@/components/ui/Button/Button";
import { Dropdown } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import ResultModal from "@/components/ui/forms/resultModal";
import productIcon from "@/assets/Seller/proccessed.svg";
import XIcon from "@/assets/icons/X.svg";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function RejectOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrderById, rejectOrder, partialAcceptOrder, fetchRejectionReasons, fetchWarehouses, fetchDeliveryPartners, loading } = useFetchProducts();
  
  const [order, setOrder] = useState<any>(null);
  const [reason, setReason] = useState<any>(null);
  const [rejectionReasons, setRejectionReasons] = useState<any[]>([]);
  const [loadingReasons, setLoadingReasons] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const [resultModal, setResultModal] = useState({
    isOpen: false,
    result: "success" as "success" | "error" | "warning",
    title: "",
    message: "",
  });

  // Modal states
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  
  // Warehouse/Delivery data
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [loadingDeliveryPartners, setLoadingDeliveryPartners] = useState(false);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<any>(null);

  useEffect(() => {
    if (id && token) {
      fetchOrderById(id as string, (data) => {
        setOrder(data);
        const initialQuants: Record<string, number> = {};
        const initialSelections: Record<string, boolean> = {};
        data?.items?.forEach((item: any, idx: number) => {
          const itemId = item.id || idx.toString();
          initialQuants[itemId] = item.quantity || 1;
          initialSelections[itemId] = false;
        });
        setItemQuantities(initialQuants);
        setSelectedItems(initialSelections);
      });

      setLoadingReasons(true);
      fetchRejectionReasons(
        (data) => {
          const mapped = (data || []).map((item: any) => {
            if (typeof item === "string") return { id: item, name: item };
            return {
              ...item,
              name: item.name || item.reason || item.title || item.label || "Unknown Reason",
              id: item.uuid || item.id || Math.random().toString()
            };
          });
          setRejectionReasons(mapped);
          setLoadingReasons(false);
        },
        () => {
          setLoadingReasons(false);
          toast.error("Failed to load rejection reasons");
        }
      );
    }
  }, [id, token]);

  useEffect(() => {
    if (showWarehouseModal) {
      if (warehouses.length === 0) {
        setLoadingWarehouses(true);
        fetchWarehouses((data) => {
          setWarehouses(data);
          setLoadingWarehouses(false);
        });
      }
      if (deliveryPartners.length === 0) {
        setLoadingDeliveryPartners(true);
        fetchDeliveryPartners((data) => {
          setDeliveryPartners(data);
          setLoadingDeliveryPartners(false);
        });
      }
    }
  }, [showWarehouseModal]);

  const handleQuantityChange = (itemId: string, increment: boolean, max: number) => {
    setItemQuantities((prev) => {
      const current = prev[itemId] || 1;
      const newVal = increment ? Math.min(max, current + 1) : Math.max(1, current - 1);
      return { ...prev, [itemId]: newVal };
    });
  };

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isAllSelected = order?.items?.length > 0 && 
    order.items.every((item: any, idx: number) => {
      const itemId = item.id || idx.toString();
      return selectedItems[itemId] && itemQuantities[itemId] === item.quantity;
    });

  const handleActionTrigger = () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setShowWarningModal(true);
  };

  const handleHandleResult = () => {
    setShowWarningModal(false);
    if (isAllSelected) {
      handleFinalSubmit(true); // pass true to indicate we're bypassing modal
    } else {
      setShowWarehouseModal(true);
    }
  };

  const handleFinalSubmit = (bypassModal = false) => {
    if (!bypassModal && !isAllSelected) {
      if (!selectedWarehouse || !selectedDeliveryPartner) {
        toast.error("Please select warehouse and delivery partner");
        return;
      }
    }

    if (isAllSelected) {
      setRejecting(true);
      const payload = {
        rejection_reason_id: reason.id,
        rejection_note: reason.name || "Out of stock for all items",
      };

      rejectOrder(
        id as string,
        payload,
        () => {
          setRejecting(false);
          setShowWarehouseModal(false);
          setResultModal({
            isOpen: true,
            result: "success",
            title: "Order Rejected",
            message: "The order has been successfully rejected.",
          });
        },
        (err) => {
          setRejecting(false);
          toast.error(err?.response?.data?.message || "Failed to reject order");
        }
      );
    } else {
      // Partial Accept
      setRejecting(true);

      const itemsPayload: any[] = [];
      order.items.forEach((item: any, idx: number) => {
        const itemId = item.id || idx.toString();
        const rejectedQty = selectedItems[itemId] ? itemQuantities[itemId] : 0;

        if (rejectedQty > 0) {
          // If there's any rejection, send as reject action. 
          // The backend will assume the rest (if any) is accepted.
          itemsPayload.push({
            item_id: item.id,
            action: "reject",
            rejected_quantity: rejectedQty,
          });
        } else {
          // Fully accepted
          itemsPayload.push({
            item_id: item.id,
            
            rejected_quantity: item.quantity,
          });
        }
      });

      const payload = {
        warehouse_id: selectedWarehouse.id,
        delivery_partner: selectedDeliveryPartner.id,
        items: itemsPayload,
        rejection_reason_id: reason.id,
        additional_notes: reason.name || "Stock issues",
      };

      partialAcceptOrder(
        id as string,
        payload,
        () => {
          setRejecting(false);
          setShowWarehouseModal(false);
          setResultModal({
            isOpen: true,
            result: "success",
            title: "Partial Acceptance",
            message: "The order has been partially accepted and rejected items noted.",
          });
        },
        (err) => {
          setRejecting(false);
          console.error("Partial accept error:", err);
          const backendError = err?.response?.data;
          const errorMessage = 
            (typeof backendError?.items === 'string' ? backendError.items : backendError?.items?.[0]) || 
            backendError?.message || 
            backendError?.detail || 
            "Failed to partially accept order";
          toast.error(errorMessage);
        }
      );
    }
  };

  if (loading && !order) {
    return (
      <div className="p-8">
        <ProductSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-xl font-MontserratSemiBold text-ff715b">
          Order Not Found
        </p>
        <button onClick={() => router.back()} className="text-ff715b underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-c16 mx-auto p-4 md:p-8 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-start h-c64 border-b border-000000/10 justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center mt-1.75"
        >
          <span className="h-6 w-6 flex items-center justify-center mr-4">
            <Image src={navBack} width={9} height={16.5} alt="Back" />
          </span>
          <span className="text-base font-MontserratSemiBold">
            Reject order
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pt-4">
        {/* Left Section */}
        <div className="flex-1 space-y-10">
          <div className="max-w-md space-y-6">
            <Dropdown
              label="Select a reason"
              selected={reason?.name}
              onSelect={(item) => setReason(item)}
              fetchItems={() => {}}
              items={rejectionReasons}
              loading={loadingReasons}
              placeholder="Select a reason"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-MontserratSemiBold text-sm text-000000">
              Select item(s) that are not available for order fulfilment
            </h3>

            <div className="w-full overflow-hidden rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-[#947fff] text-white font-MontserratNormal text-sm">
                  <tr>
                    <th className="p-4 rounded-tl-lg font-MontserratNormal">items</th>
                    <th className="p-4 text-center rounded-tr-lg font-MontserratNormal">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item: any, idx: number) => {
                    const itemId = item.id || idx.toString();
                    const isChecked = selectedItems[itemId];
                    return (
                      <tr key={idx} className="bg-white">
                        <td className="p-4 items-center flex gap-4">
                          <button
                            type="button"
                            onClick={() => handleCheckboxChange(itemId)}
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${isChecked ? "bg-ff715b border-ff715b" : "border-ff715b bg-transparent"}`}
                          >
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          
                          <div className="w-16 h-16 rounded bg-gray-50 flex-shrink-0 overflow-hidden">
                            <Image
                              src={item.product_image || productIcon}
                              alt="item"
                              width={64}
                              height={64}
                              unoptimized={true}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-MontserratNormal">
                            {item.product_name}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(itemId, false, item.quantity)}
                              className="w-8 h-8 flex items-center justify-center border border-ff715b rounded text-ff715b hover:bg-ff715b/10 transition-colors"
                            >
                              -
                            </button>
                            <span className="min-w-[20px] text-center font-MontserratMedium">
                              {itemQuantities[itemId]}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(itemId, true, item.quantity)}
                              className="w-8 h-8 flex items-center justify-center border border-ff715b rounded text-ff715b hover:bg-ff715b/10 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section / Buttons */}
        <div className="w-full lg:w-[320px] flex flex-col gap-4">
          <Button
            onClick={handleActionTrigger}
            disabled={rejecting || !reason?.id}
            className="w-full py-4 bg-ff715b hover:bg-ff715b/90 text-white rounded-xl font-MontserratMedium shadow-sm transition-all h-[56px] disabled:opacity-50"
          >
            {rejecting ? <LoadingSpinner /> : (isAllSelected ? "Reject all" : "Proceed")}
          </Button>
          <Button
            onClick={() => router.back()}
            disabled={rejecting}
            className="w-full py-4 bg-transparent border border-ff715b text-ff715b hover:bg-ff715b/5 rounded-xl font-MontserratMedium transition-all h-[56px]"
          >
            Cancel
          </Button>
        </div>
      </div>

      <ResultModal
        isOpen={resultModal.isOpen}
        result={resultModal.result}
        title={resultModal.title}
        message={resultModal.message}
        onCancel={() => setResultModal((prev) => ({ ...prev, isOpen: false }))}
        buttenText="Back to orders"
        onConfirm={() => {
          setResultModal((prev) => ({ ...prev, isOpen: false }));
          router.push("/dashboard/seller/orders");
        }}
      />

      {/* Warning Modal */}
      <AnimatePresence>
  {/* Warning Modal */}
  <ResultModal
    key="warning-modal"
    isOpen={showWarningModal}
    result="warning"
    title="Are you sure?"
    message={isAllSelected 
      ? "You are about to reject this entire order. This action cannot be undone."
      : "You are about to partially reject some items in this order."}
    onCancel={() => setShowWarningModal(false)}
    onConfirm={handleHandleResult}
    buttenText="Proceed"
  />

  {/* Warehouse Modal */}
  {showWarehouseModal && (
    <div key="warehouse-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={() => setShowWarehouseModal(false)}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
        >
          <Image src={XIcon} alt="close" width={20} height={20} />
        </button>
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-c18 font-MontserratMedium text-000000">Order Confirmation</h2>
            <p className="text-c12 text-000000/68 font-MontserratNormal px-4">
              {isAllSelected 
                ? "Finalize order rejection" 
                : "Select warehouse and delivery partner for the remaining items"}
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleFinalSubmit(); }} className="space-y-6 pt-4">
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
              <Button type="button" onClick={() => setShowWarehouseModal(false)} variant="secondary">Cancel</Button>
              <Button type="submit" disabled={rejecting} className="disabled:cursor-not-allowed">
                {rejecting ? <LoadingSpinner /> : (isAllSelected ? "Yes, Reject all" : "Yes, Proceed")}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
        



    </div>
  );
}
