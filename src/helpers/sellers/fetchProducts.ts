"use client";

import { RootState } from "@/store";
import {
  fetchDisputeDetails,
  fetchOrdersFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  setShippingAddress,
} from "@/store/orders/order-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
// import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

import { setSellerProduct } from "@/store/sellers/productSlice";
import { setDraft } from "@/store/sellers/draftSlice";
import { setBalance, setFinanceLoading, setFinanceError, setWalletOverview, setOverviewLoading } from "@/store/finance/financeSlice";
import {
  setTransactions,
  setTransactionsLoading,
  setTransactionsError,
} from "@/store/finance/transactionsSlice";
import { useState } from "react";
import { RequestType } from "@/types/global";


export const useFetchProducts = (id?: string) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading, error, setError } = useHttp();
  const [success, setsuccess] = useState(false);
  const [activated, setActivated]= useState(false)
  const [isActive, setIsActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string| null>("")
const [request, setRequest] = useState<RequestType>({
  requestType: null,
});



 
  // fetching all orders


 
  const fetchProducts = () => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "products/manufacturer/products/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
       
       
        const productFetched = responseData?.data?.results;
         console.log("products fetched", productFetched);
        dispatch(setSellerProduct(productFetched));;
      
       
      },
    });
  };

  //fetching disput lists

 
  const fetchOrderDetails = () => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/buyer/${id}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        console.log("productDetails", responseData);
        dispatch(
          setShippingAddress(responseData.data.shipping_address_snapshot),
        );
      },
    });
  };
  const activateProduct = () => {

     const url = isActive? `/products/manufacturer/products/${id}/request-deactivation/`:`/products/manufacturer/products/${id}/request-activation/`;
    console.log ("what is the status",isActive)
   
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: url,
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        setsuccess(true);
        
      },
    });
  };
