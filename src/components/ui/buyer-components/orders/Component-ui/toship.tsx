"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Copy from "@/assets/icons/Copy.png";

import AddressModal from "@/components/ui/Modals/new-address-modal"; // adjust path
import { UserAddressProps, Address } from "@/types/global";
import { useSelector } from "react-redux";
import OrderEditAddressModal from "@/components/ui/Modals/orders/edit-address-order-modal";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { RootState } from "@/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { useFetchOrders } from "@/helpers/fetchOrders";



export default function ToShip() {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    Partial<Address> | undefined
  >(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { sendHttpRequest: cancelReq } = useHttp();
  const [loadingIds, setLoadingIds] = useState<string | null>(null);
  const token: string | undefined = useSelector(
    (state: RootState) => state.token?.token ?? undefined
  );
 const { fetchOrders } = useFetchOrders();
  const { orders } = useSelector((state: any) => state.orders);
  const router = useRouter();

  const toShip = orders.filter(
    (order: OrderItem) => order.status === "To Ship"
  );

 const handleEditAddress = (id: string) => {
  setSelectedId(id);

  const isMobile = window.innerWidth <= 768; 

  if (isMobile) {
 
    router.push(`/dashboard/buyer/orders/edit-address/${id}`);
  } else {
    
      setTimeout(()=>setIsOpen(true), 0);
  }
};


  const handleCancelOrder = (orderId: string) => {
    setLoadingIds(orderId);
    console.log("checking item to cancel", orderId);
    if (!token) {
      return;
    }

    cancelReq({
      requestConfig: {
        url: `/orders/${orderId}/cancel/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User order cancel info:", res);
        toast.success ("order cancelled")
        setLoadingIds("");
        fetchOrders();
      },
    });
  };

  const handleEdit = (itemId: string) => {
    
    router.push(`/edit-address/${itemId}`);
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = (orderId: string) => {
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="space-y-c24 px-6 w-full">
      <div className="w-full">
        <div className="w-full space-y-c24 mt-c32">
          <AnimatePresence mode="wait">
            {toShip.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="w-full text-center max-w-41.25 text-000000/60 font-MontserratMedium text-c18 leading-6.5">
                  You haven’t made any orders yet
                </p>
                <Button className="w-51">Start shopping</Button>
              </motion.div>
            ) : (
              <motion.div
                key="orders-list"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, height: 0 },
                  visible: {
                    opacity: 1,
                    height: "auto",
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-c24"
              >
                {toShip.map((item: OrderItem) => {
                  const isSingleItemOrder = item.items?.length === 1;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full flex items-center gap-32 justify-center md:gap-0 md:justify-between mb-3 md:mb-c32">
                        <div>
                          <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                            Order is being processed
                          </p>
                          <div className="md:flex hidden gap-2 mt-2">
                            <p className="text-c12  font-MontserratNormal">
                              Order ID: {item.order_no}
                            </p>
                            <button
                              onClick={() => handleCopy(item.order_no || "")}
                            >
                              <Image
                                src={Copy}
                                alt="copy"
                                width={16}
                                height={16}
                              />
                            </button>
                            {copied && (
                              <span className="text-green-600 text-c12 font-MontserratMedium">
                                Copied!
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                          {item.estimated_delivery_date}
                        </p>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <div className="flex flex-col md:flex-row gap-4 items-start  ">
                            {item.items?.map((prod) => (
                              <div
                                key={prod.id}
                                className="flex gap-4 items-start  w-full"
                              >
                                <Image
                                  src={
                                    prod.product?.main_image.medium|| "/placeholder.png"
                                  }
                                  alt={prod.product?.name || "Product Image"}
                                  width={96}
                                  height={96}
                                  className="h-24 w-24 "
                                />
                                <div className="w-full">
                                  <p className="font-MontserratSemiBold text-base mb-1">
                                    {prod.product?.name}
                                  </p>
                                  <p className=" text-c12 font-MontserratMedium mb-3">
                                    {item.manufacturer}
                                  </p>
                                  <p className="rounded-c12 bg-000000/10 text-000000/60  h-c32 py-2 w-fit min-w-24.5  px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center">
                                    {prod.quantity}Pc, {prod.variant?.color}
                                  </p>
                                  <p className="font-MontserratSemiBold text-c16 pt-3">
                                    ₦{item.total_price}
                                  </p>
                                  <div className="w-full gap-4 pl flex md:hidden  mt-4 space-y-4">
                                    <Button
                                      onClick={() => handleEditAddress(item.id)}
                                      variant="secondary"
                                      className=""
                                    >
                                      Edit address
                                    </Button>
                                    <Button
                                      onClick={() => handleCancelOrder(item.id)}
                                      variant="primary"
                                    >
                                      {loadingIds === item.id ? (
                                        <LoadingSpinner />
                                      ) : (
                                        "Cancel order"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-4 w-full">
                            <div className="hidden sm:flex gap-4">
                              <div
                                className={`grid gap-4 ${
                                  item.items.length === 1
                                    ? "grid-cols-1"
                                    : item.items.length === 2
                                    ? "grid-cols-2"
                                    : "grid-cols-3"
                                }`}
                              >
                                {item.items?.slice(0, 3).map((prod) => (
                                  <div
                                    key={prod.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="w-24 h-24 relative">
                                      <Image
                                        src={
                                          prod.product?.main_image.medium ||
                                          "/placeholder.png"
                                        }
                                        alt={
                                          prod.product?.name || "Product Image"
                                        }
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 object-cover"
                                      />
                                      <p className="absolute bottom-2 text-c12 font-MontserratNormal flex items-center justify-center left-4 translate-x-1/2 text-center bg-000000 rounded-c12 text-ffffff  w-7.5 h-6">
                                        x{prod.quantity}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div>
                                <p className="font-MontserratSemiBold text-base mb-2 flex flex-wrap gap-1">
                                  {item.items
                                    ?.slice(0, 3)
                                    .map((prod, index) => (
                                      <span
                                        key={prod.id}
                                        className="flex items-center"
                                      >
                                        <span
                                          className="max-w-[110px] truncate inline-block align-middle"
                                          title={prod.product?.name}
                                        >
                                          {prod.product?.name}
                                        </span>
                                        {index <
                                          Math.min(item.items.length, 3) -
                                            1 && <span>,&nbsp;</span>}
                                      </span>
                                    ))}
                                  {item.items.length > 3 && <span>...</span>}
                                </p>

                                <p className="text-c12 font-MontserratMedium mb-3">
                                  {item.manufacturer}
                                </p>

                                <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                  {item.items?.length}{" "}
                                  <span className="pl-0.5">Items</span>
                                </p>

                                <p className="font-MontserratSemiBold text-c16 pt-3">
                                  ₦{item.total_price}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:hidden w-full items-start gap-4">
                              {item.items?.[0] && (
                                <Image
                                  src={
                                    item.items[0].product?.main_image.medium ||
                                    "/placeholder.png"
                                  }
                                  alt={
                                    item.items[0].product?.name ||
                                    "Product Image"
                                  }
                                  width={96}
                                  height={96}
                                  className="w-24 h-24"
                                />
                              )}

                              <div className="w-full ">
                                <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
                                  {item.items?.[0]?.product?.name}
                                </p>

                                <p className="text-c12 font-MontserratMedium mb-2">
                                  {item.manufacturer}
                                </p>

                                <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                  {item.items?.reduce(
                                    (sum, i) => sum + (i.quantity || 0),
                                    0
                                  )}{" "}
                                  <span className="pl-0.5">Items</span>
                                </p>

                                <p className="font-MontserratSemiBold text-c16 pt-2">
                                  ₦{item.total_price}
                                </p>
                                <div className="w-full text-c10 gap-4 pl flex md:hidden  mt-4 space-y-4">
                                  <Button
                                    onClick={() => handleEditAddress(item.id)}
                                    variant="secondary"
                                    className=""
                                  >
                                    Edit address
                                  </Button>
                                  <Button
                                    onClick={() => handleCancelOrder(item.id)}
                                    variant="primary"
                                  >
                                    {loadingIds === item.id ? (
                                      <LoadingSpinner />
                                    ) : (
                                      "Cancel order"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          <Button
                            onClick={() => handleEditAddress(item.id)}
                            variant="secondary"
                            className=""
                          >
                            Edit address
                          </Button>
                          <Button
                            onClick={() => handleCancelOrder(item.id)}
                            variant="primary"
                          >
                            {loadingIds === item.id ? (
                              <LoadingSpinner />
                            ) : (
                              "Cancel order"
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAddress={editingAddress}
        onSave={(newAddress) => {
          console.log("Saved Address:", newAddress);
          setIsModalOpen(false);
        }}
      />

      <OrderEditAddressModal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        id={selectedId}
      />
    </div>
  );
}
