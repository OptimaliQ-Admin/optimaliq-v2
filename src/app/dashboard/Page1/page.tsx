"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page1() {
  const router = useRouter();
  
  // State to store business assessment responses
  const [businessResponses, setBusinessResponses] = useState({
    obstacles: "",
    strategy: "",
    process: "",
    customers: "",
    technology: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBusinessResponses({
      ...businessResponses,
      [e.target.name]: e.target.value,
    });
  };
  

  // Handle form submission and navigate to Page2
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
   // Validate required fields
for (const key in businessResponses) {
  if (!businessResponses[key as keyof typeof businessResponses]) {
    alert("⚠️ All fields are required. Please complete the form before proceeding.");
    return;
  }
}
    
    // Navigate to Page2 with responses passed as a query parameter
    router.push(`/dashboard/Page2?businessResponses=${encodeURIComponent(JSON.stringify(businessResponses))}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4">
      <header className="w-full max-w-4xl py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Business Growth Assessment</h1>
        <p className="text-gray-600 mt-2">Answer the following questions to get AI-driven insights.</p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg space-y-4">
        <label className="block">
          <span className="text-gray-700">What are your biggest obstacles to scaling?</span>
          <input
            type="text"
            name="obstacles"
            value={businessResponses.obstacles}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="e.g., funding, hiring, competition"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">How does your strategy differentiate you?</span>
          <input
            type="text"
            name="strategy"
            value={businessResponses.strategy}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="e.g., Unique brand, low cost, innovation"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Are your processes optimized for efficiency?</span>
          <select
            name="process"
            value={businessResponses.process}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">How well do you understand your customers' needs?</span>
          <input
            type="text"
            name="customers"
            value={businessResponses.customers}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="e.g., Surveys, analytics, intuition"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Is your technology stack supporting your growth?</span>
          <select
            name="technology"
            value={businessResponses.technology}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select</option>
            <option value="Outdated">Outdated</option>
            <option value="Needs Work">Needs Work</option>
            <option value="Optimized">Optimized</option>
            <option value="Cutting Edge">Cutting Edge</option>
          </select>
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Get AI Insights
        </button>
      </form>
    </div>
  );
}
