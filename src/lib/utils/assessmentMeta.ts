export type AssessmentMeta = {
  slug: string;
  title: string;
  description: string;
};

export const assessments: AssessmentMeta[] = [
  {
    slug: "sales",
    title: "Sales Performance",
    description: "Evaluate your sales pipeline and conversions."
  },
  {
    slug: "bpm",
    title: "Business Process Maturity",
    description: "Assess how structured and scalable your workflows are."
  },
  {
    slug: "tech",
    title: "Technology Stack",
    description: "Analyze your current tech stack and identify gaps."
  },
  {
    slug: "ai",
    title: "AI Readiness",
    description: "Measure your organization's readiness for AI adoption."
  },
  {
    slug: "strategy",
    title: "Strategic Maturity",
    description: "Evaluate your organization's strategic planning and alignment."
  },
  {
    slug: "marketing",
    title: "Marketing Effectiveness",
    description: "Assess your marketing reach, engagement, and impact."
  },
  {
    slug: "customer",
    title: "Customer Experience",
    description: "Measure satisfaction and consistency across customer touchpoints."
  },
  {
    slug: "digital",
    title: "Digital Transformation Readiness",
    description: "Evaluate how prepared your org is for digital innovation."
  },
  {
    slug: "leadership",
    title: "Leadership & Team Performance",
    description: "Identify leadership alignment and team dynamics."
  },
  {
    slug: "growth",
    title: "Competitive Benchmarking",
    description: "Compare your business performance against top performers."
  },
  {
    slug: "reassessment",
    title: "Business Reassessment",
    description: "Track changes since your initial evaluation."
  }
]; 