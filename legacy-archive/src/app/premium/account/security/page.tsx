"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import PasswordInput from "@/components/shared/PasswordInput";

export default function SecurityPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
    <div className="space-y-8">
      {/* Password Change Form */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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

      {/* Security Tips */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Tips</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Strong Password</h3>
            <p className="text-blue-700 text-sm">
              Use a combination of uppercase, lowercase, numbers, and special characters.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Unique Password</h3>
            <p className="text-green-700 text-sm">
              Don&apos;t reuse passwords from other accounts or services.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Regular Updates</h3>
            <p className="text-purple-700 text-sm">
              Change your password regularly, especially after security incidents.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Two-Factor Auth</h3>
            <p className="text-orange-700 text-sm">
              Consider enabling two-factor authentication for additional security.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 