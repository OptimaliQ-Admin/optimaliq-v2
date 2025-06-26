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
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import { formatPhoneForDisplay, stripPhoneFormatting } from "@/lib/utils/phoneFormatter";
import { isValidLinkedInUrl, isValidEmail, isDisposableEmail, normalizeLinkedInUrl } from "@/lib/utils/validation";

interface SubscribeFormProps {
  plan: "accelerator" | "strategic" | null;
  cycle: "monthly" | "annual" | null;
  email?: string;
}

export default function SubscribeForm({ plan, cycle, email }: SubscribeFormProps) {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plan || "accelerator");
  const [selectedCycle, setSelectedCycle] = useState(cycle || "annual");
  const [legalConsent, setLegalConsent] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: email || "",
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

  const handleLegalConsentChange = (field: keyof typeof legalConsent) => {
    setLegalConsent(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!userInfo.first_name || !userInfo.last_name || !userInfo.email || !userInfo.company) {
      showToast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Validate email
    if (!isValidEmail(userInfo.email)) {
      setValidationErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
      setLoading(false);
      return;
    }

    // Check for disposable email
    if (await isDisposableEmail(userInfo.email)) {
      setValidationErrors(prev => ({ ...prev, email: "Please use a business email address." }));
      setLoading(false);
      return;
    }

    // Validate LinkedIn URL if provided
    if (userInfo.linkedin_url && !isValidLinkedInUrl(userInfo.linkedin_url)) {
      setValidationErrors(prev => ({ ...prev, linkedin_url: "Please enter a valid LinkedIn URL." }));
      setLoading(false);
      return;
    }

    // Validate captcha
    if (!captchaToken) {
      showToast.error("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    // Validate legal consent
    if (!legalConsent.terms || !legalConsent.privacy) {
      showToast.error("Please accept the Terms of Service and Privacy Policy to continue.");
      setLoading(false);
      return;
    }

    try {
      // 1. Check for existing user by email
      const { data: existingUser, error: fetchError } = await supabase
        .from("tier2_users")
        .select("u_id")
        .eq("email", userInfo.email)
        .maybeSingle();

      if (fetchError) {
        console.error("Failed to check existing user:", fetchError);
        showToast.error("Failed to check existing user. Please try again.");
        setLoading(false);
        return;
      }

      let userId: string;

      // 2. If user exists, update their info
      if (existingUser?.u_id) {
        userId = existingUser.u_id;

        const { error: updateError } = await supabase
          .from("tier2_users")
          .update({
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            company: userInfo.company,
            phone: userInfo.phone,
            title: userInfo.title,
            company_size: userInfo.company_size,
            revenue_range: userInfo.revenue_range,
            industry: userInfo.industry,
          })
          .eq("u_id", userId);

        if (updateError) {
          console.error("Failed to update user:", updateError);
          showToast.error("Failed to update user information.");
          setLoading(false);
          return;
        }
      } else {
        // 3. If no existing user, create one (INSERT full record not just email)
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
          label="Company Size"
          value={userInfo.company_size}
          onChange={handleChange}
          options={["1-10", "11-50", "51-200", "201-500", "500+"]}
        />
        <IconSelect
          icon={FaDollarSign}
          name="revenue_range"
          label="Revenue Range"
          value={userInfo.revenue_range}
          onChange={handleChange}
          options={["<$100K", "$100K-$500K", "$500K-$1M", "$1M-$10M", "$10M+"]}
        />
        <IconSelect
          icon={FaIndustry}
          name="industry"
          label="Industry"
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

        {/* Legal Consent */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FaLock className="text-blue-600" />
            Legal Agreements
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={legalConsent.terms}
                onChange={() => handleLegalConsentChange('terms')}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Terms of Service
                </button>
                {" "}and acknowledge that I am entering into a subscription agreement.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={legalConsent.privacy}
                onChange={() => handleLegalConsentChange('privacy')}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacy Policy
                </button>
                {" "}and consent to the collection and processing of my data.
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !legalConsent.terms || !legalConsent.privacy}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting..." : "Continue to Payment"}
        </button>

        <p className="text-sm text-gray-500 text-center mt-3">
          🔒 Secure checkout powered by Stripe. Cancel anytime.
        </p>
      </form>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaShieldAlt className="text-blue-600" />
                  Terms of Service
                </h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Subscription Service</h4>
                  <p>By subscribing to OptimaliQ.ai, you agree to pay the specified subscription fee for access to our AI-powered business insights and strategic tools.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Payment Terms</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                    <li>You may cancel your subscription at any time</li>
                    <li>No refunds are provided for partial months or unused periods</li>
                    <li>We reserve the right to change pricing with 30 days notice</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Service Usage</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You may use our services for legitimate business purposes only</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You may not share your account credentials with others</li>
                    <li>We reserve the right to suspend accounts for misuse</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4. Intellectual Property</h4>
                  <p>All content, features, and functionality are owned by OptimaliQ.ai and are protected by copyright, trademark, and other intellectual property laws.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5. Limitation of Liability</h4>
                  <p>OptimaliQ.ai provides insights and recommendations but is not responsible for business decisions made based on our analysis. We disclaim all warranties and limit our liability to the amount paid for the service.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    <strong>Note:</strong> These terms apply to your subscription. For our complete terms of service, please visit our main terms page.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setLegalConsent(prev => ({ ...prev, terms: true }));
                    setShowTermsModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaLock className="text-blue-600" />
                  Privacy Policy
                </h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
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
                  <p>We collect the following information to provide you with our services:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Personal information (name, email, phone, company details)</li>
                    <li>Business information (industry, company size, revenue range)</li>
                    <li>Usage data and assessment responses</li>
                    <li>Payment information (processed securely by Stripe)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How We Use Your Data</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Provide and improve our AI-powered insights</li>
                    <li>Process payments and manage your subscription</li>
                    <li>Send service-related communications</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Analyze usage patterns to improve our services</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your data is encrypted and stored securely</li>
                    <li>We do not sell your personal data to third parties</li>
                    <li>We use industry-standard security measures</li>
                    <li>Access is restricted to authorized personnel only</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Rights</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Export your data in a portable format</li>
                    <li>Contact us with privacy concerns</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p>For privacy-related questions or requests, please contact us at:</p>
                  <p className="mt-1">Email: privacy@optimaliq.ai</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    <strong>Note:</strong> This privacy policy applies to your subscription. For our complete privacy policy, please visit our main privacy page.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setLegalConsent(prev => ({ ...prev, privacy: true }));
                    setShowPrivacyModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}