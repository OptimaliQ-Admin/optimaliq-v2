"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

export default function SubscribePage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    title: "",
    company: "",
    company_size: "",
    revenue_range: "",
    industry: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) return alert("⚠️ Please complete the captcha.");
    setLoading(true);

    const { data: userInsert, error: userError } = await supabase
      .from("tier2_users")
      .upsert([{ ...userInfo }], { onConflict: "email" })
      .select("u_id")
      .single();

    if (userError || !userInsert?.u_id) {
      alert("❌ Failed to save user.");
      setLoading(false);
      return;
    }

    const user_id = userInsert.u_id;
    localStorage.setItem("tier2_user_id", user_id);
    localStorage.setItem("tier2_email", userInfo.email);

    const sub_id = crypto.randomUUID();
    await supabase.from("subscriptions").upsert([
      {
        sub_id,
        u_id: user_id,
        plan: "accelerator",
        status: "pending",
      },
    ]);

    const res = await fetch("/api/stripe/createCheckoutSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        plan: "accelerator",
        user_id,
        billingCycle: "annual", // Fixed for now
      }),
    });

    const { url } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      alert("❌ Failed to create Stripe session.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-6 py-10">
      <div className="max-w-2xl w-full bg-white p-10 shadow-xl rounded-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">Ready to Unlock Predictable Growth?</h1>
        <p className="text-center text-gray-600 text-lg mt-3 mb-8">
          Start your OptimaliQ journey and get instant access to AI-powered business insights and a 30-day strategic roadmap.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <Input label="First Name" name="first_name" value={userInfo.first_name} onChange={handleChange} />
            <Input label="Last Name" name="last_name" value={userInfo.last_name} onChange={handleChange} />
          </div>
          <Input label="Email" name="email" value={userInfo.email} onChange={handleChange} type="email" />
          <Input label="Phone" name="phone" value={userInfo.phone} onChange={handleChange} />
          <Input label="Title / Role" name="title" value={userInfo.title} onChange={handleChange} />
          <Input label="Company Name" name="company" value={userInfo.company} onChange={handleChange} />
          <Select label="Company Size" name="company_size" value={userInfo.company_size} onChange={handleChange} options={["1-10", "11-50", "51-200", "201-500", "500+"]} />
          <Select label="Revenue Range" name="revenue_range" value={userInfo.revenue_range} onChange={handleChange} options={["<$100K", "$100K-$500K", "$500K-$1M", "$1M-$10M", "$10M+"]} />
          <Select label="Industry" name="industry" value={userInfo.industry} onChange={handleChange} options={["E-commerce", "Finance", "SaaS", "Education", "Technology", "Healthcare", "Retail", "Consulting", "Other"]} />

          <div className="pt-2">
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={(token) => setCaptchaToken(token)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-800 transition"
          >
            {loading ? "Redirecting..." : "Continue to Payment"}
          </button>

          <p className="text-sm text-center text-gray-500 pt-2">
            100% secure checkout powered by Stripe. No hidden fees, cancel anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>
      <input {...props} className="block w-full mt-1 border border-gray-300 rounded p-3 text-base" required />
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: string[];
}) {
  return (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full mt-1 border border-gray-300 rounded p-3 text-base"
        required
      >
        <option value="">Select {label}</option>
        {(options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
