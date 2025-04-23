// src/app/subscribe/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SubscribeForm from "@/components/subscribe/SubscribeForm";
import ValueCarousel from "@/components/subscribe/ValueCarousel";
import { useTier2User } from "@/context/Tier2UserContext";

export default function Tier2Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useTier2User();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/tier2/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // ✅ Set the user in context
      setUser(data);
      // ✅ Navigate cleanly (no email in URL)
      router.push("/tier2/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Sign in to GMF+ Tier 2</h1>
        <p className="text-gray-600 text-center mt-2">Enter your email to access advanced insights.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-gray-700">Email Address</span>
            <input
              type="email"
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Access Your Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
