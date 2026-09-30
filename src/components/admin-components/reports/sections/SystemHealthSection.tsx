"use client";

import { Activity } from "lucide-react";

/**
 * Deferred per the Reports PRD itself: "Data is sourced from real
 * infrastructure/monitoring tooling -- this section must not ship with
 * fabricated or placeholder metrics," and the monitoring/observability
 * data source is explicitly unconfirmed (P1, pending Engineering + DevOps
 * decision). Showing an honest "not yet available" state is the correct
 * MVP behavior here, not inventing uptime/error-rate numbers.
 */
export default function SystemHealthSection() {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <Activity className="w-5 h-5 text-000000/44" />
      </div>
      <p className="text-sm font-MontserratSemiBold">System Health isn&apos;t connected yet</p>
      <p className="text-c12 text-000000/44 font-MontserratNormal max-w-md">
        This section needs a real infrastructure/monitoring data source (uptime, API error rate, response time,
        security alerts), which hasn&apos;t been chosen yet. Showing placeholder numbers here would be misleading, so
        this stays empty until that&apos;s connected.
      </p>
    </div>
  );
}
