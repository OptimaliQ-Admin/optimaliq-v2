// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Tier2Login() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to Tier 2 dashboard with the email in URL query
    if (email) {
      router.push(`/tier2/dashboard?email=${encodeURIComponent(email)}`);
    } else {
      alert("⚠️ Please enter your email.");
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
