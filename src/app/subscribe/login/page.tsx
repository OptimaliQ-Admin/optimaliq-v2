"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import LabeledInput from "@/components/shared/LabeledInput";
import SubmitButton from "@/components/shared/SubmitButton";
import { toast } from "react-hot-toast";
import AssessmentIntroModal from "@/components/modals/AssessmentIntroModal";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = usePremiumUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ 1. Try login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData?.user?.id) {
      setError("Invalid credentials or user not found.");
      return;
    }

    const authUserId = signInData.user.id;

    // ✅ 2. One API call to check everything
    const res = await fetch("/api/premium/auth/checkUserStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: authUserId }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Failed to verify account.");
      return;
    }

    const { hasActiveSubscription, hasCompletedOnboarding, profile } = result;

    setUser(profile); // ✅ Set context

    if (!hasActiveSubscription) {
      toast.error("Your subscription is inactive. Please subscribe.");
      router.push("/Pricing");
      return;
    }

    if (hasCompletedOnboarding) {
      router.push("/premium/dashboard");
    } else {
      setShowAssessmentModal(true); // ✅ Correct modal triggered
    }
  };

  const handleStartAssessment = () => {
    setShowAssessmentModal(false);
    router.push("/premium/onboarding/initial-assessment");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h1>
          <p className="text-center text-sm text-gray-600 mb-6">Log in to access your dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <LabeledInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <LabeledInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-right text-sm">
              <a href="/subscribe/forgot-password" className="text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <SubmitButton text="Log In" isSubmitting={false} cooldown={0} />
          </form>
        </div>
      </div>

      {/* ✅ Modal to prompt onboarding if not yet done */}
      <AssessmentIntroModal
        isOpen={showAssessmentModal}
        onClose={handleStartAssessment} // closes + navigates
      />
    </>
  );
}
