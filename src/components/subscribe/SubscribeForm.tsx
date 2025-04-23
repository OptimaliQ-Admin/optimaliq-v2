// src/components/subscribe/SubscribeForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

export default function SubscribeForm() {
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

    const { data: existingUser, error: fetchError } = await supabase
      .from("tier2_users")
      .select("u_id")
      .eq("email", userInfo.email)
      .maybeSingle();

    let user_id;

    if (fetchError) {
      alert("❌ Failed to check existing user.");
      setLoading(false);
      return;
    }

    if (existingUser) {
      user_id = existingUser.u_id;
      const { error: updateError } = await supabase
        .from("tier2_users")
        .update({ ...userInfo })
        .eq("u_id", user_id);

      if (updateError) {
        alert("❌ Failed to update user info.");
        setLoading(false);
        return;
      }
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from("tier2_users")
        .insert([{ ...userInfo }])
        .select("u_id")
        .single();

      if (insertError || !newUser?.u_id) {
        alert("❌ Failed to create user.");
        setLoading(false);
        return;
      }
      user_id = newUser.u_id;
    }

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
        billingCycle: "annual",
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 w-full max-w-xl">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-2">Subscribe to OptimaliQ</h2>
      <p className="text-gray-600 text-center mb-6">
        Get your 30-day strategic roadmap and AI-driven insights — starting now.
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

        <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={(token) => setCaptchaToken(token)} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {loading ? "Redirecting..." : "Continue to Payment"}
        </button>

        <p className="text-sm text-gray-500 text-center mt-3">
          🔒 Secure checkout powered by Stripe. Cancel anytime.
        </p>
      </form>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <input
        {...props}
        className="mt-1 block w-full p-3 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options = [] }: any) {
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-3 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select {label}</option>
        {options.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}