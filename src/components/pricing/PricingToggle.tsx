"use client";

interface PricingToggleProps {
  billingCycle: "annual" | "monthly";
  setBillingCycle: (cycle: "annual" | "monthly") => void;
}

export default function PricingToggle({ billingCycle, setBillingCycle }: PricingToggleProps) {
  return (
    <div className="text-center my-10">
      <span className="text-gray-600 font-medium">Billing: </span>
      <button
        className={`px-4 py-2 rounded-l-lg text-lg font-bold ${
          billingCycle === "annual" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => setBillingCycle("annual")}
      >
        Annual (Save 20%)
      </button>
      <button
        className={`px-4 py-2 rounded-r-lg text-lg font-bold ${
          billingCycle === "monthly" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => setBillingCycle("monthly")}
      >
        Monthly
      </button>
    </div>
  );
}
