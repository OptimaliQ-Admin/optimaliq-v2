"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { PremiumUser } from "@/context/PremiumUserContext";

export default function AccountPage() {
  const { user } = usePremiumUser();
  const [form, setForm] = useState<Partial<PremiumUser>>({});
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(user);
      setProfilePic(user.profile_pic_url || null);
    }
  }, [user]);

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
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">?</div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg">
              <input type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
              <span className="text-xs">Edit</span>
            </label>
          </div>
          <div>
            <div className="font-semibold text-lg">{form.first_name} {form.last_name}</div>
            <div className="text-gray-500 text-sm">{form.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input name="first_name" value={form.first_name || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input name="last_name" value={form.last_name || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={form.title || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input name="company" value={form.company || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Size</label>
            <input name="company_size" value={form.company_size || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input name="industry" value={form.industry || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <input name="linkedin_url" value={form.linkedin_url || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <input name="timezone" value={form.timezone || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="agreed_marketing" checked={!!form.agreed_marketing} onChange={e => setForm(f => ({ ...f, agreed_marketing: e.target.checked }))} />
            Receive marketing emails
          </label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50" disabled={saving || uploading}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {success && <div className="text-green-600 font-medium">Profile updated!</div>}
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </form>

      {/* Password change form */}
      <form onSubmit={handlePasswordChange} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
        </div>

        {passwordError && (
          <div className="text-red-600 font-medium">{passwordError}</div>
        )}
        
        {passwordSuccess && (
          <div className="text-green-600 font-medium">Password updated successfully!</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
          disabled={changingPassword}
        >
          {changingPassword ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
} 