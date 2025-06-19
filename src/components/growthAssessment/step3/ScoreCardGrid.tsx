// components/step3/ScoreCardGrid.tsx
"use client";

import { useState } from "react";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import GMFModal from "./GMFModal";
import SocialProofCard from "./SocialProofCard";

export default function ScoreCardGrid({ score }: { score: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="📊 GMF+ Score" />
          <p className="text-3xl font-bold text-blue-600">{score} / 5</p>
          <p className="text-sm text-gray-600 mt-2">Your current growth maturity level.</p>
          <p className="text-xs text-gray-400 mt-1 italic">Powered by <span className="text-blue-600 font-semibold">OptimaliQ.ai</span></p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-blue-600 mt-4 font-medium hover:underline self-start"
        >
          Learn more →
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="📈 Industry Benchmark" tooltip="Unlock full benchmarking with OptimaliQ Pro" />
          <p className="text-3xl font-bold text-green-600">4.2 / 5</p>
          <p className="text-sm text-gray-600 mt-2">Average score of top industry performers.</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="🔍 Optimization Potential" tooltip="Unlock predictive modeling with OptimaliQ Pro" />
          <p className="text-3xl font-bold text-blue-600">+{(5 - score - 0.5).toFixed(1)} / +20%</p>
          <p className="text-sm text-gray-600 mt-2">Potential to elevate your score and revenue over the next 12 months.</p>
        </div>
      </div>

      <SocialProofCard />

      <GMFModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
