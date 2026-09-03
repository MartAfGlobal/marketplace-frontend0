"use client";

import { RootState } from "@/store";

import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
// import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

import { useState } from "react";
import { RequestType } from "@/types/global";
import { setAdminBuyerData } from "@/store/admin/users/buyers/buyerDetailsSlice";
import { setAdminBuyerStats } from "@/store/admin/users/buyers/buyerStatsSlice";
import { setAdminSellerData } from "@/store/admin/users/seller/sellerDetailsSlice";
import { setAdminSellerById } from "@/store/admin/users/seller/sellerByIdSlice";
import { setAdminKycData } from "@/store/admin/users/kyc/kycDetailsSlice";
import { setAdminProductsData } from "@/store/admin/products/adminProductsSlice";
import { setAdminProductDetail } from "@/store/admin/products/adminProductDetailSlice";
import { setAdminCategoryStats } from "@/store/admin/categories/categoryStatsSlice";
import { setAdminCategoriesData } from "@/store/admin/categories/adminCategoriesSlice";
import { setAdminCategoryDetail } from "@/store/admin/categories/adminCategoryDetailSlice";
import { setAdminOrdersData } from "@/store/admin/orders/adminOrdersSlice";

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

  const fetchAdminBuyerStats = (callback?: (data: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/accounts/admin/customers/stats/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const statsData = responseData?.data;
        console.log("Buyer stats", statsData);
        if (statsData) {
          dispatch(setAdminBuyerStats(statsData));
        }
        if (callback) callback(statsData);
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
        console.log("Product review checklist response:", responseData);
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

  const fetchAdminProductsByCategory = (
    categoryId: string,
    page: number = 1,
    callback?: (data: { results: any[]; count: number }) => void,
  ) => {
    if (!token || !categoryId) return;

    sendHttpRequest({
      requestConfig: {
        url: `products/admin/products?category=${categoryId}&page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const productsFetched = responseData?.data?.results ?? [];
        const totalCount = responseData?.data?.count ?? 0;
        console.log(
          "Category products fetched:",
          productsFetched,
          "Total:",
          totalCount,
        );
        dispatch(
          setAdminProductsData({ results: productsFetched, count: totalCount }),
        );
        if (callback) callback({ results: productsFetched, count: totalCount });
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

  const updateAdminProductReviewChecklist = (
    productId: string,
    items: Record<string, boolean>,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/products/${productId}/review-checklist/`,
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body: { items },
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

  const approveAdminProduct = (
    productId: string,
    notes?: string,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `products/admin/products/${productId}/approve/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: notes ? { notes } : {},
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

  const fetchAdminCategoryStats = (callback?: (data: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/dashboard-stats/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const statsData = responseData?.data;
        console.log("Category stats", statsData);
        if (statsData) {
          dispatch(setAdminCategoryStats(statsData));
        }
        if (callback) callback(statsData);
      },
    });
  };

  const fetchAdminCategories = (
    page: number = 1,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/?root_only=true&page_size=20&page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const rawResults =
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);
        const categoriesFetched = Array.isArray(rawResults) ? rawResults : [];
        const totalCount =
          responseData?.data?.count ??
          responseData?.count ??
          categoriesFetched.length;
        console.log(
          "Admin categories fetched:",
          categoriesFetched,
          "Total:",
          totalCount,
        );
        dispatch(
          setAdminCategoriesData({
            results: categoriesFetched,
            count: totalCount,
          }),
        );
        if (callback) callback(responseData);
      },
    });
  };

  const fetchAdminCategoryById = (
    categorySlug: string,
    callback?: (data: any) => void,
  ) => {
    if (!token || !categorySlug) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/${categorySlug}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const categoryData = responseData?.data ?? responseData;
        console.log("Admin category detail fetched:", categoryData);
        if (categoryData) {
          dispatch(setAdminCategoryDetail(categoryData));
        }
        if (callback) callback(categoryData);
      },
    });
  };

  const fetchAdminParentCategories = (callback?: (data: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/?root_only=true&page_size=100`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const rawResults =
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);
        const results = Array.isArray(rawResults) ? rawResults : [];
        const totalCount =
          responseData?.data?.count ?? responseData?.count ?? results.length;
        console.log(
          "Admin parent categories fetched:",
          results,
          "Total:",
          totalCount,
        );
        if (callback) callback({ results, totalCount });
      },
    });
  };

  const fetchAdminSubcategories = (
    page: number = 1,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/?parent_only=true&page_size=20&page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const rawResults =
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);
        const results = Array.isArray(rawResults) ? rawResults : [];
        const totalCount =
          responseData?.data?.count ?? responseData?.count ?? results.length;
        console.log(
          "Admin subcategories fetched:",
          results,
          "Total:",
          totalCount,
        );
        if (callback) callback({ results, totalCount });
      },
    });
  };

  const createAdminCategory = (
    payload: FormData | Record<string, any>,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/`,
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

  const createAdminAttribute = (
    payload: { name: string; values?: string[]; is_active?: boolean },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: {
          name: payload.name,
          ...(payload.values !== undefined && { values: payload.values }),
          is_active: payload.is_active ?? true,
        },
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

  const fetchAdminAttributes = (
    page: number = 1,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/?page_size=20&page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const rawResults =
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);
        const results = Array.isArray(rawResults) ? rawResults : [];
        const totalCount =
          responseData?.data?.count ?? responseData?.count ?? results.length;
        console.log("Admin attributes fetched:", results, "Total:", totalCount);
        if (callback) callback({ results, totalCount });
      },
    });
  };

  const fetchAdminAttributeById = (
    attributeId: string,
    callback?: (data: any) => void,
  ) => {
    if (!token || !attributeId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/${attributeId}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        if (callback) callback(data);
      },
    });
  };

  const fetchAdminAttributeCategories = (
    attributeId: string,
    callback?: (data: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token || !attributeId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/${attributeId}/categories`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const updateAdminAttribute = (
    attributeId: string,
    payload: {
      name?: string;
      values?: string[];
      is_active?: boolean;
      category_id?: string;
    },
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/${attributeId}/`,
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

  const deleteAdminAttribute = (
    attributeId: string,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/${attributeId}/`,
        method: "DELETE",
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

  const hideAdminAttribute = (
    attributeId: string,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/attributes/${attributeId}/`,
        method: "PATCH",
        token,
        isAuth: true,
        userType: "admin",
        body: { is_active: false },
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

  const updateAdminCategory = (
    categoryId: string,
    payload: FormData | Record<string, any>,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token || !categoryId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/${categoryId}/`,
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

  const deleteAdminCategory = (
    categoryId: string,
    callback?: (response?: any) => void,
    errorCallback?: (err?: any) => void,
  ) => {
    if (!token || !categoryId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/admin/categories/${categoryId}/`,
        method: "DELETE",
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

  //order management Api

  const fetchOrdersList = (
    page: number = 1,
    status?: string,
    callback?: (data: any) => void,
  ) => {
    if (!token) return;

    const statusParam = status && status !== "all" ? `&status=${status}` : "";
    console.log("Fetching orders token for admin...", token);
    sendHttpRequest({
      requestConfig: {
        url: `/orders/admin/orderslist?page=${page}${statusParam}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const rawResults =
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);
        const results = Array.isArray(rawResults) ? rawResults : [];
        const totalCount =
          responseData?.data?.count ?? responseData?.count ?? results.length;
        console.log("Admin orders fetched:", results, "Total:", totalCount);
        dispatch(setAdminOrdersData({ results, count: totalCount }));
        if (callback) callback({ results, totalCount });
      },
    });
  };

  const fetchCancellationRequests = (
    status: string = "pending",
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/cancellation/admin/cancellation-requests?status=${status}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data =
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);
        console.log("Cancellation requests fetched:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Cancellation requests error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const approveCancellationRequest = (
    cancellationRequestId: string,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !cancellationRequestId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/cancellation/admin/cancellation-requests/${cancellationRequestId}/approve/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: {},
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Cancellation request approved:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Approve cancellation request error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const rejectCancellationRequest = (
    cancellationRequestId: string,
    payload: { rejection_notes: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !cancellationRequestId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/cancellation/admin/cancellation-requests/${cancellationRequestId}/reject/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Cancellation request rejected:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Reject cancellation request error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const fetchAdminDisputeStats = (
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/admin/stats/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const statsData = responseData?.data ?? responseData;
        console.log("Admin dispute stats:", statsData);
        if (callback) callback(statsData);
      },
      errorRes: (err: any) => {
        console.error("Fetch admin dispute stats error:", err);
        // Fallback retry without trailing slash
        sendHttpRequest({
          requestConfig: {
            url: `/disputes/admin/stats`,
            method: "GET",
            token,
            isAuth: true,
            userType: "admin",
          },
          successRes: (fallbackRes: any) => {
            const fbData = fallbackRes?.data ?? fallbackRes;
            if (callback) callback(fbData);
          },
          errorRes: (fallbackErr: any) => {
            if (errorCallback) errorCallback(fallbackErr);
          },
        });
      },
    });
  };

  const fetchAdminDisputesList = (
    params: { status?: string; page?: number; search?: string } = {},
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;

    const queryParts: string[] = [];
    if (params.status && params.status !== "ALL") {
      queryParts.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params.page) {
      queryParts.push(`page=${params.page}`);
    }
    if (params.search && params.search.trim()) {
      queryParts.push(`search=${encodeURIComponent(params.search.trim())}`);
    }
    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/admin${queryString}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData ?? [];
        console.log("Admin disputes fetched:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Admin disputes list error:", err);
        // Fallback retry with trailing slash if needed
        sendHttpRequest({
          requestConfig: {
            url: `/disputes/admin/${queryString}`,
            method: "GET",
            token,
            isAuth: true,
            userType: "admin",
          },
          successRes: (fbRes: any) => {
            const fbData = fbRes?.data ?? fbRes ?? [];
            if (callback) callback(fbData);
          },
          errorRes: (fbErr: any) => {
            if (errorCallback) errorCallback(fbErr);
          },
        });
      },
    });
  };

  const fetchAdminDisputeDetail = (
    disputeId: string,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !disputeId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/admin/${disputeId}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Admin dispute detail fetched:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Fetch admin dispute detail error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const updateAdminDisputeStatus = (
    disputeId: string,
    payload: { status: string; notes?: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !disputeId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/admin/${disputeId}/update-status/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Admin dispute status updated:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        // Fallback: try PATCH /disputes/admin/${disputeId}/
        sendHttpRequest({
          requestConfig: {
            url: `/disputes/admin/${disputeId}/`,
            method: "PATCH",
            token,
            isAuth: true,
            userType: "admin",
            body: payload,
          },
          successRes: (fbRes: any) => {
            if (callback) callback(fbRes?.data ?? fbRes);
          },
          errorRes: (fbErr: any) => {
            if (errorCallback) errorCallback(fbErr);
          },
        });
      },
    });
  };

  const processAdminDisputeRefund = (
    disputeId: string,
    payload: { amount?: number; is_partial?: boolean; notes?: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !disputeId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/admin/${disputeId}/refund/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Admin dispute refund processed:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Admin dispute refund error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const rejectAdminDispute = (
    disputeId: string,
    payload: { rejection_notes?: string; reason?: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !disputeId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/admin/${disputeId}/reject/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Admin dispute rejected:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Admin dispute reject error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const fetchOrdersSummary = (
    range: string = "this_month",
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/admin/summary/?range=${range}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData ?? {};
        console.log("Admin orders summary:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Admin orders summary error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const fetchAdminOrderDetail = (
    orderId: string,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !orderId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/admin/orderslist/${orderId}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Admin order details fetched:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Admin order details error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const updateAdminOrderStatus = (
    sellerOrderId: string,
    payload: { status: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !sellerOrderId) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/admin/seller-orders/${sellerOrderId}/update-status/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Admin seller-order status updated:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Admin seller-order status update error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const fetchOrderTracking = (
    trackingNumber: string,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void,
  ) => {
    if (!token || !trackingNumber) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/${trackingNumber}/track/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (responseData: any) => {
        const data = responseData?.data ?? responseData;
        console.log("Order tracking fetched:", data);
        if (callback) callback(data);
      },
      errorRes: (err: any) => {
        console.error("Order tracking error:", err);
        if (errorCallback) errorCallback(err);
      },
    });
  };

  return {
    fetchOrdersList,
    fetchCancellationRequests,
    approveCancellationRequest,
    rejectCancellationRequest,
    fetchAdminDisputeStats,
    fetchAdminDisputesList,
    fetchAdminDisputeDetail,
    updateAdminDisputeStatus,
    processAdminDisputeRefund,
    rejectAdminDispute,
    fetchOrdersSummary,
    fetchAdminOrderDetail,
    fetchOrderTracking,
    updateAdminOrderStatus,
    fetchAdminSellersProductDetails,
    updateAdminProductReviewChecklist,
    approveAdminProduct,
    fetchAdminSellersProductsList,
    fetchAdminProductsByCategory,
    fetchAdminSellers,
    fetchAdminSellerById,
    toggleAdminSellerStatus,
    deleteAdminSeller,
    setIsActive,
    fetchAdminSellersKycList,
    fetchAdminBuyers,
    fetchAdminBuyerById,
    fetchAdminBuyerStats,
    fetchAdminCategoryStats,
    fetchAdminCategories,
    fetchAdminParentCategories,
    fetchAdminCategoryById,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
    createAdminAttribute,
    fetchAdminAttributes,
    fetchAdminAttributeById,
    fetchAdminAttributeCategories,
    updateAdminAttribute,
    deleteAdminAttribute,
    hideAdminAttribute,
    fetchAdminSubcategories,
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
