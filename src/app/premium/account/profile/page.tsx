"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { PremiumUser } from "@/context/PremiumUserContext";
import { formatPhoneForDisplay, stripPhoneFormatting } from "@/lib/utils/phoneFormatter";
import { isValidLinkedInUrl, isValidEmail, isDisposableEmail } from "@/lib/utils/validation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = usePremiumUser();
  const [form, setForm] = useState<Partial<PremiumUser>>({});
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; linkedin_url?: string }>({});

  useEffect(() => {
    if (user) {
      setForm(user);
      setProfilePic(user.profile_pic_url || null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // For phone, store only digits in form state but display formatted
      const digits = stripPhoneFormatting(value);
      setForm({ ...form, [name]: digits });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Show instant preview while uploading
      try { setProfilePic(URL.createObjectURL(file)); } catch {}
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
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
      const errorMessage = 'Failed to upload profile picture.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    // Client-side validation
    const errors: { email?: string; linkedin_url?: string } = {};
    if (form.email && (!isValidEmail(form.email) || isDisposableEmail(form.email))) {
      errors.email = 'Please enter a valid, non-disposable email address.';
    }
    if (form.linkedin_url && form.linkedin_url.trim() !== '' && !isValidLinkedInUrl(form.linkedin_url)) {
      errors.linkedin_url = 'Please enter a valid LinkedIn profile URL.';
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSaving(false);
      return;
    }
    try {
      const response = await fetch('/api/premium/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u_id: user?.id, updates: { ...form } }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      setSuccess(true);
      toast.success("Saved successfully!");
      
      // Update user context with new data
      if (user) {
        setUser({
          ...user,
          ...form
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
        
        {/* Profile Picture Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-24 h-24">
            {profilePic ? (
              <Image 
                src={profilePic} 
                alt={`${form.first_name} ${form.last_name} profile picture`}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" 
              />
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
            <select 
              name="company_size" 
              value={form.company_size || ''} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
            <select 
              name="industry" 
              value={form.industry || ''} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select industry</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Finance">Finance</option>
              <option value="SaaS">SaaS</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input 
              name="phone" 
              value={formatPhoneForDisplay(form.phone || '')} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              name="email" 
              value={form.email || ''} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
            />
            {validationErrors.email && (
              <div className="text-red-600 text-xs mt-1">{validationErrors.email}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
            <input 
              name="linkedin_url" 
              value={form.linkedin_url || ''} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
            />
            {validationErrors.linkedin_url && (
              <div className="text-red-600 text-xs mt-1">{validationErrors.linkedin_url}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
            <select 
              name="timezone" 
              value={form.timezone || ''} 
              onChange={handleChange} 
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select timezone</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
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
    </div>
  );
} 