// src/components/growthAssessment/GrowthAssessmentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import FormField from "@/components/shared/FormField";
import FormSelect from "@/components/shared/FormSelect";
import ProgressIndicator from "@/components/growthAssessment/ProgressIndicator";
import FormNavigation from "@/components/shared/FormNavigation";
import {
  UserIcon, EnvelopeIcon, BuildingOfficeIcon, BriefcaseIcon,
  BuildingLibraryIcon, CurrencyDollarIcon, ShieldCheckIcon, CheckCircleIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // ✅ Validate required fields
    for (const [key, value] of Object.entries(userInfo)) {
      if (!value) {
        showToast.warning("All fields are required.");
        setIsSubmitting(false);
        return;
      }
    }
  
    if (!captchaToken) {
      showToast.warning("Please verify you are not a robot.");
      setIsSubmitting(false);
      return;
    }

    if (!privacyConsent) {
      showToast.warning("Please accept our privacy policy to continue.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Use API endpoint to handle user creation/update
      const response = await fetch('/api/growth-assessment/manage-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInfo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast.error(errorData.error || "Failed to process user data. Try again.");
        setIsSubmitting(false);
        return;
      }

      const { userId } = await response.json();
  
      // ✅ Store ID securely in localStorage
      localStorage.setItem("u_id", userId);
  
      // 🚀 Navigate to next step
      router.push("/growth-assessment/step2");
  
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      showToast.error("Unexpected error. Please try again.");
      setIsSubmitting(false);
    }
  };  

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      {/* Background Card */}
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-6 lg:p-8 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheckIcon className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Tell Us About Yourself</h2>
          <p className="text-sm text-gray-600">We&rsquo;ll tailor insights to your business needs.</p>
        </div>

                {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={1}
          totalSteps={2}
          steps={[
            { title: 'Business Overview', description: 'Tell us about yourself', status: 'current' as const },
            { title: 'Growth Assessment', description: 'Answer strategic questions', status: 'upcoming' as const }
          ]}
          className="mb-8"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          <div className="space-y-4">
          <FormField
            label="Full Name"
              name="name" 
            type="text"
              value={userInfo.name} 
              onChange={handleChange} 
            placeholder="Enter your full name"
            error={validationErrors.name}
            required
            maxLength={30}
            icon={<UserIcon className="w-5 h-5" />}
            helperText="We'll use this to personalize your experience"
          />
          
          <FormField
            label="Email Address"
              name="email" 
              type="email" 
              value={userInfo.email} 
              onChange={handleChange} 
            placeholder="Enter your email address"
            error={validationErrors.email}
            required
            maxLength={250}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            helperText="We'll send your assessment results here"
            />
          
          <FormSelect
            label="Industry"
              name="industry" 
              value={userInfo.industry} 
              onChange={handleChange} 
            options={[
              { value: "E-commerce", label: "E-commerce" },
              { value: "Finance", label: "Finance" },
              { value: "SaaS", label: "SaaS" },
              { value: "Education", label: "Education" },
              { value: "Technology", label: "Technology" },
              { value: "Healthcare", label: "Healthcare" },
              { value: "Retail", label: "Retail" },
              { value: "Manufacturing", label: "Manufacturing" },
              { value: "Consulting", label: "Consulting" },
              { value: "Entertainment", label: "Entertainment" },
              { value: "Real Estate", label: "Real Estate" },
              { value: "Transportation", label: "Transportation" },
              { value: "Hospitality", label: "Hospitality" },
              { value: "Energy", label: "Energy" },
              { value: "Telecommunications", label: "Telecommunications" },
              { value: "Pharmaceuticals", label: "Pharmaceuticals" },
              { value: "Automotive", label: "Automotive" },
              { value: "Construction", label: "Construction" },
              { value: "Legal", label: "Legal" },
              { value: "Nonprofit", label: "Nonprofit" },
              { value: "Other", label: "Other" }
            ]}
            placeholder="Select your industry"
            error={validationErrors.industry}
            required
            icon={<BuildingOfficeIcon className="w-5 h-5" />}
            helperText="This helps us provide industry-specific insights"
          />
          
          <FormField
            label="Job Role"
              name="role" 
            type="text"
              value={userInfo.role} 
              onChange={handleChange} 
            placeholder="e.g., CEO, Marketing Manager, Founder"
            error={validationErrors.role}
            required
            maxLength={250}
            icon={<BriefcaseIcon className="w-5 h-5" />}
            helperText="Your role helps us tailor recommendations"
            />
          
          <FormSelect
            label="Company Size"
              name="companysize" 
              value={userInfo.companysize} 
              onChange={handleChange} 
            options={[
              { value: "1-10", label: "1-10 employees" },
              { value: "11-50", label: "11-50 employees" },
              { value: "51-200", label: "51-200 employees" },
              { value: "201-500", label: "201-500 employees" },
              { value: "501-1000", label: "501-1000 employees" },
              { value: "1000+", label: "1000+ employees" }
            ]}
            placeholder="Select company size"
            error={validationErrors.companysize}
            required
            icon={<BuildingLibraryIcon className="w-5 h-5" />}
            helperText="Company size affects growth strategies"
          />
          
          <FormSelect
            label="Revenue Range"
              name="revenuerange" 
              value={userInfo.revenuerange} 
              onChange={handleChange} 
            options={[
              { value: "<$100K", label: "Under $100K" },
              { value: "$100K-$500K", label: "$100K - $500K" },
              { value: "$500K-$1M", label: "$500K - $1M" },
              { value: "$1M-$10M", label: "$1M - $10M" },
              { value: "$10M-$50M", label: "$10M - $50M" },
              { value: "$50M+", label: "$50M+" }
            ]}
            placeholder="Select revenue range"
            error={validationErrors.revenuerange}
            required
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            helperText="Revenue helps us benchmark your performance"
            />
          </div>

          {/* ReCAPTCHA */}
          <div className="pt-1 flex justify-center">
            <ReCAPTCHA 
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} 
              onChange={(token) => setCaptchaToken(token)} 
            />
          </div>

          {/* Privacy Consent */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <LockClosedIcon className="text-blue-600 mt-1 flex-shrink-0 w-4 h-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="privacyConsent" className="text-sm font-medium text-gray-900">
                    I agree to let OptimaliQ collect and use my answers to personalize my experience.
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  By checking this box, you agree to our{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyDetails(true)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Privacy Policy
                  </button>{" "}
                  and consent to receive your personalized business insights.
                </p>
              </div>
            </div>
          </div>

          {/* Form Navigation */}
          <FormNavigation
            currentStep={1}
            totalSteps={2}
            onNext={() => handleSubmit(new Event('submit') as any)}
            onPrevious={() => {}}
            isValid={Object.values(userInfo).every(value => value.trim() !== '') && privacyConsent && !!captchaToken}
            isSubmitting={isSubmitting}
            nextLabel="Continue to Assessment"
            previousLabel="Back"
            className="mt-6"
          />

          {/* Trust Message */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheckIcon className="text-green-500 w-3 h-3" />
              <span>No spam. No sales pitches. Just data-driven insights.</span>
            </p>
          </div>
        </form>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <LockClosedIcon className="text-blue-600 w-5 h-5" />
                  Privacy Policy
                </h3>
                <button
                  onClick={() => setShowPrivacyDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Collection</h4>
                  <p>We collect the following information to provide you with personalized business insights:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Name and email address for communication</li>
                    <li>Industry, role, company size, and revenue range for analysis</li>
                    <li>Assessment responses for generating insights</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How We Use Your Data</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Generate personalized business insights and recommendations</li>
                    <li>Provide you with your assessment results</li>
                    <li>Improve our services and user experience</li>
                    <li>Send you relevant business insights (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your data is stored securely using industry-standard encryption</li>
                    <li>We do not sell, rent, or share your personal data with third parties</li>
                    <li>Access to your data is restricted to authorized personnel only</li>
                    <li>We implement appropriate security measures to protect your information</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Rights</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access your personal data at any time</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Contact us with any privacy concerns</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p>For privacy-related questions or requests, please contact us at:</p>
                  <p className="mt-1">Email: privacy@optimaliq.ai</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    <strong>Note:</strong> This privacy policy applies to the growth assessment lead form. 
                    For our full privacy policy covering all services, please visit our main privacy page.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPrivacyDetails(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPrivacyConsent(true);
                    setShowPrivacyDetails(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
