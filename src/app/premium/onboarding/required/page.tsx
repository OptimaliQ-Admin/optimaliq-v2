"use client";

import { useRouter } from "next/navigation";

export default function OnboardingRequiredPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/premium/onboarding/initial-assessment");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-700">Unlock Your Personalized Dashboard</h1>
        <p className="mt-4 text-gray-600 text-md">
          Before we can build your AI-powered roadmap, we need to understand your business.
          Completing your initial assessment unlocks:
        </p>

        <ul className="mt-6 space-y-3 text-left text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">✓</span>
            A customized business performance score
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">✓</span>
            A tailored 30-day growth roadmap
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">✓</span>
            Access to your full OptimaliQ Dashboard
          </li>
        </ul>

        <div className="mt-8">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Let&#39;s Get Started
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          It only takes 5–7 minutes to unlock your full experience.
        </p>
      </div>
    </div>
  );
}
