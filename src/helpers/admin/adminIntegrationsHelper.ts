"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";

/**
 * Data layer for Settings > Integrations and Settings > Notifications
 * (both superuser-only). Thin fetch/update helpers over the backend; the
 * screens hold their own local state since these are admin-only config pages.
 */
export const AdminIntegrationsDetails = () => {
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();

  const req = (
    url: string,
    method: string,
    body?: any,
    successRes?: (d: any) => void,
    successMessage?: string,
    errorRes?: (e: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url, method, token, isAuth: true, userType: "admin",
        ...(body ? { body } : {}),
        ...(successMessage ? { successMessage } : {}),
        ...(method === "GET" ? { suppressErrorNotification: true } : {}),
      },
      successRes: (r: any) => successRes?.(r?.data ?? r),
      errorRes: (e: any) => errorRes?.(e),
    });
  };

  // ---- Integrations ----
  const fetchProviders = (cb: (d: any[]) => void) =>
    req("/settings/integrations/providers/", "GET", undefined, (d) => cb(d?.results ?? d ?? []));
  const updateProvider = (key: string, body: any, cb?: (d: any) => void) =>
    req(`/settings/integrations/providers/${key}/`, "PATCH", body, cb, "Updated.");
  const testProvider = (key: string, cb?: (d: any) => void) =>
    req(`/settings/integrations/providers/${key}/test/`, "POST", {}, cb, "Connection tested.");
  const fetchFlags = (cb: (d: any) => void) => req("/settings/integrations/flags/", "GET", undefined, cb);
  const updateFlags = (body: any, cb?: (d: any) => void) =>
    req("/settings/integrations/flags/", "PATCH", body, cb, "Saved.");

  // ---- Notifications ----
  const fetchNotifConfig = (cb: (d: any) => void) =>
    req("/settings/notifications/config/", "GET", undefined, cb);
  const updateNotifConfig = (body: any, cb?: (d: any) => void) =>
    req("/settings/notifications/config/", "PATCH", body, cb, "Saved.");
  const fetchNotifCategories = (cb: (d: any[]) => void) =>
    req("/settings/notifications/categories/", "GET", undefined, (d) => cb(d?.results ?? d ?? []));
  const updateNotifCategory = (key: string, body: any, cb?: (d: any) => void) =>
    req(`/settings/notifications/categories/${key}/`, "PATCH", body, cb);

  return {
    loading,
    fetchProviders, updateProvider, testProvider, fetchFlags, updateFlags,
    fetchNotifConfig, updateNotifConfig, fetchNotifCategories, updateNotifCategory,
  };
};
