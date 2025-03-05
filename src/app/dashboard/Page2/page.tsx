"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Page2Component() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve business responses from Page1
  const [businessResponses, setBusinessResponses] = useState(null);
  
  useEffect(() => {
    const businessData = searchParams.get("businessResponses");
    if (businessData) {
      setBusinessResponses(JSON.parse(decodeURIComponent(businessData)));
    } else {
      router.push("/dashboard/Page1"); // Redirect if missing data
    }
  }, [searchParams, router]);

  // ✅ Define userInfo state
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    industry: "",
    role: "",
    companySize: "",
    revenueRange: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission and navigate to Page3
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    for (const key in userInfo) {
      if (!userInfo[key as keyof typeof userInfo]) {
        alert("⚠️ All fields are required. Please complete the form before proceeding.");
        return;
      }
    }
    
    // Navigate to Page3, passing all collected data
    router.push(`/dashboard/Page3?businessResponses=${encodeURIComponent(JSON.stringify(businessResponses))}&userInfo=${encodeURIComponent(JSON.stringify(userInfo))}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4">
      <header className="w-full max-w-4xl py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Business Growth Assessment</h1>
        <p className="text-gray-600 mt-2">Tell us more about yourself to get AI-driven insights.</p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg space-y-4">
        <label className="block">
          <span className="text-gray-700">Your Name</span>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="Enter your name"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Your Email *</span>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            required
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="Enter your email"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Your Industry *</span>
          <select
            name="industry"
            value={userInfo.industry}
            onChange={handleChange}
            required
            className="block w-full mt-1 border border-gray-300 rounded p-2"
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
        </label>

        <label className="block">
          <span className="text-gray-700">Your Role</span>
          <input
            type="text"
            name="role"
            value={userInfo.role}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded p-2"
            placeholder="Enter your role"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Company Size</span>
          <select name="companySize" value={userInfo.companySize} onChange={handleChange} className="block w-full mt-1 border border-gray-300 rounded p-2" required>
            <option value="">Select company size</option>
            <option value="1-10">1-10 Employees</option>
            <option value="11-50">11-50 Employees</option>
            <option value="51-200">51-200 Employees</option>
            <option value="201-500">201-500 Employees</option>
            <option value="501-1000">501-1000 Employees</option>
            <option value="1000+">1000+ Employees</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Annual Revenue</span>
          <select name="revenueRange" value={userInfo.revenueRange} onChange={handleChange} className="block w-full mt-1 border border-gray-300 rounded p-2" required>
            <option value="">Select revenue range</option>
            <option value="<$100K">Less than $100K</option>
            <option value="$100K-$500K">$100K - $500K</option>
            <option value="$500K-$1M">$500K - $1M</option>
            <option value="$1M-$10M">$1M - $10M</option>
            <option value="$10M-$50M">$10M - $50M</option>
            <option value="$50M+">More than $50M</option>
          </select>
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}
// ✅ Wrap in Suspense to prevent hydration issues
export default function Page2() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Page2Component />
    </Suspense>
  );
}