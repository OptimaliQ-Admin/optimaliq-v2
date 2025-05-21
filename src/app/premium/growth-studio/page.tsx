//src/app/premium/growth-studio/page.tsx
"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useSimulation } from "@/context/SimulationContext";
import SimulationModal from "@/components/growthstudio/SimulationModal";
import GrowthLeversCard from "@/components/growthstudio/GrowthLeversCard";
import QuadrantChart from "@/components/growthstudio/QuadrantChart";
import InsightLoading from "@/components/dashboard/InsightLoading";

export default function GrowthStudioPage() {
  const { user } = usePremiumUser();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { simulation, setSimulation } = useSimulation();

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <InsightLoading />;
  }

  if (!user?.email || !user?.u_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Access Denied</h2>
            <p className="text-center text-gray-600 mb-6">
              Please sign in to access the Growth Studio.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuadrantChart userId={user.u_id} />
          <GrowthLeversCard userId={user.u_id} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Growth Strategy</h3>
              <p className="text-gray-600 mb-4">
                Based on your assessment results, we've identified key areas for growth and improvement.
                Use the growth levers below to explore different strategies and their potential impact.
              </p>
              <Button
                onClick={() => setSimulation({ isOpen: true })}
                className="w-full"
              >
                Run Growth Simulation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {simulation.isOpen && (
        <SimulationModal
          isOpen={simulation.isOpen}
          onClose={() => setSimulation({ isOpen: false })}
          userId={user.u_id}
        />
      )}
    </div>
  );
}