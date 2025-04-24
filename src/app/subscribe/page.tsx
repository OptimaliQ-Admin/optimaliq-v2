"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SubscribeForm from "@/components/subscribe/SubscribeForm";
import ValueCarousel from "@/components/subscribe/ValueCarousel";

export default function SubscribePage() {
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600 dark:text-white">
        Checking subscription status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:block">
          <ValueCarousel />
        </div>
        <SubscribeForm />
      </div>
    </div>
  );
}
