
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const pieChartData = [
  {
    name: "Market Share",
    value: 32.5,
    display: "32.5%",
  },
  {
    name: "Sales Velocity",
    value: 18,
    display: "18,243/mo",
  },
  {
    name: "Average Rating",
    value: 4.7,
    display: "4.7/5",
  },
];
const pieColors = ["#9b87f5", "#F97316", "#0EA5E9"];

export default function PieChartSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-12 animate-fade-in">
      <div className="rounded-xl bg-white/90 shadow-lg backdrop-blur-sm p-6 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-gray-800 mb-3">
          Product Metrics Breakdown
        </span>
        <PieChart width={320} height={220}>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={43}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(1)}%)`
            }
            labelLine={false}
          >
            {pieChartData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(_value: any, name: any, props: any) => {
              if (props && typeof props.dataIndex === 'number' && pieChartData[props.dataIndex]) {
                return [`${pieChartData[props.dataIndex].display}`, name];
              }
              return [`${_value}`, name];
            }}
            contentStyle={{ backgroundColor: "#fff", color: "#151515" }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value: string) => (
              <span className="text-gray-700 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </div>
    </section>
  );
}
