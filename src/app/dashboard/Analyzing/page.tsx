"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const messages = [
  "Bringing 20 years of battlefield strategy to your business.",
  "One insight can change everything.",
  "Uncovering hidden growth opportunities...",
  "Mapping your customer journey for deeper engagement...",
  "Analyzing your strategy for sustainable scale...",
  "Evaluating process efficiency and automation gaps...",
  "Benchmarking your technology stack against industry leaders...",
  "Scanning for untapped revenue channels...",
  "Profiling your business maturity in real time...",
  "Diagnosing growth blind spots you didn't know you had...",
  "Generating insights you can act on — not just read."
];

export default function Analyzing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userData = searchParams.get("userInfo");
    if (!userData) {
      router.push("/dashboard/Page1");
      return;
    }

    const fetchInsights = async () => {
      try {
        const parsed = JSON.parse(decodeURIComponent(userData));
        const res = await fetch("/api/getInsights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: parsed.u_id }),
        });

        if (!res.ok) throw new Error("API call failed");

        setTimeout(() => {
          router.push(`/dashboard/Page3?userInfo=${encodeURIComponent(userData)}`);
        }, 1000);
      } catch (err) {
        console.error("🔴 Error calling insights API:", err);
        router.push("/dashboard/Page2");
      }
    };

    fetchInsights();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">🔍 Analyzing Your Business...</h1>
      <p className="text-lg text-gray-700 max-w-xl animate-pulse">{messages[messageIndex]}</p>
      <div className="mt-8 text-sm text-gray-400">Powered by <span className="font-semibold text-blue-600">OptimaliQ.ai</span></div>
    </div>
  );
}