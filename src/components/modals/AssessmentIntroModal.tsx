"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AssessmentIntroModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  const handleStart = () => {
    onClose();
    router.push("/premium/onboarding/initial-assessment");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* ✅ Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" />

        {/* ✅ Modal panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10"
        >
          <Dialog.Title className="text-xl font-semibold text-blue-700 text-center">
            One Last Step to Unlock Your Dashboard
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600 text-sm text-center">
            Before we personalize your dashboard, we need to understand how your business operates.
            This quick assessment helps us tailor your roadmap with real insights—across Strategy, Process, and Technology.
          </Dialog.Description>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
            >
              Let’s Get Started
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
