"use client";

import { RootState } from "@/store";
import {
  fetchDisputeDetails,

  setShippingAddress,
} from "@/store/orders/order-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
// import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

import { setSellerProduct } from "@/store/sellers/productSlice";
import { setDraft } from "@/store/sellers/draftSlice";
import { useState } from "react";
import { RequestType } from "@/types/global";


export const useFetchProducts = (id?: string) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();
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

  const fetchOrders = () => {
   
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "order/manufacturer/order/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
       
        console.log("User orders:", res);

      },
    });
  };


  return {
    setIsActive,
    fetchdDraft,
    fetchProducts,
    fetchOrders,
    fetchLogs,
    fetchOrderDetails,
    activateProduct,
    cancelProductRequest,
    success,
    request,
    setRequest,
    successMessage,
    loading,
    activated
  };
};
