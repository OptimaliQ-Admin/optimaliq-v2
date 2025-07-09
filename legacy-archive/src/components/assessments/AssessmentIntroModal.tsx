// src/components/assessments/AssessmentIntroModal.tsx
"use client";

import React from "react";

export type AssessmentType =
  | "BPM"
  | "sales"
  | "tech"
  | "cx"
  | "strategy"
  | "ai"
  | "digital"
  | "leadership"
  | "benchmarking"
  | "reassessment"
  | "marketing";

export const assessmentIntros: Record<
  AssessmentType,
  { title: string; description: string }
> = {
  BPM: {
    title: "⚙️ Business Process Management Assessment",
    description:
      "Analyze how well your internal processes are structured and discover areas for automation. Answer honestly to ensure your score and roadmap reflect your true state.",
  },
  sales: {
    title: "💼 Sales Performance Assessment",
    description:
      "Evaluate the health of your sales pipeline and how consistently your team executes. Your answers shape personalized growth strategies—be honest for best results.",
  },
  tech: {
    title: "🛠️ Tech Stack Assessment",
    description:
      "Review the tools and platforms used across your business to identify integration gaps and inefficiencies. Honest answers will help us give tailored tech optimization guidance.",
  },
  cx: {
    title: "🎯 Customer Experience Assessment",
    description:
      "Evaluate how effectively you meet customer expectations across the lifecycle. Accurate input leads to sharper insights and retention strategies.",
  },
  strategy: {
    title: "🚀 Strategic Maturity Assessment",
    description:
      "Measure the clarity and scalability of your strategic planning. Realistic answers help surface blind spots and prioritize smarter decisions.",
  },
  ai: {
    title: "🤖 AI & Automation Readiness Assessment",
    description:
      "Understand your organization's current capacity to leverage AI and automation. Transparency here sets the foundation for realistic AI adoption plans.",
  },
  digital: {
    title: "📲 Digital Transformation Readiness Assessment",
    description:
      "Assess how well your organization is prepared to evolve digitally. Clear input allows us to map out your transformation journey.",
  },
  leadership: {
    title: "👥 Leadership & Team Performance Assessment",
    description:
      "Explore how aligned and effective your leadership team is in driving results. Candid responses help identify opportunities for stronger collaboration.",
  },
  benchmarking: {
    title: "📊 Competitive Benchmarking Assessment",
    description:
      "See how your business stacks up against industry peers. Honest inputs generate the most actionable positioning recommendations.",
  },
  reassessment: {
title: "📊 Business Reassessment",
    description:
      " Re-evaluate your business using the same questions from your initial assessment and track progress over time.",
  },
  marketing: {
title: "📢 Marketing Effectiveness Assessment",
    description:
      "Analyze your marketing performance and receive recommendations to optimize efforts.",
  },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  assessmentType: AssessmentType;
};

export default function AssessmentIntroModal({
  isOpen,
  onClose,
  onStart,
  assessmentType,
}: Props) {
  const content = assessmentIntros[assessmentType];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">{content.title}</h2>
        <p className="text-gray-600 mt-4 whitespace-pre-line">{content.description}</p>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Let’s Get Started
          </button>
        </div>
      </div>
    </div>
  );
}