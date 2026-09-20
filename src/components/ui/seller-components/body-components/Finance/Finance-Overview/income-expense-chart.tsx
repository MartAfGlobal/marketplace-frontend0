"use client";

import { useState, useEffect } from "react";
import FilterDropdown from "../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../over-view/Filter-components/filterOptions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAppSelector } from "@/store/Provider";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";

type RangeType = "weekly" | "monthly" | "yearly";

const RANGE_MAP: Record<string, RangeType> = {
  "This Week": "weekly",
  "This Month": "monthly",
  "This Year": "yearly",
};

interface ChartPoint {
  name: string;
  income: number;
  expense: number;
}

export default function IncomeAndExpenseChart() {
  const { balance: financeBalance } = useAppSelector((state) => state.finance);
  const token = useAppSelector((state) => state.token?.token);
  const { fetchSalesChart } = useFetchProducts();

  const [range, setRange] = useState<RangeType>("weekly");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetchSalesChart(range, (data: any) => {
      if (data?.chart_data && Array.isArray(data.chart_data)) {
        const formatted: ChartPoint[] = data.chart_data.map((item: any) => {
          let label = item.period;
          try {
            const d = new Date(item.period);
            if (!isNaN(d.getTime())) {
              if (range === "weekly") {
                label = d.toLocaleDateString("en-US", { weekday: "short" });
              } else if (range === "monthly") {
                label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              } else if (range === "yearly") {
                label = d.toLocaleDateString("en-US", { month: "short" });
              }
            }
          } catch {}
          return {
            name: label,
            income: parseFloat(item.gross_revenue ?? item.net_revenue ?? 0),
            expense: parseFloat(item.platform_fee ?? 0),
          };
        });
        setChartData(formatted);
      }
      setLoading(false);
    });
  }, [range, token]);

  const handleRangeChange = (selected: string) => {
    const mapped = RANGE_MAP[selected];
    if (mapped) {
      setRange(mapped);
    }
  };

  const pieData = [
    { 
      name: " Sales", 
      value: financeBalance ? (typeof financeBalance.sales === 'string' ? parseFloat(financeBalance.sales) : financeBalance.sales) : 75, 
      color: "#4DBEA7" 
    },
    { 
      name: "Refunds", 
      value: financeBalance ? (typeof financeBalance.refunds === 'string' ? parseFloat(financeBalance.refunds) : financeBalance.refunds) : 15, 
      color: "#CA0202" 
    },
    { name: "Promotions", value: 10, color: "#FFAC06" },
  ];

  const formatYAxisTick = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return String(val);
  };

  return (
    <div className="w-full mt-8">
      <div className="w-full space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-c18 font-MontserratNormal mb-2">
              Income/expense
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-[2px]" 
                  style={{ 
                    background: 'linear-gradient(150.73deg, rgba(77, 190, 167, 0.64) 12.63%, rgba(255, 255, 255, 0) 107.22%)',
                    border: '1px solid #4DBEA7'
                  }} 
                />
                <span className="text-[10px] font-MontserratMedium text-[#666666]">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-[2px]" 
                  style={{ 
                    background: 'linear-gradient(150.73deg, rgba(202, 2, 2, 0.64) 12.63%, rgba(255, 255, 255, 0) 107.22%)',
                    border: '1px solid #CA0202'
                  }} 
                />
                <span className="text-[10px] font-MontserratMedium text-[#666666]">Expense</span>
              </div>
            </div>
          </div>
          <FilterDropdown
            options={filterOptions}
            defaultValue="This Week"
            onChange={handleRangeChange}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between w-full gap-12 mt-6 min-h-fit mb-8">
        {/* Area Chart Section */}
        <div className="flex-1 w-full max-w-200">
          {loading && (
            <div className="h-[360px] flex items-center justify-center text-[11px] font-MontserratMedium text-[#999999] animate-pulse">
              Loading sales chart…
            </div>
          )}

          {!loading && chartData.length === 0 && (
            <div className="h-[360px] flex items-center justify-center text-[11px] font-MontserratMedium text-[#999999]">
              No sales chart data available for this range.
            </div>
          )}

          {!loading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4DBEA7" stopOpacity={0.64} />
                    <stop offset="95%" stopColor="#4DBEA7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CA0202" stopOpacity={0.64} />
                    <stop offset="95%" stopColor="#CA0202" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E6E6E6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#000000",
                    fontFamily: "Montserrat-Regular",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  tickFormatter={formatYAxisTick}
                  domain={[0, "auto"]}
                  tick={{
                    fontSize: 12,
                    fill: "#000000",
                    fontFamily: "Montserrat-Regular",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "11px",
                  }}
                  formatter={(value: any, name: any) => [
                    `N${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    name === "income" ? "Income" : name === "expense" ? "Expense" : name
                  ]}
                  cursor={{ stroke: "#f0f0f0", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#4DBEA7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#CA0202"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart Section */}
        <div className="w-full lg:w-55.75 flex flex-col gap-6 h-fit py-9.5">
          <div className="w-[174.69px] h-[174.69px] flex justify-start relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="60%"
                  outerRadius="100%"
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full grid grid-cols-1 gap-3">
            {pieData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-c12 font-MontserratNormal">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
