"use client";

import { RootState } from "@/store";

import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
// import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

import { useState } from "react";
import { RequestType } from "@/types/global";
import { setAdminBuyerData } from "@/store/admin/users/buyers/buyerDetailsSlice";
import { setAdminSellerData } from "@/store/admin/users/seller/sellerDetailsSlice";
import { setAdminSellerById } from "@/store/admin/users/seller/sellerByIdSlice";
import { setAdminKycData } from "@/store/admin/users/kyc/kycDetailsSlice";
import { setAdminProductsData } from "@/store/admin/products/adminProductsSlice";
import { setAdminProductDetail } from "@/store/admin/products/adminProductDetailSlice";

export const AdminDetails = (id?: string) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading, error, setError } = useHttp();
  const [success, setsuccess] = useState(false);
  const [activated, setActivated] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [request, setRequest] = useState<RequestType>({
    requestType: null,
  });

  // fetching all orders

  const fetchAdminBuyers = (page: number = 1) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/customers/?page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const buyersFetched = responseData?.data?.results ?? [];
        const totalCount = responseData?.data?.count ?? 0;
        console.log("Buyers", buyersFetched, "Total:", totalCount);
        dispatch(
          setAdminBuyerData({ results: buyersFetched, count: totalCount }),
        );
      },
    });
  };

  const fetchAdminBuyerById = (
    customerId: string,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/customers/${customerId}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const buyerData = responseData?.data;
        console.log("Buyer details", buyerData);
        if (callback) callback(buyerData);
      },
    });
  };

  const toggleAdminBuyerStatus = (
    customerId: string,
    payload: { action: "suspend" | "activate"; reason?: string; note?: string },
    callback?: () => void,
  ) => {
    if (!token) return;

    console.log(
      "Toggling buyer status for customerId:",
      customerId,
      "with payload:",
      payload,
    );

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/customers/${customerId}/toggle-status/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: () => {
        setsuccess(true);
        console.log(
          "Buyer status toggled successfully for customerId:",
          customerId,
        );
        if (callback) callback();
      },
    });
  };
  const fetchAdminSellers = (page: number = 1) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/manufacturers/?page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const sellersFetched = responseData?.data?.results ?? [];
        const totalCount = responseData?.data?.count ?? 0;
        console.log("Sellers", sellersFetched, "Total:", totalCount);
        dispatch(
          setAdminSellerData({ results: sellersFetched, count: totalCount }),
        );
      },
    });
  };

  const fetchAdminSellerById = (
    manufacturerId: string,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/manufacturers/${manufacturerId}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const sellerData = responseData?.data;
        console.log("Seller details", sellerData);
        dispatch(setAdminSellerById(sellerData));
        if (callback) callback(sellerData);
      },
    });
  };

  const toggleAdminSellerStatus = (
    manufacturerId: string,
    payload: { action: "suspend" | "unsuspend"; reason: string },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    console.log(
      "Toggling seller status for manufacturerId:",
      manufacturerId,
      "with payload:",
      payload,
    );

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/manufacturers/${manufacturerId}/suspend/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        console.log(
          "Seller status toggled successfully for manufacturerId:",
          manufacturerId,
        );
        if (callback) callback(responseData);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const deleteAdminSeller = (
    manufacturerId: string,
    payload: { reason: string; note: string },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/manufacturers/${manufacturerId}/delete/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        if (callback) callback(responseData);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const deleteAdminBuyer = (
    customerId: string,
    payload: { reason: string; note: string },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/customers/${customerId}/delete/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        if (callback) callback(responseData);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const updateAdminBuyer = (
    customerId: string,
    payload: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      address?: string;
      state?: string;
      country?: string;
      city?: string;
      postal_code?: string;
      dob?: string;
      gender?: string;
    },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/customers/${customerId}/`,
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        if (callback) callback(responseData);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  //  kyc verification

  const fetchAdminSellersKycList = (page: number = 1) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/verifications/?page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const sellersFetched = responseData?.data?.results ?? [];
        const totalCount = responseData?.data?.count ?? 0;
        console.log("kyc", sellersFetched, "Total:", totalCount);
        dispatch(
          setAdminKycData({ results: sellersFetched, count: totalCount }),
        );
      },
    });
  };

  const verifyAdminSeller = (
    manufacturerId: string,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/manufacturers/${manufacturerId}/verify/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        if (callback) callback(responseData);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  //products management

  const fetchAdminSellersProductsList = (page: number = 1) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `products/admin/products/?page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const productsFetched = responseData?.data?.results ?? [];
        const totalCount = responseData?.data?.count ?? 0;
        console.log("products list", productsFetched);
        dispatch(
          setAdminProductsData({ results: productsFetched, count: totalCount }),
        );
      },
    });
  };
  const fetchAdminSellersProductDetails = (
    productId: string,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: `products/admin/products/${productId}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const productData = responseData?.data;
        console.log("product details", productData);
        if (productData) {
          dispatch(setAdminProductDetail(productData));
        }
        if (callback) callback(productData);
      },
    });
  };

  const rejectAdminSeller = (
    manufacturerId: string,
    payload: { reason: string },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/manufacturers/${manufacturerId}/verification/reject/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        if (callback) callback(responseData);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  return {
    fetchAdminSellersProductDetails,
    fetchAdminSellersProductsList,
    fetchAdminSellers,
    fetchAdminSellerById,
    toggleAdminSellerStatus,
    deleteAdminSeller,
    setIsActive,
    fetchAdminSellersKycList,
    fetchAdminBuyers,
    fetchAdminBuyerById,
    toggleAdminBuyerStatus,
    deleteAdminBuyer,
    updateAdminBuyer,
    verifyAdminSeller,
    rejectAdminSeller,

    success,
    setSuccess: setsuccess,
    request,
    setRequest,
    successMessage,
    loading,
    activated,
    setActivated,
    error,
    setError,
  };
};
