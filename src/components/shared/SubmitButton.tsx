"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

type Props = {
  text?: string;
  isSubmitting: boolean;
  cooldown?: number;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function SubmitButton({
  text = "Submit",
  isSubmitting,
  cooldown = 0,
  disabled = false,
  type = "button",
}: Props) {
  const isDisabled = isSubmitting || cooldown > 0 || disabled;
  const label = isSubmitting
    ? "Submitting..."
    : cooldown > 0
    ? `Please wait (${cooldown}s)`
    : text;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
        isDisabled
          ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-sm"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
      }`}
    >
      {isSubmitting ? (
        <>
          <FaSpinner className="animate-spin text-lg" />
          <span>{label}</span>
        </>
      ) : cooldown > 0 ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{label}</span>
        </>
      ) : (
        <>
          <FaCheckCircle className="text-lg" />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
}
