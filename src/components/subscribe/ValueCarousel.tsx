//src/components/subscribe/ValueCarousel.tsx
"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "Scale 3x Faster with Data-Backed Strategy",
    description: "OptimaliQ identifies your hidden growth levers and delivers a personalized 30-day roadmap.",
  },
  {
    title: "Better Than Consultants. Powered by AI.",
    description: "For a fraction of the price, you get continuous, actionable insights — not just a static PDF.",
  },
  {
    title: "Stay Ahead of Market Shifts in Real Time",
    description: "Track benchmarks, adapt to trends, and outsmart your competition.",
  },
  {
    title: "Turn Strategy into Execution — Automatically",
    description: "Connect insights to action with AI-driven recommendations tailored to your business stage.",
  },
];

export default function ValueCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { title, description } = slides[index];

  return (
    <div className="text-white p-8 max-w-lg">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-gray-300">{description}</p>
    </div>
  );
}
