//src/app/subscribe/login/page.tsx
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import LabeledInput from "@/components/shared/LabeledInput";
import SubmitButton from "@/components/shared/SubmitButton";
import { toast } from "react-hot-toast";
import PasswordInput from "@/components/shared/PasswordInput";

type EmailStatus = 'checking' | 'paid_no_account' | 'paid_with_account' | 'not_paid' | 'not_found' | null;

function LoginPageContent() {
  const router = useRouter();
  const { setUser } = usePremiumUser();
  const searchParams = useSearchParams();
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  // Check for email parameter and redirect message on component mount
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const messageParam = searchParams.get("message");
    
    if (emailParam) {
      setEmail(emailParam);
      // Trigger email status check for pre-filled email
      checkEmailStatus(emailParam);
    }
    
    if (messageParam) {
      setRedirectMessage(messageParam);
    }
  }, [searchParams]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, []);

  const checkEmailStatus = async (emailToCheck: string) => {
    // More robust email validation - wait for a complete email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailToCheck || !emailRegex.test(emailToCheck)) return;
    
    setIsCheckingEmail(true);
    setEmailStatus(null);
    setError("");

    try {
      const response = await fetch("/api/auth/check-email-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToCheck })
      });

      if (response.ok) {
        const result = await response.json();
        setEmailStatus(result.status);
        setUserInfo(result.userInfo);
        
        // Show appropriate message based on status
        if (result.status === 'paid_no_account') {
          toast.success("We found your payment! Let's complete your account setup.");
        } else if (result.status === 'not_paid') {
          toast.success("Please subscribe to access OptimaliQ.");
        } else if (result.status === 'not_found') {
          toast.success("New to OptimaliQ? Create an account to get started.");
        } else if (result.status === 'paid_with_account' && result.account_created) {
          toast.success("Account found! Please log in with your password.");
        }
      } else {
        console.error("Error checking email status");
      }
    } catch (error) {
      console.error("Error checking email status:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear status when email changes
    if (emailStatus) {
      setEmailStatus(null);
      setUserInfo(null);
    }
    
    // Clear any existing timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }
    
    // Debounce email check with longer delay and better validation
    emailCheckTimeoutRef.current = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newEmail && emailRegex.test(newEmail)) {
        checkEmailStatus(newEmail);
      }
    }, 1000); // Increased from 500ms to 1000ms
  };

  const handleCreateAccount = () => {
    if (emailStatus === 'paid_with_account' && userInfo?.account_created) {
      // User already has an account - redirect back to login with message
      const message = encodeURIComponent("Looks like you already have an account. Please log in.");
      router.push(`/subscribe/login?email=${encodeURIComponent(email)}&message=${message}`);
      return;
    }
    
    if (emailStatus === 'paid_no_account' && userInfo) {
      // User paid but needs to complete account
      localStorage.setItem("tier2_email", userInfo.email);
      localStorage.setItem("tier2_user_id", userInfo.id);
      localStorage.setItem("tier2_full_user_info", JSON.stringify(userInfo));
      router.push("/subscribe/recover-create-account");
    } else if (emailStatus === 'not_paid' || emailStatus === 'not_found') {
      // User needs to subscribe
      router.push(`/subscribe?email=${encodeURIComponent(email)}`);
    } else {
      // Default to normal signup
      router.push("/subscribe");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✅ 1. Try login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData?.user?.id) {
        // ✅ Check if this might be an incomplete user who paid but didn't complete account creation
        try {
          const recoveryResponse = await fetch("/api/admin/recoverIncompleteUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });

          if (recoveryResponse.ok) {
            const recoveryResult = await recoveryResponse.json();
            
            if (recoveryResult.needsAccountCompletion) {
              // User paid but didn't complete account creation
              localStorage.setItem("tier2_email", email);
              localStorage.setItem("tier2_user_id", recoveryResult.userInfo.u_id);
              localStorage.setItem("tier2_full_user_info", JSON.stringify(recoveryResult.userInfo));
              
              toast.error("Account setup incomplete. Please complete your account creation.");
              router.push("/subscribe/recover-create-account");
              return;
            }
          }
        } catch (recoveryError) {
          console.error("Error checking for incomplete user:", recoveryError);
          // Continue with normal error handling
        }

        const errorMessage = signInError?.message || "Invalid email or password";
        toast.error(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const authUserId = signInData.user.id;

      // ✅ 2. Check user status
      const res = await fetch("/api/premium/auth/checkUserStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_id: authUserId }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result.error || "Failed to verify account";
        toast.error(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const { hasActiveSubscription, hasCompletedOnboarding, profile } = result;

      if (!hasActiveSubscription) {
        toast.error("Your subscription is inactive. Please subscribe.");
        router.push("/Pricing");
        return;
      }

      setUser(profile); // ✅ set context
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("🧠 Session after login:", sessionData);

      // Add success toast
      toast.success("Welcome back!");

      if (hasCompletedOnboarding) {
        router.push("/premium/dashboard");
      } else {
        router.push("/premium/onboarding/world-class");
      }
    } catch (error) {
      console.error("❌ Unexpected login error:", error);
      const errorMessage = "Unexpected error. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (emailStatus) {
      case 'paid_no_account':
        return "We found your payment! Complete your account setup to get started.";
      case 'paid_with_account':
        return "Account exists. Please enter your password to continue.";
      case 'not_paid':
        return "Please subscribe to access OptimaliQ's premium features.";
      case 'not_found':
        return "New to OptimaliQ? Create an account to get started.";
      default:
        return "";
    }
  };

  const getCreateAccountText = () => {
    switch (emailStatus) {
      case 'paid_no_account':
        return "Complete Account Setup";
      case 'not_paid':
        return "Subscribe Now";
      case 'not_found':
        return "Create Account";
      default:
        return "Create Account";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h1>
        <p className="text-center text-sm text-gray-600 mb-6">Log in to access your dashboard</p>

        {/* Redirect Message Banner */}
        {redirectMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  {decodeURIComponent(redirectMessage)}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <LabeledInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-10">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Status Message */}
          {emailStatus && (
            <div className={`p-3 rounded-lg text-sm ${
              emailStatus === 'paid_no_account' ? 'bg-green-50 text-green-800 border border-green-200' :
              emailStatus === 'paid_with_account' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
              emailStatus === 'not_paid' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
              'bg-gray-50 text-gray-800 border border-gray-200'
            }`}>
              {getStatusMessage()}
            </div>
          )}

          {/* Show password field only if user has an account */}
          {(emailStatus === 'paid_with_account' || !emailStatus) && (
            <>
              <PasswordInput
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <div className="text-right text-sm">
                <a href="/subscribe/forgot-password" className="text-blue-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Login Button - only show if user has account or no status yet */}
            {(emailStatus === 'paid_with_account' || !emailStatus) && (
              <SubmitButton
                text="Log In"
                isSubmitting={isLoading}
                type="submit"
                disabled={isLoading}
              />
            )}

            {/* Create Account/Subscribe Button - show for all other statuses */}
            {emailStatus && emailStatus !== 'paid_with_account' && (
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {getCreateAccountText()}
              </button>
            )}

            {/* Divider */}
            {emailStatus && emailStatus !== 'paid_with_account' && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
            )}

            {/* Create Account Link - always show */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">Don&apos;t have an account? </span>
              <button
                type="button"
                onClick={handleCreateAccount}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Create one here
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoginPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}
