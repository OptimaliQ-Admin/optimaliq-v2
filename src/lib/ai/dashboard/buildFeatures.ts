import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export interface OnboardingFeatures {
  industry: string;
  companySize?: string;
  revenueRange?: string;
  processMaturityLevel: number; // 1-5
  techMaturityLevel: number; // 1-5
  decisionDisciplineLevel: number; // 1-5
  alignmentLevel: number; // 1-5
  hasFundingConstraints: boolean;
  hasBrandPositioningGap: boolean;
  hasAdHocProcesses: boolean;
  channelsCount: number;
  toolsCount: number;
  priorities: string[];
  rawAnswers: Record<string, unknown>;
}

function mapMaturity(text?: string | null): number {
  if (!text) return 3;
  const t = text.toLowerCase();
  if (t.includes("ad hoc")) return 1.5;
  if (t.includes("basic") || t.includes("still selecting")) return 2.2;
  if (t.includes("defined") || t.includes("core platforms in place")) return 3.0;
  if (t.includes("optimized") || t.includes("integrated")) return 4.0;
  if (t.includes("world-class")) return 4.8;
  return 3.0;
}

function mapDecision(text?: string | null): number {
  if (!text) return 3;
  const t = text.toLowerCase();
  if (t.includes("gut")) return 2.0;
  if (t.includes("some data")) return 3.0;
  if (t.includes("data-driven") || t.includes("metrics")) return 4.0;
  return 3.0;
}

function mapAlignment(text?: string | null): number {
  if (!text) return 3;
  const t = text.toLowerCase();
  if (t.includes("misalignment")) return 2.2;
  if (t.includes("some alignment")) return 3.0;
  if (t.includes("well-aligned") || t.includes("strong alignment")) return 4.2;
  return 3.0;
}

export function buildOnboardingFeatures(user: any, onboardingSession: any): OnboardingFeatures {
  const m = (onboardingSession?.metadata ?? {}) as Record<string, any>;
  const industry = (user?.industry ?? "general").toString().trim().toLowerCase();

  const processMaturityLevel = mapMaturity(m.process_maturity as string);
  const techMaturityLevel = mapMaturity(m.tech_maturity as string);
  const decisionDisciplineLevel = mapDecision(m.strategic_decision_making as string);
  const alignmentLevel = mapAlignment(m.team_alignment as string);

  const hasFundingConstraints =
    (Array.isArray(m.friction_points_insights?.challenges) && m.friction_points_insights.challenges.includes("funding_constraints")) ||
    (typeof m.capital_funding_status === "string" && m.capital_funding_status.toLowerCase().startsWith("no"));

  const hasBrandPositioningGap =
    Array.isArray(m.friction_points) && m.friction_points.some((x: string) => /brand positioning/i.test(x));

  const hasAdHocProcesses = typeof m.process_maturity === "string" && m.process_maturity.toLowerCase().includes("ad hoc");

  const channelsCount = Array.isArray(m.acquisition_channels) ? m.acquisition_channels.length : 0;
  const toolsCount = Array.isArray(m.tech_stack_overview) ? m.tech_stack_overview.length : 0;
  const priorities = Array.isArray(m.business_priorities) ? m.business_priorities : [];

  return {
    industry,
    companySize: user?.company_size,
    revenueRange: user?.revenue_range,
    processMaturityLevel,
    techMaturityLevel,
    decisionDisciplineLevel,
    alignmentLevel,
    hasFundingConstraints,
    hasBrandPositioningGap,
    hasAdHocProcesses,
    channelsCount,
    toolsCount,
    priorities,
    rawAnswers: m.business_overview ?? m,
  };
}


