"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import LabeledInput from "@/components/shared/LabeledInput";
import SubmitButton from "@/components/shared/SubmitButton";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = usePremiumUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data?.user?.id) {
      setError("Invalid credentials or user not found.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("u_id", data.user.id)
      .single();

    if (profileError || !profile) {
      setError("Failed to load user profile.");
      return;
    }

    setUser(profile);
    router.push("/premium/dashboard");
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
  );
}
