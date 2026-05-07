"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import ShildCheck from "@/assets/icons/ShieldCheck.png";
import padlock from "@/assets/icons/padlock.png";
import UserAddress from "@/components/ui/buyer-components/Main-section/sections/address-selector";

import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import Cookies from "js-cookie";

import { Input } from "../forms/Input";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "../loading-spinner";
import GuestUserAddress from "../buyer-components/guest/address_selector";

interface loadinProps {
  loadingState: boolean;
}

export default function CheckoutItems({ loadingState }: loadinProps) {
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses,
  );

  const [visibleItems, setVisibleItems] = useState(14);
  const dispatch = useDispatch();

  const selectedAddressId = useSelector(
    (state: RootState) => state.buyer.selectedAddressId,
  );

  useEffect(() => {
    if (buyerAddresses.length > 0 && !selectedAddressId) {
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

  // const token = useSelector((state: RootState) => state.token?.token);
  const token = useSelector((state: RootState) => state.token.token);
  const checkoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems,
  );

  const checkoutSummary = useSelector(
    (state: RootState) => state.cart.checkoutSummary,
  );

  const { loading: guestchecking, sendHttpRequest: saveRequest } = useHttp();

  const toNumber = (value: any): number => {
    if (!value) return 0;

    return Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;
  };

  const TotalItems = checkoutItems.length; //

  const { sendHttpRequest, loading } = useHttp();

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

  const uniqueCheckoutItems = [
    ...new Map(
      checkoutItems.map((item) => [
        `${item.id}-${item.variation_id || "no-var"}`,
        item,
      ]),
    ).values(),
  ];

  //   if (!selectedAddress) {
  //     alert("Please select a shipping address");
  //     return;
  //   }

  //   if (checkoutItems.length === 0) {
  //     alert("Your cart is empty");
  //     return;
  //   }

  //   // Prepare payload
  //   const payload = {
  //     address_id: selectedAddress,
  //     items: checkoutItems
  //       .filter(item => item.checked !== false) // only checked items
  //       .map(item => ({
  //         id: item.id,
  //         variation_id: item.variation.id || null, // or whatever your backend expects
  //         quantity: item.quantity,
  //       })),
  //   };

  //   try {
  //     await sendHttpRequest({
  //       requestConfig: {
  //         url: "/cart/checkout/",
  //         method: "POST",
  //         token: useSelector((state: RootState) => state.token?.token), // if required
  //         body: payload,
  //         isAuth: true,
  //       },
  //       successRes: (res) => {
  //         console.log("Checkout successful:", res);
  //         alert("Order placed successfully!");
  //         // Optionally redirect to success page:
  //         // router.push("/order/success");
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Checkout failed:", err);
  //     alert("Checkout failed. Please try again.");
  //   }
  // };

  console.log("selected address id:", checkoutItems);

  return (
    <div className="md:pt-c48  w-full md:pb-c64 ">
      <div className=" ">
        <div className="flex gap-18 justify-center ">
          {loadingState ? (
            <div className="w-full flex justify-center py-10">
              <LoadingSpinner color="border-ff715b" size={50} />
            </div>
          ) : (
            <>
              <div className=" w-full pb-c32 flex md:flex-col md:max-w-207">
                <div className=" border-b hidden w-full md:flex border-b-000000/5  mb-c32">
                  <div className="w-full">
                    <div className="pb-c32 justify-between w-full flex ">
                      <p className="font-MontserratSemiBold text-c16 ">
                        Items details
                      </p>

                      {visibleItems < checkoutItems.length && (
                        <button
                          className="font-MontserratSemiBold text-sm text-ff715b mt-2"
                          onClick={() => setVisibleItems((prev) => prev + 14)}
                        >
                          See More
                        </button>
                      )}
                    </div>

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
                      className="w-full h-fit flex md:flex-row flex-col gap-c24"
                    >
                      {uniqueCheckoutItems
                        .slice(0, visibleItems)
                        .map((item) => {
                          // Create a reliable unique key
                          const uniqueKey = `${item.id}-${
                            item.variation_id || "no-var"
                          }`;

                          return (
                            <div key={uniqueKey} className="w-fit h-fit">
                              <Image
                                src={item.product_image || "/placeholder.png"}
                                alt={item.product_name || "Product image"}
                                width={96}
                                height={96}
                                className="rounded h-24 w-24"
                              />
                              <p className="text-c12 font-MontserratSemiBold pt-4 text-161616">
                                ₦{item.subtotal}
                              </p>

                              <p className="text-c12 text-000000/70">
                                {item.product_name}
                              </p>
                            </div>
                          );
                        })}
                    </motion.div>
                  </div>
                </div>

                <div className="w-full ">
                  <div className="pb-c32 border-b border-b-000000/5">
                    {token ? (
                      <UserAddress
                        selectedAddressId={selectedAddressId ?? undefined}
                        onSelectAddress={handleSelectAddress}
                        className="md:w-64.25 h-31 "
                      />
                    ) : (
                      <GuestUserAddress />
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-84.25 hidden md:flex md:flex-col">
                <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                  Order Summary
                </p>
                {token && (
                  <div className="flex gap-2 pb-3">
                    <Input placeholder="Enter coupon code w-full" />
                    <button className="w-full max-w-31.25 bg-transparent border border-ff715b text-c12 h-12 rounded-c8 font-MontserratSemiBold text-ff715b">
                      Apply coupon
                    </button>
                  </div>
                )}
                <div className="font-MontserratNormal text-sm text-000000 h-23 border-b border-b-000000/10 space-y-2">
                  <div className="flex justify-between">
                    <p>Total items</p>
                    <p>N{checkoutSummary?.subtotal}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Discounts</p>
                    <p>-N{checkoutSummary?.discount_amount}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{checkoutSummary?.subtotal}</p>
                  </div>
                </div>
                <div className="flex justify-between h-9 border-b border-b-000000/10 mt-3">
                  <p>Shipping fee</p>
                  <p>{checkoutSummary?.shipping_cost}</p>
                </div>
                <div className="flex justify-between h-9 border-b border-b-000000/10 mt-3">
                  <p>Order total</p>
                  <p>{checkoutSummary?.total}</p>
                </div>

                <div className=" mt-3 mb-c32 flex gap-c42 items-center">
                  <div>
                    <p className="font-MontserratNormal text-sm text-000000">
                      Total
                    </p>
                    <p className="text-c10">
                      Please refer to your final actual payment amount.
                    </p>
                  </div>
                  <p className="font-MontserratSemiBold text-c32 ">
                    N{checkoutSummary?.total}
                  </p>
                </div>
                {token ? (
                  <Button
                    onClick={handleCheckout}
                    disabled={
                      loading ||
                      !selectedAddressId ||
                      TotalItems === 0 ||
                      !checkoutSummary
                    }
                  >
                    {loading ? <LoadingSpinner /> : ` Checkout (${TotalItems})`}
                  </Button>
                ) : (
                  <Button
                    onClick={handleGuestCheckout}
                    disabled={
                      guestchecking ||
                      !checkoutSummary?.guest_address ||
                      TotalItems === 0 ||
                      !checkoutSummary
                    }
                  >
                    {guestchecking ? (
                      <LoadingSpinner />
                    ) : (
                      ` Checkout (${TotalItems})`
                    )}
                  </Button>
                )}

                <div className="  w-full space-y-6 mt-c32 max-w-84">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Image
                        src={ShildCheck}
                        alt="shild check"
                        width={20}
                        height={20}
                      />
                      <p className="text-c12 font-MontserratSemiBold">
                        Secure payments
                      </p>
                    </div>
                    <p className="text-c12 font-MontserratNormal leading-4 ">
                      Every payment you make on MartAf is secured with strict
                      SSL encryption and PCI DSS data protection protocols
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Image
                        src={padlock}
                        alt="padlock"
                        width={20}
                        height={20}
                      />
                      <p className="text-c12 font-MontserratSemiBold">
                        Secure privacy
                      </p>
                    </div>
                    <p className="text-c12 font-MontserratNormal leading-4 ">
                      Protecting your privacy is important to us! Please be
                      assured that your information will be kept secured and
                      uncompromised. We will only use your information in
                      accordance with our privacy policy to provide and improve
                      our services to you.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
