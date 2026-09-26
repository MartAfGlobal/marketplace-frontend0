"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Download, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence, motion } from "framer-motion";
import UpdateOrderStatusModal from "@/components/ui/Modals/admin/UpdateOrderStatusModal";
import AdminCancelOrderModal from "@/components/ui/Modals/admin/AdminCancelOrderModal";
import ConfirmItemDepartureModal from "@/components/ui/Modals/admin/ConfirmItemDepartureModal";
import ConfirmSellerTrackingModal from "@/components/ui/Modals/admin/ConfirmSellerTrackingModal";
import RequestPickupModal from "@/components/ui/Modals/admin/RequestPickupModal";
import ResultModal from "@/components/ui/forms/resultModal";
import OrderProgressBar, {
  getProgressIndex,
} from "@/components/admin-components/orders/OrderProgressBar";
import { getHubStatusIndex } from "@/components/ui/Modals/admin/UpdateOrderStatusModal";
import OrderItemsAndSummary from "@/components/admin-components/orders/OrderItemsAndSummary";
import OrderDocumentsCard from "@/components/admin-components/orders/OrderDocumentsCard";
import OrderPartyDetails from "@/components/admin-components/orders/OrderPartyDetails";
import OrderSummaryCards from "@/components/admin-components/orders/OrderSummaryCards";
import UpdateStatusSection from "@/components/admin-components/orders/UpdateStatusSection";
import {
  getOrderDisplayStatus,
  formatOrderStatus,
  isOrderFullyRejected,
} from "@/helpers/admin/orderStatusHelper";
import { Button } from "@/components/ui/Button/Button";
import ConfirmDeliveryModal from "@/components/ui/Modals/admin/ConfirmDeliveryModal";
import OrderDisputeModal, {
  DisputeItem,
} from "@/components/admin-components/orders/OrderDisputeModal";
import DisputeDetailSideModal from "@/components/ui/Modals/admin/DisputeDetailSideModal";
import { useOrderRefresh } from "@/hooks/useOrderRefresh";

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = (params.id as string) || "";
  const fromParam = searchParams.get("from");

  /* ── Breadcrumb ── */
  const [parentCategory, setParentCategory] = useState("Orders");
  const [parentHref, setParentHref] = useState("/dashboard/admin/orders");

  useEffect(() => {
    if (fromParam) {
      const n = fromParam.trim().toLowerCase();
      if (n.includes("dispute") || n.includes("refund")) {
        setParentCategory("Disputes");
        setParentHref("/dashboard/admin/orders/refund-dispute");
      } else if (n.includes("buyer")) {
        setParentCategory("Buyers");
        setParentHref("/dashboard/admin/users?type=buyers");
      } else if (n.includes("seller")) {
        setParentCategory("Sellers");
        setParentHref("/dashboard/admin/users?type=sellers");
      } else if (n.includes("dashboard") || n.includes("overview")) {
        setParentCategory("Dashboard");
        setParentHref("/dashboard/admin");
      } else {
        setParentCategory(
          fromParam
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
        );
        setParentHref("/dashboard/admin/orders");
      }
    } else if (typeof window !== "undefined" && document.referrer) {
      const ref = document.referrer;
      if (ref.includes("/refund-dispute") || ref.includes("/disputes")) {
        setParentCategory("Disputes");
        setParentHref("/dashboard/admin/orders/refund-dispute");
      } else if (ref.includes("/users/buyers") || ref.includes("type=buyers")) {
        setParentCategory("Buyers");
        setParentHref("/dashboard/admin/users?type=buyers");
      } else if (
        ref.includes("/users/sellers") ||
        ref.includes("type=sellers")
      ) {
        setParentCategory("Sellers");
        setParentHref("/dashboard/admin/users?type=sellers");
      } else if (ref.includes("/dashboard/admin/orders")) {
        setParentCategory("Orders");
        setParentHref("/dashboard/admin/orders");
      }
    }
  }, [fromParam]);

  const handleNavigateBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1)
      router.back();
    else router.push(parentHref);
  };

  /* ── State ── */
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [confirmTrackingOpen, setConfirmTrackingOpen] = useState(false);
  const [confirmTrackingLoading, setConfirmTrackingLoading] = useState(false);
  const [confirmSuccessModalOpen, setConfirmSuccessModalOpen] = useState(false);
  const [arrivalWarningOpen, setArrivalWarningOpen] = useState(false);
  const [arrivalLoading, setArrivalLoading] = useState(false);
  const [arrivalSuccessOpen, setArrivalSuccessOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccessModalOpen, setCancelSuccessModalOpen] = useState(false);

  /* ── Pickup & Departure States ── */
  const [pickupDropdownOpen, setPickupDropdownOpen] = useState(false);
  const pickupDropdownRef = useRef<HTMLDivElement>(null);
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupSuccessOpen, setPickupSuccessOpen] = useState(false);
  const [confirmDepartureOpen, setConfirmDepartureOpen] = useState(false);
  const [confirmDeliveryOpen, setConfirmDeliveryOpen] = useState(false);
  const [confirmDepartureLoading, setConfirmDepartureLoading] = useState(false);
  const [confirmDepartureSuccessOpen, setConfirmDepartureSuccessOpen] =
    useState(false);
  const [confirmDeliverySuccessOpen, setConfirmDeliverySuccessOpen] =
    useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeDetailSideModalOpen, setDisputeDetailSideModalOpen] =
    useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null,
  );
  const [selectedDisputeData, setSelectedDisputeData] = useState<any>(null);
  const [loadedDisputes, setLoadedDisputes] = useState<any[]>([]);
  const disputeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickupDropdownRef.current &&
        !pickupDropdownRef.current.contains(event.target as Node)
      ) {
        setPickupDropdownOpen(false);
      }
      if (
        disputeDropdownRef.current &&
        !disputeDropdownRef.current.contains(event.target as Node)
      ) {
        setDisputeModalOpen(false);
      }
    }
    if (pickupDropdownOpen || disputeModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickupDropdownOpen, disputeModalOpen]);

  const token = useSelector((state: RootState) => state.token.token);
  const {
    fetchAdminOrderDetail,
    fetchOrderTracking,
    searchAdminOrder,
    fetchAdminDisputeDetail,
    fetchAdminDisputesList,
    updateAdminOrderStatus,
    confirmTracking,
    receiveAtHub,
    requestItemPickup,
    shipSellerOrder,
    ConfirmItemDelivered,
  } = AdminDetails();

  // Helper to extract a single order from search API response
  const extractOrderFromResponse = (data: any) => {
    if (!data) return null;
    if (Array.isArray(data)) return data[0] || null;
    if (Array.isArray(data.results)) return data.results[0] || null;
    if (data.data) {
      if (Array.isArray(data.data)) return data.data[0] || null;
      return data.data;
    }
    return data;
  };

  /* ── Fetch ── */
  const loadOrder = (idToFetch: string, showLoader: boolean = true) => {
    if (!token || !idToFetch) return;
    if (showLoader) setLoading(true);

    const trySearchOrderLookup = () => {
      searchAdminOrder(
        idToFetch,
        (searchRes: any) => {
          const foundOrder = extractOrderFromResponse(searchRes);
          if (foundOrder && (foundOrder.id || foundOrder.order_id)) {
            const resolvedId = foundOrder.id;
            if (resolvedId && resolvedId !== idToFetch) {
              fetchAdminOrderDetail(
                resolvedId,
                (fullData: any) => {
                  setOrder(fullData || foundOrder);
                  setLoading(false);
                },
                () => {
                  setOrder(foundOrder);
                  setLoading(false);
                },
              );
            } else {
              setOrder(foundOrder);
              setLoading(false);
            }
          } else {
            tryTrackingLookup();
          }
        },
        () => {
          tryTrackingLookup();
        },
      );
    };

    const tryTrackingLookup = () => {
      fetchOrderTracking(
        idToFetch,
        (trackData: any) => {
          const resolvedId = trackData?.id || trackData?.order_id;
          if (resolvedId && resolvedId !== idToFetch) {
            fetchAdminOrderDetail(
              resolvedId,
              (fullData: any) => {
                setOrder(fullData || trackData);
                setLoading(false);
              },
              () => {
                setOrder(trackData);
                setLoading(false);
              },
            );
          } else {
            setOrder(trackData);
            setLoading(false);
          }
        },
        (trackErr: any) => {
          console.error("Order search and tracking failed:", trackErr);
          setLoading(false);
        },
      );
    };

    // Check if idToFetch is a standard 36-character UUID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idToFetch.trim(),
      );

    // If identifier is NOT a UUID (e.g. ORD-3493353, SELLER-TRK-00123, etc.), use the search endpoint
    if (!isUuid) {
      trySearchOrderLookup();
      return;
    }

    fetchAdminOrderDetail(
      idToFetch,
      (data: any) => {
        if (data && (data.id || data.order_id || data.items)) {
          setOrder(data);
          setLoading(false);
        } else {
          trySearchOrderLookup();
        }
      },
      () => {
        trySearchOrderLookup();
      },
    );
  };

  useEffect(() => {
    if (token && rawId) {
      loadOrder(rawId, true);
    }
  }, [token, rawId]);

  useOrderRefresh(() => {
    if (token && rawId) loadOrder(rawId, false);
  });

  useEffect(() => {
    if (order && searchParams.get("viewDispute") === "true") {
      setDisputeModalOpen(true);
    }
  }, [order, searchParams]);

  // Fetch full details of any dispute(s) linked to this order so that all buyer dispute evidence files are available in documents
  useEffect(() => {
    if (!order || !token) return;

    const rawDisputes: any[] =
      order?.disputes ??
      order?.dispute_list ??
      order?.order_disputes ??
      (order?.dispute ? [order.dispute] : []);

    if (Array.isArray(rawDisputes) && rawDisputes.length > 0) {
      rawDisputes.forEach((d: any) => {
        const dId = d?.id || d?.uuid || d?.dispute_id;
        if (dId && (!d.evidence || d.evidence.length === 0)) {
          fetchAdminDisputeDetail(String(dId), (fullDispute: any) => {
            if (fullDispute) {
              setLoadedDisputes((prev) => {
                const exists = prev.some(
                  (p) =>
                    (p?.id || p?.uuid) ===
                    (fullDispute?.id || fullDispute?.uuid),
                );
                return exists
                  ? prev.map((p) =>
                      (p?.id || p?.uuid) ===
                      (fullDispute?.id || fullDispute?.uuid)
                        ? fullDispute
                        : p,
                    )
                  : [...prev, fullDispute];
              });
            }
          });
        } else if (d) {
          setLoadedDisputes((prev) => {
            const exists = prev.some(
              (p) => (p?.id || p?.uuid) === (d?.id || d?.uuid),
            );
            return exists ? prev : [...prev, d];
          });
        }
      });
    } else if (
      order?.has_dispute ||
      (order?.status && order.status.toUpperCase().includes("DISPUTE")) ||
      order?.status === "RETURN_REQUESTED"
    ) {
      const searchRef =
        order?.order_number || order?.order_id || order?.payment_no || rawId;
      if (searchRef) {
        fetchAdminDisputesList({ search: String(searchRef) }, (res: any) => {
          const results =
            res?.results ??
            res?.data?.results ??
            res?.data ??
            (Array.isArray(res) ? res : []);
          if (Array.isArray(results) && results.length > 0) {
            results.forEach((disp: any) => {
              const dId = disp?.id || disp?.uuid || disp?.dispute_id;
              if (dId) {
                fetchAdminDisputeDetail(String(dId), (full: any) => {
                  if (full) {
                    setLoadedDisputes((prev) => {
                      const exists = prev.some(
                        (p) => (p?.id || p?.uuid) === (full?.id || full?.uuid),
                      );
                      return exists
                        ? prev.map((p) =>
                            (p?.id || p?.uuid) === (full?.id || full?.uuid)
                              ? full
                              : p,
                          )
                        : [...prev, full];
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  }, [order, token]);

  /* ── Handlers ── */
  const handleTrackOrder = () => {
    const trackId =
      order?.tracking_number ||
      order?.tracking_no ||
      order?.order_no ||
      order?.order_number ||
      order?.payment_no ||
      rawId;
    router.push(`/dashboard/admin/orders/track/${encodeURIComponent(trackId)}`);
  };

  const handleConfirmStatusUpdate = (newStatus: string) => {
    const soId: string =
      (order?.seller_orders?.[0]?.id as string) ??
      (order?.seller_orders?.[0]?.seller_order_id as string) ??
      rawId ??
      "";
    if (!soId) {
      toast.error("Could not determine seller order ID.");
      return;
    }
    setUpdateStatusLoading(true);
    updateAdminOrderStatus(
      soId,
      { status: newStatus },
      (_data: any) => {
        setOrder((prev: any) => ({
          ...prev,
          status: newStatus,
          order_timeline_stage: newStatus,
          hub_delivery_status: newStatus,
          hub_status: newStatus,
          tracking_status: newStatus,
          seller_orders: Array.isArray(prev?.seller_orders)
            ? prev.seller_orders.map((so: any, idx: number) =>
                idx === 0
                  ? {
                      ...so,
                      hub_status: newStatus,
                      hub_delivery_status: newStatus,
                      tracking_status: newStatus,
                      status: newStatus,
                    }
                  : so,
              )
            : prev?.seller_orders,
          items: Array.isArray(prev?.items)
            ? prev.items.map((it: any) => ({
                ...it,
                status: newStatus,
                seller_order_status: newStatus,
              }))
            : prev?.items,
        }));
        if (rawId) loadOrder(order?.id || rawId, false);
        toast.success(
          `Order status updated to "${newStatus.replace(/_/g, " ")}" successfully.`,
        );
        setUpdateStatusOpen(false);
        setUpdateStatusLoading(false);
      },
      (_err: any) => {
        toast.error("Failed to update order status. Please try again.");
        setUpdateStatusLoading(false);
      },
    );
  };

  const handleConfirmTracking = () => {
    const soId: string =
      (order?.seller_order_id as string) ??
      (order?.seller_orders?.[0]?.id as string) ??
      (order?.seller_orders?.[0]?.seller_order_id as string) ??
      (order?.id as string) ??
      rawId ??
      "";
    if (!soId) {
      toast.error("Could not determine seller order ID.");
      return;
    }

    setConfirmTrackingLoading(true);
    confirmTracking(
      soId,
      (_data: any) => {
        setConfirmTrackingLoading(false);
        setConfirmTrackingOpen(false);
        setConfirmSuccessModalOpen(true);
        if (rawId) {
          loadOrder(order?.id || rawId, false);
        }
      },
      (err: any) => {
        setConfirmTrackingLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to confirm tracking. Please try again.",
        );
      },
    );
  };

  const handleReceiveAtHub = () => {
    const hubOrderId: string =
      (order?.hub_order_id as string) ??
      (order?.seller_order_id as string) ??
      (order?.seller_orders?.[0]?.id as string) ??
      (order?.seller_orders?.[0]?.seller_order_id as string) ??
      (order?.id as string) ??
      rawId ??
      "";
    if (!hubOrderId) {
      toast.error("Could not determine order ID.");
      return;
    }

    setArrivalWarningOpen(false);
    setArrivalLoading(true);
    receiveAtHub(
      hubOrderId,
      (_data: any) => {
        setArrivalLoading(false);
        setArrivalSuccessOpen(true);
        if (rawId) {
          loadOrder(order?.id || rawId, false);
        }
      },
      (err: any) => {
        setArrivalLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to confirm item arrival. Please try again.",
        );
      },
    );
  };

  const getSellerOrderId = () => {
    return (
      (order?.seller_order_id as string) ??
      (order?.seller_orders?.[0]?.id as string) ??
      (order?.seller_orders?.[0]?.seller_order_id as string) ??
      (order?.id as string) ??
      rawId ??
      ""
    );
  };

  const handleRequestPickupSubmit = (data: {
    pickup_reason: string;
    notes: string;
  }) => {
    const soId = getSellerOrderId();
    if (!soId) {
      toast.error("Could not determine seller order ID.");
      return;
    }

    setPickupLoading(true);
    requestItemPickup(
      soId,
      data,
      (_res: any) => {
        setPickupLoading(false);
        setPickupModalOpen(false);
        setPickupSuccessOpen(true);
        if (rawId) {
          loadOrder(order?.id || rawId, false);
        }
      },
      (err: any) => {
        setPickupLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to submit pickup request. Please try again.",
        );
      },
    );
  };

  const handleConfirmDepartureSubmit = (formData: FormData) => {
    const soId = getSellerOrderId();
    if (!soId) {
      toast.error("Could not determine seller order ID.");
      return;
    }

    setConfirmDepartureLoading(true);
    shipSellerOrder(
      soId,
      formData,
      (_res: any) => {
        setConfirmDepartureLoading(false);
        setConfirmDepartureOpen(false);
        setConfirmDepartureSuccessOpen(true);
        if (rawId) {
          loadOrder(order?.id || rawId, false);
        }
      },
      (err: any) => {
        setConfirmDepartureLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to confirm item departure. Please try again.",
        );
      },
    );
  };
  const handleConfirmDelivery = (formData: FormData) => {
    const soId = getSellerOrderId();
    if (!soId) {
      toast.error("Could not determine seller order ID.");
      return;
    }

    setConfirmDepartureLoading(true);
    ConfirmItemDelivered(
      soId,
      formData,
      (_res: any) => {
        setConfirmDepartureLoading(false);
        setConfirmDeliveryOpen(false);
        setConfirmDeliverySuccessOpen(true);
        if (rawId) {
          loadOrder(order?.id || rawId, false);
        }
      },
      (err: any) => {
        setConfirmDepartureLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to confirm item departure. Please try again.",
        );
      },
    );
  };

  const handleCopyOrderId = () => {
    if (!displayOrderId || displayOrderId === "N/A") return;
    navigator.clipboard.writeText(displayOrderId).then(() => {
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    });
  };

  const handleCopyTxnId = () => {
    if (!transactionId || transactionId === "N/A") return;
    navigator.clipboard.writeText(transactionId).then(() => {
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    });
  };

  /* ── Early return while loading or order not yet available ── */
  if (loading || !order) {
    return (
      <div className="mb-12 box-border w-full animate-in fade-in duration-300 space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="flex flex-col gap-8 w-full rounded-c16 bg-ffffff border border-000000/4 p-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-MontserratNormal"
          >
            <button
              type="button"
              onClick={handleNavigateBack}
              className="text-000000/44 hover:text-gray-700 transition-colors cursor-pointer"
            >
              {parentCategory}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-000000/44 flex-shrink-0" />
            <span className="text-000000/68 font-MontserratNormal">
              {rawId}
            </span>
          </nav>
        </div>
        <div className="py-20 flex justify-center items-center">
          <LoadingSpinner size={36} color="border-fftext-ff715b" />
        </div>
      </div>
    );
  }

  /* ── Derived Values (only computed once order is loaded) ── */
  const displayOrderId =
    order?.order_id ||
    order?.order_number ||
    order?.payment_no ||
    order?.id ||
    rawId ||
    "N/A";

  const transactionId =
    order?.payment_no ||
    order?.payment ||
    order?.transaction_id ||
    order?.payment_no ||
    (order?.id ? `TNX-${order.id.slice(0, 8).toUpperCase()}` : "N/A");
  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : order?.date || "N/A";
  const paymentDate = order?.paid_at
    ? new Date(order.paid_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : orderDate;
  const statusForProgress = (
    order?.admin_status ||
    order?.status ||
    order?.order_timeline_stage ||
    order?.hub_delivery_status ||
    "Pending"
  ).toLowerCase();
  const currentStep = getProgressIndex(statusForProgress);
  const displayStatus = getOrderDisplayStatus(order);
  const paymentMethod =
    order?.payment_method || (order?.payment ? "Card" : "Card");
  const rawPaymentStatus = (
    order?.payment_status ||
    (order?.payout_status === "ESCROWED" ? "PAID" : order?.payout_status) ||
    "PAID"
  ).toUpperCase();
  const displayPaymentStatus = formatOrderStatus(rawPaymentStatus);

  /* ── Buyer / Seller ── */
  const buyer = order?.buyer;
  const shippingInfo =
    order?.shipping_address ||
    order?.shipping_info ||
    order?.guest_shipping_address;
  const buyerFullName = [buyer?.first_name, buyer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const shippingFullName = [shippingInfo?.first_name, shippingInfo?.last_name]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(" ")
    .trim();
  const buyerName =
    buyerFullName ||
    shippingFullName ||
    (buyer?.email ? buyer.email.split("@")[0] : null) ||
    order?.buyer_name ||
    "Buyer";
  const buyerEmail =
    buyer?.email || shippingInfo?.email || order?.buyer_email || "N/A";
  const buyerPhone =
    shippingInfo?.phone ||
    shippingInfo?.phone_number ||
    buyer?.phone ||
    buyer?.phone_number ||
    order?.delivery_address?.phone ||
    "N/A";
  const buyerAddress =
    [
      shippingInfo?.address || shippingInfo?.line1,
      shippingInfo?.city,
      shippingInfo?.state,
      shippingInfo?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    order?.delivery_address?.address ||
    order?.shipping_address?.address ||
    "N/A";
  const buyerAvatar =
    buyer?.avatar || buyer?.profile_picture || buyer?.image || "";
  const buyerId =
    buyer?.id || order?.buyer_id || order?.user_id || order?.user?.id;

  const shippingAddress =
    [
      shippingInfo?.address || shippingInfo?.line1,
      shippingInfo?.city,
      shippingInfo?.state,
      shippingInfo?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    order?.shipping_address?.address ||
    order?.delivery_address?.address ||
    "N/A";
  const shippingMethod =
    order?.shipping_method ||
    order?.delivery_partner ||
    order?.shipping_breakdown?.shipping_method ||
    "MartAf Express";
  const trackingNumber =
    order?.tracking_number || order?.tracking_no || order?.parcel_id || null;

  const firstSellerOrder =
    Array.isArray(order?.seller_orders) && order.seller_orders.length > 0
      ? order.seller_orders[0]
      : null;
  const seller =
    typeof order?.seller === "object"
      ? order.seller
      : firstSellerOrder?.seller ||
        firstSellerOrder?.vendor ||
        firstSellerOrder?.manufacturer ||
        (Array.isArray(order?.sellers) && order.sellers.length > 0
          ? order.sellers[0]
          : null) ||
        null;
  const sellerName =
    order?.seller_name ||
    seller?.business_name ||
    seller?.shop_name ||
    seller?.store_name ||
    firstSellerOrder?.business_name ||
    [seller?.first_name, seller?.last_name].filter(Boolean).join(" ").trim() ||
    seller?.name ||
    "MartAf Store";
  const sellerEmail =
    seller?.email ||
    seller?.user?.email ||
    order?.seller_email ||
    firstSellerOrder?.vendor_email ||
    "seller@martaf.com";
  const sellerPhone =
    seller?.phone ||
    seller?.phone_number ||
    order?.seller_phone ||
    firstSellerOrder?.vendor_phone ||
    "+2348000000000";
  const sellerAddress =
    seller?.business_address ||
    seller?.address ||
    [seller?.city, seller?.state, seller?.country].filter(Boolean).join(", ") ||
    firstSellerOrder?.vendor_address ||
    "MartAf Verified Merchant";
  const sellerAvatar =
    seller?.avatar ||
    seller?.logo ||
    seller?.profile_picture ||
    seller?.image ||
    "";
  const isSellerVerified = seller?.is_verified ?? true;
  const sellerId =
    seller?.id ||
    seller?.seller_id ||
    firstSellerOrder?.seller_id ||
    firstSellerOrder?.seller?.id ||
    order?.seller_id;

  /* ── Order Items ── */
  const extractedItems =
    Array.isArray(order?.items) && order.items.length > 0
      ? order.items
      : Array.isArray(order?.order_items) && order.order_items.length > 0
        ? order.order_items
        : Array.isArray(order?.seller_orders) && order.seller_orders.length > 0
          ? order.seller_orders.flatMap(
              (so: any) =>
                so.order_items || so.items || (so.product ? [so] : []),
            )
          : [];
  const orderItems = extractedItems;

  /* ── Financials ── */
  const subtotalAmount = Number(order?.subtotal ?? 0);
  const discountAmount = Number(order?.discount_amount ?? order?.discount ?? 0);
  const shippingFeeAmount = Number(
    order?.shipping_cost ?? order?.shipping_fee ?? 0,
  );
  const grandTotalAmount = Number(
    order?.total_amount ??
      order?.total_price ??
      subtotalAmount + shippingFeeAmount - discountAmount,
  );
  const rawTotal = grandTotalAmount;
  const totalItemsCount =
    order?.accepted_quantity ||
    order?.items_count ||
    (orderItems.length > 0
      ? orderItems.reduce(
          (acc: number, it: any) =>
            acc +
            (Number(
              it.quantity ??
                it.qty ??
                it.fulfilled_quantity ??
                it.accepted_quantity,
            ) || 1),
          0,
        )
      : 1);
  const paymentId =
    typeof order?.payment === "string"
      ? order.payment
      : order?.payment?.id || null;

  /* ── Status Flags ── */
  const isCancelled =
    (order?.status ?? "").toUpperCase() === "CANCELLED" ||
    (order?.order_timeline_stage ?? "").toUpperCase() === "CANCELLED";
  const isPending =
    (order?.status ?? "").toUpperCase() === "PENDING" ||
    (order?.order_timeline_stage ?? "").toUpperCase() === "PENDING";
  const isExpired = !isCancelled && isPending && order?.can_accept === false;

  const itemStatusCandidates = extractedItems
    .flatMap((item: any) => [item?.seller_order_status, item?.status])
    .filter(Boolean) as string[];
  const hubStatusCandidates = [
    firstSellerOrder?.hub_delivery_status,
    firstSellerOrder?.hub_status,
    firstSellerOrder?.tracking_status,
    firstSellerOrder?.delivery_status,
    order?.hub_delivery_status,
    order?.hub_status,
    order?.tracking_status,
    order?.status,
    order?.order_timeline_stage,
    order?.delivery_status,
    ...itemStatusCandidates,
  ].filter(Boolean) as string[];
  const currentHubStatus: string | null = hubStatusCandidates.reduce<
    string | null
  >(
    (best, c) =>
      !best || getHubStatusIndex(c) > getHubStatusIndex(best) ? c : best,
    null,
  );
  const hasShippedState = [
    order?.status,
    order?.order_timeline_stage,
    order?.delivery_status,
    order?.tracking_status,
    ...itemStatusCandidates,
  ].some((v) => {
    const s = String(v ?? "").toUpperCase();
    return s.includes("SHIP") || s === "OUT_FOR_DELIVERY";
  });
  const effectiveHubStatus =
    hasShippedState && getHubStatusIndex(currentHubStatus) < 1
      ? "SHIPPED_TO_BUYER"
      : currentHubStatus;

  const isAcceptedOrInTransit =
    [
      "ACCEPTED",
      "PARTIALLY_ACCEPTED",
      "IN_TRANSIT_TO_HUB",
      "RECEIVED_AT_HUB",
      "SHIPPED_TO_BUYER",
      "FULFILLED",
      "SHIPPED",
      "PROCESSED",
    ].includes((order?.status ?? "").toUpperCase()) ||
    [
      "ACCEPTED",
      "PARTIALLY_ACCEPTED",
      "IN_TRANSIT_TO_HUB",
      "RECEIVED_AT_HUB",
      "SHIPPED_TO_BUYER",
      "FULFILLED",
      "SHIPPED",
      "PROCESSED",
    ].includes((order?.order_timeline_stage ?? "").toUpperCase()) ||
    Boolean(order?.fulfilled_at) ||
    Boolean(order?.accepted_at) ||
    ["IN_TRANSIT", "RECEIVED_AT_HUB", "SHIPPED_TO_BUYER"].includes(
      (currentHubStatus ?? "").toUpperCase(),
    );

  const hubComplete =
    (effectiveHubStatus ?? "").toUpperCase() === "DELIVERED" ||
    (currentHubStatus ?? "").toUpperCase() === "DELIVERED" ||
    (order?.status ?? "").toUpperCase() === "DELIVERED" ||
    (order?.order_timeline_stage ?? "").toUpperCase() === "DELIVERED";
  const isRejected =
    displayStatus.toLowerCase() === "rejected" ||
    (order?.status ?? "").toUpperCase() === "REJECTED" ||
    (order?.order_timeline_stage ?? "").toUpperCase() === "REJECTED" ||
    isOrderFullyRejected(order);
  const canUpdateStatus =
    isAcceptedOrInTransit &&
    !isCancelled &&
    !isExpired &&
    !hubComplete &&
    !isRejected;
  const hasTracking = Boolean(trackingNumber);

  const warehouseLocation =
    order?.warehouse?.name ||
    order?.warehouse_name ||
    order?.receiving_hub?.name ||
    (typeof order?.warehouse === "string" ? order?.warehouse : "") ||
    firstSellerOrder?.warehouse?.name ||
    firstSellerOrder?.warehouse_name ||
    "Utako branch";

  const defaultDepartureTracking =
    order?.admin_tracking_id_to_buyer ||
    order?.admin_tracking_id ||
    order?.tracking_number ||
    firstSellerOrder?.admin_tracking_id_to_buyer ||
    "";

  const isAtHub =
    (
      order?.status ??
      order?.order_timeline_stage ??
      order?.hub_status ??
      ""
    ).toUpperCase() === "RECEIVED_AT_HUB" ||
    (order?.status ?? "").toUpperCase() === "PICKUP_REQUESTED";

  return (
    <div className="mb-12 box-border w-full  animate-in fade-in duration-300 space-y-8">
      {/* ── Header / Breadcrumb ── */}
      <div className=" flex flex-col gap-8 w-ful rounded-c16 bg-ffffff border border-000000/4 p-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs font-MontserratNormal"
        >
          <button
            type="button"
            onClick={handleNavigateBack}
            className="text-000000/44 hover:text-gray-700 transition-colors cursor-pointer"
          >
            {parentCategory}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-000000/44 flex-shrink-0" />
          <span className="text-000000/68 font-MontserratNormal ">
            {displayOrderId}
          </span>
        </nav>

        <div className=" flex justify-between w-full">
          <div className="flex gap-4 ">
            <div className="p-[7px]">
              <ChevronLeft className="w-5 h-5 text-000000 flex-shrink-0" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-000000 text-c20 font-MontserratMedium">
                {displayOrderId}
              </span>
              <span
                className={`text-ffffff py-1 px-4 w-fit h-6 rounded-c32 text-c10 font-MontserratNormal flex items-center justify-center ${
                  displayStatus.toLowerCase() === "delivered" ||
                  displayStatus.toLowerCase() === "received by buyer"
                    ? "bg-[#0070E9]/68"
                    : displayStatus === "Cancelled" ||
                        displayStatus === "CANCELLED" ||
                        displayStatus === "Rejected" ||
                        displayStatus === "Dispute raised" ||
                        displayStatus === "RETURN_REQUESTED"
                      ? "bg-[#CA0202]"
                      : "bg-[#0070E9]"
                }`}
              >
                {displayStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {order.is_returned && (
              <div className="flex items-center gap-2">
                <p className="text-sm font-MontserratNormal leading-c20 text-000000">
                  Time left for delivery:
                </p>
                {order.status === "SHIPPED_TO_BUYER" && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-MontserratNormal leading-c20 text-000000">
                      Time left for delivery:
                    </p>

                    <span
                      className={`h-10 w-25.25 rounded-c8 py-2 px-6 text-base font-MontserratSemiBold text-center ${
                        Math.ceil(order.time_remaining_to_completion / 86400) <=
                        2
                          ? "bg-[#CA0202]/12 text-[#CA0202]"
                          : "bg-28a745/12 text-[#2D7565]"
                      }`}
                    >
                      {Math.max(
                        0,
                        Math.ceil(order.time_remaining_to_completion / 86400),
                      )}{" "}
                      days
                    </span>
                  </div>
                )}
              </div>
            )}
            {order.status === "DELIVERED" && (
              <div className="flex items-center gap-2">
                <p className="text-sm font-MontserratNormal leading-c20 text-000000">
                  Time left for return window:
                </p>
                <span
                  className={`h-10 w-25.25 rounded-c8 py-2 px-6 text-base font-MontserratSemiBold text-center ${
                    Math.ceil(
                      (new Date(order.escrow_release_date).getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24),
                    ) <= 2
                      ? "bg-[#CA0202]/12 text-[#CA0202]"
                      : "bg-28a745/12 text-[#2D7565]"
                  }`}
                >
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(order.escrow_release_date).getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24),
                    ),
                  )}{" "}
                  days
                </span>
              </div>
            )}

            {(
              order?.status ??
              order?.order_timeline_stage ??
              ""
            ).toUpperCase() === "TRACKING_SUBMITTED" && (
              <Button
                onClick={() => setConfirmTrackingOpen(true)}
                className="w-[232px]"
              >
                Confirm tracking number
              </Button>
            )}
            {order.status === "IN_TRANSIT_TO_HUB" && (
              <Button
                onClick={() => setArrivalWarningOpen(true)}
                className="w-[192px]"
              >
                Confirm item arrival
              </Button>
            )}
            {(order.status === "RETURN_REQUESTED" ||
              order.has_dispute ||
              getOrderDisplayStatus(order)
                .toLowerCase()
                .includes("dispute")) && (
              <div className="relative" ref={disputeDropdownRef}>
                <Button
                  onClick={() => setDisputeModalOpen((prev) => !prev)}
                  className="w-[150px]"
                >
                  View disputes
                </Button>
                <OrderDisputeModal
                  isOpen={disputeModalOpen}
                  onClose={() => setDisputeModalOpen(false)}
                  disputes={(() => {
                    const raw: any[] =
                      order?.disputes ??
                      order?.dispute_list ??
                      order?.order_disputes ??
                      (order?.dispute ? [order.dispute] : []);
                    return (Array.isArray(raw) ? raw : []).map(
                      (d: any): DisputeItem => ({
                        id: d?.id || d?.uuid || d?.dispute_id || d?.pk || "",
                        dispute_id:
                          d?.dispute_number ||
                          d?.dispute_id ||
                          d?.reference ||
                          d?.id ||
                          "Dispute",
                        product_name:
                          d?.product_name ??
                          d?.item?.product_name ??
                          d?.items?.[0]?.product_name,
                        product_image:
                          d?.product_image ??
                          d?.item?.image ??
                          d?.items?.[0]?.image ??
                          d?.items?.[0]?.product_image,
                        date: d?.created_at ?? d?.date,
                        status: d?.status_display ?? d?.status,
                      }),
                    );
                  })()}
                  onView={(dispute) => {
                    console.log(
                      "View dispute clicked for UUID:",
                      dispute.id,
                      dispute,
                    );
                    setDisputeModalOpen(false);
                    setSelectedDisputeId(dispute.id);
                    setSelectedDisputeData(dispute);
                    setDisputeDetailSideModalOpen(true);
                  }}
                />
              </div>
            )}
            {order.status === "SHIPPED_TO_BUYER" && (
              <Button
                onClick={() => setConfirmDeliveryOpen(true)}
                className="w-[210px]"
              >
                Confirm order delivery
              </Button>
            )}
            {isAtHub && order.pickup_requested && (
              <Button
                type="button"
                onClick={() => {
                  setPickupDropdownOpen(false);
                  setConfirmDepartureOpen(true);
                }}
                className="w-[240px]"
              >
                Confirm item&apos;s departure
              </Button>
            )}

            {isAtHub && !order.pickup_requested && (
              <div className="relative" ref={pickupDropdownRef}>
                <button
                  type="button"
                  onClick={() => setPickupDropdownOpen((prev) => !prev)}
                  className="bg-ff715b w-[223px] hover:bg-[#e05d4a] text-white rounded-c8 h-c48 px-4 font-MontserratSemiBold text-sm flex items-center justify-between gap-3 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Request item pickup</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                      pickupDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {pickupDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2.75 w-56 bg-white rounded-xl shadow-customW py-2 z-50 flex flex-col gap-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setPickupDropdownOpen(false);
                          setConfirmDepartureOpen(true);
                        }}
                        className="w-full text-left px-6 py-2 h-10  text-xs font-MontserratNormal hover:text-ff715b text-000000/68 hover:bg-[#FFF5F4] transition-colors cursor-pointer"
                      >
                        Confirm item&apos;s departure
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPickupDropdownOpen(false);
                          setPickupModalOpen(true);
                        }}
                        className="w-full text-left px-6 py-2 h-10  text-xs font-MontserratNormal hover:text-ff715b text-000000/68 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Request item pickup
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {(order?.can_cancel ?? order?.seller_orders?.[0]?.can_cancel) && (
              <Button
                variant="secodary danger"
                className="w-[140px] flex-shrink-0"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel order
              </Button>
            )}

            <button
              onClick={() => toast.info("Downloading order details...")}
              className="w-10 h-10 border border-fftext-ff715b/40 hover:border-fftext-ff715b rounded-lg flex-shrink-0 flex items-center justify-center transition-colors group"
              title="Download"
            >
              <Download className="w-4 h-4 text-ff715b group-hover:scale-105 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4 justify-center">
        <div className="flex-1 min-w-0 space-y-4 max-w-[744px]">
          {/* ── Order / Payment / Actions ── */}

          {/* ── Buyer / Shipping / Seller ── */}
          <OrderPartyDetails
            buyerId={buyerId}
            buyerName={buyerName}
            buyerAvatar={buyerAvatar}
            buyerEmail={buyerEmail}
            buyerPhone={buyerPhone}
            buyerAddress={buyerAddress}
            shippingAddress={shippingAddress}
            shippingMethod={shippingMethod}
            trackingNumber={trackingNumber ?? ""}
            sellerId={sellerId}
            sellerName={sellerName}
            sellerAvatar={sellerAvatar}
            isSellerVerified={isSellerVerified}
            sellerEmail={sellerEmail}
            sellerPhone={sellerPhone}
            sellerAddress={sellerAddress}
          />

          {/* ── Progress Bar ── */}
          <OrderProgressBar
            currentStep={currentStep}
            className="w-full max-w-[744px]"
            isDisputed={
              order?.has_dispute === true ||
              (order?.status ?? "").toUpperCase() === "RETURN_REQUESTED" ||
              (order?.status ?? "").toUpperCase() === "RETURN_ACCEPTED" ||
              ((order?.status ?? "").toUpperCase() === "CLOSED" &&
                (order?.has_dispute === true ||
                  Boolean(
                    order?.dispute ||
                    (order?.disputes && order.disputes.length > 0),
                  ))) ||
              (order?.dispute_status ?? "").toUpperCase() === "CLOSED"
            }
            adminStatus={order?.admin_status}
            statusBeforeCancellation={order?.admin_status_before_cancellation}
            disputeStatus={
              order?.dispute_status ||
              order?.disputes?.[0]?.status ||
              order?.dispute?.status ||
              order?.status
            }
          />
          <OrderItemsAndSummary
            order={order}
            orderItems={orderItems}
            totalItemsCount={totalItemsCount}
            discountAmount={discountAmount}
            subtotalAmount={subtotalAmount}
            shippingFeeAmount={shippingFeeAmount}
            grandTotalAmount={grandTotalAmount}
          />
        </div>
        <div className="w-[344px] space-y-4">
          <OrderSummaryCards
            subtotal={order.subtotal}
            discout="0"
            shippingFee={order.shipping_cost}
            totalItems={order.items.length}
            shippingMethod={order.shipping_method}
            shippingAddress={`${order.shipping_address.address},  ${order.shipping_address.address.city}, ${order.shipping_address.state}`}
            trackingId={order.tracking_number}
            displayOrderId={displayOrderId}
            orderDate={orderDate}
            rawTotal={rawTotal}
            displayStatus={displayStatus}
            transactionId={transactionId}
            paymentDate={paymentDate}
            paymentMethod={paymentMethod}
            rawPaymentStatus={rawPaymentStatus}
            displayPaymentStatus={displayPaymentStatus}
            hasTracking={hasTracking}
            isCancelled={isCancelled}
            isExpired={isExpired}
            copiedOrder={copiedOrder}
            copiedTxn={copiedTxn}
            onCopyOrderId={handleCopyOrderId}
            onCopyTxnId={handleCopyTxnId}
            onTrackOrder={handleTrackOrder}
            onCancelOrder={() => setCancelModalOpen(true)}
          />
          <div className="w-full flex justify-center">
            <OrderDocumentsCard
              order={order}
              depatureEvidence={order?.departure_evidence}
              deliveryEvidence={order?.delivery_evidence}
              disputes={
                loadedDisputes.length > 0 ? loadedDisputes : order?.disputes
              }
              className="w-full max-w-[1104px]"
            />
          </div>
        </div>
      </div>
      {/* ── Order Items & Summary ── */}
      {/* ── Order Documents Section (Seller, Admin & Buyer Dispute) ── */}
      {/* ── Modals ── */}
      <AnimatePresence>
        {confirmTrackingOpen && (
          <ConfirmSellerTrackingModal
            isOpen={confirmTrackingOpen}
            onClose={() => setConfirmTrackingOpen(false)}
            onConfirm={handleConfirmTracking}
            loading={confirmTrackingLoading}
            orderId={displayOrderId}
            logisticsCompany={
              order?.delivery_partner?.name ||
              order?.delivery_partner ||
              order?.shipping_method ||
              order?.courier ||
              order?.shipping_breakdown?.shipping_method ||
              firstSellerOrder?.delivery_partner?.name ||
              firstSellerOrder?.delivery_partner ||
              "N/A"
            }
            trackingNumber={
              order?.seller_tracking_id_to_hub ||
              order?.tracking_number ||
              order?.tracking_no ||
              order?.seller_tracking_id ||
              firstSellerOrder?.seller_tracking_id_to_hub ||
              firstSellerOrder?.tracking_number ||
              order?.parcel_id ||
              "N/A"
            }
          />
        )}
      </AnimatePresence>
      {/* ── Request Pickup Modal ── */}
      <RequestPickupModal
        isOpen={pickupModalOpen}
        onClose={() => setPickupModalOpen(false)}
        orderId={displayOrderId}
        warehouseLocation={warehouseLocation}
        onConfirm={handleRequestPickupSubmit}
        loading={pickupLoading}
      />
      {/* ── Confirm Item Departure Modal ── */}
      <ConfirmItemDepartureModal
        isOpen={confirmDepartureOpen}
        onClose={() => setConfirmDepartureOpen(false)}
        orderId={displayOrderId}
        defaultTrackingNumber={defaultDepartureTracking}
        onConfirm={handleConfirmDepartureSubmit}
        loading={confirmDepartureLoading}
      />
      {/* ── Pickup Request: success ── */}
      <ResultModal
        isOpen={pickupSuccessOpen}
        result="success"
        title="Pickup Request Sent"
        message="A pickup request has been logged and sent to the logistics partner."
        discRescription="The tracking history has been updated and the logistics partner notified."
        buttenText="Okay"
        onConfirm={() => setPickupSuccessOpen(false)}
      />
      {/* ── Item Departure: success ── */}
      <ResultModal
        isOpen={confirmDepartureSuccessOpen}
        result="success"
        title="Item Departure Confirmed"
        message="Item departure to buyer has been successfully confirmed."
        discRescription="The order has been marked as shipped to buyer."
        buttenText="Okay"
        onConfirm={() => setConfirmDepartureSuccessOpen(false)}
      />
      <ResultModal
        isOpen={confirmDeliverySuccessOpen}
        result="success"
        title="Delivery Confirmed"
        message="Item delivery to buyer has been successfully confirmed."
        discRescription="The order has been marked as delivered to the buyer."
        buttenText="Okay"
        onConfirm={() => setConfirmDeliverySuccessOpen(false)}
      />
      <UpdateOrderStatusModal
        isOpen={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
        loading={updateStatusLoading}
        currentHubStatus={effectiveHubStatus}
      />
      <AdminCancelOrderModal
        isOpen={cancelModalOpen}
        orderId={order?.id || rawId}
        displayOrderId={displayOrderId}
        items={orderItems}
        paymentId={paymentId}
        onClose={() => setCancelModalOpen(false)}
        onSuccess={() => {
          setCancelModalOpen(false);
          if (token && rawId) {
            loadOrder(order?.id || rawId, false);
          }
        }}
      />{" "}
      <ResultModal
        isOpen={cancelSuccessModalOpen}
        result="success"
        title="Request Sent"
        message="Your cancellation request has been submitted successfully."
        discRescription="The cancellation request has been logged and the order status is updated."
        buttenText="Okay"
        onConfirm={() => setCancelSuccessModalOpen(false)}
      />
      <ResultModal
        isOpen={confirmSuccessModalOpen}
        result="success"
        title="Tracking Confirmed"
        message="Item departure tracking has been confirmed successfully."
        discRescription="The order has now advanced to In Transit to Hub."
        buttenText="Okay"
        onConfirm={() => setConfirmSuccessModalOpen(false)}
      />
      {/* ── Arrival: warning (final confirmation) ── */}
      <ResultModal
        isOpen={arrivalWarningOpen}
        result="warning"
        title="Confirm item arrival?"
        message="Are you sure this item has arrived at the hub? This action will mark the order as Received at Hub."
        discRescription="This cannot be undone."
        buttenText="Yes, confirm"
        secondaryButtonText="Cancel"
        onConfirm={handleReceiveAtHub}
        onSecondaryAction={() => setArrivalWarningOpen(false)}
        loading={arrivalLoading}
      />
      {/* ── Arrival: success ── */}
      <ResultModal
        isOpen={arrivalSuccessOpen}
        result="success"
        title="Item Received at Hub"
        message="The item has been successfully marked as received at the hub."
        discRescription="The order status has advanced to Received at Hub."
        buttenText="Okay"
        onConfirm={() => setArrivalSuccessOpen(false)}
      />
      <ConfirmDeliveryModal
        isOpen={confirmDeliveryOpen}
        onClose={() => setConfirmDeliveryOpen(false)}
        orderId={displayOrderId}
        defaultTrackingNumber={defaultDepartureTracking}
        onConfirm={handleConfirmDelivery}
        loading={confirmDepartureLoading}
      />
      {/* ── Dispute Details Side Modal ── */}
      <DisputeDetailSideModal
        isOpen={disputeDetailSideModalOpen}
        onClose={() => setDisputeDetailSideModalOpen(false)}
        disputeId={selectedDisputeId}
        initialData={selectedDisputeData}
        onStatusUpdated={() => {
          loadOrder(order?.id || rawId, false);
        }}
      />
    </div>
  );
}
