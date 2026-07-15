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
import { stringify } from "querystring";

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
interface ReturnQuantity {
  title: string;
  code: number;
}

const reasons = ["Item is damaged"];

export default function OrderDetailsPage() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { returnid } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrders } = useFetchOrders();
  const { sendHttpRequest, loading } = useHttp();
  const [success, setSucess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<
    { id: string; file: File; preview: string; selected: boolean }[]
  >([]);
  const { sendHttpRequest: getReasonReq, loading: loadinReason } = useHttp();
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [selectedReason, setSelectedReason] =
    useState<CancellationReason | null>(null);
  const [returnMethod, setReturMethod] = useState<ReturnMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<ReturnMethod | null>(
    null,
  );
  const [returnQuantity, setReturnQuantity] = useState<ReturnQuantity[]>([]);
  const [selectedQuantity, setSelectedQuantity] =
    useState<ReturnQuantity | null>();
  const [methodsOpen, setMethodsOpen] = useState(false);
  const [quantityOpen, setQuantitysOpen] = useState(false);
  const { orders } = useSelector((state: any) => state.orders);
  const [additionalNote, setAdditionalNote] = useState("");
  const [discription, setDiscription] = useState("");
  const isFormValid = Boolean(
    selectedReason &&
      selectedMethod &&
      selectedQuantity &&
      discription.trim() &&
      images.length > 0 &&
      (!selectedReason.requires_additional_info || additionalNote.trim()),
  );
  const handleClick = () => {
    if (reasons.length) {
      setOpen((p) => !p);
    }
  };
  const handleMethodClick = () => {
    if (returnMethod.length) {
      setMethodsOpen((p) => !p);
    }
  };
  const handleQuantityClick = () => {
    if (returnQuantity?.length) {
      setQuantitysOpen((p) => !p);
    }
  };
  const selectedorder = orders?.find((item: OrderItem) => {
    const items = item.order_items || (item as any).items || [];
    return items.find((lineItem: OrderLineItem) => lineItem.id === returnid);
  });

  const selectedItem = selectedorder
    ? (selectedorder.order_items || (selectedorder as any).items || []).find(
        (item: OrderLineItem) => item.id === returnid,
      )
    : null;

  const handleConfirm = () => {
    router.push("/#production-section");
  };

  const methods = [
    {
      title: "Drop-off",
      code: "DROP_OFF",
    },
    {
      title: "Pick-up",
      code: "PICK_UP",
    },
  ];
  const itemQuantity = selectedItem?.fulfilled_quantity ?? selectedItem?.quantity ?? 0;
  console.log("checking my quantity", itemQuantity, selectedItem);

  const quantity = Array.from({ length: itemQuantity }, (_, i) => ({
    title: String(i + 1),
    code: i + 1,
  }));

  useEffect(() => {
    setReturMethod(methods);
    setReturnQuantity(quantity);
  }, []);
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

  const fetcheReasons = () => {
    if (!token) return;

    getReasonReq({
      requestConfig: {
        url: "/cancellation/reasons/for_buyer/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res: any) => {
        console.log("reasons fectched", res);
        setReasons(res.data);
        handleClick();
      },
    });
  };

  const handleReturnItem = () => {
    console.log(returnid);
    if (!token || !selectedReason) return;

    const formData = new FormData();

    formData.append("dispute_type", "RETURN");
    formData.append("order_item_id", String(returnid));
    formData.append("cancellation_reason", selectedReason.id);

    if (selectedMethod?.code) {
      formData.append("return_method", selectedMethod.code);
    }
    if (selectedQuantity?.code) {
      formData.append("return_quantity", String(selectedQuantity.code));
    }

    formData.append("description", discription);
    formData.append("additional_info", additionalNote);

    images.forEach((img) => {
      formData.append("evidence_files", img.file);
    });

    sendHttpRequest({
      requestConfig: {
        url: "/disputes/buyer/create/",
        method: "POST",
        token,
        isAuth: true,
        body: formData,
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
              Order ID {returnid}
            </span>
          </nav>
        </motion.div>

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
            <p className="font-MontserratSemiBold text-c16">Return/refund</p>
          </button>
          <div className="md:pt-c32  pt-7 md:pb-c64 md:px-62.5 ">
            <div className="md:p-c32  md:rounded-2xl md:border border-000000/10">
              <div className="space-y-3">
                <h1 className="text-c18 font-MontserratMedium">
                  Reason for return/refund
                </h1>
                <p className="text-c12 font-MontserratMedium">
                  We are sorry for any inconveniences, let’s sort it out
                </p>
              </div>
              <div className=" ">
                <p className="pb-2 text-c12  font-MontserratMedium text-gray-600">
                  Reason for cancelling
                </p>
                <label className="text-c12 font-MontserratMedium text-000000/65 ">
                  Select a reason
                </label>
                <div className="relative w-full mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!open && reasons.length === 0) {
                        fetcheReasons(); // fetch will open it on success
                      } else {
                        setOpen((prev) => !prev);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                  >
                    <span
                      className={
                        reasons
                          ? "text-gray-900 font-MontserratMedium text-left text-c12 "
                          : "text-black/64 font-MontserratMedium text-left text-c12"
                      }
                    >
                      {selectedReason?.title || "Select a reason"}
                    </span>

                    {loadinReason ? (
                      <LoadingSpinner color="border-ff715b" />
                    ) : (
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                      >
                        {reasons.map((item) => (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => {
                              setSelectedReason(item);
                              setOpen(false);
                            }}
                            className="block w-full px-3 py-2 font-MontserratMedium text-left text-c12 text-gray-700 hover:bg-gray-100"
                          >
                            {item.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {selectedReason?.requires_additional_info && (
                    <textarea
                      value={additionalNote}
                      onChange={(e) => setAdditionalNote(e.target.value)}
                      placeholder="Please provide more details"
                      className="mt-3 w-full border rounded-c8 p-3 text-sm"
                    />
                  )}
                </div>

                <div className="mt-4 flex flex-col md:flex-row gap-4 w-full">
                  <div className="w-full">
                    <label className="text-c12 font-MontserratMedium text-000000/65  ">
                      Return method
                    </label>
                    <div className="relative w-full mt-2">
                      <button
                        type="button"
                        onClick={handleMethodClick}
                        className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                      >
                        <span
                          className={
                            returnMethod
                              ? "text-gray-900 font-MontserratMedium text-left text-c12 "
                              : "text-black/64 font-MontserratMedium text-left text-c12"
                          }
                        >
                          {selectedMethod?.title || "Select a return method"}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {methodsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                          >
                            {returnMethod.map((item) => (
                              <button
                                key={item.title}
                                type="button"
                                onClick={() => {
                                  setSelectedMethod(item);
                                  setMethodsOpen(false);
                                }}
                                className="block w-full px-3 py-2 font-MontserratMedium text-left text-c12 text-gray-700 hover:bg-gray-100"
                              >
                                {item.title}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-c12 font-MontserratMedium text-000000/65  ">
                      Quantity to be returned
                    </label>
                    <div className="relative w-full mt-2">
                      <button
                        type="button"
                        onClick={handleQuantityClick}
                        className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                      >
                        <span
                          className={
                            returnQuantity
                              ? "text-gray-900 font-MontserratMedium text-left text-c12 "
                              : "text-black/64 font-MontserratMedium text-left text-c12"
                          }
                        >
                          {selectedQuantity?.title || "Select quantity"}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {quantityOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                          >
                            {returnQuantity?.map((item) => (
                              <button
                                key={item.title}
                                type="button"
                                onClick={() => {
                                  setSelectedQuantity(item);
                                  setQuantitysOpen(false);
                                }}
                                className="block w-full px-3 py-2 font-MontserratMedium text-left text-c12 text-gray-700 hover:bg-gray-100"
                              >
                                {item.code}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="pb-2 text-c12  font-MontserratMedium text-gray-600">
                    Please describe the issue and upload evidence to support it
                  </label>
                  <Textarea
                    value={discription}
                    onChange={(e) => setDiscription(e.target.value)}
                    placeholder=""
                    className=" w-full  p-3 text-sm mt-2 h-24.75"
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

                  <div className={`flex items-center  flex-wrap gap-3 ${
                    images.length > 0 ?"justify-baseline": "justify-center"
                  }`}>
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
                  disabled={loading || !isFormValid}
                  onClick={handleReturnItem}
                  className="mt-8"
                >
                  {loading ? <LoadingSpinner /> : "Submit"}
                </Button>
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
        title="Submitted successfully"
        message="Welcome to the team!"
        discRescription="You will receive an email with further instructions based on our return policy and evidence provided"
        onConfirm={handleConfirm}
        buttenText="Back to shopping"
      />
    </>
  );
}
