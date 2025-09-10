"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { sellerActions } from "@/store/user-data/seller/seller-slice";
import { useRouter } from "next/navigation";
import { SellerData } from "@/types/global";

export default function SellerDashboardPage() {
  const { sendHttpRequest: userInforHttpRequest } = useHttp();
  const { sendHttpRequest: statusHttpRequest } = useHttp();
  const dispatch = useDispatch();
  const router = useRouter();

  const token = useSelector((state: any) => state.token?.token);

  useEffect(() => {
    if (!token) {
      console.warn("No token, skipping user fetch");
      return;
    }

    const fetchVerificationStatus = () => {
      statusHttpRequest({
        requestConfig: {
          url: "/accounts/manufacturer/verification-status/",
          method: "GET",
          token,
          isAuth: true,
          successMessage: "Verification status fetched",
        },
        successRes: (statusRes: any) => {
          const status = statusRes?.data;
          console.log("✅ Manufacturer verification status:", status);

          const isIncomplete = status?.progress_percentage !== "100";

          // ✅ Save into Redux for use in overview
          dispatch(
            sellerActions.updateSellerVerification({
              status,
              isIncomplete,
            })
          );

          // ✅ Always redirect to overview page
          console.log("➡️ Redirecting to dashboard/seller/overview...");
          router.replace("/dashboard/seller/overview");
        },
      });
    };

    const fetchUserSucRes = (res: any) => {
      console.log("✅ User info fetched:", res);

      const resData: any = res?.data;
      const sellerUser: SellerData =
        resData?.buyerDetails || resData?.user || resData;

      dispatch(
        sellerActions.updateSellerData({
          email: sellerUser.email || "",
          first_name: sellerUser.first_name || "",
          phone: sellerUser.phone || sellerUser.profile?.phone || "",
        })
      );

      // run verification check before routing
      fetchVerificationStatus();
    };

    userInforHttpRequest({
      requestConfig: {
        url: "/accounts/UserDetails/",
        method: "GET",
        token,
        isAuth: true,
        successMessage: "User info fetched",
        userType: "seller",
      },
      successRes: fetchUserSucRes,
    });
  }, [token, dispatch, router, userInforHttpRequest, statusHttpRequest]);

  return (
    <div className="p-4 w-full">
      <h1>Seller Dashboard</h1>
      <h2>Fetching user data....</h2>
    </div>
  );
}
