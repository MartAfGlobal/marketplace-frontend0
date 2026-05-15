"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";

import ProductCard from "@/components/ui/cards/ProductCard";
import NavBack from "@/assets/icons/navBacksmall.png";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import CheckoutItems from "@/components/ui/checkouts/Items-to-checkout";

import MobileCheckoutItems from "@/components/ui/mobile/checkout-items";
import { useHttp } from "@/hooks/use-http";
import { setCheckoutItems, setCheckoutSummary } from "@/store/cart/cartSlice";
import DotSpinner from "@/components/reloadSpinner/DotSpinner";
import UserAddress from "@/components/ui/buyer-components/Main-section/sections/address-selector";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import GuestUserAddress from "@/components/ui/buyer-components/guest/address_selector";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [visible, setVisible] = useState(10);
  const router = useRouter();
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses,
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  // Prefer Redux token which is updated by login and axios refresh
  const token = useSelector((state: RootState) => state.token.token);

  const { loading, sendHttpRequest } = useHttp();

  const selectedAddressId = useSelector(
    (state: RootState) => state.buyer.selectedAddressId,
  );

  useEffect(() => {
    if (!buyerAddresses.length) return;

    
    if (!selectedAddressId || buyerAddresses.length === 1) {
      const defaultAddr = buyerAddresses.find((a) => a.is_default);
      dispatch(
        buyerActions.setSelectedAddress(
          defaultAddr?.id ?? buyerAddresses[0].id,
        ),
      );
    }
  }, [buyerAddresses, selectedAddressId, dispatch]);

  const handleSelectAddress = (addressId: string) => {
    dispatch(buyerActions.setSelectedAddress(addressId));
  };

  useEffect(() => {
    if (!token) return;
    if (buyerAddresses.length === 0) {
      toast.warning("Please add an address to get summary");
      dispatch(
        setCheckoutSummary({
          all_addresses: [],
          applied_coupon: null,
          discount_amount: "0.00",
          shipping_address: null,
          shipping_cost: "0.00",
          shipping_methods: [],
          subtotal: "0.00",
          total: "0.00",
        }),
      );
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/checkout/summary/",
        method: "POST",
        body: {
          address_id: selectedAddressId,
          discount_amount: "0.00",
        },
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        const backendCart = responseData?.data;
        console.log("summary datas:", backendCart);

        if (backendCart) {
          const mappedItems = (backendCart.items || []).map((item: any) => ({
            id: item.product_id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            quantity: item.quantity,
            subtotal: Number(item.total_price), // numeric subtotal
            unit_price: Number(item.unit_price),

            total_price: Number(item.total_price),
            variation_display: item.variation_name,
            variation_id: item.variation_id,
          }));
          // Store items for checkout
          dispatch(setCheckoutItems(mappedItems));

          // Store full cart summary
          dispatch(
            setCheckoutSummary({
              all_addresses: backendCart.all_addresses || [],
              applied_coupon: backendCart.applied_coupon || null,
              discount_amount: backendCart.discount_amount || "0.00",
              shipping_address: backendCart.shipping_address || null,
              shipping_cost: backendCart.shipping_cost || "0.00",
              shipping_methods: backendCart.shipping_methods || [],
              subtotal: backendCart.subtotal || "0.00",
              total: backendCart.total || "0.00",
            }),
          );
        }
      },
    });
  }, [token, sendHttpRequest, dispatch, selectedAddressId, buyerAddresses.length]);

  return (
    <>
      {loading && token ? (
        <div className="w-full flex justify-center h-screen items-center py-10">
          <DotSpinner size={10} color="#ff715b" gap={8} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Start slightly down and transparent
          animate={{ opacity: 1, y: 0 }} // Animate to normal
          exit={{ opacity: 0, y: -20 }} // Optional exit animation
          transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
          className="w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:pl-c56 hidden md:pt-c20 z-40 md:flex items-center w-full"
            style={{ top: "md:4rem" }}
          >
            <nav
              aria-label="breadcrumb"
              className="flex h-6 px-6 md:px-0 md:h-c32 w-full items-center gap-2"
            >
              <Link
                href="/"
                className="opacity-30 font-MontserratMedium text-c12"
              >
                Home
              </Link>
              <Image src={WnavRight} alt=">" width={16} height={16} />
              <span className=" font-MontserratMedium text-c12">Checkout</span>
            </nav>
          </motion.div>

          <div className="w-full px-6 md:px-15">
            <Link
              href="/cart"
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
                Checkout
              </p>
            </Link>

            <div className="flex justify-between mt-7 md:hidden ">
              <div className="w-full ">
                <div className="pb-c32 border-b border-b-000000/5">
                  {token ? (
                    <UserAddress
                      selectedAddressId={selectedAddressId ?? undefined}
                      onSelectAddress={handleSelectAddress}
                      className="md:w-64.25  "
                    />
                  ) : (
                    <GuestUserAddress />
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  router.push("/dashboard/buyer/mobile/addresses/add-address")
                }
                className="rounded-full flex-shrink-0 bg-ff715b text-ffffff w-c32 h-c32"
              >
                +
              </button>
            </div>
            <div className="hidden md:flex">
              <CheckoutItems loadingState={loading} />
            </div>

            <div className="md:hidden">
              <MobileCheckoutItems loadingState={loading} />
            </div>

            <div className="hidden md:flex w-full">
              <div className="py-c32 w-full">
                <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
                  More to love
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 "></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
