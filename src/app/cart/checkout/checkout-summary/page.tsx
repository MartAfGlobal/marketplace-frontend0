"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBack from "@/assets/icons/navBacksmall.png";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/Button/Button";

import { setCheckoutItems, setCheckoutSummary } from "@/store/cart/cartSlice";

import { Input } from "@/components/ui/forms/Input";

import Master from "@/assets/mobile/cards/master.png";
import CaretDwn from "@/assets/mobile/carent-down.png";
import CareteRight from "@/assets/mobile/cards/CaretRight.png";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CheckoutModal from "@/components/ui/cart/CheckoutModal";
import GuestCheckoutModal from "@/components/ui/Modals/guestCheckoutModal";

export default function CheckoutSummary() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  // Prefer Redux token (set by login or axios refresh)
  const token = useSelector((state: RootState) => state.token.token);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const checkoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems,
  );
  const checkoutSummary = useSelector(
    (state: RootState) => state.cart.checkoutSummary,
  );

  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses,
  );
  const selectedAddressId = useSelector(
    (state: RootState) => state.buyer.selectedAddressId,
  );

  const selectedAddress = buyerAddresses.find(
    (addr) => addr.id === selectedAddressId,
  );

  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);

  const { sendHttpRequest, loading } = useHttp();
  const { sendHttpRequest: saveRequest, loading: saving } = useHttp();

  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    if (!hasFetched && token) {
      sendHttpRequest({
        requestConfig: {
          url: "/cart/summary/",
          method: "GET",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: (res: any) => {
          const backendCart = res?.data;

          if (!backendCart) return;

          // const uniqueMap = new Map();

          // backendCart.items.forEach((item: any) => {
          //   const key = `${item.product_id}-${item.variation_name || "no-var"}`;
          //   if (!uniqueMap.has(key)) {
          //     uniqueMap.set(key, {
          //       id: item.product_id,
          //       name: item.product_name,
          //       product_image: item.product_image,
          //       quantity: item.quantity,
          //       subtotal: Number(item.total_price),
          //       unit_price: Number(item.unit_price),
          //       variation_name: item.variation_name,
          //       variation_id: item.variation_id,
          //     });
          //   }
          // });

          // const mappedItems = Array.from(uniqueMap.values());

          // dispatch(setCheckoutItems(mappedItems));
          // dispatch(
          //   setCheckoutSummary({
          //     all_addresses: backendCart.all_addresses || [],
          //     applied_coupon: backendCart.applied_coupon || null,
          //     discount_amount:
          //       backendCart.discount_amount?.toString() || "0.00",
          //     shipping_address: backendCart.shipping_address || null,
          //     shipping_cost: backendCart.shipping_cost?.toString() || "0.00",
          //     shipping_methods: backendCart.shipping_methods || [],
          //     subtotal: backendCart.subtotal?.toString() || "0.00",
          //     total: backendCart.total?.toString() || "0.00",
          //   })
          // );

          // setHasFetched(true);
        },
      });
    }
  }, [token]);


  if (loading) {
  return <p className="text-c12">Loading addresses...</p>;
}

  if (!selectedAddress) {
    return <p className="text-c12">No address selected</p>;
  }

  const handleGuestCheckout = (e?: React.FormEvent) => {
    e?.preventDefault();

    const formData = checkoutSummary?.guest_address;
    console.log("checking formdata", formData);

    const items = checkoutItems.map((item) => ({
      product_id: item.id,
      variation_id: item.variation_id || null,
      quantity: item.quantity,
    }));

    saveRequest({
      requestConfig: {
        url: "/checkout/guest/",
        method: "POST",
        body: { ...formData, items },
        successMessage: "Redirecting to payment gateway...",
      },
      successRes: (res) => {
        console.log("respons data:", res.data);

        if (res.data?.paystack_payment_url) {
          window.location.href = res.data.paystack_payment_url;
        } else {
          return;
        }
      },
    });
  };

  const handleCheckout = () => {
    sendHttpRequest({
      requestConfig: {
        url: "/checkout/",
        method: "POST",
        body: { shipping_address_id: selectedAddressId },
        token: token ?? undefined,
        isAuth: true,
        successMessage: "Checkout successful!",
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("respons data:", res.data);

        if (res.data?.paystack_payment_url) {
          window.location.href = res.data.paystack_payment_url;
        } else {
          return;
        }
      },
    });
  };

  return (
    <div className="px-6">
      {/* Back button */}
      <div className="pb-7">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Checkout Summary
          </p>
        </button>
      </div>

      {/* Shipping Address */}
      <div>
        <div className="font-MontserratSemiBold text-c12 flex justify-between w-full mb-6">
          <p>Shipping address</p>
          <button
            onClick={() =>
              router.push("/card/mobile/payment-cards/add-new-card")
            }
            className="text-ca0202"
          >
            Change address
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="w-full p-4 h-31 rounded-2xl bg-000000/7 circle-shadow flex-shrink-0 shadow-sm cursor-pointer flex items-center"
        >
          <div className="flex items-start gap-3">
            {token ? (
              <div className="flex-1">
                <p className="font-MontserratSemiBold text-c12 pb-2">
                  {selectedAddress.first_name} {selectedAddress.last_name}
                </p>
                <p className="text-c12 font-MontserratNormal">
                  {selectedAddress.phone}
                </p>
                <p className="text-c12 font-MontserratNormal">
                  {selectedAddress.address}
                </p>
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-MontserratSemiBold text-c12 pb-2">
                  {checkoutSummary?.guest_address?.guest_first_name}{" "}
                  {checkoutSummary?.guest_address?.guest_last_name}
                </p>
                <p className="text-c12 font-MontserratNormal">
                  {checkoutSummary?.guest_address?.guest_phone}
                </p>
                <p className="text-c12 font-MontserratNormal">
                  {checkoutSummary?.guest_address?.guest_shipping_address.line1}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment Method */}
      {/* <div className="mt-7">
        <div className="font-MontserratSemiBold text-c12 flex justify-between w-full mb-6">
          <p>Payment method</p>
          <button
            onClick={() => router.push("/card/mobile/addresses/add-address")}
            className="text-ca0202"
          >
            Change method
          </button>
        </div>
        <div className="pb-7">
          <div className="flex items-center justify-between">
            <Image
              src={Master}
              alt="card logo"
              width={24}
              height={14.81}
              className="object-contain"
            />
            <span className="text-c12 font-MontserratSemiBold text-000000 flex-1 ml-3">
              272080******7167
            </span>
          </div>
        </div>
      </div> */}

      {/* Orders List */}
      <div className="relative md:h-full mt-c28">
        <div className="w-full pb-4 md:pb-0">
          <div className="flex justify-between items-center mb-c24">
            <p className="text-c12 font-MontserratSemiBold ">
              Orders list ({checkoutItems.length})
            </p>
          </div>

          <div className="md:flex gap-18 justify-center">
            <div className="flex w-full justify-between">
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
                className="space-y-c24 w-full"
              >
                {checkoutItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.variation_id}-${index} || "no-var"}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-full justify-between items-end pb-8 flex">
                      <div className="flex gap-4 w-full items-center md:items-start">
                        <div className="flex gap-3 items-center w-full max-w-fit">
                          <Image
                            src={item.product_image || "/placeholder.png"}
                            alt={item.product_name || "name"}
                            width={100}
                            height={100}
                            className="w-16 h-16 md:w-25 md:h-25"
                          />
                        </div>
                        <div className="w-full md:max-w-143.75">
                          <p className="font-MontserratSemiBold text-c12 md:text-sm md:leading-c24 pb-1 md:pb-3 text-000000">
                            {item.product_name}
                          </p>
                          {/* <p className="font-MontserratNormal text-c12 pb-3">
                            Two piece shop
                          </p> */}
                          <div className="w-fit  p-2 justify-center rounded-c12 bg-black/3 flex items-center">
                            <span className="text-black opacity-32 font-MontserratSemiBold text-c12 ">
                              {item.quantity}PC,{" "}
                              {item.variation_display || item.product_name}
                            </span>
                          </div>
                          <p className="font-MontserratSemiBold text-base md:text-c18 pt-3 leading-6.5">
                            ₦{item.subtotal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pt-3 pb-40"
      >
        <div>
          <p className="text-base font-MontserratSemiBold">Summary</p>
          <div className="space-y-2 pt-4">
            <Input placeholder="Enter coupon code" />
            <button className="text-c12 font-MontserratSemiBold text-ff715b border border-ff715b w-full h-10 rounded-c8 flex justify-center items-center">
              Apply coupon
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm font-MontserratNormal mt-4">
          <div className="flex justify-between">
            <p>Total items:</p>
            <p>₦{checkoutSummary?.subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount:</p>
            <p className="text-ca0202">-₦{checkoutSummary?.discount_amount}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-MontserratSemiBold">Subtotal:</p>
            <p>₦{checkoutSummary?.subtotal}</p>
          </div>

          <div className="flex justify-between mt-4">
            <p>Shipping fee:</p>
            <p>₦{checkoutSummary?.shipping_cost}</p>
          </div>
          <div className="flex justify-between text-base font-MontserratSemiBold mt-4">
            <p>Estimated total:</p>
            <p>₦{checkoutSummary?.total}</p>
          </div>
        </div>
      </motion.div>

      {/* Fixed bottom bar for mobile */}
      <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          <div>
            <p className="text-base font-MontserratSemiBold mb-3">Total</p>
            <p className="font-MontserratSemiBold text-c20">
              ₦{checkoutSummary?.total}
            </p>
          </div>
        </div>

        {token ? (
          <Button
            onClick={handleCheckout}
            className="border-0"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Confirm order"}
          </Button>
        ) : (
          <Button
            onClick={handleGuestCheckout}
            className="border-0"
            disabled={saving}
          >
            {saving ? <LoadingSpinner /> : "Confirm order"}
          </Button>
        )}
      </div>
    </div>
  );
}
