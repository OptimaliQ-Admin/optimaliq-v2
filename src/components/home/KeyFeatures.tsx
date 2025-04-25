//src/components/home/KeyFeatures.tsx
"use client";

import Link from "next/link";

const features = [
  {
    icon: "📊",
    title: "AI-Powered Business Assessments",
    description:
      "Instantly analyze your business health, identify strategy gaps, and uncover optimization potential.",
  },
  {
    icon: "⚡",
    title: "Real-Time Strategy Optimization",
    description:
      "Adapt dynamically with AI-driven insights, adjusting your business strategy as new data emerges.",
  },
  {
    icon: "📈",
    title: "Competitive Benchmarking",
    description:
      "Compare your performance with industry leaders and uncover actionable areas for growth.",
  },
  {
    icon: "🔮",
    title: "Predictive Growth Insights",
    description:
      "Forecast market shifts and make proactive, data-driven decisions before your competition.",
  },
];

export default function KeyFeatures() {
  return (
    <section id="key-features" className="py-20 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto text-center px-4">
        {/* Section Title */}
        <div className="relative flex items-center justify-center mb-10">
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800 dark:text-white">Key Features</h2>
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          The essential tools designed to accelerate growth, optimize strategy, and maximize efficiency.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              className="p-8 rounded-lg shadow-lg transition-all bg-gray-50 dark:bg-gray-800 hover:shadow-xl border-l-4 border-blue-700"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full text-2xl">
                  {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link href="/dashboard/Page1">
            <button className="bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition">
              Get Your Free Growth Report
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
