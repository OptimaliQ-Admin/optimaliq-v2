"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LabeledInput from "@/components/shared/LabeledInput";
import LabeledSelect from "@/components/shared/LabeledSelect";
import SubmitButton from "@/components/shared/SubmitButton";
import { toast } from "react-hot-toast";
import PasswordInput from "@/components/shared/PasswordInput";
import { normalizeLinkedInUrl } from "@/lib/utils/validation";

interface TrialUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  title: string | null;
  trial_start_date: string;
  trial_end_date: string;
  status: 'active' | 'expired' | 'converted';
  created_at: string;
  updated_at: string;
}

const timezoneOptions = [
  { value: "-12:00", label: "(GMT -12:00) Eniwetok, Kwajalein" },
  { value: "-11:00", label: "(GMT -11:00) Midway Island, Samoa" },
  { value: "-10:00", label: "(GMT -10:00) Hawaii" },
  { value: "-09:50", label: "(GMT -9:30) Taiohae" },
  { value: "-09:00", label: "(GMT -9:00) Alaska" },
  { value: "-08:00", label: "(GMT -8:00) Pacific Time (US & Canada)" },
  { value: "-07:00", label: "(GMT -7:00) Mountain Time (US & Canada)" },
  { value: "-06:00", label: "(GMT -6:00) Central Time (US & Canada), Mexico City" },
  { value: "-05:00", label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima" },
  { value: "-04:50", label: "(GMT -4:30) Caracas" },
  { value: "-04:00", label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz" },
  { value: "-03:50", label: "(GMT -3:30) Newfoundland" },
  { value: "-03:00", label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown" },
  { value: "-02:00", label: "(GMT -2:00) Mid-Atlantic" },
  { value: "-01:00", label: "(GMT -1:00) Azores, Cape Verde Islands" },
  { value: "+00:00", label: "(GMT) Western Europe Time, London, Lisbon, Casablanca" },
  { value: "+01:00", label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris" },
  { value: "+02:00", label: "(GMT +2:00) Kaliningrad, South Africa" },
  { value: "+03:00", label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
  { value: "+03:50", label: "(GMT +3:30) Tehran" },
  { value: "+04:00", label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
  { value: "+04:50", label: "(GMT +4:30) Kabul" },
  { value: "+05:00", label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
  { value: "+05:50", label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi" },
  { value: "+05:75", label: "(GMT +5:45) Kathmandu" },
  { value: "+06:00", label: "(GMT +6:00) Almaty, Dhaka, Colombo" },
  { value: "+07:00", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta" },
  { value: "+08:00", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong" },
  { value: "+09:00", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
  { value: "+09:50", label: "(GMT +9:30) Adelaide, Darwin" },
  { value: "+10:00", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok" },
  { value: "+11:00", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia" },
  { value: "+12:00", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka" },
];

export default function TrialSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [trialUser, setTrialUser] = useState<TrialUser | null>(null);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    timezone: '',
    linkedin_url: '',
    agreed_terms: false,
    agreed_marketing: false,
  });

  useEffect(() => {
    // Get email from URL params
    const email = searchParams.get('email');
    console.log("Email from URL params:", email);
    console.log("All search params:", Object.fromEntries(searchParams.entries()));
    
    if (email) {
      setFormState(prev => ({ ...prev, email }));
      fetchTrialUser(email);
    } else {
      console.log("No email parameter found in URL");
      toast.error("Missing email parameter in trial invitation");
      router.push("/subscribe");
    }
  }, [searchParams]);

  const fetchTrialUser = async (email: string) => {
    try {
      console.log("Fetching trial user for email:", email);
      console.log("Email to search for (lowercase):", email.toLowerCase());
      
      // First, get all trial users with this email to check for duplicates
      const { data: allTrialUsers, error: fetchError } = await supabase
        .from("trial_users")
        .select("*")
        .eq("email", email.toLowerCase());

      console.log("All trial users found:", allTrialUsers);
      console.log("Fetch error:", fetchError);

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        toast.error(`Error validating trial invitation: ${fetchError.message}`);
        router.push("/subscribe");
        return;
      }

      if (!allTrialUsers || allTrialUsers.length === 0) {
        console.log("No trial user found for email:", email);
        console.log("Searched for:", email.toLowerCase());
        toast.error("Invalid or expired trial invitation. Please contact support.");
        router.push("/subscribe");
        return;
      }

      // If multiple records exist, use the most recent active one
      let trialUser = null;
      if (allTrialUsers.length > 1) {
        console.log("Multiple trial users found, using most recent active one");
        const activeUsers = allTrialUsers.filter(user => user.status === 'active');
        console.log("Active users:", activeUsers);
        if (activeUsers.length > 0) {
          // Sort by created_at descending and take the most recent
          trialUser = activeUsers.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
        }
      } else {
        trialUser = allTrialUsers[0];
      }

      if (!trialUser || trialUser.status !== 'active') {
        console.log("No active trial user found for email:", email);
        console.log("Trial user found:", trialUser);
        toast.error("Invalid or expired trial invitation. Please contact support.");
        router.push("/subscribe");
        return;
      }

      console.log("Trial user found:", trialUser);
      setTrialUser(trialUser);
    } catch (error) {
      console.error("Error fetching trial user:", error);
      toast.error("Error validating trial invitation");
      router.push("/subscribe");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trialUser) {
      toast.error("Invalid trial invitation");
      return;
    }

    if (formState.password.length < 12) {
      toast.error("❌ Password must be at least 12 characters.");
      return;
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
    if (!passwordStrengthRegex.test(formState.password)) {
      toast.error("❌ Password must include uppercase, lowercase, number, and symbol.");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    if (!formState.agreed_terms) {
      toast.error("❌ You must agree to the terms and conditions to create an account.");
      return;
    }

    setIsLoading(true);

    try {
      // Clear any existing session to prevent refresh token conflicts
      await supabase.auth.signOut();

      // Create Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          emailRedirectTo: `${window.location.origin}/premium/dashboard`,
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast.error(`❌ ${authError.message || "Failed to create account"}`);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("❌ Failed to create user account");
        setIsLoading(false);
        return;
      }

      // Create tier2_users record
      const { error: tier2Error } = await supabase
        .from("tier2_users")
        .insert([{
          u_id: authData.user.id,
          email: formState.email,
          first_name: trialUser.first_name,
          last_name: trialUser.last_name,
          company: trialUser.company,
          title: trialUser.title,
          timezone: formState.timezone,
          linkedin_url: formState.linkedin_url ? normalizeLinkedInUrl(formState.linkedin_url) : null,
          agreed_terms: formState.agreed_terms,
          agreed_marketing: formState.agreed_marketing,
        }]);

      if (tier2Error) {
        console.error("Error creating tier2_users record:", tier2Error);
        toast.error("Failed to create user profile");
        setIsLoading(false);
        return;
      }

      // Create trial subscription record for the user
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert([{
          u_id: authData.user.id,
          plan: 'trial',
          status: 'trial',
          nextbillingdate: trialUser.trial_end_date,
          createdat: trialUser.trial_start_date,
          billingCycle: 'monthly',
          stripe_subscription_id: null,
          stripe_customer_id: null,
          stripe_data: null
        }]);

      if (subscriptionError) {
        console.error("Error creating trial subscription:", subscriptionError);
        // Don't fail the signup process, just log the error
      }

      // Update trial user status to converted
      const { error: trialUpdateError } = await supabase
        .from("trial_users")
        .update({ status: 'converted' })
        .eq("id", trialUser.id);

      if (trialUpdateError) {
        console.error("Error updating trial user status:", trialUpdateError);
      }

      toast.success("🎉 Account created successfully! Welcome to OptimaliQ!");
      
      // Sign in the user immediately after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        // Still redirect to login page if auto-signin fails
        toast.success("Account created! Please sign in to continue.");
        router.push("/subscribe/login");
        return;
      }

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/premium/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("❌ An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!trialUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your trial invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Trial Setup
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome, {trialUser.first_name}! Let&apos;s get your OptimaliQ trial account set up.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-900">
                🎉 You have a 30-day free trial of{" "}
                <span className="text-blue-600 font-semibold">OptimaliQ</span> Premium
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <LabeledInput
              label="Email"
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              readOnly
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              required
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formState.confirmPassword}
              onChange={handleChange}
              required
            />

            <LabeledSelect
              label="Timezone"
              name="timezone"
              value={formState.timezone}
              onChange={handleChange}
              options={timezoneOptions}
            />

            <LabeledInput
              label="LinkedIn Profile (Optional)"
              type="url"
              name="linkedin_url"
              value={formState.linkedin_url}
              onChange={handleChange}
            />

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreed_terms"
                  checked={formState.agreed_terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreed_marketing"
                  checked={formState.agreed_marketing}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I&apos;d like to receive helpful insights and updates
                </span>
              </label>
            </div>

            <SubmitButton
              text="Complete Setup"
              isSubmitting={isLoading}
              type="submit"
            />
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our terms and acknowledge our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 