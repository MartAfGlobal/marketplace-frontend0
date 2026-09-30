"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";

const REPORTS = "/reports/admin";

type Query = Record<string, string | number | undefined | null>;

const toQueryString = (query: Query = {}) => {
  const parts = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

/**
 * Admin Reports endpoints. Callback-based, same convention as
 * helpers/admin/financeHelper.ts -- each report section owns its own data,
 * nothing here needs to live in the redux store.
 *
 * Most sections' KPIs/tables come from the ALREADY-EXISTING admin
 * endpoints for that domain (Orders, Finance, Products, Refunds,
 * Disputes) rather than a reports-only duplicate -- `getAbsolute` hits
 * those directly by their own full path. Only the genuine gaps (Sellers
 * leaderboard, Buyers segmentation, Admin Staff ranking, Products
 * top-selling/no-sales, Refunds/Disputes breakdowns, Marketplace
 * Operations, Activity Log, Audits, payment-method breakdown) live under
 * /reports/admin/ itself.
 */
export const ReportsDetails = () => {
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();

  // The 4th param is an ERROR callback, fired only when the request actually
  // fails -- every call site in every report section passes something like
  // `() => setXError(true)` here, expecting exactly that. It used to be
  // named `onDone` and fired unconditionally (after onData on success, AND
  // on failure), which meant every successful summary/stats fetch flipped
  // its own error flag straight back to true a moment after loading real
  // data, permanently stuck showing "Something went wrong" even though the
  // request succeeded (confirmed via the server's access log: 200 on every
  // one of these calls, no backend error at all -- this was 100% here).
  const getAbsolute = <T,>(path: string, query: Query | undefined, onData: (data: T) => void, onError?: () => void) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${path}${toQueryString(query)}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (res: any) => onData(res?.data as T),
      errorRes: () => onError?.(),
    });
  };

  const get = <T,>(path: string, query: Query | undefined, onData: (data: T) => void, onError?: () => void) =>
    getAbsolute<T>(`${REPORTS}/${path}`, query, onData, onError);

  const post = (path: string, body: unknown, onSuccess?: (data: any) => void) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${REPORTS}/${path}`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body,
      },
      successRes: (res: any) => onSuccess?.(res?.data),
    });
  };

  return {
    loading,
    getAbsolute,

    // Sales & Orders (table reused from order app directly; KPIs are a gap fill)
    fetchSalesSummary: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("sales/summary/", query, cb, done),
    fetchSalesTrend: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("sales/trend/", query, cb, done),

    // Sellers
    fetchSellerSummary: (cb: (d: any) => void, done?: () => void) =>
      get("sellers/summary/", undefined, cb, done),
    fetchSellerPerformance: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("sellers/performance/", query, cb, done),

    // Buyers
    fetchBuyerSummary: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("buyers/summary/", query, cb, done),
    fetchBuyerTrend: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("buyers/trend/", query, cb, done),
    fetchBuyers: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("buyers/", query, cb, done),

    // Products & Inventory (gaps only -- list/dashboard-stats reused from products app directly)
    fetchProductInventorySummary: (cb: (d: any) => void, done?: () => void) =>
      get("products/summary/", undefined, cb, done),
    fetchProductPerformance: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("products/performance/", query, cb, done),

    // Admin Staff
    fetchStaffSummary: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("staff/summary/", query, cb, done),
    fetchStaffActivity: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("staff/activity/", query, cb, done),

    // Refunds & Disputes
    fetchRefundBreakdown: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("refunds/breakdown/", query, cb, done),
    fetchDisputeBreakdown: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("disputes/breakdown/", query, cb, done),

    // Marketplace Operations
    fetchDeliveryPerformance: (cb: (d: any) => void, done?: () => void) =>
      get("operations/delivery-performance/", undefined, cb, done),
    fetchOperationalAlerts: (cb: (d: any) => void, done?: () => void) =>
      get("operations/alerts/", undefined, cb, done),
    markAlertReviewed: (alertKey: string, cb?: (d: any) => void) =>
      post("operations/alerts/mark-reviewed/", { alert_key: alertKey }, cb),

    // Activity Log
    fetchActivitySummary: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("activity/summary/", query, cb, done),
    fetchActivityTrend: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("activity/trend/", query, cb, done),
    fetchActivityList: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("activity/", query, cb, done),

    // Payments (gaps only -- transactions table reused from commission app directly)
    fetchPaymentsOverview: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("payments/overview/", query, cb, done),
    fetchPaymentMethodBreakdown: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("payments/method-breakdown/", query, cb, done),

    // Audits
    fetchAuditSummary: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("audits/summary/", query, cb, done),
    fetchAudits: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("audits/", query, cb, done),
    fetchAuditDetail: (id: string, cb: (d: any) => void, done?: () => void) =>
      get(`audits/${id}/`, undefined, cb, done),
    createAudit: (formData: FormData, onSuccess: (d: any) => void, onError?: (err: any) => void) => {
      if (!token) return;
      sendHttpRequest({
        requestConfig: {
          url: `${REPORTS}/audits/`,
          method: "POST",
          token,
          isAuth: true,
          userType: "admin",
          body: formData,
        },
        successRes: (res: any) => onSuccess(res?.data),
        errorRes: onError,
      });
    },
  };
};
