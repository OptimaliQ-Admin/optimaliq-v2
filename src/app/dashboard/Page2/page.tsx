"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Ensure Supabase client is imported

function Page2Component() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<{ u_id: string } | null>(null);
  const [businessResponses, setBusinessResponses] = useState({
    obstacles: "",
    strategy: "",
    process: "",
    customers: "",
    technology: "",
  });

  useEffect(() => {
    const u_id = localStorage.getItem("u_id");

if (!u_id) {
  alert("❌ User session expired. Please start again.");
  router.push("/dashboard/Page1");
  return;
}

setUserInfo({ u_id }); // Just store the ID

  }, [searchParams, router]);

  // ✅ Handle business input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBusinessResponses({
      ...businessResponses,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submission & store in Supabase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInfo?.u_id) {
      alert("❌ User ID is missing. Please start from Page 1.");
      return;
    }

    try {
      console.log("🔍 Saving responses for user:", userInfo.u_id);
      console.log("📌 Submitting data:", businessResponses);

      // ✅ Step 1: Insert assessment data
      const { data, error } = await supabase
        .from("assessment") // ✅ Ensure correct table name
        .insert([
          {
            u_id: userInfo.u_id,
            obstacles: businessResponses.obstacles,
            strategy: businessResponses.strategy,
            process: businessResponses.process,
            customers: businessResponses.customers,
            technology: businessResponses.technology,
            submittedat: new Date().toISOString(),
          },
        ])
        .select("*"); // ✅ Fetch back the inserted data to verify

      if (error) {
        console.error("❌ Supabase Insert Error:", error);
        alert(`❌ Failed to save responses. Supabase says: ${error.message}`);
        return;
      }

      console.log("✅ Success! Inserted into assessments:", data);

// ✅ Step 2: Immediately navigate to Analyzing Page
const encodedUserInfo = encodeURIComponent(JSON.stringify(userInfo));
router.push(`/dashboard/Analyzing?userInfo=${encodedUserInfo}`);

    } catch (err: any) {
      console.error("❌ Unexpected Error:", err);
      alert(`Unexpected Error: ${err.message || "Something went wrong. Try again."}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white p-8 shadow-lg rounded-lg">
        <p className="text-blue-600 text-sm font-bold mb-4 text-center">Step 2 of 2 – Business Profile</p>
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Build Your Growth Roadmap</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Answer a few quick questions to receive custom insights on how to scale your business effectively.
          </p>
        </header>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">What are your biggest obstacles to scaling?</span>
            <input
              type="text"
              name="obstacles"
              value={businessResponses.obstacles}
              onChange={handleChange}
              className="block w-full mt-1 border border-gray-300 rounded p-2"
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

          {/* CTA Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
            Get My Insights
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense to prevent hydration issues
export default function Page2() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Page2Component />
    </Suspense>
  );
}
