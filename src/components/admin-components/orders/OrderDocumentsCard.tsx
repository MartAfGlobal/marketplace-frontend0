"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, ExternalLink, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface OrderDocumentItem {
  id: string;
  name: string;
  kind: "DEPARTURE" | "DELIVERY" | "SELLER" | "DISPUTE" | "ADMIN" | "GENERAL";
  imageUrl: string;
  uploadedAt: string;
  uploadedByName?: string;
  dateFormatted: string;
  extension: string;
  source: "Admin" | "Seller" | "Buyer (Dispute)" | "Order";
  badgeLabel: string;
  badgeColorClass: string;
  description?: string;
}

export interface OrderDocumentsCardProps {
  order?: any;
  depatureEvidence?: any[];
  departureEvidence?: any[];
  deliveryEvidence?: any[];
  disputes?: any[];
  disputeEvidence?: any[];
  sellerEvidence?: any[];
  adminEvidence?: any[];
  title?: string;
  className?: string;
}

export function getFileExtension(url?: string): string {
  if (!url || typeof url !== "string") return "jpg";
  try {
    const clean = url.split("?")[0].split("#")[0];
    const match = clean.match(/\.([a-zA-Z0-9]+)$/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  } catch {
    // fallback
  }
  return "jpg";
}

export function formatDocumentDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const j = day % 10;
    const k = day % 100;
    let suffix = "th";
    if (j === 1 && k !== 11) suffix = "st";
    else if (j === 2 && k !== 12) suffix = "nd";
    else if (j === 3 && k !== 13) suffix = "rd";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}${suffix} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

export function isImageExtension(ext: string): boolean {
  return ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico"].includes(
    ext.toLowerCase(),
  );
}

export function isPdfExtension(ext: string): boolean {
  return ext.toLowerCase() === "pdf";
}

