"use client";

import { useState, useEffect } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import QuadrantChart from "./QuadrantChart";
import BarChartCard from "./BarChartCard";

interface GrowthInsights {
  quadrantData: {
    companies: Array<{
      label: string;
      strategyScore: number;
      processScore: number;
      technologyScore: number;
    }>;
    user: {
      strategyScore: number;
      processScore: number;
      technologyScore: number;
    };
  };
}

export default function GrowthChartModule() {
  const { user } = usePremiumUser();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [data, setData] = useState<GrowthInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.u_id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/growth_studio/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: user.u_id }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch growth insights");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching growth insights:", err);
        setError(err instanceof Error ? err.message : "Failed to load insights");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.u_id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-[400px] bg-gray-100 rounded"></div>
          <div className="h-[400px] bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p className="font-semibold mb-2">⚠️ Error Loading Charts</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <QuadrantChart
        companies={data.quadrantData.companies}
        userData={data.quadrantData.user}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
      <BarChartCard
        companies={data.quadrantData.companies}
        userData={data.quadrantData.user}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
    </div>
  );
} 