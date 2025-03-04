"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Placeholder for Logo */}
          <Image src="/images/logo.png" alt="OptimaliQ Logo" width={150} height={50} />
        </div>
        <div className="flex space-x-6">
          <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">How It Works</Link>
          <Link href="#key-features" className="text-gray-700 hover:text-blue-600 font-medium">Key Features</Link>
          <Link href="#faq" className="text-gray-700 hover:text-blue-600 font-medium">FAQ</Link>
          <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
        </div>
        <Link href="/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">Sign In</Link>
      </nav>
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-end py-24 px-6 bg-white mt-16">
        {/* Hero Background Image covering 3/4 of the page */}
        <div className="absolute inset-0 w-3/4 h-full left-0">
          <Image src="/images/Hero_Background.jpeg" alt="Business Strategy" layout="fill" objectFit="cover" className="opacity-50" />
        </div>
        
        {/* Text Box */}
        <div className="relative w-1/2 p-8 bg-white shadow-lg border-l-4 border-r-4 border-blue-900 rounded-lg z-10 mr-6">
          <h1 className="text-5xl font-bold text-gray-800">AI-Powered Business Strategy & Insights</h1>
          <p className="mt-4 text-lg text-gray-600">Smarter Decisions. Faster Growth. Gain real-time AI insights to optimize your business strategy and scale efficiently.</p>
          <div className="mt-6">
            <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition">Get Early Access</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8">How It Works</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="relative p-10 bg-blue-900 rounded-lg shadow-lg text-white">
              <Image src="/images/Step1_Background.jpeg" alt="Assess Business" layout="fill" objectFit="cover" className="absolute inset-0 rounded-lg opacity-30" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">1. Assess Your Business</h3>
                <p className="mt-4 text-lg">Our AI-powered assessment pinpoints the exact obstacles preventing growth and highlights opportunities for scale. By analyzing your strategy, process efficiency, customer insights, and technology adoption, we provide custom, data-driven insights tailored to your business. No generic advice—just real strategies that work.</p>
              </div>
            </div>
            <div className="relative p-10 bg-blue-900 rounded-lg shadow-lg text-white">
              <Image src="/images/Real-Time_Insights.jpeg" alt="Real-Time Insights" layout="fill" objectFit="cover" className="absolute inset-0 rounded-lg opacity-30" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">2. Get Real-Time Insights</h3>
                <p className="mt-4 text-lg">Our AI continuously analyzes real-time market trends, competitor movements, and operational data to provide dynamic, personalized insights. Whether refining your strategy, optimizing processes, or leveraging technology, your recommendations evolve as your business grows—keeping you ahead of the competition.</p>
              </div>
            </div>
            <div className="relative p-10 bg-blue-900 rounded-lg shadow-lg text-white">
              <Image src="/images/Optimize_Scale.jpeg" alt="Optimize & Scale" layout="fill" objectFit="cover" className="absolute inset-0 rounded-lg opacity-30" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">3. Optimize & Scale</h3>
                <p className="mt-4 text-lg">Turn AI-driven insights into action with scalable strategies that optimize efficiency, maximize revenue, and future-proof your business. Our predictive analytics continuously refine your approach, ensuring data-backed decisions that drive sustainable, long-term growth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="key-features" className="py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Key Features</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700">AI-Powered Business Assessments</h3>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700">Real-Time Strategy Optimization</h3>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700">Competitive Benchmarking</h3>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700">Personalized Growth Insights</h3>
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
              <p className="mt-2 text-gray-600">OptimaliQ’s AI models analyze business data to identify trends, weaknesses, and opportunities for optimization.</p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow-md">
              <summary className="font-bold cursor-pointer">Is this suitable for small businesses?</summary>
              <p className="mt-2 text-gray-600">Yes! Our platform is built to help businesses of all sizes optimize their strategies.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p>© {new Date().getFullYear()} OptimaliQ.ai. All Rights Reserved.</p>
      </footer>
    </div>
  );
}