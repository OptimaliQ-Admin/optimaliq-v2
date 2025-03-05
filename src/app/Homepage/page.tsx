"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative flex items-center justify-end py-24 px-6 bg-white">
        {/* Hero Background Image covering 3/4 of the page */}
        <div className="absolute inset-0 w-3/4 h-full left-0">
          <Image
            src="/images/Hero_Background.jpeg"
            alt="Business Strategy"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        </div>

        {/* Text Box */}
        <div className="relative w-1/2 p-8 bg-white shadow-lg border-l-4 border-r-4 border-blue-900 rounded-lg z-10 mr-6">
          <h1 className="text-5xl font-bold text-gray-800">
            AI-Powered Business Strategy & Insights
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Smarter Decisions. Faster Growth. Gain real-time AI insights to optimize your business strategy and scale efficiently.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/Page1"
              className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Updated Section */}
<section id="how-it-works" className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-semibold text-gray-800 mb-8">How It Works</h2>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {/* Step 1 - Assess Your Business */}
      <div className="relative p-10 bg-blue-800 rounded-lg shadow-lg text-white">
        <Image
          src="/images/Step1_Background.jpeg"
          alt="Assess Business"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 rounded-lg opacity-25" // Reduced overlay opacity
        />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">1. Assess Your Business</h3>
          <p className="mt-4 text-lg">
          We analyze your <strong>strategy, operations, and market position to uncover 
  high-impact growth opportunities. Our data-driven insights help you
  overcome obstacles, scale efficiently, and maximize ROI—all tailored 
  to your unique business challenges.</strong>
          </p>
        </div>
      </div>

      {/* Step 2 - Get Data-Driven Insights */}
      <div className="relative p-10 bg-blue-800 rounded-lg shadow-lg text-white">
        <Image
          src="/images/Real-Time_Insights.jpeg"
          alt="Data-Driven Insights"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 rounded-lg opacity-25"
        />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">2. Get Data-Driven Insights</h3>
          <p className="mt-4 text-lg">
          Harnessing <strong>machine learning across industries, we provide
            customized insights tailored to your business objectives.  
  Our models analyze real-world trends, market shifts, and operational data 
  to help you identify opportunities, mitigate risks, and drive scalable growth.</strong>
          </p>
        </div>
      </div>

      {/* Step 3 - Optimize & Scale */}
      <div className="relative p-10 bg-blue-800 rounded-lg shadow-lg text-white">
        <Image
          src="/images/Optimize_Scale.jpeg"
          alt="Optimize & Scale"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 rounded-lg opacity-25"
        />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">3. Implement & Scale</h3>
          <p className="mt-4 text-lg">
          <strong>Transform strategic insights into measurable success with
            custom recommendations designed to enhance revenue, 
  improve operational efficiency, and strengthen your competitive edge.  
  Our data-driven approach ensures every decision is backed by industry insights 
  and tailored to your unique growth trajectory.</strong>
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

{/* Key Features - Updated Section */}
<section id="key-features" className="py-16">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-3xl font-semibold text-gray-800">Key Features</h2>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Feature 1 - AI-Powered Business Assessments */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
            {/* Placeholder for Icon */}
            <span>[ICON]</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700">Business Health Assessments</h3>
        </div>
        <p className="mt-3 text-gray-600">
          Evaluate your company’s strengths, weaknesses, and market position to make informed, data-backed decisions.
        </p>
      </div>

      {/* Feature 2 - Real-Time Strategy Optimization */}
      <div className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
            <span>[ICON]</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700">Real-Time Strategy Optimization</h3>
        </div>
        <p className="mt-3 text-gray-600">
          Get continuous insights to adjust and refine your business strategies dynamically as new data emerges.
        </p>
      </div>

      {/* Feature 3 - Competitive Benchmarking */}
      <div className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
            <span>[ICON]</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700">Competitive Benchmarking</h3>
        </div>
        <p className="mt-3 text-gray-600">
          Compare your performance with industry leaders and uncover actionable areas for improvement.
        </p>
      </div>

      {/* Feature 4 - Predictive Growth Insights */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
            <span>[ICON]</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700">Predictive Growth Insights</h3>
        </div>
        <p className="mt-3 text-gray-600">
          Forecast potential growth opportunities and make strategic moves before the market shifts.
        </p>
      </div>

    </div>
  </div>
</section>
 {/* FAQ Section */}
 <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          <div className="mt-10 text-left space-y-4">
            <details className="bg-white p-4 rounded-lg shadow-md">
              <summary className="font-bold cursor-pointer">How does AI generate insights?</summary>
              <p className="mt-2 text-gray-600">
                OptimaliQ’s AI models analyze business data to identify trends, weaknesses, and opportunities for optimization.
              </p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow-md">
              <summary className="font-bold cursor-pointer">Is this suitable for small businesses?</summary>
              <p className="mt-2 text-gray-600">
                Yes! Our platform is built to help businesses of all sizes optimize their strategies.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
