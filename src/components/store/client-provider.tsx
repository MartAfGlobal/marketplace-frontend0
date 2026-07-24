"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";
import AuthInitializer from "./AuthInitializer";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* PersistGate handles timing automatically */}
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer />
        {children}
      </PersistGate>
    </Provider>
  );
}
