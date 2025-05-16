// src/app/tier2/assessment/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePremiumUser } from "@/context/PremiumUserContext";
import SectionHeader from "@/components/growthstudio/SectionHeader";
import BPMCard from "@/components/assessments/BPMCard";
import SalesPerformanceCard from "@/components/assessments/SalesPerformanceCard";
import { getLatestBPMScore } from "@/lib/queries/getLatestBPMScore";
import { getLatestSalesScore } from "@/lib/queries/getLatestSalesScore";
import TechCard from "@/components/assessments/TechCard";
import { getLatestTechScore } from "@/lib/queries/getLatestTechScore";
import StrategicCard from "@/components/assessments/StrategicCard";
import { getLatestStrategicScore } from "@/lib/queries/getLatestStrategicScore";
import Business_ReassessmentCard from "@/components/assessments/Business_ReassessmentCard";
import { getLatestReassessmentScore } from "@/lib/queries/getLatestReassessmentScore";
import MarketingCard from "@/components/assessments/MarketingCard";
import { getLatestMarketingScore } from "@/lib/queries/getLatestMarketingScore";
import CustomerCard from "@/components/assessments/CustomerCard";
import { getLatestCustomerScore } from "@/lib/queries/getLatestCustomerScore";
import AICard from "@/components/assessments/AICard";
import DigitalCard from "@/components/assessments/DigitalCard";
import LeadershipCard from "@/components/assessments/LeadershipCard";
import GrowthCard from "@/components/assessments/GrowthCard";


function AssessmentComponent() {
  const { user } = usePremiumUser();
  const router = useRouter();

  const email = user?.email;
  const u_id = user?.u_id;

  const [bpmScore, setBpmScore] = useState<number | null>(null);
  const [bpmLastTaken, setBpmLastTaken] = useState<string | null>(null);
  const [salesScore, setSalesScore] = useState<number | null>(null);
  const [salesLastTaken, setSalesLastTaken] = useState<string | null>(null);
  const [techScore, settechScore] = useState<number | null>(null);
  const [techLastTaken, settechLastTaken] = useState<string | null>(null);
  const [StrategicScore, setStrategicScore] = useState<number | null>(null);
  const [StrategicLastTaken, setStrategicLastTaken] = useState<string | null>(null);
  const [reassessment_score, setreassessmentScore] = useState<number | null>(null);
  const [reassessmentLastTaken, setreassessmentLastTaken] = useState<string | null>(null);
  const [marketing_score, setmarketingScore] = useState<number | null>(null);
  const [marketingLastTaken, setmarketingLastTaken] = useState<string | null>(null);
  const [Customer_score, setCustomerScore] = useState<number | null>(null);
  const [CustomerLastTaken, setCustomerLastTaken] = useState<string | null>(null);


  useEffect(() => {
    if (!u_id) return;

    const fetchBPM = async () => {
      const result = await getLatestBPMScore(u_id);
      setBpmScore(result?.score ?? null);
      setBpmLastTaken(result?.takenAt ?? null);
    };

    const fetchSales = async () => {
      const result = await getLatestSalesScore(u_id);
      setSalesScore(result?.score ?? null);
      setSalesLastTaken(result?.takenAt ?? null);
    };
    const fetchTech = async () => {
      const result = await getLatestTechScore(u_id);
      settechScore(result?.score ?? null);
      settechLastTaken(result?.takenAt ?? null);
    };

    const fetchStrategic = async () => {
      const result = await getLatestStrategicScore(u_id);
      setStrategicScore(result?.score ?? null);
      setStrategicLastTaken(result?.takenAt ?? null);
    };

    const fetchReassessment = async () => {
      const result = await getLatestReassessmentScore(u_id);
      setreassessmentScore(result?.score ?? null);
      setreassessmentLastTaken(result?.takenAt ?? null);
    };

    const fetchMarketing = async () => {
      const result = await getLatestMarketingScore(u_id);
      setmarketingScore(result?.score ?? null);
      setmarketingLastTaken(result?.takenAt ?? null);
    };

     const fetchCustomer = async () => {
      const result = await getLatestCustomerScore(u_id);
      setCustomerScore(result?.score ?? null);
      setCustomerLastTaken(result?.takenAt ?? null);
    };


    fetchBPM();
    fetchSales();
    fetchTech();
    fetchStrategic();
    fetchReassessment();
    fetchMarketing();
    fetchCustomer();
  }, [u_id]);

  if (!email || !u_id) {
    return <p className="text-center text-red-600">⚠️ Email and User ID required.</p>;
  }

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl space-y-10">
        <SectionHeader
          title="📝 Business Assessments"
          subtitle="Choose an assessment to gain deeper insights into your business."
        />


<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
  {/* Inject BPMCard */}
  <BPMCard score={bpmScore} lastTakenDate={bpmLastTaken} userId={u_id} />

  {/* Inject SalesPerformanceCard */}
  <SalesPerformanceCard score={salesScore} lastTakenDate={salesLastTaken} userId={u_id} />

{/* Inject TechCard */}
  <TechCard score={techScore} lastTakenDate={techLastTaken} userId={u_id} />
  
{/* Inject StrategicCard */}
  <StrategicCard score={StrategicScore} lastTakenDate={StrategicLastTaken} userId={u_id} />

  {/* Inject ReassessmentCard */}
  <Business_ReassessmentCard score={reassessment_score} lastTakenDate={reassessmentLastTaken} userId={u_id} />

  {/* Inject MarketingCard */}
  <MarketingCard score={marketing_score} lastTakenDate={marketingLastTaken} userId={u_id} />

   {/* Inject CustomerCard */}
  <CustomerCard score={Customer_score} lastTakenDate={CustomerLastTaken} userId={u_id} />
  

  {[
    
   
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