
import React from "react";

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

export default function RecommendationsSection() {
  return (
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
  );
}
