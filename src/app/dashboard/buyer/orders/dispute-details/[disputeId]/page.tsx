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
import DisputeDetailsSkeleton from "@/components/reloadSpinner/disputeDetails-skeleton";

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

const reasons = ["Item is damaged"];

export default function DisputeDetailsPage() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { disputeId } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrders } = useFetchOrders();
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  //   const { sendHttpRequest, loading } = useHttp();
  const [success, setSucess] = useState(false);

  const disputeDetails = useSelector(
    (state: RootState) => state.orders.disputeDetails,
  );
  const MobileActions = (
    <div className="w-full gap-4 text-c10 flex md:hidden mt-4 space-y-4">
      <Button variant="secondary">Cancel dispute</Button>
    </div>
  );
  const id = disputeId as string;
  const { fetchDisputerDetails, loading } = useFetchOrders(id);

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

  const [additionalNote, setAdditionalNote] = useState("");
  const [discription, setDiscription] = useState("");
  const handleClick = () => {
    if (reasons.length) {
      setOpen((p) => !p);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDisputerDetails();
    } else return;
  }, [id]);

  console.log("fetch dispute full details", disputeDetails);

  return (
    <>
      {loading ? (
        <DisputeDetailsSkeleton />
      ) : (
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
              <p className="font-MontserratSemiBold text-c16">
                Awaiting feedback
              </p>
            </button>
            <div className="md:pt-c32  pt-7 md:pb-c64 md:px-62.5 ">
              <div className="md:p-c32  md:rounded-2xl md:border border-000000/10">
                <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                  <Link
                    href={{
                      pathname: `/product/${disputeDetails?.product_id}`,
                      query:
                        disputeDetails?.variant_id || disputeDetails?.product_id
                          ? { variationId: disputeDetails?.variant_id }
                          : { variationId: disputeDetails?.product_id },
                    }}
                    className="w-full justify-between md:pb-8 flex"
                  >
                    <div className="flex gap-4 items-start  w-full">
                      <Image
                        src={
                          disputeDetails?.product_image || "/placeholder.png"
                        }
                        alt={disputeDetails?.product_name || "Product Image"}
                        width={96}
                        height={96}
                        className="h-24 w-24 "
                      />
                      <div className="w-full">
                        <p className="font-MontserratSemiBold text-base mb-1">
                          {disputeDetails?.product_name}
                        </p>
                        <p className=" text-c12 font-MontserratMedium mb-3">
                          {disputeDetails?.seller_name}
                        </p>
                        <p className="rounded-c12 bg-000000/10 text-000000/60 p-2  w-fit font-MontserratSemiBold text-c12 flex items-center ">
                          {disputeDetails?.affected_quantity ?? disputeDetails?.item_quantity}Pc,
                          {disputeDetails?.variant_name ||
                            disputeDetails?.product_name}
                        </p>
                        <p className="font-MontserratSemiBold text-c16 pt-3">
                          ₦{disputeDetails?.requested_refund_amount}
                        </p>
                      </div>
                    </div>
                  </Link>
                  {MobileActions}
                  <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                    <Button
                      onClick={() => {
                        setSelectedOrderId(id);
                        setOpenCancelModal(true);
                      }}
                      variant="secondary"
                    >
                      Cancel dispute
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-c18 font-MontserratMedium">
                    Return process is underway
                  </h1>
                  <p className="text-c12 font-MontserratMedium">
                    We will inform you when your returned item is received
                  </p>
                </div>
                <div className=" mt-c32">
                  <label className="text-c12 font-MontserratMedium text-000000/65 ">
                    Reason for cancelling
                  </label>
                  <div className="relative w-full mt-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                    >
                      <span
                        className={
                          "text-gray-900 font-MontserratMedium text-left text-c12 "
                        }
                      >
                        {disputeDetails?.cancellation_reason_title}
                      </span>

                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* <AnimatePresence>
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
                  )} */}
                  </div>
                  <div className="mt-4">
                    <label className="text-c12 font-MontserratMedium text-000000/65  ">
                      Returned method
                    </label>
                    <div className="relative w-full mt-2">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                      >
                        <span
                          className={
                            "text-gray-900 font-MontserratMedium text-left text-c12 "
                          }
                        >
                          {disputeDetails?.return_method_display}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* <AnimatePresence>
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
                    </AnimatePresence> */}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="pb-2 text-c12  font-MontserratMedium text-gray-600">
                      Please describe the issue and upload evidence to support
                      it
                    </label>
                    <p className=" w-full  p-3 text-sm mt-2 h-24.75 border border-000000/35 rounded-c8">
                      {disputeDetails?.cancellation_reason_description}
                    </p>
                  </div>
                  <div className="w-full border rounded-c8 mt-4 relative p-3">
                    <div className="flex items-center  flex-wrap gap-3">
                      {disputeDetails?.evidence.map((image) => (
                        <div
                          key={image.id}
                          className="relative h-24 w-23  overflow-hidden  cursor-pointer"
                        >
                          <Image
                            src={image.file_url}
                            alt="preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
      )}
    </>
  );
}
