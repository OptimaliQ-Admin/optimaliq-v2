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
import { getLatestAIScore } from "@/lib/queries/getLatestAIScore";
import DigitalCard from "@/components/assessments/DigitalCard";
import { getLatestDigitalScore } from "@/lib/queries/getLatestDigitalScore";
import LeadershipCard from "@/components/assessments/LeadershipCard";
import { getLatestLeadershipScore } from "@/lib/queries/getLatestLeadershipScore";
import GrowthCard from "@/components/assessments/GrowthCard";
import { getLatestGrowthScore } from "@/lib/queries/getLatestGrowthScore";


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
  const [AI_score, setAIScore] = useState<number | null>(null);
  const [AILastTaken, setAILastTaken] = useState<string | null>(null);
  const [Digital_score, setDigitalScore] = useState<number | null>(null);
  const [DigitalLastTaken, setDigitalLastTaken] = useState<string | null>(null);
  const [Leadership_score, setLeadershipScore] = useState<number | null>(null);
  const [LeadershipLastTaken, setLeadershipLastTaken] = useState<string | null>(null);
  const [Growth_score, setGrowthScore] = useState<number | null>(null);
  const [GrowthLastTaken, setGrowthLastTaken] = useState<string | null>(null);


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

    const fetchAI = async () => {
      const result = await getLatestAIScore(u_id);
      setAIScore(result?.score ?? null);
      setAILastTaken(result?.takenAt ?? null);
    };

    const fetchDigital = async () => {
      const result = await getLatestDigitalScore(u_id);
      setDigitalScore(result?.score ?? null);
      setDigitalLastTaken(result?.takenAt ?? null);
    };

     const fetchLeadership = async () => {
      const result = await getLatestLeadershipScore(u_id);
      setLeadershipScore(result?.score ?? null);
      setLeadershipLastTaken(result?.takenAt ?? null);
    };

    const fetchGrowth = async () => {
      const result = await getLatestGrowthScore(u_id);
      setGrowthScore(result?.score ?? null);
      setGrowthLastTaken(result?.takenAt ?? null);
    };


    fetchBPM();
    fetchSales();
    fetchTech();
    fetchStrategic();
    fetchReassessment();
    fetchMarketing();
    fetchCustomer();
    fetchAI();
    fetchDigital();
    fetchLeadership();
    fetchGrowth();
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

  {/* Inject AICard */}
  <AICard score={AI_score} lastTakenDate={AILastTaken} userId={u_id} />

  {/* Inject DigitalCard */}
  <DigitalCard score={Digital_score} lastTakenDate={DigitalLastTaken} userId={u_id} />

  {/* Inject LeadershipCard */}
  <LeadershipCard score={Leadership_score} lastTakenDate={LeadershipLastTaken} userId={u_id} />

  {/* Inject GrowthCard */}
  <GrowthCard score={Growth_score} lastTakenDate={GrowthLastTaken} userId={u_id} />
  

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