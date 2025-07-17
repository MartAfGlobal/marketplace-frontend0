"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Heart, Loader2, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Footer from "@/components/martaf/Footer";
import MoreToLove from "@/components/martaf/MoreToLove";
import { ConfirmDeliveryModal } from "@/components/martaf/ConfirmDeliveryModal";
import { Order } from "@/types/api";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getStatusDisplay } from "@/lib/utils";

// Mock order data
// const orders = [
//   {
//     id: 1,
//     status: "on_way",
//     title: "Wireless Bluetooth Headphones with Noise Cancellation",
//     description: "Premium audio headphones",
//     specifications: "Black, Over-ear",
//     price: "₦25,000",
//     delivery: "May 15, 2025",
//     image:
//       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 2,
//     status: "dispute",
//     title: "Vintage Leather Handbag for Women",
//     description: "Genuine leather shoulder bag",
//     specifications: "Brown, Medium size",
//     price: "₦18,500",
//     delivery: "May 15, 2025",
//     image:
//       "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 3,
//     status: "completed",
//     title: "Organic Cotton T-Shirt Pack (3-piece)",
//     description: "Comfortable casual wear",
//     specifications: "3PC, Assorted colors",
//     price: "₦12,000",
//     delivery: "Delivered",
//     image:
//       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 4,
//     status: "dispute",
//     title: "Smart Fitness Watch with Heart Rate Monitor",
//     description: "Health tracking smartwatch",
//     specifications: "Black, Silicone strap",
//     price: "₦45,000",
//     delivery: "May 15, 2025",
//     image:
//       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 5,
//     status: "awaiting_payment",
//     title: "Professional Kitchen Knife Set",
//     description: "Stainless steel knives",
//     specifications: "5PC, German steel",
//     price: "₦35,000",
//     delivery: "Pending payment",
//     image:
//       "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 6,
//     status: "to_ship",
//     title: "Luxury Scented Candle Collection",
//     description: "Aromatherapy candles",
//     specifications: "4PC, Mixed scents",
//     price: "₦15,500",
//     delivery: "Ready to ship",
//     image:
//       "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 7,
//     status: "shipped",
//     title: "Gaming Mechanical Keyboard with RGB Lighting",
//     description: "Backlit gaming keyboard",
//     specifications: "RGB, Cherry MX switches",
//     price: "₦28,000",
//     delivery: "May 20, 2025",
//     image:
//       "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=400&q=80",
//   },
// ];

// Mock product recommendations

