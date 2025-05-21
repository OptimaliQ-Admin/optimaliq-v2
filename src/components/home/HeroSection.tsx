//src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-end px-6 py-16 lg:py-24 bg-white">
      {/* Hero Background Image covering 3/4 of the page */}
      <div className="absolute inset-0 lg:w-3/4 h-full left-0 z-0">
        <Image
          src="/images/Hero_Background.jpeg"
          alt="Business Strategy"
          fill
          className="object-cover opacity-50"
        />
      </div>

      {/* Text Box */}
      <div className="relative w-full lg:w-1/2 bg-white shadow-lg border-l-4 border-r-4 border-blue-900 rounded-lg z-10 px-6 py-10 lg:mr-6 transition-transform duration-300 hover:scale-105">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
          Transform Your Business with AI-Powered Insights
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get personalized growth strategies, market insights, and actionable recommendations to accelerate your business success.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/subscribe"
            className="px-8 py-3 bg-optimaliq text-white rounded-md hover:bg-optimaliq-dark transition-colors text-center font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-3 border-2 border-optimaliq text-optimaliq rounded-md hover:bg-optimaliq hover:text-white transition-colors text-center font-semibold"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
