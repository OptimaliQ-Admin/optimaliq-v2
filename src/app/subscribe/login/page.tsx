//src/app/subscribe/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import LabeledInput from "@/components/shared/LabeledInput";
import SubmitButton from "@/components/shared/SubmitButton";
import LoadingSpinner from "@/components/shared/LoadingSpinner"; // ✅ Make sure you have this
import { toast } from "react-hot-toast";
import PasswordInput from "@/components/shared/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = usePremiumUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ new


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // ✅ show spinner

    try {
      // ✅ 1. Try login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData?.user?.id) {
        const errorMessage = signInError?.message || "Invalid email or password";
        toast.error(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const authUserId = signInData.user.id;

      // ✅ 2. Check user status
      const res = await fetch("/api/premium/auth/checkUserStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_id: authUserId }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result.error || "Failed to verify account";
        toast.error(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const { hasActiveSubscription, hasCompletedOnboarding, profile } = result;

      if (!hasActiveSubscription) {
        toast.error("Your subscription is inactive. Please subscribe.");
        router.push("/Pricing");
        return;
      }

      setUser(profile); // ✅ set context
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("🧠 Session after login:", sessionData);

      // Add success toast
      toast.success("Welcome back!");

      if (hasCompletedOnboarding) {
        router.push("/premium/dashboard");
      } else {
        router.push("/premium/onboarding/required");
      }
    } catch (error) {
      console.error("❌ Unexpected login error:", error);
      const errorMessage = "Unexpected error. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

          <PasswordInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="text-right text-sm">
            <a href="/subscribe/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <SubmitButton
  text="Log In"
  isSubmitting={isLoading}
  type="submit" // ✅ Ensure it's type submit
  disabled={isLoading}
/>

          )}
        </form>
      </div>
    </div>
  );
}
