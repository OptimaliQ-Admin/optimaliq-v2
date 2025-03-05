"use client";
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [score, setScore] = useState(3);
  const [insights, setInsights] = useState({
    strategy: "Complete the assessment to receive insights.",
    process: "Complete the assessment to receive insights.",
    technology: "Complete the assessment to receive insights.",
  });
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState([]);

  // Function to round down to the nearest 0.5
  const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;

  const fetchAIInsights = async (answers: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/getInsights", { answers });

      // Round score down to the nearest 0.5 before updating UI
      const roundedScore = roundToNearestHalf(response.data.score ?? 1);
      setScore(roundedScore);

      setInsights({
        strategy: response.data.strategyInsight || "No insight available.",
        process: response.data.processInsight || "No insight available.",
        technology: response.data.technologyInsight || "No insight available.",
      });

      // Roadmap to improvement with rounded score
      const improvementSteps = [
        { month: "Now", score: roundedScore },
        { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
        { month: "6 Months", score: Math.min(5, roundedScore + 1) },
        { month: "12 Months", score: Math.min(5, roundedScore + 2) },
      ];

      setRoadmapData(improvementSteps);

    } catch (error) {
      console.error("Error fetching AI insights:", error.response?.data || error.message);
      setScore(1);
      setInsights({
        strategy: "Error generating insights. Please try again.",
        process: "Error generating insights. Please try again.",
        technology: "Error generating insights. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4">
     <header className="w-full max-w-4xl py-6 flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold tracking-tight">GMF+ Business Growth Dashboard</h1>
          <p className="text-gray-600 mt-2">Assess your business and get AI-driven insights.</p>
        </div>

        {/* Sign In Link */}
        <a 
          href="/tier2/login" 
          className="text-blue-600 hover:underline text-lg font-medium absolute top-6 right-6"
        >
          Sign In
        </a>
      </header>

      <section className="w-full max-w-3xl mt-6">
        <Card className="p-6 shadow-lg bg-white text-center rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Your GMF+ Score</h2>
          <p className="text-5xl font-bold text-blue-600 mt-2">{score} / 5</p>
        </Card>
      </section>

      {/* 🛣️ Roadmap to Improvement Chart */}
      <section className="w-full max-w-3xl mt-6">
        <Card className="p-6 shadow-lg bg-white rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">🛣️ Roadmap to Score Improvement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roadmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="w-full max-w-3xl mt-6">
        <Card className="p-6 shadow-lg bg-white rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">🤖 AI-Generated Insights</h2>
          {loading ? (
            <p className="text-gray-500">Generating insights...</p>
          ) : (
            <>
              <p className="text-gray-700 mt-2"><strong>📌 Strategy:</strong> {insights.strategy}</p>
              <p className="text-gray-700 mt-2"><strong>⚙️ Process:</strong> {insights.process}</p>
              <p className="text-gray-700 mt-2"><strong>🖥️ Technology:</strong> {insights.technology}</p>
            </>
          )}
        </Card>
      </section>

      {/* Business Growth Deep Assessment */}
      <form
  onSubmit={(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const answers = Object.fromEntries(formData.entries());

    // Validate required fields before sending data
    if (!answers.email || !answers.industry) {
      alert("⚠️ Please fill in the required fields: Email & Industry.");
      return;
    }

    fetchAIInsights(answers);
  }}
  className="w-full max-w-3xl mt-8 bg-white p-6 shadow-lg rounded-lg space-y-4"
>
  <h2 className="text-lg font-bold text-gray-700">Business Growth Deep Assessment</h2>

  {/* Name */}
  <label className="block">
    <span className="text-gray-700">Your Name</span>
    <input
      type="text"
      name="name"
      maxLength={50}
      className="block w-full mt-1 border border-gray-300 rounded p-2"
      placeholder="Enter your name"
    />
  </label>

  {/* Email (Required) */}
  <label className="block">
    <span className="text-gray-700">Your Email <span className="text-red-500">*</span></span>
    <input
      type="email"
      name="email"
      required
      className="block w-full mt-1 border border-gray-300 rounded p-2"
      placeholder="Enter your email"
    />
  </label>

  {/* Industry (Required) */}
  <label className="block">
    <span className="text-gray-700">Your Industry <span className="text-red-500">*</span></span>
    <select
      name="industry"
      required
      className="block w-full mt-1 border border-gray-300 rounded p-2"
    >
      <option value="">Select your industry</option>
      <option value="Technology">Technology</option>
      <option value="Healthcare">Healthcare</option>
      <option value="Finance">Finance</option>
      <option value="Retail">Retail</option>
      <option value="Manufacturing">Manufacturing</option>
      <option value="Education">Education</option>
      <option value="Consulting">Consulting</option>
      <option value="Other">Other</option>
    </select>
  </label>

  {/* Role */}
  <label className="block">
    <span className="text-gray-700">Your Role</span>
    <input
      type="text"
      name="role"
      maxLength={50}
      className="block w-full mt-1 border border-gray-300 rounded p-2"
      placeholder="Enter your role"
    />
  </label>
  <label className="block">
  <span className="text-gray-700">Company Size</span>
  <select name="companySize" className="block w-full mt-1 border border-gray-300 rounded p-2">
    <option value="1-10">1-10 Employees</option>
    <option value="11-50">11-50 Employees</option>
    <option value="51-200">51-200 Employees</option>
    <option value="201-500">201-500 Employees</option>
    <option value="501-1000">501-1000 Employees</option>
    <option value="1000+">1000+ Employees</option>
  </select>
</label>

<label className="block">
  <span className="text-gray-700">Annual Revenue</span>
  <select name="revenueRange" className="block w-full mt-1 border border-gray-300 rounded p-2">
    <option value="<$100K">Less than $100K</option>
    <option value="$100K-$500K">$100K - $500K</option>
    <option value="$500K-$1M">$500K - $1M</option>
    <option value="$1M-$10M">$1M - $10M</option>
    <option value="$10M-$50M">$10M - $50M</option>
    <option value="$50M+">More than $50M</option>
  </select>
</label>

  {/* Business Assessment Fields */}
  <label className="block">
    <span className="text-gray-700">What are your biggest obstacles to scaling?</span>
    <input
      type="text"
      name="obstacles"
      maxLength={150}
      className="block w-full mt-1 border border-gray-300 rounded p-2"
      placeholder="e.g., funding, hiring, competition"
    />
  </label>

  <label className="block">
    <span className="text-gray-700">How does your strategy differentiate you?</span>
    <input
      type="text"
      name="strategy"
      maxLength={150}
      className="block w-full mt-1 border border-gray-300 rounded p-2"
      placeholder="e.g., Unique brand, low cost, innovation"
    />
  </label>

  <label className="block">
    <span className="text-gray-700">Are your processes optimized for efficiency?</span>
    <select name="process" className="block w-full mt-1 border border-gray-300 rounded p-2">
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </label>

  <label className="block">
    <span className="text-gray-700">How well do you understand your customers' needs?</span>
    <input
      type="text"
      name="customers"
      maxLength={150}
      className="block w-full mt-1 border border-gray-300 rounded p-2"
      placeholder="e.g., Surveys, analytics, intuition"
    />
  </label>

  <label className="block">
    <span className="text-gray-700">Is your technology stack supporting your growth?</span>
    <select name="technology" className="block w-full mt-1 border border-gray-300 rounded p-2">
      <option value="Outdated">Outdated</option>
      <option value="Needs Work">Needs Work</option>
      <option value="Optimized">Optimized</option>
      <option value="Cutting Edge">Cutting Edge</option>
    </select>
  </label>

  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
    Get AI Insights & Roadmap
  </button>
      </form>
    </div>
  );
}
