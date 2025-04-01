"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function Page2Component() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
const [cooldown, setCooldown] = useState(0);


  const [userId, setUserId] = useState<string | null>(null);
  const [businessResponses, setBusinessResponses] = useState({
    obstacles: "",
    strategy: "",
    process: "",
    customers: "",
    technology: "",
  });

  useEffect(() => {
    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null;

    if (!u_id) {
      alert("❌ User session expired. Please start again.");
      router.push("/dashboard/Page1");
      return;
    }

    setUserId(u_id);
  }, [router]);

    useEffect(() => {
      if (cooldown === 0) return;
    
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    
      return () => clearInterval(interval);
    }, [cooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBusinessResponses({
      ...businessResponses,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!userId) {
      alert("❌ User ID is missing. Please start again.");
      return;
    }
  
    try {
      const { error } = await supabase
        .from("assessment")
        .upsert(
          [
            {
              u_id: userId,
              ...businessResponses,
              submittedat: new Date().toISOString(),
            },
          ],
          { onConflict: "u_id" } // 🔐 Make sure u_id is a UNIQUE constraint in your DB
        );
  
        if (error) {
          alert(`❌ Failed to save responses. ${error.message}`);
        } else {
          router.push("/dashboard/Analyzing");
        }
      } catch {
        alert("❌ Unexpected error. Please try again.");
      } finally {
        setIsSubmitting(false);
        setCooldown(10); // 10-second cooldown
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="What are your biggest obstacles to scaling?" name="obstacles" maxLength={250} value={businessResponses.obstacles} onChange={handleChange} />
          <Input label="How does your strategy differentiate you?" name="strategy" maxLength={250} value={businessResponses.strategy} onChange={handleChange} />
          <Select label="Are your processes optimized for efficiency?" name="process" value={businessResponses.process} onChange={handleChange} options={["Yes", "No"]} />
          <Input label="How well do you understand your customers' needs?" name="customers" maxLength={250} value={businessResponses.customers} onChange={handleChange} />
          <Select
            label="Is your technology stack supporting your growth?"
            name="technology"
            value={businessResponses.technology}
            onChange={handleChange}
            options={["Outdated", "Needs Work", "Optimized", "Cutting Edge"]}
          />
         <button
  type="submit"
  disabled={isSubmitting || cooldown > 0}
  className={`w-full py-3 rounded-md text-lg font-semibold transition ${
    isSubmitting || cooldown > 0
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
>
  {isSubmitting
    ? "Submitting..."
    : cooldown > 0
    ? `Please wait (${cooldown}s)`
    : "Get My Insights"}
</button>



        </form>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }: any) {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full mt-1 border border-gray-300 rounded p-2"
        required
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full mt-1 border border-gray-300 rounded p-2"
        required
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

export default function Page2() {
  return <Page2Component />;
}
