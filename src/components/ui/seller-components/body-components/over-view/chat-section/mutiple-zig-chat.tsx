import React from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
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

export default function MultiLineZigZagChart() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  return (
    <>
    {isIncomplete ? (

      <div className="w-full h-[230px] mt-4 lg:mt-c32 overflow-x-auto scrollbar-hide">
        <div className="min-w-[700px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
                interval={0}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                domain={[485, 515]}
                ticks={[485, 490, 495, 500, 505, 510, 515]}
                interval={0}
                axisLine={false}
                tickLine={false}
                tickMargin={20}
                tick={{
                  fontSize: 12,
                  fill: "rgba(0, 0, 0, 0.56)",
                  fontFamily: "Montserrat-SemiBold",
                }}
                tickFormatter={(_, index) => (index % 2 === 0 ? "500" : "")}
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

      <div className="w-full  h-[158px] mt-8 bg-ffffff  overflow-x-auto scrollbar-hide">
        <div className="W-full h-full  min-w-113.75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
                interval={0}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                domain={[485, 515]}
                ticks={[485, 490, 495, 500, 505, 510, 515]}
                interval={0}
                axisLine={false}
                tickLine={false}
                tickMargin={20}
                tick={{
                  fontSize: 12,
                  fill: "rgba(0, 0, 0, 0.56)",
                  fontFamily: "Montserrat-SemiBold",
                }}
                tickFormatter={(_, index) => (index % 2 === 0 ? "500" : "")}
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
