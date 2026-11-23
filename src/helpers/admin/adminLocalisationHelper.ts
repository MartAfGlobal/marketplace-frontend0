"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import {
  setLocalisationList,
  LocalisationResource,
} from "@/store/admin/settings/adminLocalisationSlice";

// Resource -> endpoints. Countries reuse the existing /locations/ CRUD
// (superusers pass its StaffAccess gate); currencies/languages/exchange-rates
// use the superuser-gated Localisation management endpoints.
const LIST_URLS: Record<LocalisationResource, string> = {
  countries: "/locations/countries/?page_size=300&ordering=name",
  currencies: "/settings/localisation/currencies/",
  languages: "/settings/localisation/languages/",
  exchangeRates: "/settings/localisation/exchange-rates/",
};

const BASE_URLS: Record<LocalisationResource, string> = {
  countries: "/locations/countries/",
  currencies: "/settings/localisation/currencies/",
  languages: "/settings/localisation/languages/",
  exchangeRates: "/settings/localisation/exchange-rates/",
};

export const AdminLocalisationDetails = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();

  const fetchList = (resource: LocalisationResource, callback?: (data: any[]) => void) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: LIST_URLS[resource],
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
        suppressErrorNotification: true,
      },
      successRes: (res: any) => {
        const payload = res?.data ?? res;
        const data = payload?.results ?? payload ?? [];
        dispatch(setLocalisationList({ resource, data }));
        callback?.(data);
      },
    });
  };

  const fetchAll = () => {
    (["countries", "currencies", "languages", "exchangeRates"] as LocalisationResource[]).forEach(
      (r) => fetchList(r),
    );
  };

  const createItem = (
    resource: LocalisationResource,
    body: Record<string, any>,
    cb?: (data: any) => void,
    errCb?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: BASE_URLS[resource],
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body,
        successMessage: "Added.",
      },
      successRes: (res: any) => {
        fetchList(resource);
        cb?.(res?.data ?? res);
      },
      errorRes: (err: any) => errCb?.(err),
    });
  };

  const updateItem = (
    resource: LocalisationResource,
    id: string,
    body: Record<string, any>,
    cb?: (data: any) => void,
    errCb?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${BASE_URLS[resource]}${id}/`,
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body,
        successMessage: "Saved.",
      },
      successRes: (res: any) => {
        fetchList(resource);
        cb?.(res?.data ?? res);
      },
      errorRes: (err: any) => errCb?.(err),
    });
  };

  const deleteItem = (
    resource: LocalisationResource,
    id: string,
    cb?: () => void,
    errCb?: (err: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `${BASE_URLS[resource]}${id}/`,
        method: "DELETE",
        token,
        isAuth: true,
        userType: "admin",
        successMessage: "Deleted.",
      },
      successRes: () => {
        fetchList(resource);
        cb?.();
      },
      errorRes: (err: any) => errCb?.(err),
    });
  };

  const refreshRates = (cb?: (updated: number) => void) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: "/settings/localisation/exchange-rates/refresh/",
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: {},
        successMessage: "Exchange rates refreshed.",
      },
      successRes: (res: any) => {
        fetchList("exchangeRates");
        cb?.((res?.data ?? res)?.updated ?? 0);
      },
    });
  };

  return { loading, fetchList, fetchAll, createItem, updateItem, deleteItem, refreshRates };
};
