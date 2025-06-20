"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { PremiumUser } from "@/context/PremiumUserContext";
import PasswordInput from "@/components/shared/PasswordInput";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";

export default function AccountPage() {
  const { user, setUser } = usePremiumUser();
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
      
      // Update user context with new profile picture URL
      if (user) {
        setUser({
          ...user,
          profile_pic_url: publicUrl
        });
      }
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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              <span>Account Management</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              Manage Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Account Settings
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Update your profile information, manage your password, and customize your notification preferences to get the most out of OptimaliQ.
            </motion.p>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Notification Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
            <NotificationPreferences />
          </motion.div>

          {/* Profile Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit} 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-3xl text-gray-400 border-4 border-white shadow-lg">?</div>
                )}
                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
                  <span className="text-xs">Edit</span>
                </label>
              </div>
              <div>
                <div className="font-semibold text-xl text-gray-900">{form.first_name} {form.last_name}</div>
                <div className="text-gray-500">{form.email}</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input 
                  name="first_name" 
                  value={form.first_name || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input 
                  name="last_name" 
                  value={form.last_name || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input 
                  name="title" 
                  value={form.title || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                <input 
                  name="company" 
                  value={form.company || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                <input 
                  name="company_size" 
                  value={form.company_size || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                <input 
                  name="industry" 
                  value={form.industry || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input 
                  name="phone" 
                  value={form.phone || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                <input 
                  name="linkedin_url" 
                  value={form.linkedin_url || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                <input 
                  name="timezone" 
                  value={form.timezone || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />
              </div>
            </div>

            {/* Marketing Checkbox */}
            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="agreed_marketing" 
                  checked={!!form.agreed_marketing} 
                  onChange={e => setForm(f => ({ ...f, agreed_marketing: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Receive marketing emails</span>
              </label>
            </div>

            {/* Submit Button and Status */}
            <div className="mt-8">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50" 
                disabled={saving || uploading}
              >
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
              
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-green-600 font-medium flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Profile updated successfully!
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-600 font-medium flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {error}
                </motion.div>
              )}
            </div>
          </motion.form>

          {/* Password Change Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handlePasswordChange} 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
            
            <div className="space-y-6">
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                autoComplete="current-password"
              />
              
              <PasswordInput
                label="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                showRequirements
              />
              
              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                showMatchError
                matchValue={passwordForm.newPassword}
              />
            </div>

            {passwordError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-600 font-medium flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {passwordError}
              </motion.div>
            )}
            
            {passwordSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-600 font-medium flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Password updated successfully!
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50"
              disabled={changingPassword}
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
} 