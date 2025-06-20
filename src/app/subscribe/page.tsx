"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import SubscribeForm from "@/components/subscribe/SubscribeForm";
import SubscribeHeader from "@/components/subscribe/SubscribeHeader";

function SubscribePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingStatus, setCheckingStatus] = useState(true);

  const plan = searchParams.get("plan") as "accelerator" | "strategic" | null;
  const cycle = searchParams.get("cycle") as "monthly" | "annual" | null;

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