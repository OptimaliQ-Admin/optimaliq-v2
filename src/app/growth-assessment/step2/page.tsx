// src/app/growth-assessment/step2/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LabeledInput from "@/components/shared/LabeledInput";
import LabeledSelect from "@/components/shared/LabeledSelect";
import SubmitButton from "@/components/shared/SubmitButton";
import FormSectionHeader from "@/components/shared/FormSectionHeader";

export default function GrowthAssessmentStep2() {
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
    const u_id = localStorage.getItem("u_id");
    if (!u_id) {
      alert("❌ User session expired. Please start again.");
      router.push("/growth-assessment");
      return;
    }
    setUserId(u_id);
  }, [router]);

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBusinessResponses({ ...businessResponses, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      alert("❌ User ID is missing. Please start again.");
      return;
    }

    try {
      const { error } = await supabase.from("assessment").upsert(
        [
          {
            u_id: userId,
            ...businessResponses,
            submittedat: new Date().toISOString(),
          },
        ],
        { onConflict: "u_id" }
      );

      if (error) {
        alert(`❌ Failed to save responses. ${error.message}`);
      } else {
        router.push("/growth-assessment/analyzing");
      }
    } catch {
      alert("❌ Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setCooldown(10);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white p-8 shadow-lg rounded-lg">
        <p className="text-blue-600 text-sm font-bold mb-4 text-center">Step 2 of 2 – Business Profile</p>
        <FormSectionHeader />

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <LabeledInput label="What are your biggest obstacles to scaling?" name="obstacles" maxLength={250} value={businessResponses.obstacles} onChange={handleChange} />
          <LabeledInput label="How does your strategy differentiate you?" name="strategy" maxLength={250} value={businessResponses.strategy} onChange={handleChange} />
          <LabeledSelect label="Are your processes optimized for efficiency?" name="process" value={businessResponses.process} onChange={handleChange} options={["Yes", "No"]} />
          <LabeledInput label="How well do you understand your customers' needs?" name="customers" maxLength={250} value={businessResponses.customers} onChange={handleChange} />
          <LabeledSelect label="Is your technology stack supporting your growth?" name="technology" value={businessResponses.technology} onChange={handleChange} options={["Outdated", "Needs Work", "Optimized", "Cutting Edge"]} />
          <SubmitButton isSubmitting={isSubmitting} cooldown={cooldown} />
        </form>
      </div>
    </div>
  );
}
