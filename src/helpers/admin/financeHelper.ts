"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";

const FINANCE = "/commission/admin/finance";

type Query = Record<string, string | number | undefined | null>;

const toQueryString = (query: Query = {}) => {
  const parts = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

/**
 * Admin Finance endpoints. Callback-based on purpose: every Finance screen
 * owns its own data (filters differ per screen and nothing is shared between
 * them), so nothing here needs to live in the redux store.
 */
export const FinanceDetails = () => {
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();

  const get = <T,>(path: string, query: Query | undefined, onData: (data: T) => void, onDone?: () => void) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${FINANCE}/${path}${toQueryString(query)}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (res: any) => {
        onData(res?.data as T);
        onDone?.();
      },
      errorRes: () => onDone?.(),
    });
  };

  const send = (
    method: "POST" | "PATCH" | "DELETE",
    path: string,
    body: unknown,
    onSuccess?: (data: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${FINANCE}/${path}`,
        method,
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
    // Overview
    fetchFinanceDashboard: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("overview/dashboard/", query, cb, done),
    // Escrow release (the payout sweep, on demand)
    fetchEscrow: (query: Query, cb: (d: any) => void, done?: () => void) => get("payouts/escrow/", query, cb, done),
    releaseAllEscrow: (cb: (d: any) => void) => send("POST", "payouts/escrow/release/", undefined, cb),
    releaseSellerEscrow: (manufacturerId: number, cb: (d: any) => void) =>
      send("POST", `payouts/sellers/${manufacturerId}/trigger/`, undefined, cb),
    releaseOrderEscrow: (orderId: string, cb: (d: any) => void) =>
      send("POST", `payouts/escrow/${orderId}/release/`, undefined, cb),
    // Martaf earnings (service fee, costs, net profit)
    fetchEarnings: (query: Query, cb: (d: any) => void, done?: () => void) => get("earnings/", query, cb, done),
    fetchEarningsEntries: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("earnings/entries/", query, cb, done),
    // Transactions
    fetchTransactions: (query: Query, cb: (d: any) => void, done?: () => void) => get("transactions/", query, cb, done),
    fetchMoneyFlow: (query: Query, cb: (d: any) => void) => get("transactions/money-flow/", query, cb),
    fetchTransactionDetail: (transactionId: string, cb: (d: any) => void, done?: () => void) =>
      get(`transactions/${transactionId}/`, undefined, cb, done),
    // Payouts
    fetchPayouts: (query: Query, cb: (d: any) => void, done?: () => void) =>
      get("payouts/withdrawals/", query, cb, done),
    fetchPayoutDetail: (id: number, cb: (d: any) => void, done?: () => void) =>
      get(`payouts/withdrawals/${id}/`, undefined, cb, done),
    // Tax & compliance
    fetchTaxDashboard: (query: Query, cb: (d: any) => void, done?: () => void) => get("tax-dashboard/", query, cb, done),
    fetchTaxRates: (cb: (d: any) => void, done?: () => void) => get("tax-rates/", undefined, cb, done),
    saveTaxRate: (body: unknown, id: number | null, cb: () => void) =>
      id ? send("PATCH", `tax-rates/${id}/`, body, cb) : send("POST", "tax-rates/", body, cb),
    deleteTaxRate: (id: number, cb: () => void) => send("DELETE", `tax-rates/${id}/`, undefined, cb),
    // Reference data for the tax-rate country picker
    fetchCountries: (cb: (d: any) => void) => {
      if (!token) return;
      sendHttpRequest({
        requestConfig: { url: "/locations/countries/", method: "GET", token, isAuth: true, userType: "admin" },
        successRes: (res: any) => cb(res?.data),
      });
    },
    // Third-party providers
    fetchProviders: (cb: (d: any) => void, done?: () => void) => get("tpp/", undefined, cb, done),
    fetchProviderBilling: (id: number, cb: (d: any) => void, done?: () => void) =>
      get(`tpp/${id}/billing/`, undefined, cb, done),
    saveProvider: (body: unknown, id: number | null, cb: () => void) =>
      id ? send("PATCH", `tpp/${id}/`, body, cb) : send("POST", "tpp/", body, cb),
    addBillingRecord: (providerId: number, body: unknown, cb: () => void) =>
      send("POST", `tpp/${providerId}/billing/`, body, cb),
  };
};
