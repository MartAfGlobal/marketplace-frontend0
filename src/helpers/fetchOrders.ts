import { RootState } from "@/store";
import {
  fetchDisputeDetails,
  fetchDisputesSuccess,
  fetchOrdersSuccess,
  addOrdersSuccess,
  setShippingAddress,
} from "@/store/orders/order-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

export const useFetchOrders = (id?: string) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest, loading } = useHttp();

  // fetching awaiting payment orders
  const fetchAwaitingPayments = () => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/orders/buyer/payments/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        console.log("awaiting-payments fetched", responseData);
        const rawPayments =
          responseData?.data?.results ?? responseData?.data ?? [];
        const paymentsArray = Array.isArray(rawPayments) ? rawPayments : [];

        const mappedPayments = paymentsArray.map((payment: any) => {
          const rawItems = payment.order_items || payment.items || [];
          return {
            ...payment,
            id: payment.id || payment.order_id || payment.reference,
            order_no: payment.order_no || payment.reference || payment.id,
            status: payment.status || "AWAITING_PAYMENT",
            order_items: (Array.isArray(rawItems) ? rawItems : []).map(
              (item: any) => ({
                ...item,
                id: item.id || item.product_id || item.product,
                product_name:
                  item.product_name ||
                  item.name ||
                  item.product_title ||
                  item.product?.name ||
                  item.product?.title ||
                  "Product",
                product_image:
                  item.product_image ||
                  item.image ||
                  item.product?.image ||
                  item.product?.thumbnail ||
                  item.thumbnail ||
                  "/placeholder.png",
                variation_name:
                  item.variation_name ||
                  item.variation_display ||
                  item.variation?.name ||
                  "",
                quantity: item.quantity ?? 1,
                fulfilled_quantity: item.fulfilled_quantity ?? item.quantity ?? 1,
                price_at_purchase: Number(
                  item.price_at_purchase ??
                    item.unit_price ??
                    item.price ??
                    item.total_price ??
                    0,
                ),
                total_price: String(
                  item.total_price ??
                    item.subtotal ??
                    Number(item.unit_price || 0) * Number(item.quantity || 1),
                ),
              }),
            ),
            total_price: Number(
              payment.total_price ??
                payment.amount ??
                payment.expected_amount ??
                payment.total ??
                payment.subtotal ??
                0,
            ),
            manufacturer:
              payment.manufacturer ||
              payment.seller_name ||
              payment.seller?.store_name ||
              "",
            seller_name: payment.seller_name || payment.manufacturer || "",
          };
        });

        dispatch(addOrdersSuccess(mappedPayments));
      },
    });
  };

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
        const backendOrders =
          responseData?.data?.results ?? responseData?.data ?? [];

        // Map backend field names to what the UI OrderItem type expects
        const mappedOrders = (
          Array.isArray(backendOrders) ? backendOrders : []
        ).map((order: any) => ({
          ...order,
          // Backend returns `items`, UI expects `order_items`
          order_items: (order.items || []).map((item: any) => ({
            ...item,
            product_name: item.product_name || item.name,
            product_image: item.product_image || item.image || null,
            variation_name:
              item.variation_name || item.variation_display || null,
          })),
          // total price fallback
          total_price: order.total_price ?? order.total ?? order.subtotal,
          // seller name
          seller_name: order.seller_name,
        }));

        dispatch(fetchOrdersSuccess(mappedOrders));
        fetchAwaitingPayments();
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




  const fetchAddress = () => {
   
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/shipping/shipping-addresses/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const rawAddresses = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.results)
          ? res.data.results
          : [];

        const addresses = rawAddresses.map((addr: any) => ({
          id: String(addr.id), // always store as string for consistent Redux comparisons
          country: addr.country_name || addr.country,
          first_name: addr.first_name,
          last_name: addr.last_name,
          phone: addr.phone,
          state: addr.state,
          city: addr.city,
          postal_code: addr.postal_code,
          address: addr.address,
          defaultAddress: addr.is_default || addr.defaultAddress || false,
          is_default: addr.is_default || addr.defaultAddress || false,
        }));

        console.log("User address info:", res);

        dispatch(buyerActions.setBuyerAddresses(addresses));
      },
    });
  };


  // sellers ordrs payloads

//  const sellerOrders = () => {
   
//     if (!token) return;

//     sendHttpRequest({
//       requestConfig: {
//         url: "/order/manufacturer/order",
//         method: "GET",
//         token,
//         isAuth: true,
//         userType: "seller",
//       },
//       successRes: (res) => {
       
//         console.log("seller orders:", res);

   
//       },
//     });
//   };


  return {
    fetchOrders,
    fetchAwaitingPayments,
    fetchAddress,
    fetchDisputeList,
    fetchLogs,
    fetchOrderDetails,
    fetchDisputerDetails,
    loading,
    // sellerOrders,
  };
};
