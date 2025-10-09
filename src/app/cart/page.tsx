"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";



import { RootState } from "@/store";
import { removeFromCart, updateQuantity, setCheckoutItems} from "@/store/cart/cartSlice";

import padlock from "@/assets/icons/padlock.png";
import NavBack from "@/assets/icons/navBacksmall.png";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import VisaCard from "@/assets/icons/visa_inc_logo.svg.svg";
import ShildCheck from "@/assets/icons/ShieldCheck.png";
import Trash from "@/assets/icons/trash.png";

import GoodMark from "@/assets/mobile/good.png";
import CaretDwn from "@/assets/mobile/carent-down.png";
import Filter from "@/assets/icons/filter.png";
import CloseX from "@/assets/mobile/closeX.png";

import QuantitySelector from "@/components/ui/cart/quantityControl";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Button } from "@/components/ui/Button/Button";
import CheckoutModal from "@/components/ui/cart/CheckoutModal";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CartPage() {
  const [selected, setSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);

  const token = useSelector((state: RootState) => state.token?.token);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const { loading, sendHttpRequest } = useHttp();


  const clearSelectedItems = () => {
  Object.entries(selectedItems).forEach(([id, isSelected]) => {
    if (isSelected) {
      dispatch(removeFromCart(id));
    }
  });
  setSelectedItems({}); // reset local selection state
};
const handleCheckout = () => {
  const selectedItemsData = cartItems.filter(
    (item) => selectedItems[item.id]
  );

  const checkoutItem = selectedItemsData.map((item) => ({
    product_id: String(item.id),
    variation_id: item.variations?.[0]?.id
      ? String(item.variations[0].id)
      : null,
    quantity: Number(item.quantity),
  }));

  console.log(
    "✅ Payload being sent ===>",
    JSON.stringify({ items: checkoutItem }, null, 2)
  );

  console.log("is token true or false", token);

  if (!token) {
    setCheckoutModalOpen(true);
    return;
  }

  sendHttpRequest({
    requestConfig: {
      url: "/checkout/",
      method: "POST",
      body: { items: checkoutItem },
      token,
      isAuth: true,
      successMessage: "Checkout successful!",
      userType: "buyer",
    },
    successRes: () => {
      // ✅ Save selected items to Redux
      dispatch(setCheckoutItems(selectedItemsData));

      // ✅ Clear selected items from the cart
      Object.entries(selectedItems).forEach(([id, isSelected]) => {
        if (isSelected) dispatch(removeFromCart(id));
      });
      setSelectedItems({});

      // ✅ Redirect to checkout page
      router.replace("/cart/checkout");
    },
  });
};


  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Initialize selectedItems whenever cartItems changes
  useEffect(() => {
    const initialSelected: { [key: string]: boolean } = {};
    cartItems.forEach((item) => {
      initialSelected[item.id] = true; // default: all selected
    });
    setSelectedItems(initialSelected);
  }, [cartItems]);

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => selectedItems[item.id]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newState: { [key: string]: boolean } = {};
      cartItems.forEach((item) => {
        newState[item.id] = true;
      });
      setSelectedItems(newState);
    }
  };

  const fashionProducts = cartItems.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  const totalPrice = cartItems.reduce((acc, item) => {
    if (!selectedItems[item.id]) return acc;
    const price = Number(item.price);
    return acc + (isNaN(price) ? 0 : price) * (item.quantity || 0);
  }, 0);

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const selectedItemsData = cartItems.filter((item) => selectedItems[item.id]);

  // const checkoutItems = selectedItemsData.map((item) => ({
  //   product_id: item.id,
  //   variation_id: item.variations?.[0]?.id, // 👈 pick the selected variation
  //   quantity: item.quantity,
  // }));

  const showMore = () => setVisible((prev) => prev + 10);

  return (
    <div className="relative md: md:h-full h-dvh">
      {/* Desktop Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pl-c56 pt-c20 z-40 hidden md:flex items-center w-full"
        style={{ top: "4rem" }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratMedium text-c12">Cart</span>
        </nav>
      </motion.div>

      {/* Cart Content */}
      <div className="w-full md:px-15 px-6 pb-20 md:pb-0">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4  mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            My Cart ({cartItems.length})
          </p>
        </button>

        {/* Items List */}
        <div className="pt-c48 pb-c64">
          <div className="md:flex gap-18 justify-center">
            {/* Cart Items */}
            <div className="w-full max-w-207">
              <div className="w-full h-c56 mb-4 md:mb-c32 flex px-6 justify-between items-center bg-947fff/10">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="h-5 w-5 border border-black rounded accent-black checked:bg-black checked:text-white"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <span className="text-c12 font-MontserratSemiBold">
                    Select
                  </span>
                </div>
                {Object.values(selectedItems).some(
                  (isSelected) => isSelected
                ) && (
                  <button
                    onClick={() => {
                      Object.entries(selectedItems).forEach(
                        ([id, isSelected]) => {
                          if (isSelected) {
                            dispatch(removeFromCart(id));
                          }
                        }
                      );
                      setSelectedItems({}); // reset
                    }}
                  >
                    <Image src={Trash} alt="delete" width={15} height={16.25} />
                  </button>
                )}
              </div>

              <div className="flex px-6 w-full justify-between">
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
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full justify-between pb-8 flex">
                        <div className="flex gap-4 w-full j items-center md:items-start">
                          <div className="flex gap-3 items-center w-full max-w-fit">
                            <button
                              onClick={() =>
                                setSelectedItems((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }))
                              }
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedItems[item.id]
                                  ? "bg-ff715b border-ff715b"
                                  : "border-ff715b bg-transparent"
                              }`}
                            >
                              {selectedItems[item.id] && (
                                <Image
                                  src={GoodMark}
                                  alt="checked"
                                  width={9.75}
                                  height={7.13}
                                />
                              )}
                            </button>
                            <Image
                              src={item.image[0]}
                              alt={item.slug}
                              width={100}
                              height={100}
                              className="w-16 h-16 md:w-25 md:h-25"
                            />
                          </div>
                          <div className="w-full md:max-w-143.75">
                            <p className="font-MontserratSemiBold text-c12 md:text-sm md:leading-c24 pb-1 md:pb-3 text-000000">
                              {item.name}
                            </p>
                            <p className="font-MontserratNormal text-c12 pb-3">
                              Two piece shop
                            </p>
                            <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                              <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                {item.quantity}PC,{" "}
                                {item.variations_data?.[0]?.color}
                              </span>
                            </div>
                            <p className="font-MontserratSemiBold text-base md:text-c18 pt-3 leading-6.5">
                              ₦{item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end">
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            <Image
                              src={Trash}
                              alt="delete"
                              width={15}
                              height={16.25}
                            />
                          </button>
                          <QuantitySelector
                            productId={item.id}
                            quantity={item.quantity}
                            onChange={(newQty, id) =>
                              dispatch(updateQuantity({ id, quantity: newQty }))
                            }
                            increaseBg="bg-black/20"
                            decreaseBorder="border-black/20"
                            decreaseText="text-black/20"
                            buttonHeight="h-6"
                            buttonWidth="w-6"
                            quantityFont="text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Desktop Summary */}
            <div className="hidden md:flex w-full max-w-84.25">
              <div className="w-full  ">
                <h1 className="text-sm font-MontserratSemiBold mb-3">
                  Order Summary
                </h1>
                <div className=" space-y-2 text-sm font-MontserratNormal h-23 border-b border-b-000000/10">
                  <div className="flex justify-between">
                    <p className="">Total items:</p>
                    <p className="">${totalPrice}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="">Discount:</p>
                    <p className=" text-ca0202">-₦50</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="">Subtotal:</p>
                    <p className="">${totalPrice}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-c32 border-b border-b-000000/10 pt-4">
                  <div className="w-full max-w-60">
                    <p className="">Total:</p>
                    <p className="text-c10 font-MontserratNormal leading-4">
                      Please refer to your final actual payment amount.
                    </p>
                  </div>
                  <p className="text-c32 font-MontserratSemiBold">
                    ${totalPrice}
                  </p>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={selectedCount === 0}
                  className="border-0"
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>Checkout ({selectedCount})</>
                  )}
                </Button>
                <div className="space-y-2.5 mt-c32  ">
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
                    Every payment you make on MartAf is secured with strict SSL
                    encryption and PCI DSS data protection protocols
                  </p>
                </div>
                <div className="space-y-2.5 mt-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={padlock}
                      alt="shild check"
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
          </div>
        </div>

        {/* More Products */}
        <div className="hidden w-full md:flex">
          <div className="w-full">
            <div className="py-c32">
              <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
                More to love
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {fashionProducts.slice(0, visible).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer & Modal */}
      <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed bottom-0 md:hidden z-50 flex items-center gap-4">
        <div className="flex items-center gap-2 w-11">
          <button
            onClick={toggleSelectAll}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              allSelected
                ? "bg-ff715b border-ff715b"
                : "border-ff715b bg-transparent"
            }`}
          >
            {allSelected && (
              <Image src={GoodMark} alt="checked" width={9.75} height={7.13} />
            )}
          </button>
          <p className="text-c12 font-semibold">All</p>
        </div>

        <div className="flex items-center gap-3 w-full">
          <div>
            <p className="font-MontserratSemiBold text-c20">₦{totalPrice}</p>
            <p className="text-c12 font-MontserratNormal text-ca0202 line-through">
              ₦1250.00
            </p>
          </div>
          <button
            className="w-full transition-transform"
            onClick={() => setOpenModal((prev) => !prev)}
          >
            <motion.div animate={{ rotate: openModal ? 180 : 0 }}>
              <Image src={CaretDwn} alt="view" width={16} height={16} />
            </motion.div>
          </button>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={selectedCount === 0}
          className="border-0 bg-black hover:bg-black/90 text-white rounded-xl"
        >
          Checkout ({selectedCount})
        </Button>
      </div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 300, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 w-full bg-ffffff z-40 px-6 overflow-hidden circle-shadow"
          >
            <div className="flex justify-between pt-6 ">
              <p className="text-base font-MontserratSemiBold">
                Checkout details
              </p>
              <button onClick={() => setOpenModal((prev) => !prev)}>
                <Image src={CloseX} alt="close" width={15} height={15} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-scroll py-4">
              {cartItems
                .filter((item) => selectedItems[item.id])
                .map((item) => (
                  <Image
                    key={item.id}
                    src={item.image[0]}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="flex-shrink-0 rounded"
                  />
                ))}
            </div>

            <div className="space-y-2 text-sm font-MontserratNormal">
              <div className="flex justify-between">
                <p>Total items:</p>
                <p>₦{totalPrice}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-MontserratSemiBold">Subtotal:</p>
                <p>₦{totalPrice}</p>
              </div>
              <div className="flex justify-between">
                <p>Discount:</p>
                <p className="text-ca0202">-₦50</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping fee:</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between text-base font-MontserratSemiBold">
                <p>Estimated total:</p>
                <p>₦{totalPrice}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
}
