"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import PasswordInput from "@/components/shared/PasswordInput";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";

type ProfileForm = {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  company_size: string;
  industry: string;
  phone: string;
  linkedin_url: string;
  timezone: string;
  agreed_marketing: boolean;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountPage() {
  const { user } = usePremiumUser();
  const [form, setForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    title: "",
    company: "",
    company_size: "",
    industry: "",
    phone: "",
    linkedin_url: "",
    timezone: "",
    agreed_marketing: false,
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user?.u_id) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("tier2_profiles")
          .select("*")
          .eq("u_id", user.u_id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            title: data.title || "",
            company: data.company || "",
            company_size: data.company_size || "",
            industry: data.industry || "",
            phone: data.phone || "",
            linkedin_url: data.linkedin_url || "",
            timezone: data.timezone || "",
            agreed_marketing: data.agreed_marketing || false,
          });
          setProfilePic(data.profile_pic || null);
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
      }
    };

    fetchProfile();
  }, [user?.u_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.u_id}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('profile-pics').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('profile-pics').getPublicUrl(fileName);
      setProfilePic(publicUrl);
      setForm(prev => ({ ...prev, profile_pic_url: publicUrl }));
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError('Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('/api/premium/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u_id: user?.u_id, ...form }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validate passwords
    if (passwordForm.newPassword.length < 12) {
      setPasswordError("Password must be at least 12 characters long");
      return;
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
    if (!passwordStrengthRegex.test(passwordForm.newPassword)) {
      setPasswordError("Password must include uppercase, lowercase, number, and symbol");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setChangingPassword(true);

    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        throw error;
      }

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            {/* Profile Settings */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              {/* ... rest of the form ... */}
            </form>

            {/* Password change form */}
            <form
              onSubmit={handlePasswordChange}
              className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
            >
              {/* ... rest of the password form ... */}
            </form>
          </div>

          {/* Notification Preferences */}
          <div>
            <NotificationPreferences />
          </div>
        </div>
      </div>
    </div>
  );
} 