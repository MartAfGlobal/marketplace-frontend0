"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { periodFromLabel } from "@/helpers/admin/financeFormat";
import FinanceTrendCard from "@/components/admin-components/finance/FinanceTrendCard";
import FinanceSourcesCard from "@/components/admin-components/finance/FinanceSourcesCard";
import PendingPayoutsCard from "@/components/admin-components/finance/PendingPayoutsCard";
import type { FinanceDashboard, SourceGrouping } from "@/types/finance";

// Each card has its own period dropdown (revenue and its sources share one,
// as do expenses and theirs), so the dashboard is fetched per figure.
type Figure = "revenue" | "expenses";

export default function FinancesOverviewPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchFinanceDashboard } = FinanceDetails();

  const [periods, setPeriods] = useState<Record<Figure, string>>({ revenue: "this_month", expenses: "this_month" });
  const [grouping, setGrouping] = useState<Record<Figure, SourceGrouping>>({ revenue: "category", expenses: "category" });
  const [data, setData] = useState<Record<Figure, FinanceDashboard | null>>({ revenue: null, expenses: null });

  const load = (figure: Figure) =>
    fetchFinanceDashboard(
      { period: periods[figure], revenue_by: grouping.revenue, expense_by: grouping.expenses },
      (d: FinanceDashboard) => setData((prev) => ({ ...prev, [figure]: d })),
    );

  useEffect(() => {
    if (token) load("revenue");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, periods.revenue, grouping.revenue]);

  useEffect(() => {
    if (token) load("expenses");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, periods.expenses, grouping.expenses]);

  const setPeriod = (figure: Figure) => (label: string) =>
    setPeriods((prev) => ({ ...prev, [figure]: periodFromLabel(label) }));
  const setGroup = (figure: Figure) => (g: SourceGrouping) => setGrouping((prev) => ({ ...prev, [figure]: g }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <h1 className="text-xl md:text-c18 font-MontserratSemiBold mb-8">Overview</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FinanceTrendCard
          title="Revenue"
          figure={data.revenue?.revenue}
          color="#3F6F5A"
          period={periods.revenue}
          onPeriodChange={setPeriod("revenue")}
        />
        <FinanceSourcesCard
          title="Revenue sources"
          sources={data.revenue?.revenue.sources}
          grouping={grouping.revenue}
          onGroupingChange={setGroup("revenue")}
          period={periods.revenue}
          onPeriodChange={setPeriod("revenue")}
        />

        <FinanceTrendCard
          title="Expenses"
          figure={data.expenses?.expenses}
          color="#C1272D"
          period={periods.expenses}
          onPeriodChange={setPeriod("expenses")}
        />
        <FinanceSourcesCard
          title="Expense sources"
          sources={data.expenses?.expenses.sources}
          grouping={grouping.expenses}
          onGroupingChange={setGroup("expenses")}
          period={periods.expenses}
          onPeriodChange={setPeriod("expenses")}
        />

        <PendingPayoutsCard pending={(data.revenue ?? data.expenses)?.pending_payouts} />
      </div>
    </div>
  );
}
