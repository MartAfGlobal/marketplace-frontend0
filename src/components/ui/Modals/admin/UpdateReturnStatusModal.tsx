"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, Check, ChevronDown, AlertCircle } from "lucide-react";
import CheckBoxButton from "@/components/ui/Button/checkBoxButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { toast } from "sonner";

export type ReturnActionType =
  | "MARK_RETURN_RECEIVED"
  | "APPROVE_RETURN"
  | "REJECT_RETURN";

export interface CancellationReason {
  id: string;
  title: string;
  code: string;
  requires_additional_info?: boolean;
}

export const RETURN_ACTIONS: {
  value: ReturnActionType;
  label: string;
  description: string;
}[] = [
  {
    value: "APPROVE_RETURN",
    label: "Approve Return",
    description: "Approve return request for this dispute",
  },
  {
    value: "REJECT_RETURN",
    label: "Reject Return",
    description: "Reject return dispute with a valid cancellation reason",
  },
  {
    value: "MARK_RETURN_RECEIVED",
    label: "Received at Warehouse",
    description: "Mark item in transit as received and record inspection",
  },
];

interface UpdateReturnStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  disputeId: string;
  currentDisputeStatus?: string;
  defaultAction?: ReturnActionType;
  defaultResolutionType?: "FULL_REFUND" | "PARTIAL_REFUND";
  initialTrackingNumber?: string;
  initialAmount?: string | number;
  onSuccess?: (message?: string) => void;
}

