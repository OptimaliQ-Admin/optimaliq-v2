//src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { buildOnboardingFeatures } from "@/lib/ai/dashboard/buildFeatures";
import { scoreFromFeatures } from "@/lib/ai/dashboard/scoreFromFeatures";
import { benchmarkFromScores } from "@/lib/ai/dashboard/benchmarkFromScores";
import { swFromAnswers } from "@/lib/ai/dashboard/swFromAnswers";
import { roadmapFromSw } from "@/lib/ai/dashboard/roadmapFromSw";
import { generateSWAndRoadmap } from "@/lib/ai/dashboard/generateSWAndRoadmap";
import { saveAssessmentResults } from "@/lib/sync/saveAssessmentResults";
import { recordTelemetry } from "@/lib/sync/aiTelemetry";
import { generateScoresWithLLM } from "@/lib/ai/dashboard/generateScoring";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";
import { getErrorMessage } from "@/utils/errorHandler";


export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json(
        { error: "Invalid or missing u_id" },
        { status: 400 }
      );
    }

    // Fetch user profile from new users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", u_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch latest onboarding session (replaces onboarding_sessions)
    const { data: onboardingSession, error: onboardingError } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("user_id", u_id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (onboardingError || !onboardingSession) {
      return NextResponse.json(
        { error: "No completed onboarding session found" },
        { status: 404 }
      );
    }

    // Read exclusively from compatibility view (normalized pipeline)
    const { data: insights } = await supabase
      .from("tier2_dashboard_insights_v")
      .select("*")
      .eq("u_id", u_id)
      .maybeSingle();

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const updatedAt = insights?.updated_at ? new Date(insights.updated_at) : null;
    let needsRefresh = !updatedAt || updatedAt < thirtyDaysAgo;
    
    // 🔍 Check if there are newer onboarding scores that haven't been synced
    if (insights && onboardingSession.metadata?.has_ai_scores) {
      const onboardingScoreDate = new Date(onboardingSession.metadata.ai_scores_generated_at || onboardingSession.completed_at);
      const dashboardScoreDate = new Date(insights.updated_at);
      
      if (onboardingScoreDate > dashboardScoreDate) {
        console.log("🔄 Newer onboarding scores detected, forcing refresh...");
        needsRefresh = true;
      }
    }

    if (!needsRefresh) {
      const normalized = {
        ...insights,
        strategy_score: Number(insights.strategy_score),
        process_score: Number(insights.process_score),
        technology_score: Number(insights.technology_score),
        overall_score: Number(insights.overall_score),
        industryAvgScore: Number(insights.industryAvgScore),
        topPerformerScore: Number(insights.topPerformerScore),
        chartData: Array.isArray((insights as any)?.chartData) ? (insights as any).chartData : [],
        score: Number((insights as any).overall_score ?? (insights as any).score),
        industry: user.industry?.trim().toLowerCase(),
        promptRetake: false,
      } as any;
      return NextResponse.json(normalized);
    }

    // Check if onboarding session already has AI-generated scores
    let aiScores;
    if (onboardingSession.metadata?.has_ai_scores && onboardingSession.metadata?.score && onboardingSession.metadata?.fallback_used !== true) {
      console.log("✅ Using pre-generated scores from onboarding session");
      
      const storedScores = {
        strategy_score: onboardingSession.metadata.strategy_score,
        process_score: onboardingSession.metadata.process_score,
        technology_score: onboardingSession.metadata.technology_score,
        score: onboardingSession.metadata.score,
        industryAvgScore: onboardingSession.metadata.industryAvgScore,
        topPerformerScore: onboardingSession.metadata.topPerformerScore,
        benchmarking: onboardingSession.metadata.benchmarking,
        strengths: onboardingSession.metadata.strengths,
        weaknesses: onboardingSession.metadata.weaknesses,
        roadmap: onboardingSession.metadata.roadmap,
      };

      console.log("🧪 Using stored scores:", JSON.stringify(storedScores, null, 2));
      
      // Use stored scores instead of regenerating
      aiScores = storedScores;
      
      // 🔄 SYNC: Update the legacy dashboard insights table with new data
      console.log("🔄 Syncing new scores to legacy dashboard table...");
      const syncPayload = {
        u_id,
        strategy_score: storedScores.strategy_score,
        process_score: storedScores.process_score,
        technology_score: storedScores.technology_score,
        overall_score: storedScores.score,
        score: storedScores.score, // Add score field for frontend compatibility
        industryAvgScore: storedScores.industryAvgScore,
        topPerformerScore: storedScores.topPerformerScore,
        benchmarking: storedScores.benchmarking,
        strengths: storedScores.strengths,
        weaknesses: storedScores.weaknesses,
        roadmap: storedScores.roadmap,
        chartData: [
          { month: "Now", userScore: storedScores.score, industryScore: storedScores.industryAvgScore, topPerformerScore: storedScores.topPerformerScore },
          { month: "3 Months", userScore: Math.min(5, storedScores.score + 0.5), industryScore: storedScores.industryAvgScore, topPerformerScore: storedScores.topPerformerScore },
          { month: "6 Months", userScore: Math.min(5, storedScores.score + 1), industryScore: storedScores.industryAvgScore, topPerformerScore: storedScores.topPerformerScore },
          { month: "12 Months", userScore: Math.min(5, storedScores.score + 2), industryScore: storedScores.industryAvgScore, topPerformerScore: storedScores.topPerformerScore },
        ],
        updated_at: new Date().toISOString(),
        industry: user.industry?.trim().toLowerCase(),
      };
      
      // Dual-write: legacy and normalized
      const { error: syncError } = await supabase
        .from("tier2_dashboard_insights")
        .upsert([syncPayload], { onConflict: "u_id" });
      await saveAssessmentResults({
        userId: u_id,
        sessionId: onboardingSession.id,
        scores: {
          strategy_score: storedScores.strategy_score,
          process_score: storedScores.process_score,
          technology_score: storedScores.technology_score,
          score: storedScores.score,
          versions: { feature_version: "v1", prompt_version: onboardingSession.metadata?.ai_details?.prompt_version ?? null, model_version: onboardingSession.metadata?.ai_details?.model_version ?? null },
          ai_details: onboardingSession.metadata?.ai_details ?? {},
        },
        insights: {
          benchmarking: storedScores.benchmarking,
          strengths: storedScores.strengths,
          weaknesses: storedScores.weaknesses,
          roadmap: storedScores.roadmap,
        },
        industry: user.industry?.trim().toLowerCase(),
      });
    } else {
      console.log("🔄 No pre-generated scores found, running structured pipeline...");
      // Generate AI scores using onboarding features/deterministic fallback
      const t0 = Date.now();
      const features = buildOnboardingFeatures(user as any, onboardingSession as any);
      await recordTelemetry({ userId: u_id, sessionId: onboardingSession.id, stage: "features", featureVersion: "v1", success: true, durationMs: Date.now() - t0 });
      const deterministicScores = scoreFromFeatures(features);

      // Try LLM scoring; if fails, fall back to deterministic
      let llmScores = null as any;
      try {
        const t1 = Date.now();
        const llmValidated = await generateScoresWithLLM({
          industry: (user.industry || "general").toLowerCase(),
          features: features as any,
          answers: features.rawAnswers || {},
        });
        if (llmValidated) {
          llmScores = llmValidated;
        }
        await recordTelemetry({ userId: u_id, sessionId: onboardingSession.id, stage: "scoring", usedModel: "openai", promptVersion: "v1", featureVersion: "v1", success: true, durationMs: Date.now() - t1 });
      } catch {}

      const finalScores = llmScores ?? deterministicScores;
      const benchmarks = benchmarkFromScores({
        strategy_score: finalScores.strategy_score,
        process_score: finalScores.process_score,
        technology_score: finalScores.technology_score,
      }, features.industry);
      let sw = swFromAnswers(features.rawAnswers || {});
      let roadmap = roadmapFromSw(sw.weaknesses, features.industry);
      // Try LLM refinement for SW and Roadmap with McKinsey tone
      try {
        const t2 = Date.now();
        const refined = await generateSWAndRoadmap({
          industry: features.industry,
          answers: features.rawAnswers || {},
          businessOverview: (onboardingSession.metadata?.business_overview?.business_description) || user.business_overview || ""
        });
        if (refined) {
          sw = { strengths: refined.strengths, weaknesses: refined.weaknesses } as any;
          roadmap = refined.roadmap as any;
        }
        await recordTelemetry({ userId: u_id, sessionId: onboardingSession.id, stage: "insights", usedModel: "openai", promptVersion: "v1", featureVersion: "v1", success: true, durationMs: Date.now() - t2 });
      } catch {}

      aiScores = {
        strategy_score: finalScores.strategy_score,
        process_score: finalScores.process_score,
        technology_score: finalScores.technology_score,
        score: finalScores.score,
        industryAvgScore: 3.2,
        topPerformerScore: 4.5,
        benchmarking: benchmarks,
        strengths: sw.strengths,
        weaknesses: sw.weaknesses,
        roadmap,
      };

      // Persist ai_details for transparency
      const computedConfidence = (finalScores as any).confidence ?? 0.75;
      const computedModelVersion = llmScores ? "gpt-4.1-mini" : "deterministic-v1";
      const computedPromptVersion = llmScores ? "v1" : null;

      await supabase.from("onboarding_sessions").update({
        metadata: {
          ...onboardingSession.metadata,
          ai_details: {
            feature_version: "v1",
            model_version: computedModelVersion,
            prompt_version: computedPromptVersion,
            confidence: computedConfidence,
            explanations: (finalScores as any).explanations ?? {},
          }
        }
      }).eq("id", onboardingSession.id);

      console.log(
        "🧪 Final AI scores returned to dashboard route:",
        JSON.stringify(aiScores, null, 2)
      );
      if (aiScores) {
        console.log("🧪 Types:", {
          benchmarking: typeof aiScores.benchmarking,
          strengths: Array.isArray(aiScores.strengths),
          weaknesses: Array.isArray(aiScores.weaknesses),
          roadmap: Array.isArray(aiScores.roadmap),
        });
      }

      if (!aiScores) {
        return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
      }
    }

    console.info("🧠 AI Scores Generated:", aiScores);

    const chartData = [
      {
        month: "Now",
        userScore: aiScores.score ?? 3.0,
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
      {
        month: "3 Months",
        userScore: Math.min(4.6, (aiScores.score ?? 3.0) + 0.3),
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
      {
        month: "6 Months",
        userScore: Math.min(4.6, (aiScores.score ?? 3.0) + 0.6),
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
      {
        month: "9 Months",
        userScore: Math.min(4.6, (aiScores.score ?? 3.0) + 0.9),
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
      {
        month: "12 Months",
        userScore: Math.min(4.6, (aiScores.score ?? 3.0) + 1.2),
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
      {
        month: "15 Months",
        userScore: Math.min(4.6, (aiScores.score ?? 3.0) + 1.5),
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
      {
        month: "18 Months",
        userScore: Math.min(4.6, (aiScores.score ?? 3.0) + 1.8),
        industryScore: aiScores.industryAvgScore ?? 3.2,
        topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      },
    ];

    const payload = {
      u_id,
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      overall_score: aiScores.score,
      score: aiScores.score, // Add score field for frontend compatibility
      industryAvgScore: aiScores.industryAvgScore ?? 3.2,
      topPerformerScore: aiScores.topPerformerScore ?? 4.5,
      benchmarking: aiScores.benchmarking ?? { strategy: "", process: "", technology: "" },
      strengths: Array.isArray(aiScores.strengths) ? aiScores.strengths : [],
      weaknesses: Array.isArray(aiScores.weaknesses) ? aiScores.weaknesses : [],
      roadmap: Array.isArray(aiScores.roadmap) ? aiScores.roadmap : [],
      chartData,
      updated_at: now.toISOString(),
      industry: user.industry?.trim().toLowerCase(),
      model_version: (onboardingSession.metadata?.ai_details?.model_version) ?? undefined,
      prompt_version: (onboardingSession.metadata?.ai_details?.prompt_version) ?? undefined,
      confidence: (onboardingSession.metadata?.ai_details?.confidence) ?? undefined,
    };
    // Save to legacy
    const { error: upsertError } = await supabase
      .from("tier2_dashboard_insights")
      .upsert([payload], { onConflict: "u_id" });
    // Also save normalized
    await saveAssessmentResults({
      userId: u_id,
      sessionId: onboardingSession.id,
      scores: {
        strategy_score: aiScores.strategy_score,
        process_score: aiScores.process_score,
        technology_score: aiScores.technology_score,
        score: aiScores.score,
        confidence: (onboardingSession.metadata?.ai_details?.confidence) ?? 0.75,
        versions: { 
          feature_version: "v1", 
          prompt_version: onboardingSession.metadata?.ai_details?.prompt_version ?? null, 
          model_version: onboardingSession.metadata?.ai_details?.model_version ?? "deterministic-v1" 
        },
        ai_details: onboardingSession.metadata?.ai_details ?? {},
      },
      insights: {
        benchmarking: aiScores.benchmarking,
        strengths: aiScores.strengths,
        weaknesses: aiScores.weaknesses,
        roadmap: aiScores.roadmap,
      },
      industry: user.industry?.trim().toLowerCase(),
    });

    // Save summary to profile
    await saveProfileScores(supabase, u_id, {
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      base_score: aiScores.score,
    });

    console.info("📦 Dashboard & profile saved for:", u_id);

    return NextResponse.json({ ...payload, promptRetake: false });
  } catch (err: unknown) {
    console.error("🔥 Dashboard API error:", err);
    return NextResponse.json(
      { error: "Server error", detail: getErrorMessage(err) },
      { status: 500 }
    );
  }
}
