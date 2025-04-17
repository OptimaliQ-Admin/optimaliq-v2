// src/app/tier2/assessment/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTier2User } from "@/context/Tier2UserContext";
import SectionHeader from "@/components/growthstudio/SectionHeader";
import BPMCard from "@/components/assessments/BPMCard";
import { getLatestBPMScore } from "@/lib/queries/getLatestBPMScore";

function AssessmentComponent() {
  const { user } = useTier2User();
  const router = useRouter();

  const email = user?.email;
  const user_id = user?.user_id;

  const [bpmScore, setBpmScore] = useState<number | null>(null);
  const [bpmLastTaken, setBpmLastTaken] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) return;

    const fetchBPM = async () => {
      const result = await getLatestBPMScore(user_id);
      setBpmScore(result?.score ?? null);
      setBpmLastTaken(result?.takenAt ?? null);
    };

    fetchBPM();
  }, [user_id]);

  if (!email || !user_id) {
    return <p className="text-center text-red-600">⚠️ Email and User ID required.</p>;
  }

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl space-y-10">
        <SectionHeader
          title="📝 Business Assessments"
          subtitle="Choose an assessment to gain deeper insights into your business."
        />

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Inject BPMCard as the first grid item */}
  <BPMCard score={bpmScore} lastTakenDate={bpmLastTaken} userId={user_id} />

  {/* Render remaining assessment cards */}
  {[
    {
      id: "reassessment",
      title: "📊 Business Reassessment",
      description:
        "Re-evaluate your business using the same questions from your initial assessment and track progress over time.",
    },
    {
      id: "tech-stack",
      title: "🛠 Tech Stack Assessment",
      description:
        "Identify and analyze the software solutions used across different business channels and receive AI-driven recommendations.",
    },
    {
      id: "strategy",
      title: "🎯 Strategic Maturity Assessment",
      description:
        "Evaluate your business strategy and receive insights to refine and strengthen it.",
    },
    {
      id: "marketing-effectiveness",
      title: "📢 Marketing Effectiveness Assessment",
      description:
        "Analyze your marketing performance and receive recommendations to optimize efforts.",
    },
    {
      id: "sales-performance",
      title: "📈 Sales Performance Assessment",
      description:
        "Evaluate sales pipeline and conversion rates to improve revenue outcomes.",
    },
    {
      id: "customer-experience",
      title: "👥 Customer Experience Assessment",
      description:
        "Understand satisfaction levels and discover retention and engagement opportunities.",
    },
    {
      id: "ai-readiness",
      title: "🚀 AI & Automation Readiness",
      description:
        "Measure how well your business is leveraging AI and automation.",
    },
    {
      id: "digital-transformation",
      title: "📡 Digital Transformation Readiness",
      description:
        "Evaluate your preparedness for digital transformation and modern tech adoption.",
    },
    {
      id: "leadership-team",
      title: "🏢 Leadership & Team Assessment",
      description:
        "Assess leadership effectiveness and alignment to improve culture and execution.",
    },
    {
      id: "competitive-benchmarking",
      title: "📊 Growth & Benchmarking Intake",
      description:
        "Provide key business metrics and competitive insights to personalize your roadmap and compare your performance to industry benchmarks.",
    },
  ].map((assessment) => (
    <div
      key={assessment.id}
      className="bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition"
      onClick={() => router.push(`/tier2/assessment/${assessment.id}`)}
    >
      <h2 className="text-xl font-bold text-gray-800">{assessment.title}</h2>
      <p className="text-gray-600 mt-2">{assessment.description}</p>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<p>Loading assessment...</p>}>
      <AssessmentComponent />
    </Suspense>
  );
}