export default function UpdateReturnStatusModal({
  isOpen,
  onClose,
  disputeId,
  currentDisputeStatus = "Pending",
  defaultAction,
  defaultResolutionType = "FULL_REFUND",
  initialTrackingNumber = "",
  initialAmount = "",
  onSuccess,
}: UpdateReturnStatusModalProps) {
  const token = useSelector((state: RootState) => state.token.token);
  const {
    approveAdminDispute,
    rejectAdminDispute,
    markAdminReturnReceived,
  } = AdminDetails();

  const { sendHttpRequest: fetchReasonsReq, loading: loadingReasons } =
    useHttp();

  // Status Stage Detection
  const statusUpper = (currentDisputeStatus || "").toUpperCase();
  const isApproved =
    statusUpper.includes("APPROV") ||
    statusUpper.includes("IN_TRANSIT") ||
    statusUpper.includes("ITEM_RETURNED") ||
    statusUpper.includes("RETURN_APPROVED") ||
    statusUpper.includes("RECEIVED");
  const isRejected =
    statusUpper.includes("REJECT") ||
    statusUpper.includes("DECLIN") ||
    statusUpper.includes("CANCEL");
  const isRequested = !isApproved && !isRejected;

  // Compute Initial Action based on status
  const computedDefaultAction: ReturnActionType = defaultAction
    ? defaultAction
    : isApproved
      ? "MARK_RETURN_RECEIVED"
      : "APPROVE_RETURN";

  // Selected Action State
  const [selectedAction, setSelectedAction] =
    useState<ReturnActionType>(computedDefaultAction);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  // Form Fields: Mark Received
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [inspectionPassed, setInspectionPassed] = useState(true);
  const [inspectionNotes, setInspectionNotes] = useState(
    "Item matches description, undamaged."
  );

  // Form Fields: Approve Return
  const [resolutionType, setResolutionType] = useState<
    "FULL_REFUND" | "PARTIAL_REFUND"
  >(defaultResolutionType);
  const [approvedAmount, setApprovedAmount] = useState<string>(
    initialAmount ? String(initialAmount) : ""
  );
  const [adminNotes, setAdminNotes] = useState(
    "Approved after reviewing evidence"
  );

  // Form Fields: Reject Return
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [selectedReason, setSelectedReason] =
    useState<CancellationReason | null>(null);
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const reasonDropdownRef = useRef<HTMLDivElement>(null);
  const [rejectionNotes, setRejectionNotes] = useState("");

  // Confirmation & Loading
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync props on open
  useEffect(() => {
    if (isOpen) {
      const initialAct = defaultAction
        ? defaultAction
        : isApproved
          ? "MARK_RETURN_RECEIVED"
          : "APPROVE_RETURN";
      setSelectedAction(initialAct);
      setResolutionType(defaultResolutionType);
      setTrackingNumber(initialTrackingNumber);
      if (initialAmount) {
        setApprovedAmount(String(initialAmount));
      }
      setConfirmed(false);
      setIsActionDropdownOpen(false);
      setIsReasonDropdownOpen(false);
    }
  }, [
    isOpen,
    defaultAction,
    defaultResolutionType,
    initialTrackingNumber,
    initialAmount,
    isApproved,
  ]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(event.target as Node)
      ) {
        setIsActionDropdownOpen(false);
      }
      if (
        reasonDropdownRef.current &&
        !reasonDropdownRef.current.contains(event.target as Node)
      ) {
        setIsReasonDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cancellation reasons when reject action is chosen or dropdown opened
  const fetchReasons = () => {
    if (!token) return;
    if (reasons.length > 0) {
      setIsReasonDropdownOpen((p) => !p);
      return;
    }
    fetchReasonsReq({
      requestConfig: {
        url: "/cancellation/reasons/for_admin",
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (res: any) => {
        const list: CancellationReason[] = res?.data ?? res ?? [];
        setReasons(list);
        setIsReasonDropdownOpen(true);
      },
      errorRes: () => {
        toast.error("Failed to load cancellation reasons.");
      },
    });
  };

  // Check if an action option is disabled given current dispute status
  const getActionState = (
    actionVal: ReturnActionType
  ): { isDisabled: boolean; reason?: string } => {
    if (actionVal === "MARK_RETURN_RECEIVED") {
      if (isRequested) {
        return {
          isDisabled: true,
          reason: "Approve or reject request first",
        };
      }
      if (isRejected) {
        return { isDisabled: true, reason: "Return was rejected" };
      }
      return { isDisabled: false };
    }

    if (actionVal === "APPROVE_RETURN") {
      if (isApproved) {
        return { isDisabled: true, reason: "Already approved" };
      }
      if (isRejected) {
        return { isDisabled: true, reason: "Return was rejected" };
      }
      return { isDisabled: false };
    }

    if (actionVal === "REJECT_RETURN") {
      if (isApproved) {
        return { isDisabled: true, reason: "Already approved" };
      }
      if (isRejected) {
        return { isDisabled: true, reason: "Already rejected" };
      }
      return { isDisabled: false };
    }

    return { isDisabled: false };
  };

  // Validation
  const isSubmitDisabled = () => {
    if (!disputeId) return true;
    if (selectedAction === "MARK_RETURN_RECEIVED") {
      return !trackingNumber.trim();
    }
    if (selectedAction === "APPROVE_RETURN") {
      if (!resolutionType) return true;
      if (
        resolutionType === "PARTIAL_REFUND" &&
        (!approvedAmount ||
          isNaN(Number(approvedAmount)) ||
          Number(approvedAmount) <= 0)
      ) {
        return true;
      }
      return false;
    }
    if (selectedAction === "REJECT_RETURN") {
      return !selectedReason?.id;
    }
    return false;
  };

  const handleSubmit = () => {
    if (!disputeId) {
      toast.error("Dispute ID not found.");
      return;
    }
    setLoading(true);

    if (selectedAction === "MARK_RETURN_RECEIVED") {
      markAdminReturnReceived(
        disputeId,
        {
          tracking_number: trackingNumber.trim(),
          inspection_passed: inspectionPassed,
          inspection_notes: inspectionNotes.trim() || undefined,
        },
        () => {
          setLoading(false);
          onSuccess?.("Return marked as received at warehouse successfully.");
          onClose();
        },
        (err: any) => {
          setLoading(false);
          console.error("mark received error:", err);
          const msg =
            err?.message ||
            err?.data?.message ||
            err?.data?.detail ||
            "Failed to mark return as received.";
          toast.error(msg);
        }
      );
    } else if (selectedAction === "APPROVE_RETURN") {
      approveAdminDispute(
        disputeId,
        {
          resolution_type: resolutionType,
          approved_amount: approvedAmount
            ? Number(approvedAmount).toFixed(2)
            : undefined,
          admin_notes: adminNotes.trim() || undefined,
        },
        () => {
          setLoading(false);
          onSuccess?.("Return approved successfully.");
          onClose();
        },
        (err: any) => {
          setLoading(false);
          console.error("approve dispute error:", err);
          if (err?.status === 403 || err?.response?.status === 403) {
            toast.error(
              "Permission denied: Only super-admins can approve return disputes."
            );
          } else {
            const msg =
              err?.message ||
              err?.data?.message ||
              err?.data?.detail ||
              "Failed to approve return dispute.";
            toast.error(msg);
          }
        }
      );
    } else if (selectedAction === "REJECT_RETURN") {
      if (!selectedReason?.id) {
        setLoading(false);
        toast.error("Please select a rejection reason.");
        return;
      }

      rejectAdminDispute(
        disputeId,
        {
          rejection_reason: selectedReason.id,
          rejection_notes: rejectionNotes.trim() || undefined,
        },
        () => {
          setLoading(false);
          toast.success("Return request rejected successfully.");
          onSuccess?.("Return request rejected successfully.");
          onClose();
        },
        (err: any) => {
          setLoading(false);
          console.error("reject dispute error:", err);
          if (err?.status === 403 || err?.response?.status === 403) {
            toast.error(
              "Permission denied: Only super-admins can reject return disputes."
            );
          } else {
            const msg =
              err?.message ||
              err?.data?.message ||
              err?.data?.detail ||
              "Failed to reject return dispute.";
            toast.error(msg);
          }
        }
      );
    }
  };

  const currentActionOption = RETURN_ACTIONS.find(
    (item) => item.value === selectedAction
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-xl flex flex-col w-full max-w-[595px] rounded-2xl p-6 sm:p-10 relative max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-lg font-MontserratMedium leading-[26px] mb-2 text-[#161616]">
                  Update Return Status
                </h2>
                <p className="text-xs font-MontserratNormal text-[#000000]/68 leading-[16px]">
                  {isRequested
                    ? "This return is currently on request. You must approve or reject it before receiving items at the warehouse."
                    : "Update the return dispute status and proceed to warehouse processing."}
                </p>
              </div>

              {/* Action Selection + Alert — 2-column row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 items-start">
                {/* Action Dropdown */}
                <div className="relative" ref={actionDropdownRef}>
                  <label className="block text-xs font-MontserratMedium text-[#000000]/68 mb-2">
                    Select Action
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsActionDropdownOpen((prev) => !prev)}
                    className={`w-full h-12 bg-white border rounded-lg px-4 flex items-center justify-between text-sm font-MontserratNormal transition-colors cursor-pointer ${
                      isActionDropdownOpen
                        ? "border-[#FF6D5B] ring-1 ring-[#FF6D5B]"
                        : "border-[#eef0f3] hover:border-[#FF6D5B]/60"
                    }`}
                  >
                    <span
                      className={
                        currentActionOption
                          ? "text-[#161616] font-MontserratMedium"
                          : "text-[#000000]/40"
                      }
                    >
                      {currentActionOption?.label || "Select action"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#000000]/56 transition-transform duration-200 ${
                        isActionDropdownOpen ? "rotate-180 text-[#FF6D5B]" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isActionDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#eef0f3] rounded-lg shadow-lg z-50 overflow-hidden py-1"
                      >
                        {RETURN_ACTIONS.map((action) => {
                          const isSelected = selectedAction === action.value;
                          const { isDisabled, reason } = getActionState(
                            action.value
                          );

                          return (
                            <button
                              key={action.value}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedAction(action.value);
                                  setIsActionDropdownOpen(false);
                                }
                              }}
                              className={`w-full px-4 py-3 text-left text-sm font-MontserratMedium flex items-center justify-between transition-colors ${
                                isDisabled
                                  ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                                  : isSelected
                                    ? "bg-[#FF6D5B]/10 text-[#FF6D5B] cursor-pointer"
                                    : "text-[#000000]/80 hover:bg-gray-50 cursor-pointer"
                              }`}
                            >
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span>{action.label}</span>
                                  {reason && (
                                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-MontserratNormal">
                                      {reason}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] font-MontserratNormal text-gray-500">
                                  {action.description}
                                </span>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#FF6D5B] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Conditional Alert — right column */}
                {selectedAction === "APPROVE_RETURN" && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-xs font-MontserratNormal h-fit mt-5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                    <span>This action is super-admin-only.</span>
                  </div>
                )}
                {selectedAction === "REJECT_RETURN" && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-[#CA0202] text-xs font-MontserratNormal h-fit mt-5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#CA0202]" />
                    <span>
                      Rejecting a return dispute is super-admin-only. Please select a cancellation reason.
                    </span>
                  </div>
                )}
              </div>

              {/* ── Sub-forms based on selected action ── */}

              {/* 1. APPROVE_RETURN Form */}
              {selectedAction === "APPROVE_RETURN" && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Resolution Type */}
                    <div>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-2">
                        Resolution Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-6 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setResolutionType("FULL_REFUND");
                            if (initialAmount) setApprovedAmount(String(initialAmount));
                          }}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <span
                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                              resolutionType === "FULL_REFUND"
                                ? "border-[#FF6D5B]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {resolutionType === "FULL_REFUND" && (
                              <span className="w-2.5 h-2.5 bg-[#FF6D5B] rounded-full" />
                            )}
                          </span>
                          <span className="text-xs font-MontserratMedium text-[#161616]">
                            Full refund
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setResolutionType("PARTIAL_REFUND")}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <span
                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                              resolutionType === "PARTIAL_REFUND"
                                ? "border-[#FF6D5B]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {resolutionType === "PARTIAL_REFUND" && (
                              <span className="w-2.5 h-2.5 bg-[#FF6D5B] rounded-full" />
                            )}
                          </span>
                          <span className="text-xs font-MontserratMedium text-[#161616]">
                            Partial refund
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Approved Amount */}
                    <div>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-1.5">
                        Approved Amount (₦){" "}
                        {resolutionType === "PARTIAL_REFUND" && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                        placeholder="e.g. 5000.00"
                        className="w-full h-11 px-3.5 bg-white border border-gray-200 rounded-lg text-xs font-MontserratMedium text-[#161616] focus:outline-none focus:border-[#FF6D5B]"
                      />
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-1.5">
                        Admin Notes
                      </label>
                      <textarea
                        rows={2}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Approved after reviewing evidence"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-MontserratNormal text-gray-700 focus:outline-none focus:border-[#FF6D5B] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. REJECT_RETURN Form */}
              {selectedAction === "REJECT_RETURN" && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rejection Reason */}
                    <div className="relative" ref={reasonDropdownRef}>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-1.5">
                        Rejection Reason <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={fetchReasons}
                        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 h-11 text-xs text-gray-900 focus:border-[#FF6D5B] focus:outline-none cursor-pointer"
                      >
                        <span className="font-MontserratMedium text-left truncate">
                          {selectedReason?.title || "Select a rejection reason"}
                        </span>
                        {loadingReasons ? (
                          <LoadingSpinner color="border-[#FF6D5B]" size={16} />
                        ) : (
                          <ChevronDown
                            size={16}
                            className={`transition-transform text-gray-500 ${
                              isReasonDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {isReasonDropdownOpen && reasons.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 mt-1.5 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl divide-y divide-gray-50"
                          >
                            {reasons.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedReason(item);
                                  setIsReasonDropdownOpen(false);
                                }}
                                className={`block w-full px-3.5 py-2.5 font-MontserratMedium text-left text-xs transition-colors cursor-pointer ${
                                  selectedReason?.id === item.id
                                    ? "bg-orange-50 text-[#FF6D5B]"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {item.title}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-1.5">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={rejectionNotes}
                        onChange={(e) => setRejectionNotes(e.target.value)}
                        placeholder="Add any internal notes regarding this rejection..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-MontserratNormal text-gray-700 focus:outline-none focus:border-[#FF6D5B] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MARK_RETURN_RECEIVED Form */}
              {selectedAction === "MARK_RETURN_RECEIVED" && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tracking Number */}
                    <div>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-1.5">
                        Tracking Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. NGN4829424982"
                        className="w-full h-11 px-3.5 bg-white border border-gray-200 rounded-lg text-xs font-MontserratMedium text-[#161616] focus:outline-none focus:border-[#FF6D5B]"
                      />
                    </div>

                    {/* Inspection Result */}
                    <div>
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-2">
                        Inspection Result
                      </label>
                      <div className="flex items-center gap-6 mt-1">
                        <button
                          type="button"
                          onClick={() => setInspectionPassed(true)}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <span
                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                              inspectionPassed
                                ? "border-[#FF6D5B]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {inspectionPassed && (
                              <span className="w-2.5 h-2.5 bg-[#FF6D5B] rounded-full" />
                            )}
                          </span>
                          <span className="text-xs font-MontserratMedium text-[#2D7565]">
                            Passed
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInspectionPassed(false)}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <span
                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                              !inspectionPassed
                                ? "border-[#FF6D5B]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {!inspectionPassed && (
                              <span className="w-2.5 h-2.5 bg-[#FF6D5B] rounded-full" />
                            )}
                          </span>
                          <span className="text-xs font-MontserratMedium text-[#CA0202]">
                            Failed
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Inspection Notes — full width */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-MontserratMedium text-[#000000]/70 mb-1.5">
                        Inspection Notes
                      </label>
                      <textarea
                        rows={2}
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
                        placeholder="Item matches description, undamaged."
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-MontserratNormal text-gray-700 focus:outline-none focus:border-[#FF6D5B] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 mb-8">
                <div className="mt-0.5 shrink-0">
                  <CheckBoxButton
                    checked={confirmed}
                    onChange={(checked) => setConfirmed(checked)}
                  />
                </div>
                <p
                  className="text-xs font-MontserratNormal text-[#000000]/68 cursor-pointer leading-relaxed select-none"
                  onClick={() => setConfirmed((prev) => !prev)}
                >
                  I confirm that the selected return status and details are correct and should be applied.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  variant="secondary"
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!confirmed || isSubmitDisabled() || loading}
                  variant="primary"
                  className="w-1/2 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : "Update Status"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