const tabs = [
  { key: "all", label: "All" },
  { key: "Awaiting Confirmation", label: "Awaiting Confirmation" },
  { key: "Processing", label: "To ship(2)" },
  { key: "Shipped", label: "Shipped(1)" },
  { key: "Delivered", label: "Processed(1)" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<
    number | string | null
  >(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    Order["status"] | undefined
  >(undefined);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { results } = await apiService.getOrderHistory(selectedStatus);
        setDisplayedOrders(results); // store all orders once
      } catch (err) {
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, [selectedStatus]);

  const applyFilters = () => {
    const filteredByTab =
      activeTab === "all"
        ? displayedOrders
        : displayedOrders.filter(
            (order) => order.status.toLowerCase() === activeTab.toLowerCase()
          );

    return filteredByTab.filter((order) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const normalizedQuery = query.replace(/[₦,]/g, "");

      const itemMatch = order.items?.some((item) => {
        const nameMatch =
          item?.product?.name?.toLowerCase().includes(query) || false;
        const descriptionMatch = item?.product?.description
          ?.toLowerCase()
          .includes(query);

        const colorMatch = item?.variant?.color?.toLowerCase().includes(query);
        const sizeMatch = item?.variant?.size?.toLowerCase().includes(query);

        return nameMatch || descriptionMatch || colorMatch || sizeMatch;
      });

      const priceMatch = order.total_price
        .toString()
        .replace(/[₦,]/g, "")
        .toLowerCase()
        .includes(normalizedQuery);

      return itemMatch || priceMatch;
    });
  };

  // Handle search with animation
  useEffect(() => {
    setIsSearching(true);

    const timer = setTimeout(() => {
      setDisplayedOrders(applyFilters);
      setIsSearching(false);
    }, 300); // Small delay for smooth transition

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Initialize displayed orders
  // useEffect(() => {
  //   setDisplayedOrders(searchFilteredOrders);
  // }, []);

  const handleConfirmDelivery = async (orderId: string | number | null) => {
    try {
      await apiService.MarkOrderDelivered(orderId); // Await the API call
      toast.success(`Delivery confirmed for order #${orderId}`);
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast.error(error.message || "Failed to confirm delivery");
    }
  };

  const router = useRouter();

  const handleViewOrderDetails = async (orderId: string | number) => {
    try {
      // Optional: Fetch the order (to validate or pre-load)
      await apiService.getOrder(orderId);

      // Navigate to the order details page
      router.push(`/order-details/${orderId}`);
    } catch (error: any) {
      toast.error(error.message || "Could not load order details");
    }
  };

  const handleTrackOrder = async (orderId: number | string) => {
    try {
      await apiService.trackOrder(orderId);
      router.push(`/track-order/${orderId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to retrieve tracking information");
    }
  };

  const handleCancelOrder = async (orderId: number | string) => {
    try {
      const cancelledOrder = await apiService.cancelOrder(orderId);
      toast.success(`Order #${orderId} has been cancelled successfully`);

      // Optionally update the local state to reflect change
      setDisplayedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === cancelledOrder.id ? cancelledOrder : order
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel the order");
    }
  };

  const handleSearchToggle = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery(""); // Clear search when closing
    }
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setIsSearching(true);

    // Smooth transition for tab change
    setTimeout(() => {
      setIsSearching(false);
    }, 200);
    if (tabKey === "all") {
      setSelectedStatus(undefined); // fetch all orders
    } else {
      setSelectedStatus(tabKey as Order["status"]); // fetch only specific status
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="p-0">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-black">Orders</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 md:hidden"
            onClick={handleSearchToggle}
          >
            <Search className="w-6 h-6 text-gray-600" />
          </Button>
        </div>

        {/* Search Input */}
        <div
          className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
            showSearchInput
              ? "pt-4 pb-4 max-h-24 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200"
              autoFocus={showSearchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Horizontally Scrollable Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 flex-wrap md:flex-nowrap gap-4">
            <div className="flex overflow-x-auto scrollbar-hide px-4 -mb-px scroll-smooth">
              {tabs.map((tab, index) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out relative touch-manipulation ${
                    activeTab === tab.key
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-gray-900"
                  } ${index > 0 ? "ml-2" : ""}`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full transition-all duration-200 ease-in-out"></div>
                  )}
                </button>
              ))}
              {/* Add extra padding at the end for better scrolling */}
              <div className="flex-shrink-0 w-4"></div>
            </div>

            {/* Search Input - visible from md and up */}
            <div className="hidden md:block md:max-w-sm w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* confirm delivery modal */}
      <ConfirmDeliveryModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedOrderId(null);
        }}
        onConfirm={handleConfirmDelivery}
        orderId={selectedOrderId ?? ""}
        // Pass the first order ID for confirmation
      />
      {/* Orders List */}
      <div className="px-4 py-6 pb-8 relative min-h-[400px]">
        {/* Loading overlay */}
        {isSearching && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Filtering orders...</span>
            </div>
          </div>
        )}

        {/* Orders with staggered animation */}
        <div
          className={`space-y-4 transition-all duration-300 ease-in-out ${
            isSearching
              ? "opacity-30 transform scale-[0.98]"
              : "opacity-100 transform scale-100"
          }`}
        >
          {displayedOrders.map((order, index) => {
            const statusDisplay = getStatusDisplay(order.status);
            return (
              <Card
                key={order.id}
                className="p-4 bg-white shadow-sm border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-0.5"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: !isSearching
                    ? "fadeInUp 0.4s ease-out forwards"
                    : "none",
                }}
                onClick={() => handleViewOrderDetails(order.id)}
              >
                <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`text-sm font-medium ${statusDisplay.color} leading-tight`}
                        >
                          {statusDisplay.text}
                        </span>
                        <span className="text-sm font-medium">
                          Order ID: {order.order_no}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 text-right leading-tight ml-2">
                        Delivery: {order.estimated_delivery_date ?? "Pending"}
                      </span>
                    </div>
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        order.items?.[0]?.product?.images_data?.[0]?.image ||
                        "/placeholder.png"
                      }
                      alt={order.items[0]?.product?.name || "Product image"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    {/* Status and Delivery - Better Alignment */}
                    

                    {/* Product Info  */}
                    <div className="md:flex justify-between">
                      <div>
                        <div className="space-y-1 mb-4">
                          <h3 className="font-semibold text-black text-sm sm:text-base leading-tight line-clamp-2">
                            {order.items[0]?.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-tight">
                            {order.items[0]?.product?.description}
                          </p>
                          <p className="text-xs text-gray-500 leading-tight">
                            {[
                              order.items[0]?.variant?.color,
                              order.items[0]?.variant?.size,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>

                        {/* Price */}
                        <p className="text-lg font-bold text-black mb-4">
                          ₦{order.items[0]?.price_at_purchase}
                        </p>
                      </div>

                      {/* Action Buttons - Responsive Layout */}
                      {order.status === "Out for Delivery" && (
                        <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                          <Button
                            size="sm"
                            className="hidden md:flex h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setShowConfirmModal(true);
                            }}
                          >
                            Confirm delivery
                          </Button>
                          <Link
                            href="/track-order"
                            className="flex-1 md:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                            >
                              Track order
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="flex-1 md:hidden h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setShowConfirmModal(true);
                            }}
                          >
                            Confirm delivery
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden md:flex w-full h-9 text-xs sm:text-sm text-orange-600 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                            onClick={() => handleViewOrderDetails(order.id)}
                          >
                            Order details
                          </Button>
                        </div>
                      )}
                      {order.status === "Awaiting Confirmation" && (
                        <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                          <Link
                            href="/account/edit/"
                            className="flex-1 md:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                            >
                              Edit Address
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="flex-1  h-9 md:py-2 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                            //onClick={() => handleConfirmDelivery(order.id)}
                          >
                            Confirm & Pay
                          </Button>
                        </div>
                      )}
                      {order.status === "Processing" && (
                        <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                          <Button
                            size="sm"
                            className="flex-1 h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel order
                          </Button>
                          <Link
                            href="/account/edit/"
                            className="flex-1 md:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d]  font-medium transition-colors duration-200 md:px-24"
                            >
                              Edit Address
                            </Button>
                          </Link>
                        </div>
                      )}
                      {order.status === "Shipped" && (
                        <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                          <Link
                            href="/track-order"
                            className="flex-1 md:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d]  font-medium transition-colors duration-200 md:px-24"
                              onClick={() => handleTrackOrder(order.id)}
                            >
                              Track order
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="flex-1 h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setShowConfirmModal(true);
                            }}
                          >
                            Confirm delivery
                          </Button>
                        </div>
                      )}
                      {order.status === "Delivered" && (
                        <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                          <Button
                            size="sm"
                            className="flex-1 md:flex-none h-9 text-xs sm:text-sm border border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                            onClick={() => handleConfirmDelivery(order.id)}
                          >
                            Add to cart
                          </Button>
                          <Link
                            href="/track-order"
                            className="flex-1 md:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d]  font-medium transition-colors duration-200 md:px-24"
                            >
                              Leave a review
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden md:flex w-full h-9 text-xs sm:text-sm text-orange-600 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {!isSearching && displayedOrders.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <p className="text-gray-500">
              {searchQuery
                ? `No orders found matching "${searchQuery}"`
                : "No orders found for this category."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* More to love section */}
      <div>
        <h2 className="text-xl font-bold text-black mb-4">More to love</h2>
        <MoreToLove />
      </div>
      <Footer />

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
