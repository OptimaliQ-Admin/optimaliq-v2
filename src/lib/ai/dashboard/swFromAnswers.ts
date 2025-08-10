interface SWItem { title: string; impact: string; sourceQuestions: string[] }

export interface StrengthsWeaknesses {
  strengths: SWItem[];
  weaknesses: SWItem[];
}

export function swFromAnswers(raw: Record<string, any>): StrengthsWeaknesses {
  const strengths: SWItem[] = [];
  const weaknesses: SWItem[] = [];

  // Simple heuristics extracting from known keys; extend as needed
  if (Array.isArray(raw.tech_stack_overview) && raw.tech_stack_overview.length >= 2) {
    strengths.push({ title: "Tooling foundation", impact: "Core tools in place", sourceQuestions: ["tech_stack_overview"] });
  }
  if (typeof raw.process_maturity === 'string' && /ad hoc/i.test(raw.process_maturity)) {
    weaknesses.push({ title: "Ad hoc processes", impact: "Inconsistent execution and quality", sourceQuestions: ["process_maturity"] });
  }
  if (typeof raw.strategic_decision_making === 'string' && /gut/i.test(raw.strategic_decision_making)) {
    weaknesses.push({ title: "Low decision discipline", impact: "Decisions lack data support", sourceQuestions: ["strategic_decision_making"] });
  }
  if (Array.isArray(raw.friction_points) && raw.friction_points.some((x: string) => /funding/i.test(x))) {
    weaknesses.push({ title: "Funding constraints", impact: "Limits growth investments", sourceQuestions: ["friction_points"] });
  }
  if (Array.isArray(raw.acquisition_channels) && raw.acquisition_channels.includes("Organic Search / SEO")) {
    strengths.push({ title: "SEO traction", impact: "Compounding inbound growth channel", sourceQuestions: ["acquisition_channels"] });
  }

  // Ensure at least 2 items each
  while (strengths.length < 2) strengths.push({ title: "Core strengths", impact: "Foundational capabilities present", sourceQuestions: [] });
  while (weaknesses.length < 2) weaknesses.push({ title: "Execution gaps", impact: "Key processes need formalization", sourceQuestions: [] });

  return { strengths, weaknesses };
}


