"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Camera from "@/assets/mobile/camera.svg";

import ProductCard from "@/components/ui/cards/ProductCard";
import { dummyProducts } from "@/store/data/products";
import SelectedProduct from "@/assets/mobile/selectProduct.png";
import SelectedProduct2 from "@/assets/mobile/selectproduct1.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import StarYellow from "@/assets/mobile/Star1.png";
import Stargray from "@/assets/mobile/Star2.png";
import Mark from "@/assets/mobile/mark.png";
import NavBack from "@/assets/icons/navBacksmall.png";
import { TrackOrders } from "@/types/global";
import Plus from "@/assets/mobile/Plus.png";
import CloseIcon from "@/assets/headerIcon/closeModal.png";

export default function OrderOnTheWayPage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [rating, setRating] = useState(4);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]); // store uploaded images

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleProductSelect = (id: number) => {
    setSelectedProduct(selectedProduct === id ? null : id);
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPhotos = files.map((file) => URL.createObjectURL(file));
      setUploadedPhotos((prev) => [...prev, ...newPhotos]);
      setIsBottomSheetOpen(false);
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment"); // mobile camera
      fileInputRef.current.click();
    }
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const trackOrders: TrackOrders[] = [
    {
      id: 1,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
    {
      id: 2,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
  ];

  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  return (
    <div className="px-6">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="pb-7 flex justify-between w-full items-center ">
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
            Rate product
          </p>
        </button>
        <button
          onClick={() => router.push("/dashboard/buyer/")}
          className="text-c12 font-MontserratSemiBold text-6a0dad"
        >
          Skip
        </button>
      </div>

      {/* Orders list */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="space-y-c32 pt-4"
      >
        {trackOrders.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-col pb-5 border-b border-000000/5 flex md:flex-row"
          >
            <div className="flex gap-4 items-start">
              <Image src={item.icon} alt={item.title} width={96} height={96} />
              <div className="w-full max-w-143.75">
                <p className="font-MontserratSemiBold text-base leading-c24 pb-1 text-000000">
                  {item.title}
                </p>
                <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                    {item.totalQuantity}PC, {item.colour}
                  </span>
                </div>
                <p className="font-MontserratSemiBold text-c16 pt-3 leading-6.5">
                  ₦{item.totalAmount}
                </p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="rounded-lg h-c48 mt-4 flex items-center justify-center w-full border border-ff715b text-ff715b"
                >
                  Buy again
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ⭐ Star Rating */}
      <div>
        <p className="font-MontserratSemiBold text-sm mt-3 pb-4">
          Rate this product
        </p>
        <div className="flex gap-4 pb-3 items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                onClick={() => handleStarClick(star)}
                whileTap={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={star <= rating ? StarYellow : Stargray}
                  alt="star rating"
                  width={24}
                  height={22.74}
                />
              </motion.button>
            ))}
          </div>
          <motion.p
            key={rating}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-MontserratSemiBold"
          >
            {rating}/5
          </motion.p>
        </div>
      </div>

      {/* Review Textarea */}
      <div className="py-2">
        <p className="mb-4 font-MontserratSemiBold text-c12 ">
          Rate this product
        </p>
        <textarea
          placeholder="Share your thought about the product"
          className="w-full focus:ring-1 focus:ring-ff715b text-c12 font-MontserratNormal focus:outline-0 p-4 h-30 border border-000000/5 rounded-lg"
        ></textarea>
      </div>

      {/* Add Photo Section */}
      <div>
        <p>Add Photo (Optional)</p>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { id: 1, img: SelectedProduct },
            { id: 2, img: SelectedProduct2 },
          ].map((p) => (
            <motion.button
              key={p.id}
              onClick={() => handleProductSelect(p.id)}
              className="relative"
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: selectedProduct === p.id ? 1.05 : 1,
                boxShadow:
                  selectedProduct === p.id
                    ? "0px 4px 10px rgba(0,0,0,0.2)"
                    : "none",
              }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image
                src={p.img}
                alt="selected product"
                width={92}
                height={96}
              />
              {selectedProduct === p.id && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-5 w-5 absolute flex items-center justify-center top-4 right-2 rounded-full bg-ff715b"
                >
                  <Image src={Mark} alt="remove" width={12} height={12} />
                </motion.span>
              )}
            </motion.button>
          ))}
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <Image
                src={photo}
                alt="uploaded"
                width={92}
                height={96}
                className="rounded-lg object-cover"
              />
            </div>
          ))}
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="w-c92 h-24 flex items-center justify-center border border-gray-300 rounded-lg"
          >
            <Image src={Plus} alt="add photo" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {isBottomSheetOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 w-full "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBottomSheetOpen(false)}
           
            />

          <div className="w-full px-6">
              <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="fixed bottom-0  left-3.75 right-3.75 bg-white rounded-t-2xl p-c32 py-6 z-50 "
            >
            <div className="w-full flex justify-end mb-6 h-6 ">
                <button
                onClick={() => setIsBottomSheetOpen(false)}
                className=""
              >
                <Image src={CloseIcon} alt="close" width={20} height={20} />
              </button>
            </div>

              <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={handleTakePhoto}
                  className=" py-3 rounded-lg flex gap-3 w-full items-center justify-center border  border-ff715b h-c48-15 text-ff715b text-c12 font-MontserratSemiBold"
                >
                  <Image
                    src={Camera}
                    alt="camera"
                    width={19.63}
                    height={17.36}
                    className="bg-blue-600"
                  />
                  <p className="w-fit"> Take Photo</p>
                </button>
                <button
                  onClick={handleBrowseFiles}
                  className="w-full py-3 rounded-lg bg-ff715b text-ffffff h-c48-15 font-MontserratSemiBold"
                >
                  Browse Files
                </button>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>

      {/* Submit */}
      <div className="flex gap-4 items-center justify-center w-full text-c12 font-MontserratSemiBold mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="rounded-lg h-c48 flex items-center justify-center w-full bg-ff715b text-white"
        >
          Submit
        </motion.button>
      </div>

      {/* More to Love */}
      <div className="py-c32 pb-c32">
        <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
          More to love
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-2 sm:grid-cols-4 justify-center lg:grid-cols-6 gap-2.5"
        >
          {fashionProducts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
