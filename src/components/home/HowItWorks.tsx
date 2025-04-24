"use client";

import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "Assess & Identify",
    description: (
      <>
        We analyze your <strong>strategy, operations, and market position</strong> to uncover high-impact growth opportunities.  
        Our data-driven insights help you <strong>overcome obstacles, scale efficiently, and maximize ROI</strong>—tailored to your business challenges.
      </>
    ),
    image: "/images/Step1_Background.jpeg",
  },
  {
    id: 2,
    title: "Data-Driven Insights",
    description: (
      <>
        Harnessing <strong>machine learning across industries</strong>, we provide customized insights tailored to your business objectives.  
        Our models analyze real-world trends, market shifts, and operational data to help you <strong>identify opportunities, mitigate risks, and drive scalable growth.</strong>
      </>
    ),
    image: "/images/Real-Time_Insights.jpeg",
  },
  {
    id: 3,
    title: "Implement & Scale",
    description: (
      <>
        <strong>Transform strategic insights into measurable success</strong> with custom recommendations designed to  
        <strong> enhance revenue, improve operational efficiency, and strengthen your competitive edge.</strong>
      </>
    ),
    image: "/images/Optimize_Scale.jpeg",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-[#111827]">
      <div className="max-w-6xl mx-auto text-center px-4">
        {/* Title with horizontal lines */}
        <div className="flex items-center justify-center mb-10">
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800 dark:text-white">How It Works</h2>
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ id, title, description, image }) => (
            <div key={id} className="relative p-8 bg-[#1F2937] rounded-lg shadow-lg text-white overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="absolute inset-0 object-cover opacity-25 rounded-lg"
              />
              <div className="relative z-10 text-left">
                <h3 className="text-2xl font-bold">{id}. {title}</h3>
                <p className="mt-4 text-lg">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
