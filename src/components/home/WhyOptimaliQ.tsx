// File: /src/components/home/WhyOptimaliQ.tsx
"use client";

import Link from "next/link";

export default function WhyOptimaliQ() {
  return (
    <section id="why-optimaliq" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center px-4">
        {/* Section Header */}
        <div className="relative flex items-center justify-center mb-10">
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800">
            Why <span className="text-blue-600">OptimaliQ?</span>
          </h2>
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
        </div>

        {/* Persuasive Statement */}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your competitors are scaling faster by using AI to optimize strategy, streamline execution, and stay ahead of the market. OptimaliQ gives you that same edge — for less than the cost of one hour with a consultant.
        </p>

        {/* Comparison Table */}
        <div className="mt-12 bg-white shadow-lg rounded-lg p-6 md:p-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#0A1F44] text-white text-lg">
                <th className="p-4 font-semibold">Feature</th>
                <th className="p-4 font-semibold text-center">OptimaliQ</th>
                <th className="p-4 font-semibold text-center">Traditional Consulting</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-md">
              {[
                ["Cost", "Starts at $249/mo", "$10,000+ Retainers"],
                ["Speed", "Instant, AI-Powered Insights", "Weeks of Manual Reporting"],
                ["Actionability", "Real-Time Strategy Adjustments", "Static Reports & Decks"],
                ["Market Awareness", "Live Trend + Benchmark Data", "Limited to Analyst Opinion"],
                ["Scalability", "Continuously Learns & Improves", "Bound by Human Bandwidth"],
                ["Execution", "AI Task Recommendations & Playbooks", "Requires Internal Teams"],
              ].map(([label, optimaliq, consulting], i) => (
                <tr
                  key={label}
                  className={`border-t ${i % 2 === 1 ? "bg-gray-100" : ""}`}
                >
                  <td className="p-4 font-semibold">{label}</td>
                  <td className="p-4 text-blue-600 font-bold text-center">{optimaliq}</td>
                  <td className="p-4 text-gray-600 text-center">{consulting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link href="/growth-assessment">
            <button className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition">
              Unlock My Growth Plan
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
