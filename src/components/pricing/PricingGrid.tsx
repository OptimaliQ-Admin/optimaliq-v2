import PricingCard from "./PricingCard";

interface PricingGridProps {
  billingCycle: "annual" | "monthly";
}

export default function PricingGrid({ billingCycle }: PricingGridProps) {
  const pricing = {
    annual: { accelerator: 2988, strategic: 5268 },
    monthly: { accelerator: 329, strategic: 549 },
  };

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
      {/* FREE PLAN */}
      <PricingCard
        plan="Free"
        price="FREE"
        cycle={billingCycle}
        features={[
          "GMF+ Business Score Assessment",
          "Basic AI-Generated Summary",
          "Limited Growth Insight Preview",
        ]}
        disabled={[
          "No Industry Benchmarking",
          "No Strategic Roadmap",
          "No 30-Day Growth Plan",
          "No Business Simulations",
          "No Strategy Sessions or Review Calls",
          "No Real-Time Market Trend Insights",
        ]}
        cta="Take Free Assessment"
      />

      {/* ACCELERATOR PLAN */}
      <PricingCard
        plan="Accelerator"
        price={pricing[billingCycle].accelerator}
        cycle={billingCycle}
        features={[
          "Full AI-Powered Business Assessments",
          "Industry Benchmarking & Competitive Positioning",
          "Personalized 30-Day Growth Plan (refreshed monthly)",
          "Executive Radar Charts & KPI Forecasts",
          "Business Simulation Tools for Scenario Planning",
          "One Monthly Review Call with a Growth Advisor",
          "Real-Time Market & Trend Insights (updated regularly)",
        ]}
        cta="Unlock Accelerator"
      />

      {/* STRATEGIC PLAN */}
      <PricingCard
        plan="Strategic"
        price={pricing[billingCycle].strategic}
        cycle={billingCycle}
        features={[
          "Everything in Accelerator",
          "Two Monthly 1:1 Strategy Sessions with Executive Coach",
          "AI-Generated Strategic Growth Playbooks",
          "Quarterly Planning Support & Advanced Insights",
        ]}
        cta="Start Strategic Plan"
      />
    </section>
  );
}
