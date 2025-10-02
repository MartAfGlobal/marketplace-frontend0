"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { sellerActions } from "@/store/user-data/seller/seller-slice";
import { useRouter } from "next/navigation";
import { SellerData } from "@/types/global";
import { toast } from "sonner";

export default function SellerDashboardPage() {
  const { sendHttpRequest: userInforHttpRequest } = useHttp();
  const { sendHttpRequest: statusHttpRequest } = useHttp();
  const dispatch = useDispatch();
  const router = useRouter();

  const token = useSelector((state: any) => state.token?.token);

  useEffect(() => {
    if (!token) {
      toast.error("No token, skipping user fetch");
      router.push("/auth/seller/login");
    
    }
    const fetchVerificationStatus = () => {
      statusHttpRequest({
        requestConfig: {
          url: "/accounts/manufacturer/verification-status/",
          method: "GET",
          token,
          isAuth: true,
          successMessage: "Verification status fetched",
          userType : "seller"
        },
        successRes: (statusRes: any) => {
          const status = statusRes?.data;

          // Safely extract percentage
          const percentage =
            status?.progress_percentage ??
            status?.manufacturer_data?.verification_progress?.percentage ??
            0;


  

          // ✅ Save into Redux for use in overview
          dispatch(
            sellerActions.updateSellerVerification({
              percentage: percentage, // whatever comes from API
              raw: status,
            })
          );

          router.replace("/dashboard/seller/overview");
           console.log("✅ Manufacturer verification status:", percentage)
        },
             
         
      });

      
    };

    const fetchUserSucRes = (res: any) => {
      console.log("✅ User info fetched:", res);

      const resData: any = res?.data;

    

      dispatch(
        sellerActions.updateSellerData({
          profileId: resData.id, // manufacturer profile id
          email: resData.email || "", // fallback if empty
          first_name: resData.first_name || "",
          phone: resData.profile?.phone || "", // use profile phone if available
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
      <h2>Fetching Seller data....</h2>
    </div>
  );
}
