//src/app/dashboard/Page1/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";
import {
  FaUser,
  FaEnvelope,
  FaIndustry,
  FaBriefcase,
  FaBuilding,
  FaDollarSign,
  FaShieldAlt,
} from "react-icons/fa";

export default function Page1() {
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

    // ✅ Validation
    for (const key in userInfo) {
      if (!userInfo[key as keyof typeof userInfo]) {
        alert("⚠️ All fields are required.");
        return;
      }
    }

    if (!captchaToken) {
      alert("⚠️ Please verify you are not a robot.");
      return;
    }

    try {
      let userId: string | null = null;

      // 🔍 Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("u_id")
        .eq("email", userInfo.email)
        .maybeSingle();

      if (fetchError) {
        alert("Unable to check user. Try again.");
        return;
      }

      if (existingUser?.u_id) {
        userId = existingUser.u_id;

        // 🔄 Update user info
        const { error: updateError } = await supabase
          .from("users")
          .update({ ...userInfo })
          .eq("u_id", userId);

        if (updateError) {
          alert("Failed to update user. Try again.");
          return;
        }

      } else {
        // 🆕 Create new user
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([{ ...userInfo }])
          .select("u_id")
          .single();

        if (insertError || !newUser?.u_id) {
          alert("Failed to create user. Try again.");
          return;
        }

        userId = newUser.u_id;
      }

      // 💾 Save user ID to localStorage
      if (typeof window !== "undefined" && userId) {
        localStorage.setItem("u_id", userId);
      }

      // 🚀 Go to Page 2
      router.push("/dashboard/Page2");

    } catch {
      alert("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 relative">
        
        {/* Left Column */}
        <div className="relative text-left flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold text-gray-900 text-center leading-tight relative top-[-80px]">
            Unlock Scalable Growth Backed by Data
          </h1>
          <p className="text-gray-600 text-center mt-[-30px] text-lg">
            Make <strong>confident decisions</strong> backed by <strong>data-driven insights</strong>. 
            Our analysis <strong>pinpoints hidden opportunities</strong> to refine strategy, boost efficiency, and scale — <strong>fast</strong>.
          </p>
          <div className="absolute bottom-0 left-0 flex items-center space-x-2">
            <FaShieldAlt className="text-blue-600 text-xl" />
            <p className="text-blue-600 text-sm font-semibold">Data Privacy / Security Activated</p>
          </div>
          <p className="absolute bottom-0 right-0 text-gray-500 text-sm">Trusted by industry leaders</p>
        </div>

        {/* Right Column (Form) */}
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Tell Us About Yourself</h2>
          <p className="text-gray-600 text-center mt-2">We’ll tailor insights to your business needs.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <Input icon={FaUser} name="name" maxLength={30} value={userInfo.name} onChange={handleChange} placeholder="Your Name" />
            <Input icon={FaEnvelope} name="email" maxLength={250} type="email" value={userInfo.email} onChange={handleChange} placeholder="Your Email" />
            <Select icon={FaIndustry} name="industry" value={userInfo.industry} onChange={handleChange} options={[
              "E-commerce","Finance","SaaS","Education","Technology","Healthcare","Retail",
              "Manufacturing","Consulting", "Entertainment","Real Estate","Transportation",
              "Hospitality","Energy","Telecommunications","Pharmaceuticals","Automotive",
              "Construction","Legal","Nonprofit","Other"
            ]} />
            <Input icon={FaBriefcase} name="role" maxLength={250} value={userInfo.role} onChange={handleChange} placeholder="Your Role" />
            <Select icon={FaBuilding} name="companysize" value={userInfo.companysize} onChange={handleChange} options={[
              "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
            ]} />
            <Select icon={FaDollarSign} name="revenuerange" value={userInfo.revenuerange} onChange={handleChange} options={[
              "<$100K", "$100K-$500K", "$500K-$1M", "$1M-$10M", "$10M-$50M", "$50M+"
            ]} />

            {/* 🔐 reCAPTCHA */}
            <div className="pt-2">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
              Get My Free Insights
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">No spam. No sales pitches. Just data-driven insights.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🔧 Input component
function Input({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute top-3 left-3 text-gray-400" />
      <input {...props} className="block w-full pl-10 border border-gray-300 rounded p-2" required />
    </div>
  );
}

// 🔧 Select component
function Select({ icon: Icon, name, value, onChange, options }: any) {
  return (
    <div className="relative">
      <Icon className="absolute top-3 left-3 text-gray-400" />
      <select name={name} value={value} onChange={onChange} className="block w-full pl-10 border border-gray-300 rounded p-2" required>
        <option value="">Select {name}</option>
        {options.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
