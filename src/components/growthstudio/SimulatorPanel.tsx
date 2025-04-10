"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SimulatorPanel() {
  const [strategyChange, setStrategyChange] = useState(0);
  const [processChange, setProcessChange] = useState(0);
  const [techChange, setTechChange] = useState(0);
  const [revenue, setRevenue] = useState(100000);
  const [costs, setCosts] = useState(50000);
  const [efficiency, setEfficiency] = useState(50);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/tier2/growth_studio/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyChange,
          processChange,
          techChange,
          revenue,
          costs,
          efficiency,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Simulation failed:", err);
    }
    setLoading(false);
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

        {/* Results */}
        {results && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg text-gray-700">📈 Simulation Results</h3>
            <p className="text-gray-600">Revenue Impact: ${results.revenueImpact?.toLocaleString()}</p>
            <p className="text-gray-600">Cost Savings: ${results.costSavings?.toLocaleString()}</p>
            <p className="text-gray-600">Efficiency Gain: {results.efficiencyGain?.toFixed(1)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
