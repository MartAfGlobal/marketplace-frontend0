"use client";

import DashBoardHeader from "@/components/ui/seller-components/dashboard-header";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { sellerActions } from "@/store/user-data/seller/seller-slice";
import { RootState } from "@/store";
import { useTokenExpiration } from "@/hooks/useTokenExpiration";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  useTokenExpiration();
  
  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest: userInforHttpRequest } = useHttp();
  const { sendHttpRequest: statusHttpRequest } = useHttp();

  useEffect(() => {
    if (!token) return;
  

    const fetchVerificationStatus = () => {
      statusHttpRequest({
        requestConfig: {
          url: "/accounts/manufacturer/verification-status/",
          method: "GET",
          token,
          isAuth: true,
          userType: "seller",
        },
        successRes: (statusRes: any) => {
          const status = statusRes?.data;
          const percentage =
            status?.progress_percentage ??
            status?.manufacturer_data?.verification_progress?.percentage ??
            0;

          dispatch(
            sellerActions.updateSellerVerification({
              percentage: percentage,
              raw: status,
            })
          );
        },
      });
    };

    const fetchUserSucRes = (res: any) => {
      const resData = res?.data;
      console.log("Fetched Seller data:", resData);

      if (resData) {
        dispatch(sellerActions.setSellerData(resData));
      }

      fetchVerificationStatus();
    };


    userInforHttpRequest({

      requestConfig: {
        url: "/accounts/manufacturer/user-details/",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: fetchUserSucRes,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dispatch]);

  const isRegistrationProgress =
    pathname === "/dashboard/seller/registration-progress";

  return (
    <div className="min-h-screen flex flex-col w-full">
      {!isRegistrationProgress && <DashBoardHeader />}
      <main className="flex-1 w-full pt-6 md:pt-c32 px-4 md:px-c32 bg-[#947fff]/10 mt-18">
        {children}
      </main>
    </div>
  );
}
