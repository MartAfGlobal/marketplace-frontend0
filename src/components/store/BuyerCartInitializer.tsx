"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { RootState } from "@/store";
import { setCartItems } from "@/store/cart/cartSlice";
import { mapBackendCartItems } from "@/utils/cart";

export default function BuyerCartInitializer() {
  const token = useSelector((state: RootState) => state.token?.token);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const hydratedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!token || localStorage.getItem("accountType") !== "buyer") return;
    // The cart page loads its server cart independently.
    if (pathname === "/cart" || pathname === "/cart/") return;
    if (hydratedToken.current === token) return;

    hydratedToken.current = token;

    const hydrateCart = async () => {
      try {
        const response = await axios.get("/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCartItems(mapBackendCartItems(response?.data?.items || [])));
      } catch (error) {
        console.error("Failed to load buyer cart after login:", error);
        toast.error("Failed to sync cart with server");
        hydratedToken.current = null;
      }
    };

    void hydrateCart();
  }, [dispatch, pathname, token]);

  return null;
}
