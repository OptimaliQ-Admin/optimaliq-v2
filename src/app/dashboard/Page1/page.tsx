"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaEnvelope, FaIndustry, FaBriefcase, FaBuilding, FaDollarSign, FaShieldAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabase";  // Ensure Supabase client is imported

export default function Page1() {
  const router = useRouter();

  // ✅ Store user information
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    industry: "",
    role: "",
    companySize: "",
    revenueRange: "",
  });

  // ✅ Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submission & navigate to Page 2 with encoded URL
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validate required fields
    for (const key in userInfo) {
      if (!userInfo[key as keyof typeof userInfo]) {
        alert("⚠️ All fields are required. Please complete the form before proceeding.");
        return;
      }
    }

    try {
      console.log("Checking if user exists:", userInfo.email);

      // ✅ Step 1: Check if the user already exists in Supabase
      let userId = null;

      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userInfo.email)
        .single();

      if (userError && userError.code !== "PGRST116") {
        console.error("Supabase User Lookup Error:", userError);
        alert("❌ Error checking user existence. Try again.");
        return;
      }

      if (existingUser) {
        console.log("User already exists:", existingUser);
        userId = existingUser.id;
      } else {
        // ✅ Step 2: Create a new user if they don't exist
        const { data: newUser, error: insertUserError } = await supabase
          .from("users")
          .insert([{ email: userInfo.email, name: userInfo.name, industry: userInfo.industry, role: userInfo.role, companySize: userInfo.companySize, revenueRange: userInfo.revenueRange }])
          .select("id")
          .single(); // Get the new user’s ID

        if (insertUserError) {
          console.error("Supabase Insert User Error:", insertUserError);
          alert("❌ Failed to save user. Try again.");
          return;
        }

        userId = newUser.id;
        console.log("New user created:", userId);
      }

      // ✅ Step 3: Pass user info to Page 2, including `user_id`
      const userDataToPass = {
        id: userId,
        ...userInfo,
      };

      const encodedUserInfo = encodeURIComponent(JSON.stringify(userDataToPass));
      router.push(`/dashboard/Page2?userInfo=${encodedUserInfo}`);

    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 relative">
        
        {/* Right Side - Form Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Tell Us About Yourself</h2>
          <p className="text-gray-600 text-center mt-2">We’ll tailor insights to your business needs.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Name */}
            <input type="text" name="name" value={userInfo.name} onChange={handleChange} placeholder="Your Name" required className="block w-full border border-gray-300 rounded p-2" />

            {/* Email */}
            <input type="email" name="email" value={userInfo.email} onChange={handleChange} placeholder="Your Email" required className="block w-full border border-gray-300 rounded p-2" />

            {/* Industry */}
            <select name="industry" value={userInfo.industry} onChange={handleChange} required className="block w-full border border-gray-300 rounded p-2">
              <option value="">Select your industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
            </select>

            {/* Role */}
            <input type="text" name="role" value={userInfo.role} onChange={handleChange} placeholder="Your Role" required className="block w-full border border-gray-300 rounded p-2" />

            {/* Company Size */}
            <select name="companySize" value={userInfo.companySize} onChange={handleChange} required className="block w-full border border-gray-300 rounded p-2">
              <option value="">Select company size</option>
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
            </select>

            {/* Revenue */}
            <select name="revenueRange" value={userInfo.revenueRange} onChange={handleChange} required className="block w-full border border-gray-300 rounded p-2">
              <option value="">Select revenue range</option>
              <option value="<$100K">Less than $100K</option>
              <option value="$100K-$500K">$100K - $500K</option>
            </select>

            {/* CTA Button */}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
              Get My Free Insights
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
