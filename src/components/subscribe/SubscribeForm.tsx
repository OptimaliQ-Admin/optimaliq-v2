"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import { formatPhoneForDisplay, stripPhoneFormatting } from "@/lib/utils/phoneFormatter";
import { isValidLinkedInUrl, isValidEmail, isDisposableEmail, normalizeLinkedInUrl } from "@/lib/utils/validation";

interface SubscribeFormProps {
  plan: "accelerator" | "strategic" | null;
  cycle: "monthly" | "annual" | null;
}

export default function SubscribeForm({ plan, cycle }: SubscribeFormProps) {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plan || "accelerator");
  const [selectedCycle, setSelectedCycle] = useState(cycle || "annual");

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
    linkedin_url: "",
  });

  const [validationErrors, setValidationErrors] = useState<{ email?: string; linkedin_url?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // For phone, store only digits in form state but display formatted
      const digits = stripPhoneFormatting(value);
      setUserInfo({ ...userInfo, [name]: digits });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      showToast.warning("Please complete the captcha.");
      return;
    }
    // Client-side validation
    const errors: { email?: string; linkedin_url?: string } = {};
    if (!isValidEmail(userInfo.email) || isDisposableEmail(userInfo.email)) {
      errors.email = 'Please enter a valid, non-disposable email address.';
    }
    if (userInfo.linkedin_url && userInfo.linkedin_url.trim() !== '' && !isValidLinkedInUrl(userInfo.linkedin_url)) {
      errors.linkedin_url = 'Please enter a valid LinkedIn profile URL.';
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);

    try {
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
        console.error("Failed to check existing user:", fetchError);
        showToast.error("Failed to check existing user.");
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
          console.error("Failed to create preliminary user record:", insertUserError);
          showToast.error("Failed to create preliminary user record.");
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
          console.error("Failed to check subscription status:", subError);
          showToast.error("Failed to check subscription status.");
          setLoading(false);
          return;
        }

        if (subscription?.status === "active") {
          router.push("/subscribe/login");
          return;
        }
      }

      // 5. Save locally
      const normalizedUserInfo = {
        ...userInfo,
        linkedin_url: userInfo.linkedin_url ? normalizeLinkedInUrl(userInfo.linkedin_url) : userInfo.linkedin_url
      };
      
      localStorage.setItem("tier2_user_id", userId);
      localStorage.setItem("tier2_email", userInfo.email);
      localStorage.setItem("tier2_full_user_info", JSON.stringify(normalizedUserInfo));

      // 6. Create Stripe checkout session
      const res = await fetch("/api/stripe/createCheckoutSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          plan: selectedPlan,
          u_id: userId,
          billingCycle: selectedCycle,
        }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        console.error("Failed to create Stripe session:");
        showToast.error("Failed to create Stripe session.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8 lg:p-10 w-full max-w-lg">
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <p className="text-blue-800 text-center">
          You&lsquo;re subscribing to the <span className="font-semibold capitalize">{selectedPlan}</span> plan
          <br />
          <span className="text-sm">(Billed {selectedCycle})</span>
        </p>
      </div>

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
        {validationErrors.email && (
          <div className="text-red-600 text-xs mt-1">{validationErrors.email}</div>
        )}
        <IconInput
          icon={FaPhone}
          name="phone"
          value={formatPhoneForDisplay(userInfo.phone)}
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
        <IconInput
          icon={FaBriefcase}
          name="linkedin_url"
          value={userInfo.linkedin_url}
          onChange={handleChange}
          placeholder="LinkedIn URL"
        />
        {validationErrors.linkedin_url && (
          <div className="text-red-600 text-xs mt-1">{validationErrors.linkedin_url}</div>
        )}

        <div className="pt-2">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl"
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