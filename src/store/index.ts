"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/cart/cartSlice";
import wishlistReducer from "@/store/cart/wishlist-slice";
import { persistReducer, persistStore } from "redux-persist";
import counterReducer from "./slices/counterSlice";
import storage from "redux-persist/lib/storage";
import productDetailReducer from "@/store/productDetails/productDetailsSlice";
import categoryProductsReducer from "@/store/user-data/products/categoryProductsSlice";
import subCategoryProductsReducer from "@/store/user-data/products/subCategoryProductsSlice";
import topDealsReducer from "@/store/user-data/products/topDealsSlice";
import uiSliceReducer from "@/store/uiSlice";
import draftReducer from "@/store/sellers/draftSlice";

import productReducer from "./user-data/products/product-slice";
import selectedProductReducer from "@/store/user-data/products/selectedProduct-slice";
import tokenReducer from "@/store/token/token-slice";
import buyerReducer from "@/store/user-data/buyer/buyer-slice";
import sellerReducer from "@/store/user-data/seller/seller-slice";
import orderReducer from "@/store/orders/order-slice";
import trackingReducer from "@/store/orders/tracking-slice";
import wishlistLabelReducer from "./wishlistLabel/wishlistLabelSlice";
import orderSliceReducer from "@/store/orders/payment-success-slice";
import selectedVariationReducer from "@/store/slices/variationSelectorSlice";
import registrationReducer from "@/store/auth/registration-slice";
import registrationsReducer from "./slices/registration-slice";
import AddProductReducer from "@/store/sellers/addProductSlice";
import SellerProductReducer from "@/store/sellers/productSlice";
import financeReducer from "@/store/finance/financeSlice";

const SellerPersistConfig = {
  key: "sellerProduct",
  storage,
};
const tokenPersistConfig = {
  key: "token",
  storage,
};
const addProducPersistConfig = {
  key: "addProduct",
  storage,
};

const draftPersistConfig = {
  key: "draft",
  storage,
};

const checkoutPersistConfig = {
  key: "checkout",
  storage,
};

const productDetailsPersistConfig = {
  key: "productDetails",
  storage,
};

const variationIdPersistConfig = {
  key: "selectedVariation",
  storage,
};
const buyerPersistConfig = {
  key: "buyer",
  storage,
};

const sellerPersistConfig = {
  key: "seller",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

const orderSlicePersistConfig = {
  key: "orderSlice",
  storage,
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};

const productsPersistConfig = {
  key: "products",
  storage,
};

const ordersPersistConfig = {
  key: "orders",
  storage,
};
const trackingPersistCobfig = {
  key: "tracking",
  storage,
};
const wishlistLabelPersistCobfig = {
  key: "labels",
  storage,
};
const registrationsPersistConfig = {
  key: "registrations",
  storage,
};
const registrationPersistConfig = {
  key: "registration",
  storage,
};

const financePersistConfig = {
  key: "finance",
  storage,
};

const rootReducer = combineReducers({
  productDetails: persistReducer(
    productDetailsPersistConfig,
    productDetailReducer,
  ),
  sellerProduct: persistReducer(SellerPersistConfig, SellerProductReducer),
  tracking: persistReducer(trackingPersistCobfig, trackingReducer),
  token: persistReducer(tokenPersistConfig, tokenReducer),
  buyer: persistReducer(buyerPersistConfig, buyerReducer),
  seller: persistReducer(sellerPersistConfig, sellerReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  draft: persistReducer(draftPersistConfig, draftReducer),
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
  products: persistReducer(productsPersistConfig, productReducer),
  counter: counterReducer,
  addProduct: persistReducer(addProducPersistConfig, AddProductReducer),
  selectedProduct: selectedProductReducer,
  wishlistLabel: persistReducer(
    wishlistLabelPersistCobfig,
    wishlistLabelReducer,
  ),

  registration: persistReducer(registrationPersistConfig, registrationReducer),
  registrations: persistReducer(
    registrationsPersistConfig,
    registrationsReducer,
  ),

  orders: persistReducer(ordersPersistConfig, orderReducer),
  orderSlice: persistReducer(orderSlicePersistConfig, orderSliceReducer),
  selectedVariation: persistReducer(
    variationIdPersistConfig,
    selectedVariationReducer,
  ),
  categoryProducts: categoryProductsReducer,
  subCategoryProducts: subCategoryProductsReducer,
  topDeals: topDealsReducer,

  ui: uiSliceReducer,
  finance: persistReducer(financePersistConfig, financeReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
