"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
import Link from "next/link";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";
import { getBuyerOrderTrackingPath } from "@/utils/buyerOrderTracking";
import { getBuyerOrderDateLabel } from "@/utils/buyerOrderDisplay";
import OrdersListView from "./shared/OrdersListView";
import OrderLineItemSummary from "./shared/OrderLineItemSummary";
import OrderItemsGridSummary, {
  OrderPreviewItem,
} from "./shared/OrderItemsGridSummary";

interface OrdersProps {
  searchTerm: string;
}

export default function ToShip({ searchTerm }: OrdersProps) {
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
    (state: RootState) => state.token?.token ?? undefined,
  );

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { fetchOrders } = useFetchOrders();
  const { orders } = useSelector((state: any) => state.orders);
  const router = useRouter();

  const toShip = orders.filter(
    (order: OrderItem) => order.status === "RECEIVED_AT_HUB",
  );

  const filteredOrders = toShip.filter((order: OrderItem) => {
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
  const handleTrackOrder = (orderId: string) => {
    router.push(getBuyerOrderTrackingPath(orderId));
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
      <OrdersListView
        hasOrders={toShip.length > 0}
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
                  const totalPrice = orderItems.reduce(
                    (sum: number, orderItem) =>
                      sum +
                      orderItem.price_at_purchase *
                        (orderItem.fulfilled_quantity ??
                          orderItem.quantity ??
                          0),
                    0,
                  );
                  const orderDate = getBuyerOrderDateLabel(item);
                  const MobileActions = (
                    <div className="w-full gap-4 text-c10 flex md:hidden mt-4 space-y-4">
                      {/* <Button
                        onClick={() => handleEditAddress(item.id)}
                        variant="secondary"
                      >
                        Edit address
                      </Button> */}
                      <div className="w-full"></div>

                      <Button
                        variant="secondary"
                        key={item.id}
                        onClick={() => handleTrackOrder(item.id)}
                      >
                        Track order
                      </Button>
                    </div>
                  );
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
                          {orderDate.label}: {orderDate.date}
                        </p>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="flex flex-col md:flex-row gap-4 items-start  "
                            >
                              {orderItems.map((prod) => (
                                <OrderLineItemSummary
                                  key={prod.id}
                                  image={prod.product_image}
                                  imageAlt={
                                    prod.product_name || "Product Image"
                                  }
                                  productName={prod.product_name}
                                  sellerName={item.manufacturer}
                                  details={
                                    <>
                                      {prod.fulfilled_quantity ?? prod.quantity}
                                      Pc,
                                      {prod.variation_name || prod.product_name}
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
                                  detailsClassName="rounded-c12 bg-000000/10 text-000000/60 p-2  w-fit font-MontserratSemiBold text-c12 flex items-center "
                                />
                              ))}
                            </Link>

                            {MobileActions}
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="flex gap-4 w-full"
                            >
                              <OrderItemsGridSummary
                                products={previewItems}
                                sellerName={item.manufacturer}
                                itemCount={orderItems.length}
                                totalPrice={totalPrice}
                                desktopImageClassName="w-24 h-24 object-cover"
                                mobileImageClassName="w-24 h-24"
                                itemCountClassName="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60"
                              />
                            </Link>
                            {MobileActions}
                          </>
                        )}
                        <div className="hidden w-full gap-4 pl-4 md:flex md:flex-col md:max-w-70 space-y-4">
                          <>
                            <Button
                              variant="secondary"
                              key={item.id}
                              onClick={() => handleTrackOrder(item.id)}
                            >
                              Track order
                            </Button>
                          </>

                          <div className="w-full hidden md:flex justify-center">
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                              className="text-c14 font-MontserratSemiBold text-ff715b"
                            >
                              Order details
                            </Link>
                          </div>
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
      /> */}

      {/* <OrderEditAddressModal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        id={selectedId}
      /> */}
      {/* <CancelOrderModal
        isOpen={openCancelModal}
        orderId={selectedOrderId}
        onClose={() => setOpenCancelModal(false)}
      /> */}
    </div>
  );
}
