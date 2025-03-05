"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaEnvelope, FaIndustry, FaBriefcase, FaBuilding, FaDollarSign, FaShieldAlt } from "react-icons/fa";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validate required fields
    for (const key in userInfo) {
      if (!userInfo[key as keyof typeof userInfo]) {
        alert("⚠️ All fields are required. Please complete the form before proceeding.");
        return;
      }
    }

    // ✅ Encode user data before passing to Page 2
    const encodedUserInfo = encodeURIComponent(JSON.stringify(userInfo));
    router.push(`/dashboard/Page2?userInfo=${encodedUserInfo}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 relative">
        
        {/* Left Side - Engaging Content & Trust Signals */}
        <div className="relative text-left flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold text-gray-900 text-center leading-tight relative top-[-80px]">
            Unlock Scalable Growth Backed by Data
          </h1>

          {/* Improved Marketing Statement */}
          <p className="text-gray-600 text-center mt-[-30px] text-lg">
            Make <strong>confident decisions</strong> backed by <strong>data-driven insights</strong> designed to accelerate growth.  
            Our intelligent analysis <strong>pinpoints hidden opportunities</strong>, helping you refine strategy,  
            enhance efficiency, and strengthen competitive positioning—<strong>in just minutes</strong>.
          </p>

          {/* Bottom Left - Security Assurance */}
          <div className="absolute bottom-0 left-0 flex items-center space-x-2">
            <FaShieldAlt className="text-blue-600 text-xl" />
            <p className="text-blue-600 text-sm font-semibold">Data Privacy / Security Active</p>
          </div>

          {/* Bottom Right - Trusted by Industry Leaders */}
          <p className="absolute bottom-0 right-0 text-gray-500 text-sm">Trusted by industry leaders</p>
        </div>

        {/* Right Side - Form Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Tell Us About Yourself</h2>
          <p className="text-gray-600 text-center mt-2">We’ll tailor insights to your business needs.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded p-2"
                placeholder="Your Name"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded p-2"
                placeholder="Your Email"
                required
              />
            </div>

            {/* Industry */}
            <div className="relative">
              <FaIndustry className="absolute top-3 left-3 text-gray-400" />
              <select
                name="industry"
                value={userInfo.industry}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded p-2"
                required
              >
                <option value="">Select your industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Role */}
            <div className="relative">
              <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="role"
                value={userInfo.role}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded p-2"
                placeholder="Your Role"
                required
              />
            </div>

            {/* Company Size */}
            <div className="relative">
              <FaBuilding className="absolute top-3 left-3 text-gray-400" />
              <select
                name="companySize"
                value={userInfo.companySize}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded p-2"
                required
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>

            {/* Revenue */}
            <div className="relative">
              <FaDollarSign className="absolute top-3 left-3 text-gray-400" />
              <select
                name="revenueRange"
                value={userInfo.revenueRange}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded p-2"
                required
              >
                <option value="">Select revenue range</option>
                <option value="<$100K">Less than $100K</option>
                <option value="$100K-$500K">$100K - $500K</option>
                <option value="$500K-$1M">$500K - $1M</option>
                <option value="$1M-$10M">$1M - $10M</option>
                <option value="$10M-$50M">$10M - $50M</option>
                <option value="$50M+">More than $50M</option>
              </select>
            </div>

            {/* CTA Button */}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
              Get My Free Insights
            </button>

            {/* Reassurance Message */}
            <p className="text-xs text-gray-500 text-center mt-3">No spam. No sales pitches. Just data-driven insights.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
