"use client";

import DashBoardHeader from "@/components/ui/seller-components/dashboard-header";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { sellerActions } from "@/store/user-data/seller/seller-slice";
import { RootState } from "@/store";
import Image from "next/image";
import { useTokenExpiration } from "@/hooks/useTokenExpiration";
import kycIcon from "@/assets/Seller/completeKYC.svg";

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
  const sellerData = useSelector((state: RootState) => state.seller.data)
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
            }),
          );
        },
      });
    };

    const fetchUserSucRes = (res: any) => {
      const resData = res?.data;
      console.log("Fetched Seller data:", resData);

      if (resData) {
        dispatch(sellerActions.setSellerData(resData));
        console.log("hhhhhhh", sellerData)
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

    const RegistrationPercentage = sellerData?.profile.verification_progress?.percentage

  return (
    <div className="min-h-screen flex flex-col w-full ">
      {!isRegistrationProgress && <DashBoardHeader />}

      <main className="flex-1 w-full pt-6 md:pt-6 px-4 md:px-c48 bg-[#947fff]/10 mt-18 relative">
        {RegistrationPercentage && RegistrationPercentage !== 100 && <div className="bg-0070e9/68 w-108.25 flex gap-2.5 h-18 absolute top-6 z-20 right-c48 px-2.5 py-3">
          <div className="w-6 h-6 flex-shrink-0">
            <Image src={kycIcon} alt="warning" width={24} height={24} />
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-fffff font-MontserratNormal text-ffffff text-xs leading-4">
              Complete your KYB documentation to begin using our services
            </p>
            <div className="flex w-full justify-between">
              <div className="w-50.5 space-y-2">
                <p className="text-fffff font-MontserratNormal text-ffffff text-c10 leading-3">
                  {RegistrationPercentage?? 0} % completed
                </p>
                <div className="w-full  h-1 bg-ffffff rounded-c4">
                  <div className="bg-0070e9 rounded-c4 h-full" style={{ width: `${RegistrationPercentage ?? 0}%` }} />
                </div>
              </div>
              <button onClick={() => router.push("/dashboard/seller/settings#Documents")} className="h-6 w-18 flex items-center justify-center font-MontserratSemiBold text-c10 text-ffffff">
                Continue
              </button>
            </div>
          </div>
        </div>}
        {children}
      </main>
    </div>
  );
}
