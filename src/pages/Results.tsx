
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChartLine } from "lucide-react";

const parseQuery = (search: string) => {
  const params = new URLSearchParams(search);
  return params.get("query") || "";
};

const metricData = [
  { label: "Market Share", value: "32.5%", change: "+1.1%" },
  { label: "Sales Velocity", value: "18,243/mo", change: "+4.2%" },
  { label: "Average Rating", value: "4.7/5", change: "+0.1" }
];

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
      {/* Decorative background: subtle chart lines */}
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
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-32 pb-12 w-full">
        {/* Product header */}
        <div className="flex items-center gap-3 mb-10">
          <ChartLine className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-white drop-shadow">
            Performance for<span className="text-orange-400 ml-2">{query}</span>
          </h2>
        </div>
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {metricData.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl bg-white/15 p-6 text-white/95 flex flex-col items-start shadow-xl backdrop-blur-md"
            >
              <span className="text-xs font-semibold tracking-widest uppercase mb-2 text-white/60">{metric.label}</span>
              <span className="text-2xl md:text-3xl font-bold text-orange-300">{metric.value}</span>
              <span className={`text-sm ${metric.change.startsWith("+") ? "text-green-300" : "text-red-300"} mt-2`}>{metric.change}</span>
            </div>
          ))}
        </section>
        {/* Quick trends chart demo */}
        <section className="mb-10">
          <div className="bg-white/10 rounded-xl p-6 flex flex-col">
            <span className="text-lg font-semibold text-white mb-3">Recent Trends</span>
            <div className="h-48 flex items-center justify-center">
              <div className="w-full text-center text-white/50 italic">[ Trend chart goes here ]</div>
            </div>
          </div>
        </section>
        {/* Product highlights */}
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
