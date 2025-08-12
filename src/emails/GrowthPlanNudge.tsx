import * as React from "react";

export default function GrowthPlanNudge({ firstName = "there", type, planId }: { firstName?: string; type: "day7"|"day21"; planId: string; }) {
  const heading = type === "day7" ? "Week‑1 pulse check" : "Week‑3 checkpoint";
  const cta = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/premium/dashboard?plan=${planId}`;
  return (
    <div style={{ fontFamily: "Inter, Arial", lineHeight: 1.5 }}>
      <h2 style={{ margin: 0 }}>{heading}</h2>
      <p>Hi {firstName}, quick nudge on your 30‑day plan. Knock out one lever today.</p>
      <p><a href={cta}>Open my plan →</a></p>
    </div>
  );
}


