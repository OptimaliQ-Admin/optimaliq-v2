import PricingCard from "./PricingCard";

interface PricingGridProps {
  billingCycle: "annual" | "monthly";
}

export default function PricingGrid({ billingCycle }: PricingGridProps) {
  const pricing = {
    annual: { accelerator: 99, enterprise: 999 },
    monthly: { accelerator: 199, enterprise: 1999 },
  };

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <PricingCard
        plan="Free"
        price="FREE"
        cycle={billingCycle}
        features={["GMF+ Business Score", "Limited Growth Insights"]}
        disabled={["No Competitive Benchmarking", "No AI-Generated 30-Day Plan", "No Personalized Strategy Adjustments"]}
        cta="Take Free Assessment"
      />
      <PricingCard
        plan="Accelerator"
        price={pricing[billingCycle].accelerator}
        cycle={billingCycle}
        features={[
          "Monthly Review Call",
          "AI-Powered Business Assessments",
          "Industry Benchmarking & Competitive Insights",
          "Future Performance Overview",
          "Personalized 30-Day Action Plan",
          "Predictive AI Insights & Market Trends",
          "Business Simulations & Strategy Adjustments",
          "Access to Expert-Led Growth Community",
        ]}
        cta="Get Accelerator"
      />
      <PricingCard
        plan="Enterprise"
        price={pricing[billingCycle].enterprise}
        cycle={billingCycle}
        features={[
          "Everything in Accelerator",
          "CRM & SaaS Integrations (HubSpot, Salesforce, Asana)",
          "AI Task Execution & Workflow Automation",
          "Monthly Strategy Calls & Executive Coaching",
          "Personalized AI-Generated Growth Playbooks",
        ]}
        cta="Get Enterprise Access"
      />
    </section>
  );
}
