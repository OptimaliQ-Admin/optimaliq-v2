"use client";

import { useState } from "react";
import PricingToggle from "../../components/pricing/PricingToggle";
import PricingGrid from "../../components/pricing/PricingGrid";
import ComparisonBlock from "../../components/pricing/ComparisonBlock";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  return (
    <div className="pt-20">
      <section className="text-center py-20 bg-gray-100">
        <h1 className="text-5xl font-bold text-gray-800">
          Unlock Predictable Growth with AI-Driven Strategy
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Get instant AI-powered insights, track your business progress, and take action with a personalized 30-day plan—every month.
        </p>
      </section>

      <PricingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
      <PricingGrid billingCycle={billingCycle} />
      <ComparisonBlock />
    </div>
  );
}
