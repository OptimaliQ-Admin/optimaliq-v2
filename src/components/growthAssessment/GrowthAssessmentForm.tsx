// src/components/growthAssessment/GrowthAssessmentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";
import { IconInput } from "@/components/shared/IconInput";
import { IconSelect } from "@/components/shared/IconSelect";
import {
  FaUser, FaEnvelope, FaIndustry, FaBriefcase,
  FaBuilding, FaDollarSign,
} from "react-icons/fa";
import { showToast } from "@/lib/utils/toast";

export default function GrowthAssessmentForm() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    industry: "",
    role: "",
    companysize: "",
    revenuerange: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // ✅ Validate required fields
    for (const [key, value] of Object.entries(userInfo)) {
      if (!value) {
        showToast.warning("All fields are required.");
        return;
      }
    }
  
    if (!captchaToken) {
      showToast.warning("Please verify you are not a robot.");
      return;
    }
  
    try {
      // 🔍 Check for existing user by email
      const { data: existingUser, error: fetchError } = await supabase
        .from("growth_users")
        .select("u_id")
        .eq("email", userInfo.email)
        .maybeSingle();
  
      if (fetchError) {
        console.error("❌ Error checking user:", fetchError);
        showToast.error("Unable to check user. Try again.");
        return;
      }
  
      let userId: string;
  
      if (existingUser?.u_id) {
        userId = existingUser.u_id;
  
        const { error: updateError } = await supabase
          .from("growth_users")
          .update(userInfo)
          .eq("u_id", userId);
  
        if (updateError) {
          console.error("❌ Error updating user:", updateError);
          showToast.error("Failed to update user. Try again.");
          return;
        }
      } else {
        const { data: newUser, error: insertError } = await supabase
          .from("growth_users")
          .insert([userInfo])
          .select("u_id")
          .single();
  
        if (insertError || !newUser?.u_id) {
          console.error("❌ Error creating user:", insertError);
          showToast.error("Failed to create user. Try again.");
          return;
        }
  
        userId = newUser.u_id;
      }
  
      // ✅ Store ID securely in localStorage
      localStorage.setItem("u_id", userId);
  
      // 🚀 Navigate to next step
      router.push("/growth-assessment/step2");
  
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      showToast.error("Unexpected error. Please try again.");
    }
  };  

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Tell Us About Yourself</h2>
      <p className="text-gray-600 text-center mt-2">We&rsquo;ll tailor insights to your business needs.</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <IconInput icon={FaUser} name="name" maxLength={30} value={userInfo.name} onChange={handleChange} placeholder="Your Name" />
        <IconInput icon={FaEnvelope} name="email" maxLength={250} type="email" value={userInfo.email} onChange={handleChange} placeholder="Your Email" />
        <IconSelect icon={FaIndustry} name="industry" value={userInfo.industry} onChange={handleChange} options={["E-commerce","Finance","SaaS","Education","Technology","Healthcare","Retail","Manufacturing","Consulting","Entertainment","Real Estate","Transportation","Hospitality","Energy","Telecommunications","Pharmaceuticals","Automotive","Construction","Legal","Nonprofit","Other"]} />
        <IconInput icon={FaBriefcase} name="role" maxLength={250} value={userInfo.role} onChange={handleChange} placeholder="Your Role" />
        <IconSelect icon={FaBuilding} name="companysize" value={userInfo.companysize} onChange={handleChange} options={["1-10","11-50","51-200","201-500","501-1000","1000+"]} />
        <IconSelect icon={FaDollarSign} name="revenuerange" value={userInfo.revenuerange} onChange={handleChange} options={["<$100K","$100K-$500K","$500K-$1M","$1M-$10M","$10M-$50M","$50M+"]} />

        <div className="pt-2">
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} onChange={(token) => setCaptchaToken(token)} />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
          Get My Free Insights
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">No spam. No sales pitches. Just data-driven insights.</p>
      </form>
    </div>
  );
}
