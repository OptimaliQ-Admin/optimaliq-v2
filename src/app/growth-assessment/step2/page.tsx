// src/app/growth-assessment/step2/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/lib/supabase";
import LabeledInput from "../../../components/shared/LabeledInput";
import LabeledSelect from "../../../components/shared/LabeledSelect";
import SubmitButton from "../../../components/shared/SubmitButton";
import FormSectionHeader from "../../../components/shared/FormSectionHeader";

export default function GrowthAssessmentStep2() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      setError("User session expired. Please start again.");
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
    setError(null); // Clear any previous errors when user makes changes
  };

  const validateForm = () => {
    const requiredFields = ["obstacles", "strategy", "process", "customers", "technology"];
    const missingFields = requiredFields.filter(field => !businessResponses[field as keyof typeof businessResponses]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!userId) {
      setError("User ID is missing. Please start again.");
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("📝 Submitting growth assessment:", {
        userId,
        responses: businessResponses,
        timestamp: new Date().toISOString()
      });

      const { error: upsertError } = await supabase
        .from("growth_assessment")
        .upsert(
          [
            {
              u_id: userId,
              ...businessResponses,
              submittedat: new Date().toISOString(),
            },
          ],
          { onConflict: "u_id" }
        );

      if (upsertError) {
        console.error("❌ Failed to save responses:", upsertError);
        setError(`Failed to save responses: ${upsertError.message}`);
      } else {
        console.log("✅ Successfully saved growth assessment");
        router.push("/growth-assessment/step3");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
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

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <LabeledInput 
            label="What are your biggest obstacles to scaling?" 
            name="obstacles" 
            maxLength={250} 
            value={businessResponses.obstacles} 
            onChange={handleChange}
          />
          <LabeledInput 
            label="How does your strategy differentiate you?" 
            name="strategy" 
            maxLength={250} 
            value={businessResponses.strategy} 
            onChange={handleChange}
          />
          <LabeledSelect 
            label="Are your processes optimized for efficiency?" 
            name="process" 
            value={businessResponses.process} 
            onChange={handleChange} 
            options={["Yes", "No"]}
          />
          <LabeledInput 
            label="How well do you understand your customers' needs?" 
            name="customers" 
            maxLength={250} 
            value={businessResponses.customers} 
            onChange={handleChange}
          />
          <LabeledSelect 
            label="Is your technology stack supporting your growth?" 
            name="technology" 
            value={businessResponses.technology} 
            onChange={handleChange} 
            options={["Outdated", "Needs Work", "Optimized", "Cutting Edge"]}
          />
          <SubmitButton isSubmitting={isSubmitting} cooldown={cooldown} type="submit" />
        </form>
      </div>
    </div>
  );
}
