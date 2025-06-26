// src/components/growthAssessment/GrowthAssessmentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";
import { IconInput } from "@/components/shared/IconInput";
import { IconSelect } from "@/components/shared/IconSelect";
import {
  FaUser, FaEnvelope, FaIndustry, FaBriefcase,
  FaBuilding, FaDollarSign, FaShieldAlt, FaCheckCircle,
  FaLock, FaEye, FaEyeSlash
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
      // 🔍 Check for existing user by email
      const { data: existingUser, error: fetchError } = await supabase
        .from("growth_users")
        .select("u_id")
        .eq("email", userInfo.email)
        .maybeSingle();
  
      if (fetchError) {
        console.error("❌ Error checking user:", fetchError);
        showToast.error("Unable to check user. Try again.");
        setIsSubmitting(false);
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
          setIsSubmitting(false);
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
          setIsSubmitting(false);
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
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-8 lg:p-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
          <p className="text-gray-600">We&rsquo;ll tailor insights to your business needs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-5">
            <IconInput 
              icon={FaUser} 
              name="name" 
              maxLength={30} 
              value={userInfo.name} 
              onChange={handleChange} 
              placeholder="Your Name" 
            />
            <IconInput 
              icon={FaEnvelope} 
              name="email" 
              maxLength={250} 
              type="email" 
              value={userInfo.email} 
              onChange={handleChange} 
              placeholder="Your Email" 
            />
            <IconSelect 
              icon={FaIndustry} 
              name="industry" 
              label="Industry"
              value={userInfo.industry} 
              onChange={handleChange} 
              options={["E-commerce","Finance","SaaS","Education","Technology","Healthcare","Retail","Manufacturing","Consulting","Entertainment","Real Estate","Transportation","Hospitality","Energy","Telecommunications","Pharmaceuticals","Automotive","Construction","Legal","Nonprofit","Other"]} 
            />
            <IconInput 
              icon={FaBriefcase} 
              name="role" 
              maxLength={250} 
              value={userInfo.role} 
              onChange={handleChange} 
              placeholder="Your Role" 
            />
            <IconSelect 
              icon={FaBuilding} 
              name="companysize" 
              label="Company Size"
              value={userInfo.companysize} 
              onChange={handleChange} 
              options={["1-10","11-50","51-200","201-500","501-1000","1000+"]} 
            />
            <IconSelect 
              icon={FaDollarSign} 
              name="revenuerange" 
              label="Revenue Range"
              value={userInfo.revenuerange} 
              onChange={handleChange} 
              options={["<$100K","$100K-$500K","$500K-$1M","$1M-$10M","$10M-$50M","$50M+"]} 
            />
          </div>

          {/* ReCAPTCHA */}
          <div className="pt-2 flex justify-center">
            <ReCAPTCHA 
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} 
              onChange={(token) => setCaptchaToken(token)} 
            />
          </div>

          {/* Privacy Consent */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FaLock className="text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="privacyConsent" className="text-sm font-medium text-gray-900">
                    I consent to the collection and processing of my data
                  </label>
                </div>
                <p className="text-xs text-gray-600 mb-2">
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

          {/* Submit Button */}
          <motion.button 
            type="submit" 
            disabled={isSubmitting || !privacyConsent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-lg" />
                <span>Get My Free Insights</span>
              </>
            )}
          </motion.button>

          {/* Trust Message */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-green-500" />
              <span>No spam. No sales pitches. Just data-driven insights.</span>
            </p>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Step 1 of 2</span>
            </span>
            <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaLock className="text-blue-600" />
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
