//src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-end px-6 py-16 lg:py-24 bg-white dark:bg-black">
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
      <div className="relative w-full lg:w-1/2 bg-white dark:bg-[#121212] shadow-lg border-l-4 border-r-4 border-blue-900 dark:border-blue-600 rounded-lg z-10 px-6 py-10 lg:mr-6 transition-transform duration-300 hover:scale-105">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
          Dominate Your Market with AI-Driven Strategy
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Leverage real-time intelligence and AI-driven insights to optimize strategy, scale faster, and dominate your industry.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            href="/growth-assessment"
            className="px-6 py-3 text-center bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-transform transform hover:scale-105"
          >
            Start Your Free Growth Audit
          </Link>
          <Link
            href="/#how-it-works"
            className="px-6 py-3 text-center border border-blue-600 text-blue-600 text-lg rounded-lg shadow-md hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-transform transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
