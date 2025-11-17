import { RootState } from "@/store";
import { fetchOrdersSuccess } from "@/store/orders/order-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";

export const useFetchOrders = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();

  const fetchOrders = () => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/orders/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        const backendOrders = responseData?.data?.results;
        console.log("order details listed:", backendOrders);
        dispatch(fetchOrdersSuccess(backendOrders));
      },
    });
  };

  return { fetchOrders };
};
