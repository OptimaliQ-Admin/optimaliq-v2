"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="pt-8">
      {/* Hero Section */}
<section className="relative flex items-center justify-end py-20 px-6 bg-white">
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
  <div className="relative w-1/2 p-8 bg-white shadow-lg border-l-4 border-r-4 border-blue-900 rounded-lg z-10 mr-6 transition-transform duration-300 hover:scale-105">
    <h1 className="text-5xl font-bold text-gray-800 leading-tight">
      Dominate Your Market with AI-Driven Strategy
    </h1>
    <p className="mt-4 text-lg text-gray-600">
    Leverage real-time intelligence and AI-driven insights to optimize strategy, scale faster, and dominate your industry.
    </p>
    <div className="mt-6 flex gap-4">
      <Link
        href="/dashboard/Page1"
        className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Start Your Free Growth Audit
      </Link>
      <Link
        href="/how-it-works"
        className="px-6 py-3 border border-blue-600 text-blue-600 text-lg rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-transform transform hover:scale-105"
      >
        Learn More
      </Link>
    </div>
  </div>
</section>


      {/* How It Works - Updated Section */}
<section id="how-it-works" className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto text-center">
    {/* Section Title with Extended Lines */}
    <div className="flex items-center justify-center mb-8">
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[200px]"></span>
      <h2 className="text-5xl font-semibold text-gray-800">How It Works</h2>
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[200px]"></span>
    </div>

    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {/* Step 1 - Assess Your Business */}
      <div className="relative p-10 bg-[#1F2937] rounded-lg shadow-lg text-white">
        <Image
          src="/images/Step1_Background.jpeg"
          alt="Assess Business"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 rounded-lg opacity-25"
        />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">1. Assess & Identify</h3>
          <p className="mt-4 text-lg">
            We analyze your <strong>strategy, operations, and market position</strong> to uncover high-impact growth opportunities.  
            Our data-driven insights help you <strong>overcome obstacles, scale efficiently, and maximize ROI</strong>—tailored to your business challenges.
          </p>
        </div>
      </div>

      {/* Step 2 - Get Data-Driven Insights */}
      <div className="relative p-10 bg-[#1F2937] rounded-lg shadow-lg text-white">
        <Image
          src="/images/Real-Time_Insights.jpeg"
          alt="Data-Driven Insights"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 rounded-lg opacity-25"
        />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">2. Data-Driven Insights</h3>
          <p className="mt-4 text-lg">
            Harnessing <strong>machine learning across industries</strong>, we provide customized insights tailored to your business objectives.  
            Our models analyze real-world trends, market shifts, and operational data to help you <strong>identify opportunities, mitigate risks, and drive scalable growth.</strong>
          </p>
        </div>
      </div>

      {/* Step 3 - Implement & Scale */}
      <div className="relative p-10 bg-[#1F2937] rounded-lg shadow-lg text-white">
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
            <strong>Transform strategic insights into measurable success</strong> with custom recommendations designed to  
            <strong>enhance revenue, improve operational efficiency, and strengthen your competitive edge.</strong>  
            Our data-driven approach ensures every decision is backed by industry insights and aligned with your growth trajectory.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

{/* Key Features - Enhanced Section */}
<section id="key-features" className="py-20 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    
    {/* Section Title with Extended Lines */}
    <div className="relative flex items-center justify-center mb-8">
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[250px]"></span>
      <h2 className="text-5xl font-semibold text-gray-800">Key Features</h2>
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[250px]"></span>
    </div>

    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      The essential tools designed to accelerate growth, optimize strategy, and maximize efficiency.
    </p>

    {/* Features Grid */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Feature 1 - AI-Powered Business Assessments */}
      <div className="p-8 rounded-lg shadow-lg transition-all bg-gray-50 hover:shadow-xl border-l-4 border-blue-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
            <span className="text-2xl">📊</span> {/* Replace with proper icon */}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">AI-Powered Business Assessments</h3>
        </div>
        <p className="mt-4 text-gray-600">
          Instantly analyze your business health, identify strategy gaps, and uncover optimization potential.
        </p>
      </div>

      {/* Feature 2 - Real-Time Strategy Optimization */}
      <div className="p-8 rounded-lg shadow-lg transition-all bg-white hover:shadow-xl border-l-4 border-blue-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
            <span className="text-2xl">⚡</span> {/* Replace with proper icon */}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Real-Time Strategy Optimization</h3>
        </div>
        <p className="mt-4 text-gray-600">
          Adapt dynamically with AI-driven insights, adjusting your business strategy as new data emerges.
        </p>
      </div>

      {/* Feature 3 - Competitive Benchmarking */}
      <div className="p-8 rounded-lg shadow-lg transition-all bg-white hover:shadow-xl border-l-4 border-blue-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
            <span className="text-2xl">📈</span> {/* Replace with proper icon */}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Competitive Benchmarking</h3>
        </div>
        <p className="mt-4 text-gray-600">
          Compare your performance with industry leaders and uncover actionable areas for growth.
        </p>
      </div>

      {/* Feature 4 - Predictive Growth Insights */}
      <div className="p-8 rounded-lg shadow-lg transition-all bg-gray-50 hover:shadow-xl border-l-4 border-blue-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
            <span className="text-2xl">🔮</span> {/* Replace with proper icon */}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Predictive Growth Insights</h3>
        </div>
        <p className="mt-4 text-gray-600">
          Forecast market shifts and make proactive, data-driven decisions before your competition.
        </p>
      </div>
    </div>

    {/* Call to Action */}
    <div className="mt-12 text-center">
      <Link href="/dashboard/Page1">
        <button className="bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition">
          Get Your Free Growth Report
        </button>
      </Link>
    </div>

  </div>
