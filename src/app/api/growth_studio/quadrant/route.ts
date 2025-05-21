// src/app/api/growth_studio/quadrant/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getErrorMessage } from "@/utils/errorHandler";
import { syncDashboardInsights } from "@/lib/sync/syncDashboardInsights";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json({ error: "u_id is required" }, { status: 400 });
    }

    // First, ensure dashboard insights are synced
    const syncSuccess = await syncDashboardInsights(supabase, u_id);
    if (!syncSuccess) {
      console.warn("⚠️ Failed to sync dashboard insights, proceeding with existing data");
    }

    // Fetch all dummy company quadrant data
    const { data: companies, error: companiesError } = await supabase
      .from("growth_quadrant_data")
      .select("label, strategy_score, process_score, technology_score, overall_score");

    if (companiesError) {
      console.error("❌ Failed to fetch quadrant data:", companiesError);
      return NextResponse.json({ error: "Failed to fetch quadrant data" }, { status: 500 });
    }

    if (!companies || companies.length === 0) {
      return NextResponse.json({ error: "No comparison data available" }, { status: 404 });
    }

    // Fetch current user's insight scores
    const { data: userData, error: userError } = await supabase
      .from("tier2_dashboard_insights")
      .select("strategy_score, process_score, technology_score, overall_score")
      .eq("u_id", u_id)
      .single();

    if (userError || !userData) {
      console.error("❌ Failed to fetch user data:", userError);
      return NextResponse.json({ error: "User data not found. Please complete the assessment first." }, { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedCompanies = companies.map(company => ({
      label: company.label,
      strategyScore: company.strategy_score,
      processScore: company.process_score,
      technologyScore: company.technology_score,
      score: company.overall_score
    }));

    const transformedUser = {
      strategyScore: userData.strategy_score,
      processScore: userData.process_score,
      technologyScore: userData.technology_score,
      score: userData.overall_score
    };

    return NextResponse.json({
      companies: transformedCompanies,
      user: transformedUser
    });
  } catch (err: unknown) {
    console.error("🔥 Unexpected error in quadrant API:", err);
    return NextResponse.json({ error: getErrorMessage(err) || "Unknown error" }, { status: 500 });
  }
}
