"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
    // Default to Annual Pricing

  const pricing = {
    annual: {
      accelerator: 99, // Price per month billed annually
      enterprise: 999,
    },
    monthly: {
      accelerator: 199,
      enterprise: 1999,
    },
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-100">
        <h1 className="text-5xl font-bold text-gray-800">
          Unlock Predictable Growth with AI-Driven Strategy
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Get instant AI-powered insights, track your business progress, and take action with a personalized 30-day plan—every month.
        </p>
      </section>

      {/* Pricing Toggle */}
      <div className="text-center my-10">
        <span className="text-gray-600 font-medium">Billing: </span>
        <button
          className={`px-4 py-2 rounded-l-lg text-lg font-bold ${
            billingCycle === "annual"
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setBillingCycle("annual")}
        >
          Annual (Save 20%)
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg text-lg font-bold ${
            billingCycle === "monthly"
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Pricing Cards */}
<section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Free Plan */}
  <div className="bg-white shadow-lg rounded-lg p-8 border-l-4 border-blue-700 hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col min-h-[500px]">
    <h2 className="text-3xl font-bold text-gray-800">🌟 Free Plan</h2>
    <p className="text-gray-600 mt-3">Get started with a free assessment. No spam. No sales pitches.</p>
    <p className="text-5xl font-bold text-blue-600 mt-4">FREE</p>
    <p className="text-gray-500 text-sm">(No credit card required)</p>
    <ul className="mt-6 text-gray-700 space-y-2 flex-grow">
      <li>✅ GMF+ Business Score</li>
      <li>✅ Limited Growth Insights</li>
      <li className="opacity-50">❌ No Competitive Benchmarking</li>
      <li className="opacity-50">❌ No AI-Generated 30-Day Plan</li>
      <li className="opacity-50">❌ No Personalized Strategy Adjustments</li>
      {/* Invisible placeholders for alignment */}
      <li className="invisible">Placeholder</li>
      <li className="invisible">Placeholder</li>
    </ul>
    <Link href="/dashboard/Page1">
      <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition">
        Take Free Assessment
      </button>
    </Link>
  </div>

  {/* Accelerator Plan */}
  <div className="bg-white shadow-lg rounded-lg p-8 border-l-4 border-blue-700 hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col min-h-[500px]">
    <h2 className="text-3xl font-bold text-gray-800">🚀 Accelerator Plan</h2>
    <p className="text-gray-600 mt-2">Access all GMF+ features and AI-powered insights.</p>
    <p className="text-5xl font-bold text-blue-600 mt-4">
      ${pricing[billingCycle].accelerator} <span className="text-lg font-medium">/mo</span>
    </p>
    <p className="text-gray-500 text-sm">(Billed {billingCycle === "annual" ? "annually" : "monthly"})</p>
    <ul className="mt-6 text-gray-700 space-y-2 flex-grow">
      <li>✅ AI-Powered Business Assessments</li>
      <li>✅ Industry Benchmarking & Competitive Insights</li>
      <li>✅ Future Performance Overview</li>
      <li>✅ Personalized 30-Day Action Plan</li>
      <li>✅ Predictive AI Insights & Market Trends</li>
      <li>✅ Business Simulations & Strategy Adjustments</li>
      <li>✅ Access to Expert-Led Growth Community</li>
    </ul>
    <Link href="/dashboard/Page1">
      <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-800 transition">
        Get Accelerator
      </button>
    </Link>
  </div>

  {/* Enterprise Plan */}
  <div className="bg-white shadow-lg rounded-lg p-8 border-l-4 border-blue-700 hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col min-h-[500px]">
    <h2 className="text-3xl font-bold text-gray-800">🏆 Enterprise Plan</h2>
    <p className="text-gray-600 mt-2">Advanced automation & personalized AI strategy.</p>
    <p className="text-5xl font-bold text-blue-600 mt-4">
      ${pricing[billingCycle].enterprise} <span className="text-lg font-medium">/mo</span>
    </p>
    <p className="text-gray-500 text-sm">(Billed {billingCycle === "annual" ? "annually" : "monthly"})</p>
    <ul className="mt-6 text-gray-700 space-y-2 flex-grow">
      <li>✅ Everything in Accelerator</li>
      <li>✅ CRM & SaaS Integrations (HubSpot, Salesforce, Asana)</li>
      <li>✅ AI Task Execution & Workflow Automation</li>
      <li>✅ Monthly Strategy Calls & Executive Coaching</li>
      <li>✅ Personalized AI-Generated Growth Playbooks</li>
    </ul>
    <Link href="/dashboard/Page1">
      <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-800 transition">
        Get Enterprise Access
      </button>
    </Link>
  </div>
</section>


      {/* Competitive Comparison */}
      <section className="max-w-6xl mx-auto my-20 bg-gray-100 rounded-lg p-10 shadow-lg">
        <h2 className="text-5xl font-semibold text-center text-gray-800">Why Choose <span className="text-blue-600">OptimaliQ?</span></h2>
        <p className="text-lg text-gray-600 text-center mt-2">
          Your competition is scaling faster with AI-driven strategy and real-time market intelligence. Leverage data-driven decisions and dominate your industry.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-700">
            <h3 className="text-2xl font-bold text-blue-600">OptimaliQ</h3>
            <ul className="mt-4 text-gray-700 space-y-2">
              <li>✅ Free Plan to Start</li>
              <li>✅ Instant AI-Powered Insights</li>
              <li>✅ Continuous Business Optimization</li>
              <li>✅ AI Task Execution & Workflow Automation</li>
              <li>✅ CRM & SaaS Integrations</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
            <h3 className="text-2xl font-bold text-red-600">Traditional Consulting</h3>
            <ul className="mt-4 text-gray-700 space-y-2">
              <li>❌ Cost: $10,000+ Retainers</li>
              <li>❌ Slow: Takes Weeks for Reports</li>
              <li>❌ No Continuous Adjustments</li>
              <li>❌ No AI Task Execution</li>
              <li>❌ No Integration with Your Systems</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Social Proof 
      <section className="max-w-6xl mx-auto text-center my-20">
        <h2 className="text-4xl font-semibold text-gray-800">Trusted by Growth-Focused Businesses</h2>
        <p className="text-lg text-gray-600 mt-2">See how businesses are using AI-driven strategy to scale smarter.</p>
        <div className="mt-6 flex justify-center space-x-6">
          <Image src="/images/testimonial1.jpg" alt="Customer Testimonial" width={200} height={100} />
          <Image src="/images/testimonial2.jpg" alt="Customer Testimonial" width={200} height={100} />
          <Image src="/images/testimonial3.jpg" alt="Customer Testimonial" width={200} height={100} />
        </div>
      </section>*/}
    </div>
  );
}