export function DocumentFileIcon({ type }: { type: string }) {
  const ext = (type || "jpg").toUpperCase().slice(0, 4);
  const isPdf = ext === "PDF";
  const isDoc = ext === "DOC" || ext === "DOCX";

  return (
    <div
      className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded ${
        isPdf
          ? "text-[#CA0202] bg-red-50"
          : isDoc
            ? "text-blue-600 bg-blue-50"
            : "text-[#343330] bg-gray-50"
      }`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9.5L13.5 3H6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M13.5 3V9.5H20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="17.5"
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="bold"
          fontFamily="Montserrat, sans-serif"
          fill="currentColor"
          letterSpacing="0.3"
        >
          {ext}
        </text>
      </svg>
    </div>
  );
}

function extractItemUrl(item: any): string {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  const raw =
    item.image_url ||
    item.file_url ||
    item.url ||
    item.image ||
    item.file ||
    item.document ||
    item.attachment ||
    item.path ||
    item.src ||
    "";
  return typeof raw === "string" ? raw.trim() : "";
}

export default function OrderDocumentsCard({
  order,
  depatureEvidence,
  departureEvidence,
  deliveryEvidence,
  disputes,
  disputeEvidence,
  sellerEvidence,
  adminEvidence,
  title = "Order documents",
  className = "",
}: OrderDocumentsCardProps) {
  const [selectedDoc, setSelectedDoc] = useState<OrderDocumentItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "ADMIN" | "SELLER" | "DISPUTE"
  >("ALL");

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDoc(null);
    };
    if (selectedDoc) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDoc]);

  // Extract all documents from Admin, Seller, and Buyer Dispute
  const allDocuments = useMemo(() => {
    const docs: OrderDocumentItem[] = [];
    const seenUrls = new Set<string>();

    const addDocument = (doc: OrderDocumentItem) => {
      if (!doc.imageUrl && !doc.id) return;
      const key = (
        doc.imageUrl ? doc.imageUrl.split("?")[0].trim() : doc.id
      ).toLowerCase();
      if (key && seenUrls.has(key)) return;
      if (key) seenUrls.add(key);
      docs.push(doc);
    };

    const orderFallbackDate =
      order?.created_at || order?.date || new Date().toISOString();

    // ── 1. Admin Departure Evidence ──
    const adminDepartures: any[] =
      (depatureEvidence && Array.isArray(depatureEvidence) && depatureEvidence.length > 0
        ? depatureEvidence
        : departureEvidence && Array.isArray(departureEvidence) && departureEvidence.length > 0
        ? departureEvidence
        : Array.isArray(order?.departure_evidence)
        ? order.departure_evidence
        : []) || [];

    adminDepartures.forEach((item: any, idx: number) => {
      const url = extractItemUrl(item);
      if (!url && !item.id) return;
      const ext = getFileExtension(url) || "jpg";
      const name =
        item.name ||
        item.file_name ||
        (adminDepartures.length > 1
          ? `Order outgoing ${idx + 1}.${ext}`
          : `Order outgoing.${ext}`);

      addDocument({
        id: item.id || `admin-departure-${idx}`,
        name,
        kind: "DEPARTURE",
        source: "Admin",
        badgeLabel: "Admin Departure",
        badgeColorClass: "bg-blue-50 text-blue-600 border border-blue-200",
        imageUrl: url,
        uploadedAt: item.uploaded_at || order?.shipped_at || orderFallbackDate,
        uploadedByName: item.uploaded_by_name || "Super Admin",
        dateFormatted: formatDocumentDate(
          item.uploaded_at || order?.shipped_at || orderFallbackDate,
        ),
        extension: ext,
      });
    });

    // ── 2. Admin Delivery Evidence ──
    const adminDeliveries: any[] =
      (deliveryEvidence && Array.isArray(deliveryEvidence) && deliveryEvidence.length > 0
        ? deliveryEvidence
        : Array.isArray(order?.delivery_evidence)
        ? order.delivery_evidence
        : []) || [];

    adminDeliveries.forEach((item: any, idx: number) => {
      const url = extractItemUrl(item);
      if (!url && !item.id) return;
      const ext = getFileExtension(url) || "jpg";
      const name =
        item.name ||
        item.file_name ||
        (adminDeliveries.length > 1
          ? `Order delivered ${idx + 1}.${ext}`
          : `Order delivered.${ext}`);

      addDocument({
        id: item.id || `admin-delivery-${idx}`,
        name,
        kind: "DELIVERY",
        source: "Admin",
        badgeLabel: "Admin Delivered",
        badgeColorClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        imageUrl: url,
        uploadedAt: item.uploaded_at || order?.delivered_at || orderFallbackDate,
        uploadedByName: item.uploaded_by_name || "Super Admin",
        dateFormatted: formatDocumentDate(
          item.uploaded_at || order?.delivered_at || orderFallbackDate,
        ),
        extension: ext,
      });
    });

    // ── 3. Additional Admin Documents / Pickup Evidence ──
    const otherAdminDocs: any[] = [
      ...(Array.isArray(adminEvidence) ? adminEvidence : []),
      ...(Array.isArray(order?.pickup_evidence) ? order.pickup_evidence : []),
      ...(Array.isArray(order?.admin_documents) ? order.admin_documents : []),
      ...(Array.isArray(order?.admin_evidence) ? order.admin_evidence : []),
    ];

    otherAdminDocs.forEach((item: any, idx: number) => {
      const url = extractItemUrl(item);
      if (!url && !item.id) return;
      const ext = getFileExtension(url) || "jpg";
      const name =
        item.name || item.file_name || `Admin document ${idx + 1}.${ext}`;

      addDocument({
        id: item.id || `admin-doc-${idx}`,
        name,
        kind: "ADMIN",
        source: "Admin",
        badgeLabel: "Admin Document",
        badgeColorClass: "bg-indigo-50 text-indigo-600 border border-indigo-200",
        imageUrl: url,
        uploadedAt: item.uploaded_at || orderFallbackDate,
        uploadedByName: item.uploaded_by_name || "Admin",
        dateFormatted: formatDocumentDate(item.uploaded_at || orderFallbackDate),
        extension: ext,
      });
    });

    // ── 4. Seller Orders Documents (Departure, Delivery, Waybill, Invoice, etc.) ──
    const rawSellerOrders = Array.isArray(order?.seller_orders)
      ? order.seller_orders
      : [];

    rawSellerOrders.forEach((so: any, soIdx: number) => {
      const sellerName =
        so?.seller_name ||
        so?.store_name ||
        so?.shop_name ||
        order?.seller_name ||
        `Seller ${soIdx + 1}`;

      // Seller departure evidence
      const soDepartures: any[] = Array.isArray(so?.departure_evidence)
        ? so.departure_evidence
        : Array.isArray(so?.departure_images)
        ? so.departure_images
        : [];
      soDepartures.forEach((item: any, idx: number) => {
        const url = extractItemUrl(item);
        if (!url && !item.id) return;
        const ext = getFileExtension(url) || "jpg";
        addDocument({
          id: item.id || `seller-departure-${soIdx}-${idx}`,
          name:
            item.name ||
            item.file_name ||
            `Seller dispatch proof ${idx + 1}.${ext}`,
          kind: "SELLER",
          source: "Seller",
          badgeLabel: "Seller Departure",
          badgeColorClass: "bg-amber-50 text-amber-700 border border-amber-200",
          imageUrl: url,
          uploadedAt: item.uploaded_at || so?.shipped_at || orderFallbackDate,
          uploadedByName: item.uploaded_by_name || sellerName,
          dateFormatted: formatDocumentDate(
            item.uploaded_at || so?.shipped_at || orderFallbackDate,
          ),
          extension: ext,
        });
      });

      // Seller delivery evidence
      const soDeliveries: any[] = Array.isArray(so?.delivery_evidence)
        ? so.delivery_evidence
        : Array.isArray(so?.delivery_images)
        ? so.delivery_images
        : [];
      soDeliveries.forEach((item: any, idx: number) => {
        const url = extractItemUrl(item);
        if (!url && !item.id) return;
        const ext = getFileExtension(url) || "jpg";
        addDocument({
          id: item.id || `seller-delivery-${soIdx}-${idx}`,
          name:
            item.name ||
            item.file_name ||
            `Seller delivery proof ${idx + 1}.${ext}`,
          kind: "SELLER",
          source: "Seller",
          badgeLabel: "Seller Delivered",
          badgeColorClass: "bg-teal-50 text-teal-700 border border-teal-200",
          imageUrl: url,
          uploadedAt: item.uploaded_at || so?.delivered_at || orderFallbackDate,
          uploadedByName: item.uploaded_by_name || sellerName,
          dateFormatted: formatDocumentDate(
            item.uploaded_at || so?.delivered_at || orderFallbackDate,
          ),
          extension: ext,
        });
      });

      // Seller Waybill / tracking files
      const trackingFiles: any[] = [
        ...(Array.isArray(so?.tracking_evidence) ? so.tracking_evidence : []),
        ...(so?.waybill_document ? [so.waybill_document] : []),
        ...(so?.waybill_file ? [so.waybill_file] : []),
        ...(so?.waybill_image ? [so.waybill_image] : []),
        ...(so?.waybill_url ? [so.waybill_url] : []),
        ...(so?.waybill && typeof so.waybill === "string" ? [so.waybill] : []),
        ...(so?.waybill && typeof so.waybill === "object" ? [so.waybill] : []),
      ];
      trackingFiles.forEach((item: any, idx: number) => {
        const url = extractItemUrl(item);
        if (!url && !item?.id) return;
        const ext = getFileExtension(url) || "pdf";
        addDocument({
          id: item?.id || `seller-waybill-${soIdx}-${idx}`,
          name: item?.name || item?.file_name || `Waybill tracking.${ext}`,
          kind: "SELLER",
          source: "Seller",
          badgeLabel: "Seller Waybill",
          badgeColorClass: "bg-orange-50 text-orange-700 border border-orange-200",
          imageUrl: url,
          uploadedAt: item?.uploaded_at || so?.created_at || orderFallbackDate,
          uploadedByName: item?.uploaded_by_name || sellerName,
          dateFormatted: formatDocumentDate(
            item?.uploaded_at || so?.created_at || orderFallbackDate,
          ),
          extension: ext,
        });
      });

      // Seller Invoices / general documents
      const otherSellerDocs: any[] = [
        ...(Array.isArray(so?.documents) ? so.documents : []),
        ...(Array.isArray(so?.evidence) ? so.evidence : []),
        ...(Array.isArray(so?.attachments) ? so.attachments : []),
        ...(Array.isArray(so?.files) ? so.files : []),
        ...(so?.invoice_file ? [so.invoice_file] : []),
        ...(so?.invoice_url ? [so.invoice_url] : []),
        ...(so?.invoice && typeof so.invoice === "string" ? [so.invoice] : []),
      ];
      otherSellerDocs.forEach((item: any, idx: number) => {
        const url = extractItemUrl(item);
        if (!url && !item?.id) return;
        const ext = getFileExtension(url) || "pdf";
        addDocument({
          id: item?.id || `seller-doc-${soIdx}-${idx}`,
          name: item?.name || item?.file_name || `Seller document ${idx + 1}.${ext}`,
          kind: "SELLER",
          source: "Seller",
          badgeLabel: "Seller Document",
          badgeColorClass: "bg-orange-50 text-orange-700 border border-orange-200",
          imageUrl: url,
          uploadedAt: item?.uploaded_at || so?.created_at || orderFallbackDate,
          uploadedByName: item?.uploaded_by_name || sellerName,
          dateFormatted: formatDocumentDate(
            item?.uploaded_at || so?.created_at || orderFallbackDate,
          ),
          extension: ext,
        });
      });
    });

    // Additional seller evidence passed via prop or order
    const extraSellerEvidence: any[] = [
      ...(Array.isArray(sellerEvidence) ? sellerEvidence : []),
      ...(Array.isArray(order?.seller_documents) ? order.seller_documents : []),
      ...(Array.isArray(order?.seller_evidence) ? order.seller_evidence : []),
    ];
    extraSellerEvidence.forEach((item: any, idx: number) => {
      const url = extractItemUrl(item);
      if (!url && !item?.id) return;
      const ext = getFileExtension(url) || "jpg";
      addDocument({
        id: item?.id || `extra-seller-doc-${idx}`,
        name: item?.name || item?.file_name || `Seller evidence ${idx + 1}.${ext}`,
        kind: "SELLER",
        source: "Seller",
        badgeLabel: "Seller Document",
        badgeColorClass: "bg-orange-50 text-orange-700 border border-orange-200",
        imageUrl: url,
        uploadedAt: item?.uploaded_at || orderFallbackDate,
        uploadedByName: item?.uploaded_by_name || "Seller",
        dateFormatted: formatDocumentDate(item?.uploaded_at || orderFallbackDate),
        extension: ext,
      });
    });

    // ── 5. Buyer Dispute Documents & Evidence ──
    const allDisputesList: any[] = [
      ...(Array.isArray(disputes) ? disputes : []),
      ...(Array.isArray(order?.disputes) ? order.disputes : []),
      ...(Array.isArray(order?.dispute_list) ? order.dispute_list : []),
      ...(Array.isArray(order?.order_disputes) ? order.order_disputes : []),
      ...(order?.dispute ? [order.dispute] : []),
      ...(Array.isArray(order?.refunds) ? order.refunds : []),
      ...(Array.isArray(order?.returns) ? order.returns : []),
      ...(Array.isArray(order?.items)
        ? order.items.flatMap((it: any) =>
            Array.isArray(it?.disputes)
              ? it.disputes
              : it?.dispute
                ? [it.dispute]
                : [],
          )
        : []),
      ...rawSellerOrders.flatMap((so: any) =>
        Array.isArray(so?.disputes)
          ? so.disputes
          : so?.dispute
            ? [so.dispute]
            : Array.isArray(so?.items)
              ? so.items.flatMap((it: any) =>
                  Array.isArray(it?.disputes)
                    ? it.disputes
                    : it?.dispute
                      ? [it.dispute]
                      : [],
                )
              : [],
      ),
    ].filter(Boolean);

    allDisputesList.forEach((disp: any, dispIdx: number) => {
      const buyerName =
        disp?.created_by_name ||
        disp?.buyer_name ||
        (disp?.buyer
          ? `${disp.buyer.first_name ?? ""} ${disp.buyer.last_name ?? ""}`.trim()
          : "") ||
        order?.buyer_name ||
        (order?.buyer
          ? `${order.buyer.first_name ?? ""} ${order.buyer.last_name ?? ""}`.trim()
          : "") ||
        "Buyer";

      const dispDate =
        disp?.created_at || disp?.date || orderFallbackDate;

      // Extract all evidence formats from dispute
      const dispEvidences: any[] = [
        ...(Array.isArray(disp?.evidence) ? disp.evidence : []),
        ...(Array.isArray(disp?.evidence_images) ? disp.evidence_images : []),
        ...(Array.isArray(disp?.evidence_files) ? disp.evidence_files : []),
        ...(Array.isArray(disp?.images) ? disp.images : []),
        ...(Array.isArray(disp?.files) ? disp.files : []),
        ...(Array.isArray(disp?.documents) ? disp.documents : []),
        ...(Array.isArray(disp?.attachments) ? disp.attachments : []),
        ...(Array.isArray(disp?.return_evidence) ? disp.return_evidence : []),
      ];

      dispEvidences.forEach((item: any, evIdx: number) => {
        const url = extractItemUrl(item);
        if (!url && !item?.id) return;
        const ext = getFileExtension(url) || "jpg";
        const name =
          item?.name ||
          item?.file_name ||
          item?.title ||
          (dispEvidences.length > 1
            ? `Dispute evidence ${evIdx + 1}.${ext}`
            : `Dispute evidence.${ext}`);

        addDocument({
          id: item?.id || `dispute-${dispIdx}-ev-${evIdx}`,
          name,
          kind: "DISPUTE",
          source: "Buyer (Dispute)",
          badgeLabel: "Buyer Dispute",
          badgeColorClass: "bg-red-50 text-[#CA0202] border border-red-200",
          imageUrl: url,
          uploadedAt: item?.uploaded_at || dispDate,
          uploadedByName: item?.uploaded_by_name || buyerName,
          dateFormatted: formatDocumentDate(item?.uploaded_at || dispDate),
          extension: ext,
          description: disp?.reason || disp?.description || "Dispute evidence",
        });
      });
    });

    // Standalone dispute evidence passed via prop
    if (Array.isArray(disputeEvidence)) {
      disputeEvidence.forEach((item: any, idx: number) => {
        const url = extractItemUrl(item);
        if (!url && !item?.id) return;
        const ext = getFileExtension(url) || "jpg";
        addDocument({
          id: item?.id || `prop-dispute-ev-${idx}`,
          name:
            item?.name ||
            item?.file_name ||
            `Dispute evidence ${idx + 1}.${ext}`,
          kind: "DISPUTE",
          source: "Buyer (Dispute)",
          badgeLabel: "Buyer Dispute",
          badgeColorClass: "bg-red-50 text-[#CA0202] border border-red-200",
          imageUrl: url,
          uploadedAt: item?.uploaded_at || orderFallbackDate,
          uploadedByName: item?.uploaded_by_name || "Buyer",
          dateFormatted: formatDocumentDate(item?.uploaded_at || orderFallbackDate),
          extension: ext,
        });
      });
    }

    // ── 6. General Order Documents ──
    const generalDocs: any[] = [
      ...(Array.isArray(order?.documents) ? order.documents : []),
      ...(Array.isArray(order?.attachments) ? order.attachments : []),
      ...(Array.isArray(order?.files) ? order.files : []),
      ...(Array.isArray(order?.evidence) ? order.evidence : []),
    ];

    generalDocs.forEach((item: any, idx: number) => {
      const url = extractItemUrl(item);
      if (!url && !item?.id) return;
      const ext = getFileExtension(url) || "jpg";
      addDocument({
        id: item?.id || `order-doc-${idx}`,
        name: item?.name || item?.file_name || `Order document ${idx + 1}.${ext}`,
        kind: "GENERAL",
        source: "Order",
        badgeLabel: "Order Document",
        badgeColorClass: "bg-gray-50 text-gray-700 border border-gray-200",
        imageUrl: url,
        uploadedAt: item?.uploaded_at || orderFallbackDate,
        uploadedByName: item?.uploaded_by_name || "System",
        dateFormatted: formatDocumentDate(item?.uploaded_at || orderFallbackDate),
        extension: ext,
      });
    });

    return docs;
  }, [
    order,
    depatureEvidence,
    departureEvidence,
    deliveryEvidence,
    disputes,
    disputeEvidence,
    sellerEvidence,
    adminEvidence,
  ]);

  // Counts by filter
  const counts = useMemo(() => {
    return {
      all: allDocuments.length,
      admin: allDocuments.filter(
        (d) => d.kind === "DEPARTURE" || d.kind === "DELIVERY" || d.kind === "ADMIN",
      ).length,
      seller: allDocuments.filter((d) => d.kind === "SELLER").length,
      dispute: allDocuments.filter((d) => d.kind === "DISPUTE").length,
    };
  }, [allDocuments]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    if (activeFilter === "ALL") return allDocuments;
    if (activeFilter === "ADMIN")
      return allDocuments.filter(
        (d) =>
          d.kind === "DEPARTURE" || d.kind === "DELIVERY" || d.kind === "ADMIN",
      );
    if (activeFilter === "SELLER")
      return allDocuments.filter((d) => d.kind === "SELLER");
    if (activeFilter === "DISPUTE")
      return allDocuments.filter((d) => d.kind === "DISPUTE");
    return allDocuments;
  }, [allDocuments, activeFilter]);

  const hasMultipleCategories =
    (counts.admin > 0 ? 1 : 0) +
      (counts.seller > 0 ? 1 : 0) +
      (counts.dispute > 0 ? 1 : 0) >
    1;

  return (
    <>
      <div
        className={`w-full lg:w-[344px] xl:w-[344px] flex-shrink-0 rounded-c16 py-6 px-6 sm:px-8 bg-ffffff border border-000000/4 shadow-sm ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-MontserratNormal text-000000/68 leading-[21px] tracking-[1%]">
            {title}
          </h3>
        
        </div>

        {/* Optional Filter Tabs when documents come from multiple sources */}
        {hasMultipleCategories && (
          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar text-c10 font-MontserratMedium">
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === "ALL"
                  ? "bg-[#161616] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({counts.all})
            </button>
            {counts.admin > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter("ADMIN")}
                className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === "ADMIN"
                    ? "bg-[#161616] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Admin ({counts.admin})
              </button>
            )}
            {counts.seller > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter("SELLER")}
                className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === "SELLER"
                    ? "bg-[#161616] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Seller ({counts.seller})
              </button>
            )}
            {counts.dispute > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter("DISPUTE")}
                className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === "DISPUTE"
                    ? "bg-[#161616] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Dispute ({counts.dispute})
              </button>
            )}
          </div>
        )}

        {filteredDocuments.length > 0 ? (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5 custom-scroll">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-3 py-2 border-[0.5px] border-000000/12 rounded-c8 min-h-[56px] bg-white hover:border-[#D0D5DD] transition-colors gap-2"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <DocumentFileIcon type={doc.extension} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p
                        className="text-xs font-MontserratNormal leading-[18px] text-000000/80 truncate max-w-[130px] sm:max-w-[150px]"
                        title={doc.name}
                      >
                        {doc.name}
                      </p>
                   
                    </div>
                    <div className="flex items-center gap-1.5 text-c10 font-MontserratNormal text-000000/68 leading-[16px]">
                      <span>{doc.dateFormatted}</span>
                     
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="text-c10 font-MontserratMedium text-[#FF6D5B] hover:text-[#e05a49] hover:underline cursor-pointer flex-shrink-0 px-1 py-1"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs font-MontserratNormal text-gray-400">
            No documents available
          </div>
        )}
      </div>

      {/* ── Document View Modal ── */}
      <AnimatePresence>
        {selectedDoc && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className="text-sm font-MontserratMedium text-gray-900 truncate max-w-[340px]"
                      title={selectedDoc.name}
                    >
                      {selectedDoc.name}
                    </h4>
                    <span
                      className={`text-[10px] font-MontserratMedium px-2 py-0.5 rounded-full ${selectedDoc.badgeColorClass}`}
                    >
                      {selectedDoc.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-MontserratNormal mt-1">
                    Uploaded: {selectedDoc.dateFormatted}
                    {selectedDoc.uploadedByName
                      ? ` by ${selectedDoc.uploadedByName}`
                      : ` (${selectedDoc.source})`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Preview Body */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-2 min-h-[220px]">
                {selectedDoc.imageUrl ? (
                  isPdfExtension(selectedDoc.extension) ? (
                    <div className="w-full h-[60vh] flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <iframe
                        src={selectedDoc.imageUrl}
                        title={selectedDoc.name}
                        className="w-full h-full rounded border-0"
                      />
                    </div>
                  ) : isImageExtension(selectedDoc.extension) ? (
                    <img
                      src={selectedDoc.imageUrl}
                      alt={selectedDoc.name}
                      className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-gray-50 rounded-xl border border-gray-200 w-full">
                      <FileText className="w-12 h-12 text-[#FF6D5B]" />
                      <p className="text-sm font-MontserratMedium text-gray-800">
                        {selectedDoc.name}
                      </p>
                      <p className="text-xs text-gray-500 font-MontserratNormal">
                        Preview not directly supported in-browser for .{selectedDoc.extension.toUpperCase()} files.
                      </p>
                      <a
                        href={selectedDoc.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#FF715B] text-white text-xs font-MontserratMedium rounded-lg hover:bg-[#e05a49] transition-colors inline-flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download / Open File
                      </a>
                    </div>
                  )
                ) : (
                  <p className="text-sm font-MontserratNormal text-gray-400">
                    Preview not available
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 flex-wrap gap-2">
                {selectedDoc.imageUrl ? (
                  <div className="flex items-center gap-4">
                    <a
                      href={selectedDoc.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-MontserratMedium text-[#FF6D5B] hover:text-[#e05a49] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open file in new tab
                    </a>
                    <a
                      href={selectedDoc.imageUrl}
                      download={selectedDoc.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-MontserratMedium text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-MontserratMedium rounded-lg transition-colors cursor-pointer ml-auto"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
