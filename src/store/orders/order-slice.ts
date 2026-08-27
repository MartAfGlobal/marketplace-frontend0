import { BuyerDispute, DisputePayload, OrderItem, OrderShippingAddress } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  orders: OrderItem[];
  shippingAddress: OrderShippingAddress | null;
  disputes: BuyerDispute[];
  disputeDetails: DisputePayload | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  disputeDetails: null,
  disputes: [],
  shippingAddress: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchOrdersSuccess(state, action: PayloadAction<OrderItem[]>) {
      state.loading = false;
      const rawOrders = Array.isArray(action.payload) ? action.payload : [];
      state.orders = rawOrders.map((order: any) => {
        const rawItems = order.order_items || order.items || [];
        const mappedItems = (Array.isArray(rawItems) ? rawItems : []).map((item: any) => ({
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
            item.price_at_purchase ?? item.unit_price ?? item.price ?? item.total_price ?? 0
          ),
          total_price: String(
            item.total_price ?? item.subtotal ?? (Number(item.unit_price || 0) * Number(item.quantity || 1))
          ),
        }));

        return {
          ...order,
          order_items: mappedItems,
          items: mappedItems,
          manufacturer: order.manufacturer || order.seller_name || order.seller?.store_name || "",
          seller_name: order.seller_name || order.manufacturer || "",
          total_price: Number(order.total_price ?? order.total ?? order.subtotal ?? 0),
        };
      });
    },

    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    addOrdersSuccess(state, action: PayloadAction<OrderItem[]>) {
      state.loading = false;
      const rawOrders = Array.isArray(action.payload) ? action.payload : [];
      const mappedNew = rawOrders.map((order: any) => {
        const rawItems = order.order_items || order.items || [];
        const mappedItems = (Array.isArray(rawItems) ? rawItems : []).map((item: any) => ({
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
            item.price_at_purchase ?? item.unit_price ?? item.price ?? item.total_price ?? 0
          ),
          total_price: String(
            item.total_price ?? item.subtotal ?? (Number(item.unit_price || 0) * Number(item.quantity || 1))
          ),
        }));

        return {
          ...order,
          order_items: mappedItems,
          items: mappedItems,
          manufacturer: order.manufacturer || order.seller_name || order.seller?.store_name || "",
          seller_name: order.seller_name || order.manufacturer || "",
          total_price: Number(order.total_price ?? order.total ?? order.subtotal ?? 0),
        };
      });

      const existingIds = new Set(state.orders.map((o: any) => String(o.id)));
      const filtered = mappedNew.filter((o: any) => !existingIds.has(String(o.id)));
      state.orders = [...state.orders, ...filtered];
    },

    fetchDisputesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDisputesSuccess(state, action: PayloadAction<BuyerDispute[]>) {
      state.loading = false;
      state.disputes = action.payload;
    },

    fetchDisputesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchDisputeDetails(state, action: PayloadAction<DisputePayload>){
      state.loading = false
      state.disputeDetails = action.payload
    },
    setShippingAddress(state, action: PayloadAction<OrderShippingAddress>) {
      state.shippingAddress = action.payload;
    },

    clearOrders(state) {
      state.shippingAddress = null;
      state.orders = [];
      state.disputes = [];
      state.error = null;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  addOrdersSuccess,
  fetchOrdersFailure,
  fetchDisputesStart,
  fetchDisputesSuccess,
  setShippingAddress,
  fetchDisputesFailure,
  clearOrders,
  fetchDisputeDetails,
} = orderSlice.actions;

export default orderSlice.reducer;
