"use client";
import React from "react";
import { useSelector } from "react-redux";
import CategoryRanking from "./category-ranking";
import Charts from "./chat-section/chat-section";
import OverviewOder from "./oders";
import OverviewCards from "./overview-cards";
import OverviewHeader from "./overview-header";
import ProductInventory from "./product-inventory";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { RootState } from "@/store";
import { useEffect } from "react";
import OverviewSkeleton from "@/components/reloadSpinner/OverviewSkeleton";

import { useState } from "react";
import { useHttp } from "@/hooks/use-http";
import { getMetricTotal } from "./overview-data";

export default function OverviewBody() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [overviewAnalytics, setOverviewAnalytics] = useState<unknown>(null);
  const token = useSelector((state: RootState) => state.token?.token);

  const {
    fetchProducts,
    fetchdDraft,
    fetchBalance,
    fetchOrders,
    fetchTransactions,
    loading,
  } = useFetchProducts();
  const product = useSelector(
    (state: RootState) => state.sellerProduct.product,
  );
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const sellerVerification = useSelector(
    (state: RootState) => state.seller.verificationStatus,
  );
  const { sendHttpRequest: fetchOverviewAnalytics } = useHttp();

  useEffect(() => {
    if (token) {
      fetchdDraft();
      fetchProducts();
      fetchBalance();
      fetchOrders();
      fetchTransactions();
    }
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
    // These hook methods are recreated every render; fetching is keyed to the auth token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetchOverviewAnalytics({
      requestConfig: {
        url: `/orders/manufacturer/analytics?period=${period}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (response: unknown) => {
        const responseData =
          typeof response === "object" &&
          response !== null &&
          "data" in response
            ? response.data
            : response;
        const analytics =
          typeof responseData === "object" &&
          responseData !== null &&
          "data" in responseData
            ? responseData.data
            : responseData;
        setOverviewAnalytics(analytics ?? {});
      },
      errorRes: (error: unknown) => {
        console.warn(
          "Seller overview analytics unavailable:",
          error instanceof Error ? error.message : error,
        );
        setOverviewAnalytics(null);
      },
    });
  }, [fetchOverviewAnalytics, period, token]);

  if (initialLoading || (loading && (!product || product.length === 0)))
    return <OverviewSkeleton />;

  const verificationPercentage =
    sellerVerification?.percentage ??
    sellerData?.profile?.verification_progress?.percentage;
  const isUnapproved =
    verificationPercentage !== undefined && verificationPercentage < 100;
  const hasOverviewData =
    (product?.length ?? 0) > 0 ||
    (["sales", "orders", "products", "customers"] as const).some(
      (metric) => getMetricTotal(overviewAnalytics, metric) > 0,
    );
  const isUnavailable = isUnapproved || (overviewAnalytics !== null && !hasOverviewData);

  return (
    <>
      <style jsx global>{`
        .seller-overview[data-unavailable="true"] .seller-overview-panel {
          background: linear-gradient(0deg, #000000, #000000),
            linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.88),
              rgba(255, 255, 255, 0.88)
            ) !important;
        }
      `}</style>
    <div
      className="seller-overview space-y-6 pb-c32"
      data-unavailable={isUnavailable}
    >
      <div className ="w-full">
        <OverviewHeader period={period} onPeriodChange={setPeriod} />
      </div>

      <div>
        <OverviewCards analytics={overviewAnalytics} />
      </div>
      <div className="w-full ">
        <Charts />
      </div>
      <div className="flex flex-col  lg:flex-row gap-6 lg:gap-c32">
        <div className="w-full lg:flex-1 order-2 lg:order-1 ">
          <ProductInventory />
        </div>
        <div className="w-full  lg:max-w-137.25  lg:flex-1 order-1 lg:order-2 overflow-x-hidden">
          <CategoryRanking />
        </div>
      </div>
      <div className="hidden lg:block">
        <OverviewOder />
      </div>
    </div>
    </>
  );
}
