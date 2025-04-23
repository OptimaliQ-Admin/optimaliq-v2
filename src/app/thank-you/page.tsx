"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/tier2/onboarding/Initial_Assessment");
    }, 4000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600">🎉 You're In!</h1>
        <p className="mt-4 text-gray-700">Your payment was successful.</p>
        <p className="text-gray-600 mt-2">
          Session ID: <code className="text-sm">{sessionId}</code>
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Redirecting to your onboarding assessment...
        </p>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
