"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function InsightsPage() {  // ⬅ Removed `export default`
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); 

  if (!email) {
    console.error("🚨 Email is required but missing!");
    return <p className="text-red-500">⚠️ Error: Email is required.</p>;
  } 
  // Define the expected structure of simulationResult
interface SimulationResult {
  revenueImpact: number;
  costSavings: number;
  efficiencyGain: number;
} 
  const [trends, setTrends] = useState<Trend[]>([]); // ✅ Defined type once
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simLoading, setSimLoading] = useState(false);
  const [strategyChange, setStrategyChange] = useState(0);
  const [processChange, setProcessChange] = useState(0);
  const [techChange, setTechChange] = useState(0);
  const [revenue, setRevenue] = useState(100000);
  const [costs, setCosts] = useState(50000);
  const [efficiency, setEfficiency] = useState(50);

  // ✅ Define Trend Type
  interface Trend {
    trend: string;
    whyItMatters: string;
  }

  // Load User Data & Trends
  useEffect(() => {
    if (!email) {
      setError("No user session found.");
      setLoading(false);
      return;
    }

    const fetchTrends = async () => {
      try {
        const response = await axios.post("/api/tier2/getTrends", { industry: "Consulting", email });
        setTrends(response.data.topTrends || []);
      } catch (err) {
        setError("Failed to load industry trends.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [email]); // ✅ Runs when email changes

  // Function to Run Simulation
  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const response = await axios.post("/api/tier2/getSimulation", {
        strategyChange,
        processChange,
        techChange,
        revenue,
        costs,
        efficiency,
      });
      setSimulationResult(response.data);
    } catch (error) {
      console.error("Error running simulation:", error);
    }
    setSimLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Navigation - Maintain User Session */}
      <aside className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">GMF+</h2>
          <nav className="space-y-4">
            <a href={`/tier2/dashboard?email=${encodeURIComponent(email)}`} className="block text-gray-700 hover:text-blue-600 font-medium">📊 Dashboard</a>
            <a href={`/tier2/insights?email=${encodeURIComponent(email)}`} className="block text-gray-700 hover:text-blue-600 font-medium">📑 Insights</a>
            <a href={`/tier2/assessment?email=${encodeURIComponent(email)}`} className="block text-gray-700 hover:text-blue-600 font-medium">📝 Assessment</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">👥 Community</a>
          </nav>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Placeholder for user avatar */}
          <p className="text-gray-700 font-medium">{email || "User"}</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 space-y-6">
        <header className="w-full max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">📊 Insights & Business Simulator</h1>
          <p className="text-gray-600 mt-2">Explore key industry trends & simulate business changes.</p>
        </header>

        {/* Industry Trends Section */}
        <div className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">🔥 Industry Trends</h2>
          {loading ? (
            <p className="text-gray-600 text-lg mt-4">Loading trends...</p>
          ) : error ? (
            <p className="text-red-500 text-lg mt-4">{error}</p>
          ) : trends.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {trends.map((trend, index) => (
                <li key={index}>
                  <strong>{trend.trend}:</strong> {trend.whyItMatters}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No trends available.</p>
          )}
        </div>

        {/* 🔮 What-If Scenario Simulator */}
        <div className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">🔮 What-If Scenario Simulator</h2>
          <p className="text-gray-600 mt-2">Adjust the sliders below to simulate changes and see the potential business impact.</p>

          {/* Sliders */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-gray-700 font-medium">📌 Strategy Change</label>
              <input type="range" min="-2" max="2" step="0.5" value={strategyChange} onChange={(e) => setStrategyChange(parseFloat(e.target.value))} className="w-full"/>
              <p className="text-gray-600">Change: {strategyChange}</p>
            </div>
          </div>

          <button onClick={runSimulation} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Run Simulation
          </button>

          {/* Simulation Results */}
          {simLoading ? (
            <p className="text-gray-500 mt-4">Running simulation...</p>
          ) : simulationResult ? (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-700">📊 Simulation Results</h3>
              <p className="text-gray-600">📈 Revenue Impact: ${simulationResult.revenueImpact.toFixed(2)}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
// ✅ Wrap in Suspense to prevent Next.js hydration issues
export default function InsightsWrapper() {
  return (
    <Suspense fallback={<p>Loading insights...</p>}>
      <InsightsPage />
    </Suspense>
  );
}


