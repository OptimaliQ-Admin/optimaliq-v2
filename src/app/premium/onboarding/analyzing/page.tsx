"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { showToast } from "@/lib/utils/toast";
import AnalyzingMessage from "@/components/shared/AnalyzingMessage";

export default function OnboardingAnalyzingPage() {
  const router = useRouter();
  const { user } = usePremiumUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.u_id) {
      showToast.error("User session expired. Please log in again.");
      router.push("/subscribe/login");
      return;
    }

    // Get the assessment data from localStorage (stored by the initial assessment page)
    const assessmentData = localStorage.getItem("onboarding_assessment_data");
    
    if (!assessmentData) {
      showToast.error("Assessment data not found. Please start over.");
      router.push("/premium/onboarding/initial-assessment");
      return;
    }

    const processAssessment = async () => {
      try {
        const formAnswers = JSON.parse(assessmentData);
        
        // Submit the assessment
        const response = await fetch("/api/premium/onboarding/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            u_id: user.u_id, 
            formAnswers: formAnswers 
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Failed to process assessment");
        }

        // Clear the stored data
        localStorage.removeItem("onboarding_assessment_data");
        
        // Show success and redirect to dashboard
        showToast.success("Assessment completed successfully!");
        router.push("/premium/dashboard");
        
      } catch (err) {
        console.error("Assessment processing error:", err);
        setError(err instanceof Error ? err.message : "Failed to process assessment");
        setIsProcessing(false);
      }
    };

    // Start processing after a brief delay to show the analyzing state
    const timer = setTimeout(processAssessment, 1000);
    
    return () => clearTimeout(timer);
  }, [user?.u_id, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/premium/onboarding/initial-assessment")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <AnalyzingMessage />
        <p className="mt-4 text-sm text-gray-500">Powered by OptimaliQ.ai</p>
      </div>
    </div>
  );
} 