</section>

{/* Why OptimaliQ? - Persuasive Section */}
<section id="why-optimaliq" className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto text-center">
    
    {/* Section Title with Extended Lines */}
    <div className="relative flex items-center justify-center mb-8">
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[250px]"></span>
      <h2 className="text-5xl font-semibold text-gray-800">Why <span className= "text-blue-600">OptimaliQ?</span></h2>
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[250px]"></span>
    </div>

    {/* Persuasive Statement */}
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    Your competition is scaling faster with AI-driven strategy and real-time market intelligence. Leverage data-driven decisions and dominate your industry.
    </p>

    {/* Comparison Table */}
    <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#0A1F44] text-white">
            <th className="p-4 text-xl font-semibold text-left">Feature</th>
            <th className="p-4 text-xl font-semibold">OptimaliQ</th>
            <th className="p-4 text-xl font-semibold">Traditional Consulting</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 text-lg">
          <tr className="border-t">
            <td className="p-4 font-semibold text-left">Cost</td>
            <td className="p-4 text-blue-600 font-bold">Free to Start</td>
            <td className="p-4 text-gray-600">$10,000+ Retainers</td>
          </tr>
          <tr className="border-t bg-gray-100">
            <td className="p-4 font-semibold text-left">Speed</td>
            <td className="p-4 text-blue-600 font-bold">Instant Insights</td>
            <td className="p-4 text-gray-600">Weeks of Analysis</td>
          </tr>
          <tr className="border-t">
            <td className="p-4 font-semibold text-left">Actionable Data</td>
            <td className="p-4 text-blue-600 font-bold">Yes, with AI-backed trends</td>
            <td className="p-4 text-gray-600">Subjective Reports</td>
          </tr>
          <tr className="border-t bg-gray-100">
            <td className="p-4 font-semibold text-left">Scalability</td>
            <td className="p-4 text-blue-600 font-bold">Continuous Improvement</td>
            <td className="p-4 text-gray-600">One-time Service</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* CTA */}
    <div className="mt-12 text-center">
      <Link href="/dashboard/Page1">
        <button className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition">
          Try OptimaliQ Now
        </button>
      </Link>
    </div>

  </div>
</section>

 {/* FAQ Section - Expanded & Interactive */}
<section id="faq" className="py-20 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    
    {/* Section Title with Extended Lines */}
    <div className="relative flex items-center justify-center mb-8">
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[250px]"></span>
      <h2 className="text-5xl font-semibold text-gray-800">Frequently Asked Questions</h2>
      <span className="flex-1 border-t-2 border-gray-300 mx-12 w-[250px]"></span>
    </div>

    {/* FAQ List */}
    <div className="mt-10 max-w-4xl mx-auto space-y-4">
      
      {/* FAQ 1 */}
      <details className="bg-gray-100 p-5 rounded-lg shadow-md group">
        <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-gray-800">
          How does OptimaliQ compare to hiring a consultant?
          <span className="group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="mt-3 text-gray-700">
          OptimaliQ delivers continuous, AI-powered insights instantly, while consulting firms charge high retainers for one-time reports.
        </p>
      </details>

      {/* FAQ 2 */}
      <details className="bg-gray-100 p-5 rounded-lg shadow-md group">
        <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-gray-800">
          Can this work for small businesses?
          <span className="group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="mt-3 text-gray-700">
          Yes! Whether you're a startup or enterprise, OptimaliQ adapts to your needs with AI-driven insights that scale as you grow.
        </p>
      </details>

      {/* FAQ 3 */}
      <details className="bg-gray-100 p-5 rounded-lg shadow-md group">
        <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-gray-800">
          How does OptimaliQ predict growth?
          <span className="group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="mt-3 text-gray-700">
          We analyze real-time industry data, past performance, and competitive benchmarks to provide accurate business forecasts.
        </p>
      </details>

      {/* FAQ 4 */}
      <details className="bg-gray-100 p-5 rounded-lg shadow-md group">
        <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-gray-800">
          Is my data secure?
          <span className="group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="mt-3 text-gray-700">
          Absolutely. OptimaliQ follows strict data privacy policies and uses enterprise-grade security to protect your business data.
        </p>
      </details>

      {/* FAQ 5 */}
      <details className="bg-gray-100 p-5 rounded-lg shadow-md group">
        <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-gray-800">
          How often does OptimaliQ update insights?
          <span className="group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="mt-3 text-gray-700">
          Our AI continuously learns and updates insights in real-time, ensuring you always have the latest competitive intelligence.
        </p>
      </details>

    </div>

  </div>
</section>

    </div>
  );
}
