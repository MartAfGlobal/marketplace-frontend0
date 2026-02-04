import { RootState } from "@/store";
import { fetchDisputeDetails, fetchDisputesSuccess, fetchOrdersSuccess, setShippingAddress } from "@/store/orders/order-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";

export const useFetchOrders = (id?: string) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest,   loading } = useHttp();

  // fetching all orders

  const fetchOrders = () => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/orders/buyer/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        console.log("order-details", responseData)
        const backendOrders = responseData?.data?.results;

        dispatch(fetchOrdersSuccess(backendOrders));
      },
    });
  };

  //fetching disput lists

  const fetchDisputeList = () => {
    if (!token) return;
  
    sendHttpRequest({
      requestConfig: {
        url: "/disputes/buyer",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        console.log("dispute fetched", responseData);
        dispatch(dispatch(fetchDisputesSuccess(responseData.data.results)))
        
      },
    });
  };
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
        dispatch (setShippingAddress(responseData.data.shipping_address_snapshot))
        
        
      },
    });
  };
  const fetchDisputerDetails = () => {
   console.log("dispute details fetchib=ng")
    if (!token) return;

   
    sendHttpRequest({
      requestConfig: {
        url: `/disputes/buyer/${id}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        console.log("dispute details", responseData.data); 
        dispatch (fetchDisputeDetails(responseData.data))
      },
    });
  };

  return {
    fetchOrders,
    fetchDisputeList,
    fetchOrderDetails,
    fetchDisputerDetails,
    loading,
  };
};