const cancelProductRequest = (type: "activation" | "deactivation") => {
  const url =
    type === "activation"
      ? `/products/manufacturer/products/${id}/cancel-activation-request/`
      : `/products/manufacturer/products/${id}/cancel-deactivation-request/`;

  if (!token) return;
  setActivated(false)

  sendHttpRequest({
    requestConfig: {
      url,
      method: "POST",
      token,
      isAuth: true,
      userType: "seller",
    },
    successRes: (responseData: any) => {
      setSuccessMessage(responseData.data.detail)
      setActivated(true);
      
      console.log("product request cancelled", responseData);

    },
  });
};
  const fetchLogs = () => {
    
   
    if (!token) return;

    console.log ("fetching notification logs......")

    sendHttpRequest({

      requestConfig: {
        url: "notifications/logs/?page=1076",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        console.log("dispute logs", responseData.data);
        dispatch(fetchDisputeDetails(responseData.data));
      },
    });
  };



  const fetchdDraft = () => {
    
   
    if (!token) return;


    sendHttpRequest({

      requestConfig: {
        url:"/products/manufacturer/drafts/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        console.log("fetching DRAFTyyy", responseData.data.results);
        dispatch(setDraft(responseData.data.results));
      },
    });
  };

  const fetchBalance = () => {
    if (!token) return;

    dispatch(setFinanceLoading(true));
    sendHttpRequest({
      requestConfig: {
        url: "commission/manufacturer/wallet/balance/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        console.log("Balance data fetched successfully:", responseData.data);
        dispatch(setBalance(responseData.data));
        dispatch(setFinanceLoading(false));
      },
      errorRes: (err: any) => {
        console.error("Error fetching balance:", err);
        dispatch(setFinanceError(err.message || "Failed to fetch balance"));
        dispatch(setFinanceLoading(false));
      }
    });
  };

  /**
   * Map UI filter label → API period query param value.
   */
  const labelToPeriod = (label: string): string => {
    switch (label) {
      case "This Week":  return "this_week";
      case "This Month": return "this_month";
      case "This Year":  return "this_year";
      default:           return "this_month";
    }
  };

  /**
   * Fetch Money Flow overview (sales, payouts, pending_sales, refunds).
   * Calls: GET /commission/manufacturer/wallet/overview?period=<period>
   * period options: "this_week" | "this_month" | "this_year"
   */
  const fetchWalletOverview = (periodLabel: string = "This Month") => {
    if (!token) return;
    const period = labelToPeriod(periodLabel);
    dispatch(setOverviewLoading(true));
    sendHttpRequest({
      requestConfig: {
        url: `commission/manufacturer/wallet/overview?period=${period}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        console.log("Wallet overview fetched:", responseData.data);
        dispatch(setWalletOverview(responseData.data));
        dispatch(setOverviewLoading(false));
      },
      errorRes: (err: any) => {
        console.error("Error fetching wallet overview:", err);
        dispatch(setOverviewLoading(false));
      },
    });
  };

  /**
   * Fetch paginated wallet transactions (newest first).
   * Calls: GET /commission/manufacturer/wallet/transactions?page=<page>
   * API response shape (standard DRF pagination):
   *   { count, next, previous, results: Transaction[] }
   */
  const fetchTransactions = (page: number = 1) => {
    if (!token) return;

    dispatch(setTransactionsLoading(true));
    dispatch(setTransactionsError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/commission/manufacturer/wallet/transactions?page=${page}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const data = responseData.data;
        const items = Array.isArray(data) ? data : (data?.results ?? []);
        const totalCount = Array.isArray(data) ? items.length : (data?.count ?? items.length);
        console.log("Transactions fetched:", items);
        dispatch(setTransactions({ items, totalCount, page }));
        dispatch(setTransactionsLoading(false));
      },
      errorRes: (err: any) => {
        const errorMessage = String(
          err?.response?.data?.detail || err?.message || "Failed to fetch transactions",
        );
        const isTimeout = errorMessage.toLowerCase().includes("timeout");
        dispatch(
          setTransactionsError(
            isTimeout ? "Transactions temporarily unavailable." : errorMessage,
          ),
        );
        dispatch(setTransactionsLoading(false));
      },
    });
  };

  /**
   * Fetch time-series chart data for the Finance Overview income/expense chart.
   * Calls: GET /commission/manufacturer/sales-chart/?range=<range>
   * range options: "weekly" | "monthly" | "yearly"
   */
  const fetchSalesChart = (
    range: "weekly" | "monthly" | "yearly" = "weekly",
    onSuccess?: (data: any) => void
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/commission/manufacturer/sales-chart/?range=${range}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        console.log("Sales chart data fetched successfully:", responseData.data);
        onSuccess?.(responseData.data);
      },
      errorRes: (err: any) => {
        console.warn("Sales chart fetch warning:", err?.message || err);
      },
    });
  };

  /**
   * Fetch seller's registered bank details.
   * Calls: GET /accounts/manufacturer/bank/list/
   */
  const fetchBanks = (callback?: (data: any[]) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/accounts/manufacturer/bank/list/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const banks = responseData?.data?.results ?? responseData?.data ?? [];
        callback?.(Array.isArray(banks) ? banks : []);
      },
      errorRes: (err: any) => {
        console.warn("Error fetching bank list:", err?.message || err);
      },
    });
  };

  const fetchOrders = () => {
    if (!token) return;

    dispatch(fetchOrdersStart());

    sendHttpRequest({
      requestConfig: {
        url: "orders/manufacturer/orders/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        console.log("User orders:", res);
        const orders = res?.data?.results || res?.data || [];
        dispatch(fetchOrdersSuccess(orders));
      },
    });
  };

  const fetchOrderById = (orderId: string, callback?: (data: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `orders/manufacturer/orders/${orderId}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        console.log("Single order fetched:", res);
        if (callback) callback(res.data);
      },
    });
  };

  const acceptOrder = (orderId: string, payload: { warehouse_id: string, delivery_partner: string }, callback?: (data: any) => void, errorCallback?: (err: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/manufacturer/orders/${orderId}/accept/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
        body: payload,
      },
      successRes: (res) => {
        console.log("Order accepted:", res);
        if (callback) callback(res.data);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      }
    });
  };

  const submitTrackingToHub = (
    orderId: string,
    payload: { seller_tracking_id_to_hub: string; notes?: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `orders/manufacturer/orders/${orderId}/submit-tracking/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
        body: payload,
      },
      successRes: (res: any) => {
        console.log("Tracking submitted to hub:", res);
        if (callback) callback(res.data);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      }
    });
  };

  const fulfillOrder = (
    orderId: string,
    payload?: { seller_tracking_id_to_hub?: string; notes?: string; parcel_id?: string } | Record<string, any>,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    if (!token) return;

    const body: Record<string, any> = {};
    if (payload?.seller_tracking_id_to_hub) {
      body.seller_tracking_id_to_hub = payload.seller_tracking_id_to_hub.trim();
    }
    if (payload?.notes) {
      body.notes = payload.notes.trim();
    }
    if (payload?.parcel_id && !body.seller_tracking_id_to_hub) {
      body.seller_tracking_id_to_hub = payload.parcel_id.trim();
    }

    sendHttpRequest({
      requestConfig: {
        url: `orders/manufacturer/orders/${orderId}/submit-tracking/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
        body,
      },
      successRes: (res: any) => {
        console.log("Tracking submitted to hub (fulfill):", res);
        if (callback) callback(res.data);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      }
    });
  };

  const fetchWarehouses = (callback?: (data: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/orders/manufacturer/warehouses/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        console.log("Warehouses fetched:", res);
        if (callback) callback(res.data?.results || res.data || []);
      },
    });
  };

  const fetchDeliveryPartners = (callback?: (data: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/orders/manufacturer/delivery-partners/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        console.log("Delivery partners fetched:", res);
        if (callback) callback(res.data?.results || res.data || []);
      },
    });
  };

  const rejectOrder = (
    orderId: string,
    payload: { rejection_reason_id: string; rejection_note: string },
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `orders/manufacturer/orders/${orderId}/reject/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
        body: payload,
      },
      successRes: (res) => {
        console.log("Order rejected:", res);
        if (callback) callback(res.data);
      },
      errorRes: (err) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const partialAcceptOrder = (
    orderId: string,
    payload: any,
    callback?: (data: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: `orders/manufacturer/orders/${orderId}/partial-reject/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
        body: payload,
      },
      successRes: (res: any) => {
        console.log("Partial acceptance success:", res);
        if (callback) callback(res.data);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };

  const fetchRejectionReasons = (callback?: (data: any) => void, errorCallback?: (err: any) => void) => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/cancellation/reasons/for_seller/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        console.log("Rejection reasons fetched:", res);
        if (callback) callback(res.data?.results || res.data || []);
      },
      errorRes: (err: any) => {
        if (errorCallback) errorCallback(err);
      },
    });
  };


  return {
    setIsActive,
    fetchdDraft,
    fetchProducts,
    fetchBalance,
    fetchWalletOverview,
    fetchTransactions,
    fetchSalesChart,
    fetchBanks,
    fetchOrders,
    fetchLogs,
    fetchOrderDetails,
    fetchOrderById,
    acceptOrder,
    rejectOrder,
    fulfillOrder,
    submitTrackingToHub,
    fetchWarehouses,
    fetchDeliveryPartners,
    fetchRejectionReasons,
    partialAcceptOrder,
    activateProduct,
    cancelProductRequest,
    success,
    setSuccess: setsuccess,
    request,
    setRequest,
    successMessage,
    loading,
    activated,
    setActivated,
    error,
    setError
  };
};
