//src/app/subscribe/create-account/CreateAccountForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LabeledInput from "@/components/shared/LabeledInput";
import LabeledSelect from "@/components/shared/LabeledSelect";
import SubmitButton from "@/components/shared/SubmitButton";

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

  export default function CreateAccountForm() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
  
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("tier2_email") || "" : "";
    const storedUserInfo = typeof window !== "undefined" ? localStorage.getItem("tier2_full_user_info") : null;
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("tier2_user_id") || "" : "";
  
    const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
  
    const [formState, setFormState] = useState({
      email: storedEmail,
      password: "",
      confirmPassword: "",
      timezone: "",
      linkedin_url: "",
      agreed_terms: false,
      agreed_marketing: false, 
    });
    
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, type } = e.target;
      const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setFormState((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (!formState.email || !formState.email.includes("@")) {
        alert("❌ Please enter a valid email address.");
        return;
      }
    
      if (formState.password.length < 12) {
        alert("❌ Password must be at least 12 characters.");
        return;
      }
    
      const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
      if (!passwordStrengthRegex.test(formState.password)) {
        alert("❌ Password must include uppercase, lowercase, a number, and a symbol.");
        return;
      }
    
      if (formState.password !== formState.confirmPassword) {
        alert("❌ Passwords do not match");
        return;
      }
    
      // ✅ 1. Create Supabase Auth user
      // 1. Set password using admin API (works even if user already exists)
const res = await fetch("/api/admin/setPassword", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: formState.email, password: formState.password }),
});

const result = await res.json();

if (!res.ok) {
  if (res.status === 404) {
    alert("❌ No user record found. Please start subscription again.");
    router.push("/subscribe");
    return;
  } else {
    alert(`❌ Failed to set password: ${result.error || "Unknown error"}`);
    return;
  }
}
    
      // ✅ 2. After auth signup succeeds, update tier2_users
      const { error: updateError } = await supabase.from("tier2_users").update({
        timezone: formState.timezone,
        linkedin_url: formState.linkedin_url,
        agreed_terms: formState.agreed_terms,
        agreed_marketing: formState.agreed_marketing,
      }).eq("u_id", storedUserId);
    
      if (updateError) {
        console.error("⚠️ Profile update failed after auth creation:", updateError);
        alert("✅ Account created, but we couldn’t complete your profile update.");
      }
    
      // ✅ 3. Clean up and send to Login
    localStorage.removeItem("tier2_email");
    localStorage.removeItem("tier2_user_id");
    localStorage.removeItem("tier2_full_user_info");

    router.push("/subscribe/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    <LabeledInput label="Email" name="email" value={formState.email} readOnly type="email" />
    <LabeledInput label="Password" name="password" type="password" value={formState.password} onChange={handleChange} />
    <LabeledInput label="Confirm Password" name="confirmPassword" type="password" value={formState.confirmPassword} onChange={handleChange} />
    <LabeledSelect label="Your Timezone" name="timezone" value={formState.timezone} onChange={handleChange} options={timezoneOptions} />
    <LabeledInput label="LinkedIn URL (optional)" name="linkedin_url" value={formState.linkedin_url} onChange={handleChange} /> {/* ✅ fixed here */}
    
      <div className="flex items-center space-x-2">
  <input
    type="checkbox"
    name="agreed_terms" // ✅ corrected
    checked={formState.agreed_terms}
    onChange={handleChange}
    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
  />
  <label className="text-sm text-gray-700">
    I agree to the <a href="#" className="text-blue-600 underline">terms and conditions</a>
  </label>
</div>

<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    name="agreed_marketing" // ✅ corrected
    checked={formState.agreed_marketing}
    onChange={handleChange}
    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
  />
  <label className="text-sm text-gray-700">
    I&#39;d like to receive helpful insights and updates
  </label>
</div>

      <SubmitButton isSubmitting={false} cooldown={0} text="Create My Account" />
    </form>
  );
}
