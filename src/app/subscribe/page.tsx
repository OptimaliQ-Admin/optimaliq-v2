"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import SubscribeForm from "@/components/subscribe/SubscribeForm";
import SubscribeHeader from "@/components/subscribe/SubscribeHeader";
import { getSubscriptionStatusMessage } from "@/lib/utils/subscriptionCheck";

function SubscribePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const plan = searchParams.get("plan") as "accelerator" | "strategic" | null;
  const cycle = searchParams.get("cycle") as "monthly" | "annual" | null;
  const message = searchParams.get("message");

  useEffect(() => {
    const checkIfUserExists = async () => {
      const email = localStorage.getItem("tier2_email");
      if (!email) {
        setCheckingStatus(false);
        return;
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("email", email)
        .maybeSingle();

      if (error || !data) {
        setCheckingStatus(false);
        return;
      }

      if (data?.status === "active") {
        router.push("/login");
      } else {
        setCheckingStatus(false);
      }
    };

    checkIfUserExists();
  }, [router]);

  // Handle status messages from URL parameters
  useEffect(() => {
    if (message === 'subscription_required') {
      setStatusMessage('You need an active subscription to access premium features.');
    } else if (message === 'subscription_canceled') {
      setStatusMessage('Your subscription has been canceled. Please resubscribe to continue.');
    }
  }, [message]);

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Checking subscription status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Status Message Banner */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  {statusMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <SubscribeHeader />
          <SubscribeForm plan={plan} cycle={cycle} />
        </motion.div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading subscription page...
      </div>
    }>
      <SubscribePageContent />
    </Suspense>
  );
}