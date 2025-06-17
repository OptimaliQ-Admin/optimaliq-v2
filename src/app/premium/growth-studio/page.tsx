//src/app/premium/growth-studio/page.tsx
"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, LineChart, Target, TrendingUp } from "lucide-react";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import GrowthChartModule from "@/components/growthstudio/GrowthChartModule";

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
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
    effort: string;
    priority: string;
  }>;
}

export default function GrowthStudioPage() {
  const { user } = usePremiumUser();
  const router = useRouter();
  const [insights, setInsights] = useState<GrowthInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
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

        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error("Error fetching growth insights:", err);
        setError(err instanceof Error ? err.message : "Failed to load insights");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user?.u_id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px] bg-gray-100 rounded"></div>
            <div className="h-[400px] bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">⚠️ Error Loading Growth Studio</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Growth Studio</h1>
        <p className="mt-2 text-gray-600">
          Analyze your growth trajectory and get personalized recommendations
        </p>
      </div>

      <div className="space-y-8">
        <GrowthChartModule />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <SectionTitleBar
              title="🎯 Growth Recommendations"
              tooltip="Personalized recommendations based on your current performance and goals"
            />
            <div className="mt-6 space-y-4">
              {insights.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-blue-600">Impact: {rec.impact}</span>
                    <span className="text-purple-600">Effort: {rec.effort}</span>
                    <span className="text-green-600">Priority: {rec.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitleBar
              title="📈 Growth Metrics"
              tooltip="Key metrics tracking your growth progress"
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Growth Rate</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-blue-900">+15%</p>
                <p className="text-sm text-blue-600">vs last quarter</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">Goal Progress</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-purple-900">75%</p>
                <p className="text-sm text-purple-600">of annual target</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <LineChart className="w-5 h-5" />
                  <span className="font-semibold">Efficiency</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-green-900">92%</p>
                <p className="text-sm text-green-600">resource utilization</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-semibold">Market Position</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-orange-900">#3</p>
                <p className="text-sm text-orange-600">in your segment</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => router.push("/premium/action-plan")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Action Plan
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}