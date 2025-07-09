"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LabeledInput from "@/components/shared/LabeledInput";
import SubmitButton from "@/components/shared/SubmitButton";
import PasswordInput from "@/components/shared/PasswordInput";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      const errorMessage = "Passwords do not match.";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password: form.password });

    if (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
      setError(errorMessage);
    } else {
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/subscribe/login"), 2000);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Reset Your Password</h1>
        <p className="text-sm text-gray-600 text-center mt-1 mb-6">
          Enter your new password below.
        </p>

        {success ? (
          <p className="text-green-600 text-center font-medium">
            ✅ Password updated! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              label="New Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              showRequirements
            />
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              showMatchError
              matchValue={form.password}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <SubmitButton
              isSubmitting={isSubmitting}
              cooldown={0}
              text="Reset Password"
            />
          </form>
        )}
      </div>
    </div>
  );
}
