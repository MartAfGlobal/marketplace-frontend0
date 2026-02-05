import { RootState } from "@/store";
import {
  fetchDisputeDetails,
  fetchDisputesSuccess,
  fetchOrdersSuccess,
  setShippingAddress,
} from "@/store/orders/order-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

export const useFetchOrders = (id?: string) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();

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
        console.log("order-details", responseData);
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
        dispatch(dispatch(fetchDisputesSuccess(responseData.data.results)));
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
        dispatch(
          setShippingAddress(responseData.data.shipping_address_snapshot),
        );
      },
    });
  };
  const fetchDisputerDetails = () => {
    console.log("dispute details fetchib=ng");
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
        dispatch(fetchDisputeDetails(responseData.data));
      },
    });
  };

  const fetchAddress = () => {
    console.log("dispute details fetchib=ng");
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "shipping/shipping-addresses/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const addresses =
          res?.data?.map((addr: any) => ({
            id: addr.id,
            country: addr.country_name,
            first_name: addr.first_name,
            last_name: addr.last_name,
            phone: addr.phone,
            state: addr.state,
            city: addr.city,
            postal_code: addr.postal_code,
            address: addr.address,
            defaultAddress: addr.is_default || false,
          })) || [];

        console.log("User address info:", res);

        dispatch(buyerActions.setBuyerAddresses(addresses));
      },
    });
  };

  return {
    fetchOrders,
    fetchAddress,
    fetchDisputeList,
    fetchOrderDetails,
    fetchDisputerDetails,
    loading,
  };
};
