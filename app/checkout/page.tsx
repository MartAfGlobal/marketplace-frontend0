"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronUp,
  Minus,
  ShieldCheck,
  Lock,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import MoreToLove from "@/components/martaf/MoreToLove";
import {
  CheckoutOrderResponse,
  CheckoutResponse,
  CreateOrderPayload,
} from "@/types/api";
import { apiService } from "@/lib/api";
import Footer from "@/components/martaf/Footer";

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<
    string | number | null
  >(null);
  const [showMoreAddresses, setShowMoreAddresses] = useState(false);
  const [showMorePayments, setShowMorePayments] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(false);
  const [errors, setErrors] = useState<{ address?: string; payment?: string }>(
    {}
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(
    null
  );
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    string | null
  >(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el && checkoutData?.items) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setIsOverflowing(hasOverflow);
    }
  }, [checkoutData?.items]);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.checkout();
        setCheckoutData(data);

        // Set default selections
        if (data.default_address_id) {
          setSelectedAddress(data.default_address_id);
        } else if (data.available_addresses.length > 0) {
          setSelectedAddress(data.available_addresses[0].id.toString());
        }

        if (data.saved_cards.length > 0) {
          setSelectedPayment(data.saved_cards[0].id);
        }
      } catch (err) {
        console.error("Checkout fetch error:", err);
        toast.error("Failed to load checkout data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckout();
  }, []);

  // Update quantity function - now works with API data
  const updateQuantity = async (itemId: string, change: number) => {
    if (!checkoutData) return;

    const item = checkoutData.items.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    // Don't update if trying to go below 1
    if (item.quantity === 1 && change < 0) {
      toast.warning("Minimum quantity is 1", {
        duration: 2000,
      });
      return;
    }

    try {
      // Update the local state immediately for better UX
      setCheckoutData((prev) => ({
        ...prev!,
        items: prev!.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ),
      }));

      // You might want to call an API to update the cart quantity here
      // await apiService.updateCartItem(itemId, newQuantity);

      // Show success toast for quantity updates
      if (change > 0) {
        toast.success(`Increased quantity to ${newQuantity}`, {
          duration: 1500,
        });
      } else {
        toast.success(`Decreased quantity to ${newQuantity}`, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
      // Revert the local state change
      setCheckoutData((prev) => ({
        ...prev!,
        items: prev!.items.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity } : item
        ),
      }));
    }
  };

  // Calculate totals based on API data
  const totalItems =
    checkoutData?.items.reduce((sum, item) => sum + item.subtotal, 0) || 0;
  const discount =
    checkoutData?.items?.reduce(
      (sum, item) => sum + Number(item.discount_amount),
      0
    ) || 0;
  const subtotal = totalItems - discount;

  const validateForm = () => {
    const newErrors: { address?: string; payment?: string } = {};

    if (!selectedAddress) {
      newErrors.address = "Please select a shipping address";
    }

    // if (!selectedPayment) {
    //   newErrors.payment = "Please select a payment method";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectAddress = async (addressId: string) => {
    setSelectedAddress(addressId);
    try {
      await apiService.updatePendingCheckoutInfo({
        shipping_address: addressId,
        //payment_card_token: selectedPayment?.toString(),
      });
    } catch (err) {
      toast.error("Failed to update shipping info");
    }
  };

  const handleSelectPayment = async (paymentId: string | number) => {
    setSelectedPayment(paymentId);
    try {
      await apiService.updatePendingCheckoutInfo({
        shipping_address: selectedAddress?.toString(),
        //payment_card_token: paymentId.toString(),
      });
    } catch (err) {
      toast.error("Failed to update payment info");
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please complete all required fields", {
        description:
          "Make sure you've selected a shipping address and payment method.",
        duration: 3000,
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const payload: CreateOrderPayload = {
        shipping_address: selectedAddress!.toString(),
        ...(selectedShippingMethod && {
          shipping_method: selectedShippingMethod,
        }),
        ...(appliedCoupon && { coupon_code: appliedCoupon }),
      };

      const result: CheckoutOrderResponse = await apiService.createOrder(
        payload
      );

      // Handle the new response structure from your backend
      if (result.paystack_url) {
        // Redirect to Paystack for payment
        window.location.href = result.paystack_url;
      } else {
        // Handle free order or other cases
        toast.success("Order placed successfully! 🎉", {
          description: `Your order is confirmed.`,
          duration: 2000,
        });

        setTimeout(() => {
          window.location.href = `/order-success/${result.order_ids[0]}`;
        }, 2000);
      }
    } catch (err: any) {
      console.error("Order creation failed:", err);

      // Better error handling for different error types
      let errorMessage = "Something went wrong during checkout.";

      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      toast.error("Checkout failed", {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Get visible addresses and payments based on API data
  const visibleAddresses = showMoreAddresses
    ? checkoutData?.available_addresses || []
    : (checkoutData?.available_addresses || []).slice(0, 2);

  const visiblePayments = showMorePayments
    ? checkoutData?.saved_cards || []
    : (checkoutData?.saved_cards || []).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF715B]"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load checkout data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#FF715B] text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b md:border-none w-[17%] ">
        <Link href="/cart">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Checkout</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex justify-between gap-6">
        <div className="p-4 space-y-6 pb-24 flex-1">
          {/* Orders List Section desktop*/}
          <div className="hidden md:block">
            <div className="items-center justify-between mb-4 flex">
              <h2 className="text-lg font-semibold">
                Items details ({checkoutData.items.length})
              </h2>
              <button
                className="text-[#FF715B] flex items-center justify-center font-bold"
                onClick={() => setExpandedOrders(!expandedOrders)}
              >
                {expandedOrders ? "See less" : "View all"}
              </button>
            </div>

            <div
              ref={containerRef}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedOrders
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-4 flex gap-6">
                {checkoutData.items.map((item) => (
                  <div key={item.id} className="min-h-36 min-w-32">
                    <div className="flex flex-col gap-3 mb-3">
                      <div className=" bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative w-32 h-32">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-semibold bg-black text-white rounded-md">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">
                            {item.formatted_subtotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Shipping address</h2>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                )}
              </div>

              <div>
                {checkoutData.available_addresses.length > 2 && (
                  <button
                    className="text-[#FF715B] text-sm font-medium hidden md:flex"
                    onClick={() => setShowMoreAddresses(!showMoreAddresses)}
                  >
                    {showMoreAddresses ? "See less" : "View all"}
                  </button>
                )}
                <Link href="/account/shipping-addresses">
                  <button className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center md:hidden">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </Link>
              </div>
            </div>

            {checkoutData.available_addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No shipping addresses found</p>
                <Link href="/account/shipping-addresses">
                  <Button className="mt-4 bg-[#FF715B] hover:bg-[#ff4d2d]">
                    Add Address
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {visibleAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddress === address.id.toString()
                        ? "bg-[#7C2AE8] border-[#7C2AE8] text-white"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectAddress(address.id.toString())}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                          selectedAddress === address.id.toString()
                            ? "bg-white border-white"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAddress === address.id.toString() && (
                          <div className="w-3 h-3 bg-[#7C2AE8] rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          {address.name || address.full_name}
                        </div>
                        <div className="text-sm mb-1">
                          {address.phone || address.phone_number}
                        </div>
                        <div className="text-sm">
                          {address.address ||
                            `${address.street}, ${address.city}, ${address.state}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  href="/account/shipping-addresses"
                  className="hidden md:block"
                >
                  <div className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-[#FF715B] transition-all flex items-center justify-center min-h-[140px]">
                    <div className="flex flex-col items-center text-gray-600">
                      <Plus className="w-6 h-6 mb-1 text-[#343330]" />
                      <span className="text-sm font-medium">
                        Add new address
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {checkoutData.available_addresses.length > 2 && (
              <button
                className="text-[#FF715B] text-sm font-medium mt-3 md:hidden"
                onClick={() => setShowMoreAddresses(!showMoreAddresses)}
              >
                {showMoreAddresses ? "See less" : "See more"}
              </button>
            )}
          </div>

          {/* Payment Method Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Payment method</h2>

              <Link href="/account/payment-methods/add" className="md:hidden">
                <button className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center hover:bg-[#ff4d2d] transition-colors">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </Link>

              {checkoutData.saved_cards.length > 3 && (
                <Link
                  href="/account/payment-methods"
                  className="hidden md:flex"
                >
                  <button className="text-[#FF715B] text-sm font-medium">
                    View all
                  </button>
                </Link>
              )}
            </div>

            {checkoutData.saved_cards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payment methods found</p>
                <Link href="/account/payment-methods/add">
                  <Button className="mt-4 bg-[#FF715B] hover:bg-[#ff4d2d]">
                    Add Payment Method
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {visiblePayments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`relative min-h-[152px] p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedPayment === payment.id
                        ? "border-[#FF715B] bg-[#FF715B]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectPayment(payment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center md:hidden  ${
                            selectedPayment === payment.id
                              ? "border-[#FF715B]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === payment.id && (
                            <div className="w-3 h-3 bg-[#FF715B] rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">
                            {payment.card_number || payment.last_4_digits
                              ? `••••••••••••${
                                  payment.last_4_digits ||
                                  payment.card_number?.slice(-4)
                                }`
                              : payment.name || payment.provider}
                          </span>
                        </div>
                      </div>
                      <div className="h-6 w-12 relative">
                        {payment.card_type && (
                          <div className="text-xs font-medium">
                            {payment.card_type.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center hidden md:flex absolute right-4 bottom-4  ${
                        selectedPayment === payment.id
                          ? "border-[#FF715B]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPayment === payment.id && (
                        <div className="w-3 h-3 bg-[#FF715B] rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
                <Link
                  href="/account/payment-method/add"
                  className="hidden md:block"
                >
                  <div className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-[#FF715B] transition-all flex items-center justify-center min-h-[140px]">
                    <div className="flex flex-col items-center text-gray-600">
                      <Plus className="w-6 h-6 mb-1 text-[#343330]" />
                      <span className="text-sm font-medium">Add new card</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {checkoutData.saved_cards.length > 3 && (
              <Link href="/account/payment-methods">
                <button className="text-[#FF715B] text-sm font-medium mt-3 md:hidden">
                  See more
                </button>
              </Link>
            )}

            {errors.payment && (
              <p className="text-red-500 text-sm mt-2">{errors.payment}</p>
            )}
          </div>

          {/* Orders List Section Mobile */}
          <div className="md:hidden">
            <div className="flex md:hidden items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Orders list ({checkoutData.items.length})
              </h2>
              <button
                className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center"
                onClick={() => setExpandedOrders(!expandedOrders)}
              >
                {expandedOrders ? (
                  <Minus className="w-5 h-5 text-white" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedOrders
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-4">
                {checkoutData.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm mb-1">
                          {item.product_name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          {item.product.description || ""}
                        </p>
                        <p className="text-xs text-gray-600 mb-2 bg-gray-100 w-fit p-1.5 rounded-lg">
                          {item.variation_display}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">
                            {item.formatted_subtotal}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-neutral-600" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-neutral-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-green-600">
                            Free shipping
                          </div>
                          <div className="text-xs text-gray-500">
                            Delivery estimate: 3-5 business days
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 rounded-lg p-4 md:hidden block">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total items</span>
                <span>₦{totalItems.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discounts</span>
                <span className="text-[#FF715B]">
                  -₦{discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Total and Place Order Section */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg md:hidden block z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">Total</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    ₦{subtotal.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₦{totalItems.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddress}
              className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white px-8 py-4 text-lg font-semibold rounded-lg h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "Processing..." : "Place order"}
            </Button>
          </div>
        </div>

        {/* Right: Checkout Summary - only on md+ */}
        <div className="hidden md:block md:w-1/3 h-fit sticky top-0 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          {/* Coupon input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button className="text-[#FF715B] border border-[#FF715B] rounded-md px-3 py-2 text-sm font-medium hover:bg-[#FF715B]/10">
              Apply coupon
            </button>
          </div>

          {/* More coupons link */}
          <div className="flex items-center justify-between mb-3 text-sm font-medium text-gray-700 cursor-pointer">
            <span>More coupons</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Summary Details */}
          <div className="space-y-4 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span>Total items</span>
              <span>₦{totalItems.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discounts</span>
              <span className="text-red-500">₦{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping fee</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Order total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-base border-t pt-4">
              <span>
                <p className="font-semibold text-sm">Total</p>
                <p className="text-xs text-gray-500">
                  Please refer to your final actual payment amount.
                </p>
              </span>
              <span className="text-3xl font-bold">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            disabled={isPlacingOrder || !selectedAddress}
            className="block mt-6 w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white py-3 text-base rounded-lg font-medium h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder
              ? "Processing..."
              : `Checkout (₦${subtotal.toLocaleString()})`}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <MoreToLove />
      </div>
      <div className="mt-6">
        <Footer />
      </div>
    </div>
  );
}
