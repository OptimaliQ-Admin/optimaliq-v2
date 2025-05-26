"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { NextResponse } from "next/server";

function ThankYouContent() {
  const router = useRouter();

  useEffect(() => {
    // 🎉 Launch confetti on load
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    // ⏳ Redirect after 4s to create-account
    const timeout = setTimeout(() => {
      router.push("/subscribe/create-account");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-blue-100">
        <h1 className="text-4xl font-extrabold text-blue-700">Welcome to OptimaliQ 🎉</h1>
        <p className="mt-4 text-gray-700 text-lg">Your payment was successful.</p>
        <p className="text-gray-600 mt-1">We’re setting up your personalized onboarding experience.</p>

        <div className="mt-6 w-48 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="animate-pulse bg-blue-600 h-full w-2/3 rounded-full" />
        </div>

        <p className="mt-4 text-sm text-gray-500">Redirecting to create your account...</p>
      </div>
    </div>
  );
}

export default ThankYouContent;