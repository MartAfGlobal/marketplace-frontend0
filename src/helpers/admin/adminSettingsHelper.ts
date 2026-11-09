"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import {
  setSettingsSection,
  setSettingsChecklist,
  setSettingsReasons,
  SettingsSectionKey,
} from "@/store/admin/settings/adminSettingsSlice";

// Section key -> backend endpoint, under /settings/.
const SECTION_URLS: Record<SettingsSectionKey, string> = {
  security: "/settings/security/",
  orders: "/settings/orders/",
  productOperations: "/settings/product-operations/",
  productModeration: "/settings/product-moderation/",
  staffPolicy: "/settings/staff-policy/",
  finance: "/settings/finance/",
  payouts: "/settings/payouts/",
  refunds: "/settings/refunds/",
  disputes: "/settings/disputes/",
  shippingOperations: "/settings/shipping-operations/",
  support: "/support/configuration/",
};

// Reasons & Lists group -> backend URL prefix.
const REASON_GROUP_URLS: Record<string, string> = {
  cancellation: "/cancellation/reasons/",
  account: "/account-reasons/",
  product: "/product-reasons/",
  verification: "/verification-reasons/",
  refund: "/refund-reasons/",
};

/**
 * Admin Settings API facade -- follows the same fetch/dispatch and
 * mutate/callback pattern as AdminDetails() in adminHelper.ts, split into
 * its own file rather than growing that already-very-large file further.
 */
export const AdminSettingsDetails = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading, error } = useHttp();

  const fetchSettingsSection = (
    key: SettingsSectionKey,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: SECTION_URLS[key],
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
        suppressErrorNotification: true,
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        dispatch(setSettingsSection({ key, data }));
        callback?.(data);
      },
    });
  };

  const updateSettingsSection = (
    key: SettingsSectionKey,
    payload: Record<string, any>,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: SECTION_URLS[key],
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
        successMessage: "Settings updated.",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        dispatch(setSettingsSection({ key, data }));
        callback?.(data);
      },
      errorRes: (err: any) => errorCallback?.(err),
    });
  };

  const fetchChecklist = (callback?: (data: any[]) => void) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: "/settings/product-moderation/checklist/?page_size=50",
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
        suppressErrorNotification: true,
      },
      successRes: (responseData: any) => {
        const results = responseData?.data?.results ?? responseData?.data ?? [];
        dispatch(setSettingsChecklist(results));
        callback?.(results);
      },
    });
  };

  const updateChecklistItem = (
    id: string,
    payload: Record<string, any>,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `/settings/product-moderation/checklist/${id}/`,
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        callback?.(responseData?.data ?? responseData);
      },
      errorRes: (err: any) => errorCallback?.(err),
    });
  };

  const fetchReasons = (
    group: keyof typeof REASON_GROUP_URLS,
    params: Record<string, string> = {},
    callback?: (data: any[]) => void,
  ) => {
    if (!token) return;
    const queryParts = Object.entries(params)
      .filter(([, v]) => !!v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
    queryParts.push("page_size=100");
    const queryString = `?${queryParts.join("&")}`;
    sendHttpRequest({
      requestConfig: {
        url: `${REASON_GROUP_URLS[group]}${queryString}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
        suppressErrorNotification: true,
      },
      successRes: (responseData: any) => {
        const results = responseData?.data?.results ?? responseData?.data ?? [];
        dispatch(setSettingsReasons({ group, data: results }));
        callback?.(results);
      },
    });
  };

  const createReason = (
    group: keyof typeof REASON_GROUP_URLS,
    payload: Record<string, any>,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: REASON_GROUP_URLS[group],
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
        successMessage: "Reason added.",
      },
      successRes: (responseData: any) => callback?.(responseData?.data ?? responseData),
      errorRes: (err: any) => errorCallback?.(err),
    });
  };

  const updateReason = (
    group: keyof typeof REASON_GROUP_URLS,
    id: string,
    payload: Record<string, any>,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${REASON_GROUP_URLS[group]}${id}/`,
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
        successMessage: "Reason updated.",
      },
      successRes: (responseData: any) => callback?.(responseData?.data ?? responseData),
      errorRes: (err: any) => errorCallback?.(err),
    });
  };

  const deleteReason = (
    group: keyof typeof REASON_GROUP_URLS,
    id: string,
    callback?: () => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${REASON_GROUP_URLS[group]}${id}/`,
        method: "DELETE",
        token,
        isAuth: true,
        userType: "admin",
        successMessage: "Reason deleted.",
      },
      successRes: () => callback?.(),
      errorRes: (err: any) => errorCallback?.(err),
    });
  };

  return {
    loading,
    error,
    fetchSettingsSection,
    updateSettingsSection,
    fetchChecklist,
    updateChecklistItem,
    fetchReasons,
    createReason,
    updateReason,
    deleteReason,
  };
};
