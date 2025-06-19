import { NextResponse } from "next/server";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";

export async function GET() {
  const mockUser = {
    industry: "Consulting",
    company_size: "11-50",
    revenue_range: "$100K-$500K",
  };

  const mockAssessment = {
    growth_metrics: "profit_margin,churn_rate",
    gtm_strategy: "This is a test",
    friction_points: "lack_funding,tech_stack_issues,brand_positioning",
    differentiator: "This is a test",
    brand_perception: "This is a test",
    business_priorities: "Profitability,Brand Equity,Growth,Efficiency,Innovation",
    tech_stack: "Salesforce,Mailchimp,Intercom",
    process_discipline: "2",
    acquisition_channels: "paid_media,partnerships,events",
    tech_maturity: "siloed",
    retention_strategy: "This is a test",
    decision_bottlenecks: "This is a test",
    team_alignment: "some_misalignment",
    future_success: "This is a test",
    benchmark_preferences: "revenue_growth,retention,industry_best_practices",
    funding_status: "not_planned",
    growth_pace: "25_50",
    unresolved_issue: "This is a test",
    final_confirmation: "yes_ready",
    business_overview: "We provide strategic consulting services to small and medium-sized businesses, helping them optimize their operations, improve customer experience, and scale their growth through data-driven insights and process improvements.",
  };

  try {
    const scores = await generateDashboardScores(mockUser, mockAssessment);

    if (!scores) {
      return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
    }

    console.log("🧪 Test GPT dashboard response:", JSON.stringify(scores, null, 2));

    return NextResponse.json(scores);
  } catch (err: unknown) {
    console.error("🔥 Error running test GPT dashboard:", err);
    return NextResponse.json({ error: "Test route error" }, { status: 500 });
  }
}
