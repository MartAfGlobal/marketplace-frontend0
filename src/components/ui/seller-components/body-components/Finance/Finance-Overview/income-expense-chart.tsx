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

const areaData = [
  { name: "Mon", teal: 50, red: 70 },
  { name: "Tue", teal: 25, red: 150 },
  { name: "Wed", teal: 300, red: 245 },
  { name: "Thus", teal: 300, red: 55 },
  { name: "Fri", teal: 400, red: 300 },
  { name: "Sat", teal: 400, red: 80 },
  { name: "Sun", teal: 10, red: 0 },
];

const pieData = [
  { name: "Promotion", value: 10, color: "bg-[#4DBEA7]"},
  { name: "Refunds", value: 25,  color: "bg-[#F85252]" },
  { name: "Sales", value: 65,  color: "bg-[#FFAC06]"},
];

const COLORS = ["#FFAC06", "#F50000", "#4DBEA7"];

export default function IncomeAndExpenseChart() {
  return (
    <div className="w-full  h-100.75 mt-c32 ">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center mb-6">
          <p className="font-MontserratNormal text-c18">Income/expense</p>
          <FilterDropdown
            options={filterOptions}
            onChange={(value) => console.log("Selected:", value)}
          />
        </div>
      </div>
      <div className="flex w-full text-c12 font-MontserratNormal gap-46 h-84.75">
        <div className="w-full ">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={areaData}
              margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ED3B7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2ED3B7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F04438" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F04438" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="0" vertical={false} />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tickMargin={18.99}
                padding={{ left: 0 }}
                tick={{ dx: 15 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={24}
                interval={0}
                ticks={[0, 50, 100, 200, 300, 350, 400, 450]}
              />

              <Tooltip cursor={false} />

              <Area
                type="monotone"
                dataKey="teal"
                stroke="#2ED3B7"
                fillOpacity={1}
                fill="url(#colorTeal)"
              />
              <Area
                type="monotone"
                dataKey="red"
                stroke="#F04438"
                fillOpacity={1}
                fill="url(#colorRed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full max-w-55.75 ">
          <div className="w-43.75 h-43.75 mt-9.5 ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  startAngle={170} // starting point
                  endAngle={-190}
                  innerRadius={55}
                  outerRadius={86}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {pieData.map((data)=>(
                <div key={data.name}>
                    <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-lg ${data.color}`}></div>
                        <p className="tex-c12 font-MontserratNormal">{data.name}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
