"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

export default function Tier2OnboardingPage1() {
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
  const [authChecked, setAuthChecked] = useState(false);

  // ✅ Check if user is authenticated (i.e., paid)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        alert("🔒 Access Denied: Subscription required.");
        router.push("/");
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("⚠️ Please complete the captcha.");
      return;
    }

    const { error, data } = await supabase.from("tier2_users").insert([{ ...userInfo }]).select("u_id").single();

    if (error || !data?.u_id) {
      alert("❌ Failed to save user info.");
      return;
    }

    localStorage.setItem("tier2_user_id", data.u_id);
    router.push("/tier2/onboarding/Page2_Initial_Assessment");
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">🚀 Start Your OptimaliQ Journey</h1>
        <p className="text-center text-gray-600 mb-6">Tell us about your business to unlock personalized insights.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input label="First Name" name="first_name" value={userInfo.first_name} onChange={handleChange} />
            <Input label="Last Name" name="last_name" value={userInfo.last_name} onChange={handleChange} />
          </div>
          <Input label="Email" name="email" value={userInfo.email} onChange={handleChange} type="email" />
          <Input label="Phone" name="phone" value={userInfo.phone} onChange={handleChange} />
          <Input label="Title / Role" name="title" value={userInfo.title} onChange={handleChange} />
          <Input label="Company Name" name="company" value={userInfo.company} onChange={handleChange} />

          <Select label="Company Size (Employees)" name="company_size" value={userInfo.company_size} onChange={handleChange} options={["1-10", "11-50", "51-200", "201-500", "500+"]} />
          <Select label="Revenue Range" name="revenue_range" value={userInfo.revenue_range} onChange={handleChange} options={["<$100K", "$100K-$500K", "$500K-$1M", "$1M-$10M", "$10M+"]} />
          <Select label="Industry" name="industry" value={userInfo.industry} onChange={handleChange} options={["E-commerce", "Finance", "SaaS", "Education", "Technology", "Healthcare", "Retail", "Consulting", "Other"]} />

          <div className="pt-2">
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={(token) => setCaptchaToken(token)} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
            Continue to Assessment
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>
      <input {...props} className="block w-full mt-1 border border-gray-300 rounded p-2" required />
    </label>
  );
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>
      <select name={name} value={value} onChange={onChange} className="block w-full mt-1 border border-gray-300 rounded p-2" required>
        <option value="">Select {label}</option>
        {options.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}