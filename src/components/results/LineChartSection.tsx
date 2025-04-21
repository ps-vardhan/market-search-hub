
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const lineChartData = [
  { month: "OCT", year: "2019", value: 40 },
  { month: "NOV", year: "", value: 70 },
  { month: "DEC", year: "", value: 38 },
  { month: "JAN", year: "2020", value: 40 },
  { month: "FEB", year: "", value: 42 },
  { month: "MAR", year: "", value: 10 },
  { month: "APR", year: "", value: 25 },
  { month: "MAY", year: "", value: 55 },
  { month: "JUN", year: "", value: 80 },
];

export default function LineChartSection() {
  return (
    <section className="mb-12">
      <div className="rounded-xl bg-white/90 shadow-lg backdrop-blur-sm px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-2">
          <span className="text-lg md:text-xl font-semibold text-gray-800 block mb-1 md:mb-0">
            Produce sales
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium block">
            In Thousands (USD)
          </span>
        </div>
        <div className="w-full h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 20, right: 25, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#DEE2E6" opacity={0.7} vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
                tick={{ fill: "#444", fontSize: 13, fontWeight: 500 }}
                interval={0}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#222", fontSize: 12, fontWeight: 500 }}
                domain={[0, 90]}
                ticks={[0,10,20,30,40,50,60,70,80,90]}
              />
              <Tooltip
                formatter={(value: any) => [`${value}K`, "Sales"]}
                cursor={{ stroke: "#222", strokeWidth: 1, opacity: 0.2 }}
                contentStyle={{ backgroundColor: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#151515"
                strokeWidth={4}
                dot={{
                  r: 6,
                  fill: "#fff",
                  stroke: "#151515",
                  strokeWidth: 3
                }}
                activeDot={{
                  r: 9,
                  fill: "#151515",
                  stroke: "#151515",
                  strokeWidth: 3
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-gray-400 text-xs text-left pl-2 mt-3">OCT 2019 - JUN 2020</div>
      </div>
    </section>
  );
}
