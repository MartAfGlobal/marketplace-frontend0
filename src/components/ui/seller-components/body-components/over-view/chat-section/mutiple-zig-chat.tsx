import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface OrdersChartPoint {
  month: string;
  line1?: number | null;
  line2?: number | null;
  line3?: number | null;
}

const defaultData = [
  { month: "Jan", line1: 502, line2: 500, line3: 504 },
  { month: "Feb", line1: 496, line2: 504, line3: 498 },
  { month: "Mar", line1: 508, line2: 495, line3: 506 },
  { month: "Apr", line1: 502, line2: 507, line3: 501 },
  { month: "May", line1: 495, line2: 503, line3: 496 },
  { month: "Jun", line1: 507, line2: 498, line3: 505 },
  { month: "Jul", line1: 501, line2: 506, line3: 502 },
  { month: "Aug", line1: 499, line2: 502, line3: 497 },
  { month: "Sept", line1: 506, line2: 497, line3: 504 },
  { month: "Oct", line1: 503, line2: 508, line3: 500 },
  { month: "Nov", line1: 497, line2: 501, line3: 502 },
  { month: "Dec", line1: 505, line2: 499, line3: 506 },
];

export default function MultiLineZigZagChart({
  data,
}: {
  data?: OrdersChartPoint[];
}) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const chartData = data ?? defaultData;
  const maxValue = data
    ? Math.max(
        0,
        ...data.flatMap((point) =>
          [point.line1, point.line2, point.line3].filter(
            (value): value is number => typeof value === "number" && Number.isFinite(value),
          ),
        ),
      )
    : 0;
  const axisMax = Math.max(3, Math.ceil(maxValue / 3) * 3);
  const axisTicks = Array.from({ length: 4 }, (_, index) => (axisMax / 3) * index);
  return (
    <>
    {isIncomplete ? (

      <div className="seller-overview-panel w-full h-[230px] mt-4 lg:mt-c32 overflow-x-auto scrollbar-hide">
        <div className="min-w-[700px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: -20,
                bottom: 10,
              }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "rgba(0, 0, 0, 0.56)",
                  fontFamily: "Montserrat-SemiBold",
                }}
                tickMargin={10}
                interval={data ? "preserveStartEnd" : 0}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                domain={data ? [0, axisMax] : [485, 515]}
                ticks={data ? axisTicks : [485, 490, 495, 500, 505, 510, 515]}
                interval={0}
                axisLine={false}
                tickLine={false}
                tickMargin={20}
                tick={{
                  fontSize: 12,
                  fill: "rgba(0, 0, 0, 0.56)",
                  fontFamily: "Montserrat-SemiBold",
                }}
                tickFormatter={data ? undefined : (_, index) => (index % 2 === 0 ? "500" : "")}
                allowDecimals={false}
              />
              <Line
                type="linear"
                dataKey="line1"
                stroke="#947FFF"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="linear"
                dataKey="line2"
                stroke="#6A0DAD"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="linear"
                dataKey="line3"
                stroke="#947FFF80"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    ):(

      <div className="seller-overview-panel w-full h-[158px] mt-8 bg-ffffff overflow-x-auto scrollbar-hide">
        <div className="W-full h-full  min-w-113.75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: -10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "rgba(0, 0, 0, 0.56)",
                  fontFamily: "Montserrat-SemiBold",
                }}
                tickMargin={10}
                interval={data ? "preserveStartEnd" : 0}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                domain={data ? [0, axisMax] : [485, 515]}
                ticks={data ? axisTicks : [485, 490, 495, 500, 505, 510, 515]}
                interval={0}
                axisLine={false}
                tickLine={false}
                tickMargin={20}
                tick={{
                  fontSize: 12,
                  fill: "rgba(0, 0, 0, 0.56)",
                  fontFamily: "Montserrat-SemiBold",
                }}
                tickFormatter={data ? undefined : (_, index) => (index % 2 === 0 ? "500" : "")}
                allowDecimals={false}
              />
              <Line
                type="linear"
                dataKey="line1"
                stroke="#947FFF"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="linear"
                dataKey="line2"
                stroke="#6A0DAD"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="linear"
                dataKey="line3"
                stroke="#947FFF80"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}
    </>
  );
}
