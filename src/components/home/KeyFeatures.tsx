//src/components/home/KeyFeatures.tsx
"use client";

import { ChartBarIcon, RocketLaunchIcon, LightBulbIcon } from "@heroicons/react/24/outline";

const features = [
  {
    title: "AI-Powered Insights",
    description: "Get personalized recommendations and insights powered by advanced AI algorithms.",
    icon: <LightBulbIcon className="w-8 h-8 text-optimaliq" />,
  },
  {
    title: "Growth Analytics",
    description: "Track your business growth with comprehensive analytics and benchmarking.",
    icon: <ChartBarIcon className="w-8 h-8 text-optimaliq" />,
  },
  {
    title: "Strategic Planning",
    description: "Develop and execute data-driven strategies to achieve your business goals.",
    icon: <RocketLaunchIcon className="w-8 h-8 text-optimaliq" />,
  },
];

export default function KeyFeatures() {
  return (
    <section id="key-features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Everything you need to accelerate your business growth and stay ahead of the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-lg shadow-lg transition-all bg-gray-50 hover:shadow-xl border-l-4 border-optimaliq"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800">{feature.title}</h3>
              <p className="mt-4 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
