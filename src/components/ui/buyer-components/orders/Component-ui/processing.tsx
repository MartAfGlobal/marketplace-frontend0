"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import AddressModal from "@/components/ui/Modals/new-address-modal"; // adjust path
import { UserAddressProps, Address } from "@/types/global";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import OrderEditAddressModal from "@/components/ui/Modals/orders/edit-address-order-modal";
import { li } from "framer-motion/client";
import Link from "next/link";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";

interface OrdersProps {
  searchTerm: string;
}
export default function ProcessingOrders({ searchTerm }: OrdersProps) {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    Partial<Address> | undefined
  >(undefined);
  const router = useRouter();
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { orders } = useSelector((state: any) => state.orders);

  const awaitingPayment = orders.filter((order: OrderItem) =>
    ["PENDING"].includes(order.status),
  );

  const filteredOrders = awaitingPayment.filter((order: OrderItem) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchesOrderId = order.order_no?.toLowerCase().includes(term);

    const matchesStore = order.manufacturer?.toLowerCase().includes(term);

    const matchesProduct = order.order_items?.some((item) =>
      item.product_name?.toLowerCase().includes(term),
    );

    return matchesOrderId || matchesStore || matchesProduct;
  });

  const handleEditAddress = (id: string) => {
    setSelectedId(id);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      router.push(`/dashboard/buyer/orders/edit-address/${id}`);
    } else {
      setTimeout(() => setIsOpen(true), 0);
    }
  };

  const token = useSelector((state: any) => state.token?.token);
  const { loading: repaying, sendHttpRequest: repayReq } = useHttp();

  return (
    <div className="space-y-c24 px-6 w-full">
      <div className="w-full">
        <div className="w-full space-y-c24 mt-c32">
          <AnimatePresence mode="wait">
            {awaitingPayment.length === 0 ? (
              <motion.div
                key="empty-orders"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="text-center text-000000/60 font-MontserratMedium text-c18">
                  You haven’t made any orders yet
                </p>
                <Button className="w-51">Start shopping</Button>
              </motion.div>
            ) : filteredOrders.length === 0 ? (
              <motion.div
                key="no-search-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center h-60"
              >
                <p className="text-c16 font-MontserratMedium text-000000/60">
                  No matching orders found
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="orders-list"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-c24"
              >
                {filteredOrders.map((item: OrderItem) => {
                  const isSingleItemOrder = item.order_items?.length === 1;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full flex justify-between mb-3 md:mb-c32">
                        <div>
                          <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                            Order is being processed
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <Link
                            href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                          >
                            <div className="flex flex-col md:flex-row gap-4 items-start  ">
                              {item.order_items?.map((prod) => (
                                <div
                                  key={prod.id}
                                  className="flex gap-4 items-start  w-full"
                                >
                                  <Image
                                    src={
                                      prod.product_image || "/placeholder.png"
                                    }
                                    alt={prod.product_name || "Product Image"}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 "
                                  />
                                  <div className="w-full">
                                    <p className="font-MontserratSemiBold text-base mb-1">
                                      {prod.product_name}
                                    </p>
                                    <p className=" text-c12 font-MontserratMedium mb-3">
                                      {item.manufacturer}
                                    </p>
                                    <p className="rounded-c12 bg-000000/10 text-000000/60  h-c32 py-2 w-fit min-w-24.5  px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center">
                                      {prod.quantity}Pc {prod.variation_name},
                                    </p>
                                    <p className="font-MontserratSemiBold text-c16 pt-3">
                                      ₦{item.total_price}
                                    </p>
                                    <div className="w-full gap-4 pl flex md:hidden  mt-4 space-y-4">
                                      {/* <button
                                      onClick={() => {
                                        setEditingAddress(undefined);
                                        setIsModalOpen(true);
                                      }}
                                      className="bg-transparent border h-c40 w-full rounded-c8 text-c10 border-ff715b text-ff715b"
                                    >
                                      Edit address
                                    </button> */}
                                      <Button
                                        onClick={() => {
                                          setSelectedOrderId(item.id);
                                          setOpenCancelModal(true);
                                        }}
                                        variant="primary"
                                      >
                                        Cancel order
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Link>
                        ) : (
                          <Link href={`/dashboard/buyer/orders/${item.id}`}>
                            <div className="flex gap-4 w-full">
                              <div className="hidden sm:flex gap-4">
                                <div
                                  className={`grid gap-4 ${
                                    item.order_items.length === 1
                                      ? "grid-cols-1"
                                      : item.order_items.length === 2
                                        ? "grid-cols-2"
                                        : "grid-cols-3"
                                  }`}
                                >
                                  {item.order_items?.slice(0, 3).map((prod) => (
                                    <div
                                      key={prod.id}
                                      className="flex flex-col items-center"
                                    >
                                      <div className="w-24 h-24 relative">
                                        <Image
                                          src={
                                            prod.product_image ||
                                            "/placeholder.png"
                                          }
                                          alt={
                                            prod.product_name || "Product Image"
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
                                    {item.order_items
                                      ?.slice(0, 3)
                                      .map((prod, index) => (
                                        <span
                                          key={prod.id}
                                          className="flex items-center"
                                        >
                                          <span
                                            className="max-w-[110px] truncate inline-block align-middle"
                                            title={prod.product_name}
                                          >
                                            {prod.product_name}
                                          </span>
                                          {index <
                                            Math.min(
                                              item.order_items.length,
                                              3,
                                            ) -
                                              1 && <span>,&nbsp;</span>}
                                        </span>
                                      ))}
                                    {item.order_items.length > 3 && (
                                      <span>...</span>
                                    )}
                                  </p>

                                  <p className="text-c12 font-MontserratMedium mb-3">
                                    {item.manufacturer}
                                  </p>

                                  <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                    {item.order_items?.length}{" "}
                                    <span className="pl-0.5">Items</span>
                                  </p>

                                  <p className="font-MontserratSemiBold text-c16 pt-3">
                                    ₦{item.total_price}
                                  </p>
                                </div>
                              </div>

                              <div className="flex sm:hidden w-full items-start gap-4">
                                {item.order_items?.[0] && (
                                  <Image
                                    src={
                                      item.order_items[0].product_image ||
                                      "/placeholder.png"
                                    }
                                    alt={
                                      item.order_items[0].product_name ||
                                      "Product Image"
                                    }
                                    width={96}
                                    height={96}
                                    className="w-24 h-24"
                                  />
                                )}

                                <div className="w-full ">
                                  <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
                                    {item.order_items?.[0]?.product_name}
                                  </p>

                                  <p className="text-c12 font-MontserratMedium mb-2">
                                    {item.manufacturer}
                                  </p>

                                  <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                    {item.order_items?.reduce(
                                      (sum, i) => sum + (i.quantity || 0),
                                      0,
                                    )}{" "}
                                    <span className="pl-0.5">Items</span>
                                  </p>

                                  <p className="font-MontserratSemiBold text-c16 pt-2">
                                    ₦{item.total_price}
                                  </p>
                                  <div className="w-full gap-4 text-c10 pl flex md:hidden  mt-4 space-y-4">
                                    <Button
                                      onClick={() => {
                                        setSelectedOrderId(item.id);
                                        setOpenCancelModal(true);
                                      }}
                                      variant="primary"
                                    >
                                      Cancel order
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}

                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          {/* <Button onClick={()=>  handleEditAddress(item.id)} variant="secondary" className="">
                            Edit address
                          </Button> */}
                          <Button
                            onClick={() => {
                              setSelectedOrderId(item.id);
                              setOpenCancelModal(true);
                            }}
                            variant="primary"
                          >
                            Cancel order
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
      {/* <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAddress={editingAddress}
        onSave={(newAddress) => {
          console.log("Saved Address:", newAddress);
          setIsModalOpen(false);
        }}
      />
      <OrderEditAddressModal onClose={()=>setIsOpen(false)} isOpen={isOpen} id={selectedId}/> */}
      <CancelOrderModal
        isDispute={false}
        isOpen={openCancelModal}
        orderId={selectedOrderId}
        onClose={() => setOpenCancelModal(false)}
      />
    </div>
  );
}
