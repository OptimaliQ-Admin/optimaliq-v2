"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LabeledInput from "@/components/shared/LabeledInput";
import LabeledSelect from "@/components/shared/LabeledSelect";
import SubmitButton from "@/components/shared/SubmitButton";
import { supabase } from "@/lib/supabase";
import AssessmentIntroModal from "@/components/modals/AssessmentIntroModal";

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
  { value: "+05:75", label: "(GMT +5:45) Kathmandu, Pokhara" },
  { value: "+06:00", label: "(GMT +6:00) Almaty, Dhaka, Colombo" },
  { value: "+06:50", label: "(GMT +6:30) Yangon, Mandalay" },
  { value: "+07:00", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta" },
  { value: "+08:00", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong" },
  { value: "+08:75", label: "(GMT +8:45) Eucla" },
  { value: "+09:00", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
  { value: "+09:50", label: "(GMT +9:30) Adelaide, Darwin" },
  { value: "+10:00", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok" },
  { value: "+10:50", label: "(GMT +10:30) Lord Howe Island" },
  { value: "+11:00", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia" },
  { value: "+11:50", label: "(GMT +11:30) Norfolk Island" },
  { value: "+12:00", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka" },
  { value: "+12:75", label: "(GMT +12:45) Chatham Islands" },
  { value: "+13:00", label: "(GMT +13:00) Apia, Nukualofa" },
  { value: "+14:00", label: "(GMT +14:00) Line Islands, Tokelau" },
];

export default function CreateAccountPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [formState, setFormState] = useState({
    email: emailFromQuery,
    password: "",
    confirmPassword: "",
    timezone: "",
    linkedIn: "",
    termsAgreed: false,
    marketingOptIn: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formState.email,
      password: formState.password,
    });

    if (signUpError || !signUpData?.user?.id) {
      alert("Failed to create auth account");
      return;
    }

    const { error: updateError } = await supabase
      .from("tier2_users")
      .update({
        timezone_offset: formState.timezone,
        linkedin_url: formState.linkedIn,
        agreed_terms: formState.termsAgreed,
        agreed_marketing: formState.marketingOptIn,
      })
      .eq("u_id", signUpData.user.id);

    if (updateError) {
      alert("Account created, but failed to update user profile");
    } else {
      setShowModal(true); // Show modal instead of redirecting right away
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Create Your OptimaliQ Account</h1>
        <p className="text-gray-600 text-center mt-2 mb-6">We just need a few more details to get you started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput label="Email" name="email" value={formState.email} readOnly={true} type="email" />
          <LabeledInput label="Password" name="password" type="password" value={formState.password} onChange={handleChange} />
          <LabeledInput label="Confirm Password" name="confirmPassword" type="password" value={formState.confirmPassword} onChange={handleChange} />
          <LabeledSelect label="Your Timezone" name="timezone" value={formState.timezone} onChange={handleChange} options={timezoneOptions} />
          <LabeledInput label="LinkedIn URL (optional)" name="linkedIn" value={formState.linkedIn} onChange={handleChange} />

          <div className="flex items-center space-x-2">
            <input type="checkbox" name="termsAgreed" checked={formState.termsAgreed} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 underline">terms and conditions</a></label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="marketingOptIn" checked={formState.marketingOptIn} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label className="text-sm text-gray-700">I&#39;d like to receive helpful insights and updates</label>
          </div>

          <SubmitButton isSubmitting={false} cooldown={0} text="Create My Account" />
        </form>
      </div>
      <AssessmentIntroModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}