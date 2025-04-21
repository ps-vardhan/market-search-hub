import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChartLine } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

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

const recommendations = [
  {
    title: "+5%",
    subtitle: "Moderate Growth",
    className: "text-yellow-400",
    bg: "bg-black/70",
    description: "",
  },
  {
    title: "+10%",
    subtitle: "Strong Growth",
    className: "text-green-400",
    bg: "bg-black/70",
    description: "",
  },
  {
    title: "Discontinue",
    subtitle: "Consider phasing out this product",
    className: "text-pink-500",
    bg: "bg-black/70",
    description: "",
  },
];

const parseQuery = (search: string) => {
  const params = new URLSearchParams(search);
  return params.get("query") || "";
};

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

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = parseQuery(location.search);

  useEffect(() => {
    if (!query) {
      navigate("/");
    }
  }, [query, navigate]);

  return (
    <main className="relative min-h-screen bg-gradient-to-tr from-[#1EAEDB] via-[#7E69AB] to-[#221F26] flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#1EAEDB" />
            </linearGradient>
            <linearGradient id="chart-grad2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="30%" stopColor="#FFA99F" />
              <stop offset="100%" stopColor="#9b87f5" />
            </linearGradient>
          </defs>
          <path
            className="animate-float-1"
            d="M0,120 Q320,60 640,120 T1280,120"
            fill="none"
            stroke="url(#chart-grad1)"
            strokeWidth="5"
            opacity="0.07"
          />
          <path
            className="animate-float-2"
            d="M0,350 Q320,250 640,350 T1280,350"
            fill="none"
            stroke="url(#chart-grad2)"
            strokeWidth="5"
            opacity="0.08"
          />
          <circle cx="80%" cy="20%" r="60" fill="#F1F0FB" opacity="0.09" />
        </svg>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-32 pb-12 w-full">
        <div className="flex items-center gap-3 mb-10">
          <ChartLine className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-white drop-shadow">
            Performance for
            <span className="text-orange-400 ml-2">{query}</span>
          </h2>
        </div>
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
        <section className="mb-12">
          <div className="w-full flex flex-col md:flex-row gap-6">
            {recommendations.map((rec, idx) => (
              <div
                key={rec.title}
                className={`${rec.bg} flex-1 rounded-xl flex flex-col items-center justify-center py-7 px-2 text-center shadow-md`}
                style={{
                  minWidth: 0,
                  minHeight: 120,
                }}
              >
                <span
                  className={`block font-bold ${
                    idx === 0
                      ? "text-3xl"
                      : idx === 1
                      ? "text-3xl"
                      : "text-2xl"
                  } ${rec.className}`}
                >
                  {rec.title}
                </span>
                <span
                  className={`block mt-3 ${
                    idx === 2 ? "text-gray-300" : "text-gray-200"
                  } font-normal text-base`}
                >
                  {rec.subtitle}
                </span>
                {rec.description && (
                  <span className="block text-xs mt-0.5">{rec.description}</span>
                )}
              </div>
            ))}
          </div>
        </section>
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
        <section className="mb-10">
          <div className="bg-white/10 rounded-xl p-6 flex flex-col">
            <span className="text-lg font-semibold text-white mb-3">Recent Trends</span>
            <div className="h-48 flex items-center justify-center">
              <div className="w-full text-center text-white/50 italic">[ Trend chart goes here ]</div>
            </div>
          </div>
        </section>
        <section className="bg-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Product Highlights</h3>
          <ul className="text-base text-white/80 list-disc pl-6 space-y-2">
            <li>Strong upward sales momentum last month.</li>
            <li>Maintains leadership within its category.</li>
            <li>Consistently rated above 4.5 stars by users.</li>
            <li>Trending across social media for positive feedback.</li>
          </ul>
        </section>
        <div className="flex justify-center mt-10">
          <Button variant="secondary" className="rounded-full px-6 py-3 text-lg" onClick={() => navigate("/")}>
            Back to Search
          </Button>
        </div>
      </div>
    </main>
  );
}
