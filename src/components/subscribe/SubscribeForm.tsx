//src/components/subscribe/SubscribeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";
import { IconInput } from "@/components/shared/IconInput";
import { IconSelect } from "@/components/shared/IconSelect";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaDollarSign,
  FaIndustry,
} from "react-icons/fa";

export default function SubscribeForm() {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) return alert("⚠️ Please complete the captcha.");
    setLoading(true);
  
    // 1. Insert into leads
    await supabase.from("leads").upsert([{ 
      email: userInfo.email,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      company: userInfo.company,
      phone: userInfo.phone,
      title: userInfo.title,
    }]);
  
    // 2. Check if user exists in tier2_users
    const { data: existingUser, error: fetchError } = await supabase
      .from("tier2_users")
      .select("u_id")
      .eq("email", userInfo.email)
      .maybeSingle();
  
    if (fetchError) {
      alert("❌ Failed to check existing user.");
      setLoading(false);
      return;
    }
  
    let userId = existingUser?.u_id;
  
    // 3. If no existing user, create one (INSERT full record not just email)
    if (!userId) {
      userId = crypto.randomUUID(); // make new ID
  
      const { error: insertUserError } = await supabase
        .from("tier2_users")
        .insert([{ 
          u_id: userId,
          email: userInfo.email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          company: userInfo.company,
          phone: userInfo.phone,
          title: userInfo.title,
          company_size: userInfo.company_size,
          revenue_range: userInfo.revenue_range,
          industry: userInfo.industry,
        }]);
  
      if (insertUserError) {
        alert("❌ Failed to create preliminary user record.");
        setLoading(false);
        return;
      }
    }
  
    // 4. Check subscription status
    if (existingUser) {
      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("u_id", userId)
        .maybeSingle();
  
      if (subError) {
        alert("❌ Failed to check subscription status.");
        setLoading(false);
        return;
      }
  
      if (subscription?.status === "active") {
        router.push("/subscribe/login");
        return;
      }
    }
  
    // 5. Save locally
    localStorage.setItem("tier2_user_id", userId);
    localStorage.setItem("tier2_email", userInfo.email);
    localStorage.setItem("tier2_full_user_info", JSON.stringify(userInfo));
  
    // 6. Create Stripe checkout session
    const res = await fetch("/api/stripe/createCheckoutSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        plan: "accelerator",
        user_id: userId,
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
    <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-xl">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
        Subscribe to OptimaliQ
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Get your 30-day strategic roadmap and AI-driven insights — starting now.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <IconInput
            icon={FaUser}
            name="first_name"
            value={userInfo.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />
          <IconInput
            icon={FaUser}
            name="last_name"
            value={userInfo.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <IconInput
          icon={FaEnvelope}
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          placeholder="Email Address"
        />
        <IconInput
          icon={FaPhone}
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <IconInput
          icon={FaBriefcase}
          name="title"
          value={userInfo.title}
          onChange={handleChange}
          placeholder="Your Role"
        />
        <IconInput
          icon={FaBuilding}
          name="company"
          value={userInfo.company}
          onChange={handleChange}
          placeholder="Company Name"
        />

        <IconSelect
          icon={FaBuilding}
          name="company_size"
          value={userInfo.company_size}
          onChange={handleChange}
          options={["1-10", "11-50", "51-200", "201-500", "500+"]}
        />
        <IconSelect
          icon={FaDollarSign}
          name="revenue_range"
          value={userInfo.revenue_range}
          onChange={handleChange}
          options={["<$100K", "$100K-$500K", "$500K-$1M", "$1M-$10M", "$10M+"]}
        />
        <IconSelect
          icon={FaIndustry}
          name="industry"
          value={userInfo.industry}
          onChange={handleChange}
          options={[
            "E-commerce",
            "Finance",
            "SaaS",
            "Education",
            "Technology",
            "Healthcare",
            "Retail",
            "Consulting",
            "Other",
          ]}
        />

        <div className="pt-2">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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
