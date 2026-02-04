"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

import UserMain from "@/components/ui/buyer-components/Main-section/main";
import Image from "next/image";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import { motion } from "framer-motion";
import BuyerDashboard from "@/components/ui/mobile/dashbords/buyer-dashboard/dashboard";
import { useRouter } from "next/navigation";
import { setWishlist } from "@/store/cart/wishlist-slice";
import { RootState } from "@/store";
import { fetchOrdersSuccess } from "@/store/orders/order-slice";

import WireframeLoader from "@/components/ui/WireframeLoader";
import DotSpinner from "@/components/reloadSpinner/DotSpinner";
import { Address } from "@/types/global";

export default function BuyerDashBoardPage() {
  const { sendHttpRequest: userInforHttpRequest } = useHttp();
  const { sendHttpRequest: userAddressHttpRequest } = useHttp();
  const { sendHttpRequest: wishlistReq } = useHttp();
  const { loading, sendHttpRequest: fetchUserReq } = useHttp();
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        router.replace("/?showLogin=true");
      } else {
        router.replace("/auth/login");
      }
      return;
    }

    wishlistReq({
      requestConfig: {
        url: "/wishlist/all",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const wishlistItems = res.data.results
         

        console.log("Wishlist items fetched:", res);
         dispatch(setWishlist(wishlistItems));
      },
    });

    userAddressHttpRequest({
      requestConfig: {
        url: "shipping/shipping-addresses/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer"
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
    const fetchUserSucRes = (res: any) => {
      const resData = res?.data;

      const user = resData?.buyerDetails || resData?.user || resData;

      dispatch(
        buyerActions.updateBuyerData({
          id: user?.id ?? "",
          email: user?.email ?? "",
          first_name: user?.first_name ?? "",
          last_name: user?.last_name ?? "",
          account_status: user?.account_status ?? "",
          date_created: user?.date_created ?? "",
          date_joined: user?.date_joined ?? "",
          last_login: user?.last_login ?? null,
          groups: user?.groups ?? [],
          is_accountant: user?.is_accountant ?? false,
          is_active: user?.is_active ?? false,
          is_agent: user?.is_agent ?? false,
          is_customer: user?.is_customer ?? false,
          is_google_user: user?.is_google_user ?? false,
          is_manufacturer: user?.is_manufacturer ?? false,
          is_staff: user?.is_staff ?? false,
          is_staff_member: user?.is_staff_member ?? false,
          is_superuser: user?.is_superuser ?? false,
          profile_type: user?.profile_type ?? "",
          user_permissions: user?.user_permissions ?? [],
          profile: {
            id: user?.profile?.id ?? 0,
            profile_picture: user?.profile?.profile_picture ?? null,
            first_name: user?.profile?.first_name ?? "",
            last_name: user?.profile?.last_name ?? "",
            name: user?.profile?.name ?? "",
            phone: user?.profile?.phone ?? null,
            phone2: user?.profile?.phone2 ?? null,
            country: user?.profile?.country ?? null,
            state: user?.profile?.state ?? null,
            city: user?.profile?.city ?? null,
            address: user?.profile?.address ?? null,
            landmark: user?.profile?.landmark ?? null,
            zip_code: user?.profile?.zip_code ?? null,
            loyalty_points: user?.profile?.loyalty_points ?? 0,
            preferred_payment_method:
              user?.profile?.preferred_payment_method ?? null,
            created_at: user?.profile?.created_at ?? "",
          },
        })
      );
    };

    fetchUserReq({
      requestConfig: {
        url: "/orders/buyer/",
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

    userInforHttpRequest({
      requestConfig: {
        url: "/accounts/UserDetails/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: fetchUserSucRes,
    });
  }, [
    token,
    dispatch,
    userInforHttpRequest,
    userAddressHttpRequest,
    wishlistReq,
  ]);

  if (loading)
    return (
      <div className="w-full flex justify-center h-screen items-center py-10">
        <DotSpinner size={10} color="#ff715b" gap={8} />
      </div>
    );

  return (
    <>
      {/* Mobile Dashboard */}
      <div className="md:hidden">
        <BuyerDashboard />
      </div>

      {/* Breadcrumb for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pl-c56 pt-c20 z-40 md:flex items-center w-full hidden"
        style={{ top: "5rem" }}
      >
        <nav aria-label="breadcrumb" className="flex items-center gap-2">
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
            Account
          </span>
        </nav>
      </motion.div>

      {/* Desktop Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <UserMain />
      </motion.div>
    </>
  );
}
