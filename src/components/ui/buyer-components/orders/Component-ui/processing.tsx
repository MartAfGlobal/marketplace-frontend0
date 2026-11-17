"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
import { getBuyerOrderDateLabel } from "@/utils/buyerOrderDisplay";
import OrdersListView from "./shared/OrdersListView";
import OrderLineItemSummary from "./shared/OrderLineItemSummary";
import OrderItemsGridSummary, {
  OrderPreviewItem,
} from "./shared/OrderItemsGridSummary";

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
      <OrdersListView
        hasOrders={awaitingPayment.length > 0}
        hasResults={filteredOrders.length > 0}
        emptyMessage="You haven’t made any orders yet"
        noResultsMessage="No matching orders found"
      >
        {filteredOrders.map((item: OrderItem) => {
                  const orderItems = item.order_items || (item as any).items || [];
                  const isSingleItemOrder = orderItems.length === 1;
                  const previewItems: OrderPreviewItem[] = orderItems.map(
                    (prod) => ({
                      id: prod.id,
                      productName: prod.product_name,
                      productImage: prod.product_image || "/placeholder.png",
                      quantity: prod.fulfilled_quantity ?? prod.quantity,
                    }),
                  );
                  const itemCount = orderItems.reduce(
                    (sum, orderItem) =>
                      sum +
                      (orderItem.fulfilled_quantity ??
                        orderItem.quantity ??
                        0),
                    0,
                  );
                  const totalPrice = orderItems.reduce(
                    (sum, orderItem) =>
                      sum +
                      orderItem.price_at_purchase *
                        (orderItem.fulfilled_quantity ??
                          orderItem.quantity ??
                          0),
                    0,
                  );
                  const orderDate = getBuyerOrderDateLabel(item);

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
                        {orderDate.date && (
                          <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                            {orderDate.label}: {orderDate.date}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                            >
                              <div className="flex flex-col md:flex-row gap-4 items-start  ">
                                {orderItems.map((prod) => (
                                  <OrderLineItemSummary
                                    key={prod.id}
                                    image={prod.product_image || "/placeholder.png"}
                                    imageAlt={
                                      prod.product_name || "Product Image"
                                    }
                                    productName={prod.product_name}
                                    sellerName={item.manufacturer}
                                    details={
                                      <>
                                        {prod.fulfilled_quantity ?? prod.quantity}
                                        Pc, {prod.variation_name},
                                      </>
                                    }
                                    price={
                                      <>
                                        ₦
                                        {(
                                          prod.price_at_purchase *
                                          (prod.fulfilled_quantity ??
                                            prod.quantity ??
                                            0)
                                        ).toLocaleString()}
                                      </>
                                    }
                                    imageClassName="h-24 w-24 "
                                    detailsClassName="rounded-c12 bg-000000/4 text-000000/68 py-2 px-4  w-fit font-MontserratSemiBold text-c10  md:text-c12 justify-center flex items-center"
                                  />
                                ))}
                              </div>
                            </Link>
                            <div className="w-full gap-4 text-c10 pl flex md:hidden  mt-4 space-y-4">
                              <div className="w-full"></div>
                              {item.buyer_status === "Processing" && item.can_cancel && (
                                <Button
                                  onClick={() => {
                                    setSelectedOrderId(item.id);
                                    setOpenCancelModal(true);
                                  }}
                                  variant="primary"
                                >
                                  Cancel order
                                </Button>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <Link href={`/dashboard/buyer/orders/${item.id}`}>
                              <OrderItemsGridSummary
                                products={previewItems}
                                sellerName={item.manufacturer}
                                itemCount={itemCount}
                                totalPrice={totalPrice}
                                desktopImageClassName="w-24 h-24 object-cover"
                                mobileImageClassName="w-24 h-24"
                                itemCountClassName="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60"
                              />
                            </Link>
                            <div className="w-full gap-4 text-c10 pl flex md:hidden  mt-4 space-y-4">
                              <div className="w-full"></div>
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
                          </>
                        )}

                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          {/* <Button onClick={()=>  handleEditAddress(item.id)} variant="secondary" className="">
                            Edit address
                          </Button> */}
                          {item.buyer_status === "Processing" && item.can_cancel && (
                            <Button
                              onClick={() => {
                                setSelectedOrderId(item.id);
                                setOpenCancelModal(true);
                              }}
                              variant="primary"
                            >
                              Cancel order
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
        })}
      </OrdersListView>
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
