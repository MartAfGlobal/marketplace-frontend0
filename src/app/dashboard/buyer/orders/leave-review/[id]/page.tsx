"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import { Button } from "@/components/ui/Button/Button";
import ImageIcon from "@/assets/icons/Image.svg";

import Copy from "@/assets/icons/Copy.png";
import BLackPlus from "@/assets/icons/BLackPlus.svg";
import goodIcon from "@/assets/icons/good.svg";
import staroutline from "@/assets/icons/star-outline.svg";
import starfilled from "@/assets/icons/star-filled.svg";
import Delete from "@/assets/icons/deleteOrange.svg";

import { useEffect, useRef, useState } from "react";

import ProductCard from "@/components/ui/cards/ProductCard";
import { useParams, useRouter } from "next/navigation";
import {
  Items,
  OrderDetailsPageProps,
  OrderItem,
  OrderLineItem,
} from "@/types/global";

import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSelector } from "react-redux";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import { Label } from "recharts";
import { button } from "framer-motion/client";
import ResultModal from "@/components/ui/forms/resultModal";

interface CancellationReason {
  id: string;
  title: string;
  code: string;
  requires_additional_info: boolean;
}
interface ReturnMethod {
  title: string;
  code: string;
}

export default function OrderDetailsPage() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrders } = useFetchOrders();
  const { sendHttpRequest, loading } = useHttp();
  const [success, setSucess] = useState(false);
  const { orders } = useSelector((state: any) => state.orders);
  const selectedOrder = orders?.find((order: OrderItem) => order.id === id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<
    { id: string; file: File; preview: string; selected: boolean }[]
  >([]);
  const { sendHttpRequest: getReasonReq, loading: loadinReason } = useHttp();
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [selectedReason, setSelectedReason] =
    useState<CancellationReason | null>(null);
  const [returnMethod, setReturMethoth] = useState<ReturnMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<ReturnMethod | null>(
    null,
  );
  const [methodsOpen, setMethodsOpen] = useState(false);

  const MAX_STARS = 5;

  const [additionalNote, setAdditionalNote] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    router.push("/#production-section");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      selected: false,
    }));
    e.target.value = "";

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleReturnItem = (reviewId: string) => {
    if (!token) return;

    const formData = new FormData();

    formData.append("rating", String(rating));
    formData.append("comment", comment);

    sendHttpRequest({
      requestConfig: {
        url: `/products/reviews/${reviewId}/`,
        method: "POST",
        token,
        isAuth: true,
        body: formData, // multipart/form-data
        userType: "buyer",
      },
      successRes: () => {
        fetchOrders();
        setSucess(true);
      },
    });
  };

  const deleteSelectedImages = () => {
    setImages((prev) => prev.filter((img) => !img.selected));
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return (
    <>
      <div>
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
            <Link
              href="/"
              className="opacity-30 font-MontserratMedium text-c12"
            >
              Home
            </Link>
            <Image src={WnavRight} alt=">" width={16} height={16} />
            <Link
              href="/dashboard/buyer"
              className="opacity-30 font-MontserratMedium text-c12"
            >
              Account
            </Link>
            <Image src={WnavRight} alt=">" width={16} height={16} />
            <Link
              href="/dashboard/buyer/orders"
              className="opacity-30 font-MontserratMedium text-c12"
            >
              orders
            </Link>
            <Image src={WnavRight} alt=">" width={16} height={16} />
            <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
              Order ID {id}
            </span>
          </nav>
        </motion.div>
        <div>
          <div className="w-full px-6 md:px-15 ">
            <button
              onClick={() => router.back()}
              className="flex  items-center gap-4 mt-4 md:mt-c32"
            >
              <Image
                src={NavBack}
                alt="<"
                width={9}
                height={16.5}
                className="brightness-20 w-2.25 h-[16.5px]"
              />
              <p className="font-MontserratSemiBold text-c16">Leave a review</p>
            </button>
            <div className="md:pt-c32  pt-7 md:pb-c64 md:px-62.5 ">
              <div className="md:p-c32  md:rounded-2xl md:border border-000000/10">
                {(selectedOrder?.order_items || (selectedOrder as any)?.items || []).map((item: OrderLineItem) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8 }}
                    className=" "
                  >
                    <Link
                      href={{
                        pathname: `/product/${item.product_slug}`,
                        query:
                          item.variation || item.product
                            ? { variationId: item.variation }
                            : { variationId: item.product },
                      }}
                      className="w-full justify-between md:pb-8 flex"
                    >
                      <div className="flex gap-4 items-center md:items-start">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={100}
                          height={100}
                          className="hidden md:flex"
                        />
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={64}
                          height={64}
                          className="md:hidden"
                        />
                        <div className="w-full max-w-143.75">
                          <p className="md:font-MontserratSemiBold text-c12 font-MontserratNormal md:text-sm leading-c24 pb-3 text-000000">
                            {item.product_name}
                          </p>

                          <div className="w-fit p-2 justify-center md:text-nowrap rounded-c12 bg-black/3 flex items-center">
                            <span className="text-black opacity-32 font-MontserratSemiBold text-c12">
                               {item.fulfilled_quantity ?? item.quantity}PC,{" "}
                               {item.variation_name || item.product_name}
                            </span>
                          </div>
                          <p className="font-MontserratSemiBold text-sm flex md:text-c18 pt-3 leading-6.5">
                            ₦{(item.price_at_purchase * (item.fulfilled_quantity ?? item.quantity ?? 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="my-c48 w-full text-sm font-MontserratSemiBold ">
                      <p className="text-c12 font-MontserratMedium text-000000 mb-4">
                        Rate this product
                      </p>
                      <div className="flex gap-4 w-full">
                        <div className="flex gap-2">
                          {Array.from({ length: MAX_STARS }).map((_, index) => {
                            const starValue = index + 1;

                            return (
                              <button
                                key={starValue}
                                type="button"
                                onClick={() => setRating(starValue)}
                                className="focus:outline-none"
                              >
                                <Image
                                  src={
                                    starValue <= rating
                                      ? starfilled
                                      : staroutline
                                  }
                                  alt={`${starValue} star`}
                                  width={24}
                                  height={22.74}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-161616">({rating}/5)</p>
                      </div>
                    </div>

                    <div>
                      <div className="mt-4">
                        <label className="pb-2 text-c12  font-MontserratMedium text-gray-600">
                          Add Comments
                        </label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thought about the product"
                          className=" w-full  p-4 text-sm mt-2 h-30"
                        />
                      </div>
                      <div className="w-full border rounded-c8 mt-4 relative p-3">
                        {images.some((img) => img.selected) && (
                          <button
                            type="button"
                            onClick={deleteSelectedImages}
                            className="absolute top-2 right-4 z-10  "
                          >
                            <Image
                              src={Delete}
                              alt="Delete"
                              width={18}
                              height={19.5}
                            />
                          </button>
                        )}

                        <div
                          className={`flex items-center  flex-wrap gap-3 ${
                            images.length > 0
                              ? "justify-baseline"
                              : "justify-center"
                          }`}
                        >
                          {images.map((image) => (
                            <div
                              key={image.id}
                              onClick={() =>
                                setImages((prev) =>
                                  prev.map((img) =>
                                    img.id === image.id
                                      ? { ...img, selected: !img.selected }
                                      : img,
                                  ),
                                )
                              }
                              className="relative h-24 w-23  overflow-hidden  cursor-pointer"
                            >
                              <Image
                                src={image.preview}
                                alt="preview"
                                fill
                                className="object-cover"
                              />

                              {image.selected && (
                                <div className="absolute inset-0 bg-black/40 flex items-baseline justify-end pr-2 pt-2">
                                  <div className="w-5 h-5  bg-ff715b rounded-full flex items-center justify-center text-white text-sm">
                                    <Image
                                      src={goodIcon}
                                      alt="selected"
                                      height={7.13}
                                      width={9.7}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {images.length === 0 ? (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-35 h-35 flex flex-col gap-3 items-center justify-center "
                            >
                              <div className="w-9 h-9 flex justify-center items-center rounded-full bg-947fff/65">
                                <Image
                                  src={ImageIcon}
                                  height={20}
                                  width={20}
                                  alt="upload"
                                />
                              </div>
                              <p className="text-c12 font-MontserratMedium text-000000/50">
                                Drag and drop or{" "}
                                <span className="text-ff715b">browse</span>{" "}
                              </p>
                              <p className="text-c12 font-MontserratMedium text-000000/50">
                                PNG or JPG
                              </p>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-000000/32 h-24 w-23 flex items-center justify-center"
                            >
                              <Image
                                src={BLackPlus}
                                height={20}
                                width={20}
                                alt="add"
                              />
                            </button>
                          )}
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleUpload}
                          />
                        </div>
                      </div>

                      <Button
                        disabled={loading}
                        onClick={() => handleReturnItem(item.product)}
                        className="mt-8"
                      >
                        {loading ? <LoadingSpinner /> : "Submit"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="py-c32   pb-35 md:pb-0">
            <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
              More to love
            </p>
          </div>
        </div>
        <div className="w-full  h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
          <div className="flex gap-4 items-center justify-center w-full text-c12 font-MontserratSemiBold"></div>
        </div>
      </div>
      <ResultModal
        isOpen={success}
        title="Review submitted successfully"
        message="Thank you for your feedback!"
        discRescription="Your review has been received and will help other buyers make informed decisions."
        onConfirm={handleConfirm}
        buttenText="Back to shopping"
      />
    </>
  );
}
