"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface SimulationResult {
  revenueImpact: number;
  costSavings: number;
  efficiencyGain: number;
}

export default function SimulatorPanel({
  onResult,
}: {
  onResult: (result: SimulationResult | null) => void;
}) {
  const [strategyChange, setStrategyChange] = useState(0);
  const [processChange, setProcessChange] = useState(0);
  const [techChange, setTechChange] = useState(0);
  const [revenue, setRevenue] = useState(100000);
  const [costs, setCosts] = useState(50000);
  const [efficiency, setEfficiency] = useState(50);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/growth_studio/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          strategyChange: strategyChange,
          processChange: processChange,
          techChange: techChange,
          revenue: revenue,
          costs: costs,
          efficiency: efficiency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to run simulation");
      }

      const data = await response.json();
      setResults(data);
      onResult(data);
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err instanceof Error ? err.message : "Failed to run simulation");
      onResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="p-6 w-full max-w-3xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-2 text-gray-800">🔮 What-If Scenario Simulator</h2>
        <p className="text-gray-600 mb-4">Adjust metrics to see how improvements in strategy, process, and tech affect business outcomes.</p>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <Label>Strategy Change</Label>
            <Slider 
  min={-2} 
  max={2} 
  step={0.5} 
  value={strategyChange} 
  onValueChange={(val: number) => setStrategyChange(val)} 
/>

            <p className="text-sm text-gray-500 mt-1">Change: {strategyChange}</p>
          </div>
          <div>
            <Label>Process Change</Label>
            <Slider 
  min={-2} 
  max={2} 
  step={0.5} 
  value={processChange} onValueChange={(val: number) => setProcessChange(val)} />
            <p className="text-sm text-gray-500 mt-1">Change: {processChange}</p>
          </div>
          <div>
            <Label>Technology Change</Label>
            <Slider 
  min={-2} 
  max={2} 
  step={0.5} 
  value={techChange} onValueChange={(val: number) => setTechChange(val)} />
            <p className="text-sm text-gray-500 mt-1">Change: {techChange}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Revenue ($)</Label>
            <Input type="number" value={revenue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRevenue(Number(e.target.value))} />
          </div>
          <div>
            <Label>Costs ($)</Label>
            <Input type="number" value={costs} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCosts(Number(e.target.value))} />
          </div>
          <div>
            <Label>Efficiency (%)</Label>
            <Input type="number" value={efficiency} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEfficiency(Number(e.target.value))} />
          </div>
        </div>

        <Button onClick={runSimulation} className="mt-6 w-full">
          {loading ? "Simulating..." : "Run Simulation"}
        </Button>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

      </CardContent>
    </Card>
  );
}
