"use client";

import { useEffect, useState } from "react";
import { Timer, TruckIcon, AlertTriangle, CheckCircle2 } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import { ReportLoadingSkeleton, ReportErrorState, ReportEmptyState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";

const SEVERITY_STYLES: Record<string, string> = {
  HIGH: "bg-[#CA0202]/10 text-[#CA0202] border-[#CA0202]/20",
  MEDIUM: "bg-[#FFAC06]/10 text-[#B67300] border-[#FFAC06]/30",
  LOW: "bg-gray-100 text-000000/68 border-000000/8",
};

export default function MarketplaceOperationsSection() {
  const { fetchSalesSummary, fetchDeliveryPerformance, fetchOperationalAlerts, markAlertReviewed } = ReportsDetails();

  const [summary, setSummary] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchSalesSummary({ range: "total" }, (d: any) => { setSummary(d); setLoading(false); }, () => { setError(true); setLoading(false); });
    fetchDeliveryPerformance((d) => setDelivery(d));
    fetchOperationalAlerts((d: any) => setAlerts(d?.alerts ?? []));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkReviewed = (alertKey: string) => {
    setAlerts((prev) => prev.map((a) => (a.alert_key === alertKey ? { ...a, reviewed: true } : a)));
    markAlertReviewed(alertKey);
  };

  const s = summary?.summary;

  return (
    <div className="space-y-6">
      {loading ? (
        <ReportLoadingSkeleton />
      ) : error || !s ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusFrame title="Awaiting Acceptance" quantity={s.pending.count} icon={<StatIcon tone="warning"><Timer className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Fulfilled" quantity={s.fulfilled.count} icon={<StatIcon tone="neutral"><TruckIcon className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Delivered" quantity={s.delivered.count} icon={<StatIcon tone="positive"><CheckCircle2 className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Cancelled" quantity={s.cancelled.count} icon={<StatIcon tone="negative"><AlertTriangle className="w-4 h-4" /></StatIcon>} />
          </div>

          {delivery && (
            <div className="rounded-2xl border border-000000/8 p-6">
              <h3 className="text-base font-MontserratNormal text-000000/68 mb-4">Delivery performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-c12 text-000000/68">Average delivery time</p>
                  <p className="text-c18 font-MontserratSemiBold mt-1">
                    {delivery.average_delivery_time_hours != null ? `${delivery.average_delivery_time_hours}h` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-c12 text-000000/68">Late & still undelivered</p>
                  <p className="text-c18 font-MontserratSemiBold mt-1">{delivery.orders_late_and_still_undelivered}</p>
                </div>
                <div>
                  <p className="text-c12 text-000000/68">Delivered late</p>
                  <p className="text-c18 font-MontserratSemiBold mt-1">{delivery.orders_delivered_late}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-000000/8 p-6">
            <h3 className="text-base font-MontserratNormal text-000000/68 mb-4">Operational alerts</h3>
            {alerts.length === 0 ? (
              <ReportEmptyState message="No operational alerts right now -- everything's within its usual deadlines and thresholds." />
            ) : (
              <div className="space-y-3">
                {alerts.map((a) => (
                  <div
                    key={a.alert_key}
                    className={`flex items-start justify-between gap-4 rounded-c8 border p-4 ${a.reviewed ? "opacity-50" : ""} ${SEVERITY_STYLES[a.severity] ?? SEVERITY_STYLES.LOW}`}
                  >
                    <div>
                      <p className="text-[10px] font-MontserratSemiBold uppercase tracking-wide">{a.severity} · {a.type.replace(/_/g, " ")}</p>
                      <p className="text-c12 font-MontserratNormal mt-1">{a.message}</p>
                    </div>
                    {!a.reviewed && (
                      <button
                        onClick={() => handleMarkReviewed(a.alert_key)}
                        className="text-c12 font-MontserratSemiBold whitespace-nowrap hover:underline cursor-pointer"
                      >
                        Mark reviewed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <DataAsOf at={new Date()} />
    </div>
  );
}
