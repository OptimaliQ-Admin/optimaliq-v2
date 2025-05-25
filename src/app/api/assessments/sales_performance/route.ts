//src/app/api//premium/assessment/sales_performance/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import salesPerformanceScoringMap from "@/app/api/assessments/data/sales_scoring_map.json";
import { logAssessmentInput, logAssessmentScore, logAssessmentError, logAssessmentDebug } from "@/lib/utils/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const scoringMap = salesPerformanceScoringMap as ScoringMap;

// Update semantic key mapping to use new keys
const salesSemanticToObfuscatedKeyMap: Record<string, Record<string, string>> = {
  "score_1": {
    "lead_generation": "lead_generation",
    "sales_process": "sales_process",
    "pipeline_tracking": "pipeline_tracking",
    "sales_team": "sales_team",
    "follow_ups": "follow_ups",
    "lead_qualification": "lead_qualification",
    "pricing_proposals": "pricing_proposals",
    "sales_metrics": "sales_metrics"
  },
  "score_1_5": {
    "lead_assignment": "lead_assignment",
    "forecast_confidence": "forecast_confidence",
    "pipeline_review": "pipeline_review",
    "sales_discovery": "sales_discovery",
    "deal_progression": "deal_progression",
    "stage_consistency": "stage_consistency"
  },
  "score_2": {
    "sales_stages": "sales_stages",
    "pipeline_accuracy": "pipeline_accuracy",
    "lead_prioritization": "lead_prioritization",
    "followup_management": "followup_management",
    "sales_preparation": "sales_preparation",
    "call_documentation": "call_documentation",
    "handoff_process": "handoff_process"
  },
  "score_2_5": {
    "activity_tracking": "activity_management",
    "sales_targets": "sales_targets",
    "sales_reporting": "reporting_system",
    "strategy_adjustment": "strategy_adjustment",
    "pipeline_review_frequency": "performance_review",
    "deal_insights": "sales_communication",
    "stage_consistency": "pipeline_management"
  },
  "score_3": {
    "deal_velocity": "deal_velocity",
    "forecast_accuracy": "forecast_accuracy",
    "sales_optimization": "sales_optimization",
    "performance_analytics": "performance_analytics",
    "sales_metrics": "sales_metrics",
    "pricing_strategy": "pricing_strategy"
  },
  "score_3_5": {
    "roi_measurement": "roi_measurement",
    "sales_effectiveness": "sales_effectiveness",
    "sales_optimization": "sales_optimization",
    "performance_monitoring": "performance_monitoring",
    "sales_analytics": "sales_analytics",
    "pricing_optimization": "pricing_optimization"
  },
  "score_4": {
    "data_driven_strategy": "data_driven_strategy",
    "sales_methodology": "sales_methodology",
    "sales_intelligence": "sales_intelligence",
    "resource_allocation": "resource_allocation",
    "lead_scoring": "lead_scoring",
    "process_adaptation": "process_adaptation"
  },
  "score_4_5": {
    "team_capacity": "team_capacity",
    "sales_experimentation": "sales_experimentation",
    "sales_insights": "sales_insights",
    "resource_planning": "resource_planning",
    "lead_evaluation": "lead_evaluation",
    "process_evolution": "process_evolution"
  },
  "score_5": {
    "customer_feedback": "customer_feedback",
    "sales_culture": "sales_culture",
    "sales_automation": "sales_automation",
    "resource_strategy": "resource_strategy",
    "opportunity_assessment": "opportunity_assessment",
    "process_innovation": "process_innovation"
  }
};

// Add value mapping for backward compatibility
const valueMapping: Record<string, Record<string, string>> = {
  "lead_generation": {
    "referrals": "referrals_only",
    "occasional_outreach": "occasional_outreach",
    "digital_inquiries": "digital_channels",
    "no_consistent_method": "no_consistent_method"
  },
  "sales_process": {
    "no_process": "no_process",
    "loose_outline": "loose_outline",
    "key_steps": "key_steps",
    "defined_process": "defined_process"
  }
  // Add more mappings as needed
};

// Update value mapping for semantic answers
const salesAnswerValueMap: Record<string, Record<string, string>> = {
  // Score 2.5 mappings (most relevant for current issue)
  "activity_management": {
    "no_tracking": "no_activity_tracking",
    "manual_spreadsheet": "manual_activity_log",
    "basic_crm": "basic_activity_crm",
    "automated": "automated_activity"
  },
  "sales_targets": {
    "no_targets": "no_sales_targets",
    "basic_goals": "basic_team_targets",
    "individual_targets": "individual_targets",
    "detailed_kpis": "detailed_kpi_targets"
  },
  "reporting_system": {
    "no_reporting": "no_sales_reports",
    "basic_reports": "basic_sales_reports",
    "monthly_metrics": "monthly_sales_reports",
    "real_time": "real_time_sales_reports"
  },
  "strategy_adjustment": {
    "reactive": "reactive_strategy",
    "ad_hoc": "ad_hoc_strategy",
    "regular_reviews": "regular_strategy_review",
    "structured": "structured_strategy"
  },
  "performance_review": {
    "no_review": "no_performance_review",
    "occasional": "occasional_review",
    "weekly": "weekly_review",
    "structured": "structured_review"
  },
  "sales_communication": {
    "call_recordings": "sales_call_records",
    "chat_messages": "sales_chat_history",
    "crm_notes": "sales_crm_notes",
    "deal_reviews": "sales_deal_reviews"
  },
  "pipeline_management": {
    "skip_stages": "skip_pipeline_stages",
    "some_steps": "partial_pipeline",
    "track_movement": "track_pipeline",
    "stage_by_stage": "stage_by_stage"
  }
};

function getBracket(score: number): keyof ScoringMap {
  if (score >= 1 && score <= 1.4) return "score_1";
  if (score >= 1.5 && score <= 1.9) return "score_1_5";
  if (score >= 2 && score <= 2.4) return "score_2";
  if (score >= 2.5 && score <= 2.9) return "score_2_5";
  if (score >= 3 && score <= 3.4) return "score_3";
  if (score >= 3.5 && score <= 3.9) return "score_3_5";
  if (score >= 4 && score <= 4.4) return "score_4";
  if (score >= 4.5 && score <= 4.9) return "score_4_5";
  return "score_5";
}

export async function POST(request: Request) {
  try {
    const { answers, score, userId } = await request.json();

    // Log incoming request data
    logAssessmentInput('sales_performance', { userId, score, answers });

    if (!answers || !score || !userId) {
      const error = { error: "Missing required fields", details: { answers, score, userId } };
      logAssessmentError('sales_performance', error);
      return NextResponse.json(error, { status: 400 });
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    // Log selected bracket
    logAssessmentDebug('sales_performance', { bracket, bracketScoring });

    if (!bracketScoring) {
      const error = { error: "Invalid score bracket", details: { bracket, score } };
      logAssessmentError('sales_performance', error);
      return NextResponse.json(error, { status: 400 });
    }

    // Update the mapping logic in the POST handler
    const mappedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      // Map semantic keys to scoring map keys using the current bracket
      const bracketMap = salesSemanticToObfuscatedKeyMap[bracket] || {};
      const scoringKey = bracketMap[key] || key;
      acc[scoringKey] = value;
      return acc;
    }, {} as Record<string, any>);

    // Filter answers to only include keys from the scoring map
    const bracketScoringKeys = Object.keys(bracketScoring);
    const filteredAnswers = Object.fromEntries(
      Object.entries(mappedAnswers).filter(([key]) => bracketScoringKeys.includes(key))
    );

    // Log filtered answers and missing keys
    logAssessmentDebug('sales_performance', {
      originalAnswers: answers,
      mappedAnswers,
      filteredAnswers,
      missingKeys: Object.keys(mappedAnswers).filter(key => !bracketScoringKeys.includes(key))
    });

    let total = 0;
    let weightSum = 0;

    // Track scoring issues for debugging
    const scoringIssues = {
      unmatchedKeys: [] as string[],
      typeMismatches: [] as { key: string; expected: string; received: string }[],
      defaultedScores: [] as { 
        key: string; 
        answer: any; 
        reason: string;
        mappedValue?: string;
        mappedSelections?: string[];
      }[]
    };

    for (const key in filteredAnswers) {
      const q = bracketScoring[key];
      if (!q) {
        scoringIssues.unmatchedKeys.push(key);
        logAssessmentDebug('sales_performance', {
          message: `No scoring config found for key: ${key}`,
          answer: filteredAnswers[key]
        });
        continue;
      }

      const answer = filteredAnswers[key];
      let valScore = 0;

      // Log type mismatches
      if (q.type === "multiple_choice" && Array.isArray(answer)) {
        scoringIssues.typeMismatches.push({
          key,
          expected: "string",
          received: "array"
        });
      } else if (q.type === "multi_select" && !Array.isArray(answer) && typeof answer !== 'string') {
        scoringIssues.typeMismatches.push({
          key,
          expected: "array or string",
          received: typeof answer
        });
      }

      if (q.type === "multiple_choice") {
        // Map old values to new semantic values if needed
        const valueMap = salesAnswerValueMap[key];
        const rawValue = mappedAnswers[key];
        const mappedValue = valueMap ? valueMap[rawValue as string] : rawValue;
        valScore = q.values[mappedValue as string] || 0;
        
        if (valScore === 0) {
          scoringIssues.defaultedScores.push({
            key,
            answer: rawValue,
            mappedValue,
            reason: `No matching value in scoring map. Available values: ${Object.keys(q.values).join(', ')}`
          });
          logAssessmentDebug('sales_performance', {
            message: `No score found for multiple choice answer`,
            key,
            rawValue,
            mappedValue,
            availableValues: Object.keys(q.values)
          });
        }
      }

      if (q.type === "multi_select") {
        try {
          const selections: string[] = Array.isArray(mappedAnswers[key]) 
            ? mappedAnswers[key] 
            : JSON.parse(mappedAnswers[key] as string);
          
          // Map old values to new semantic values if needed
          const valueMap = salesAnswerValueMap[key];
          const mappedSelections = valueMap 
            ? selections.map(s => valueMap[s] || s)
            : selections;
            
          const scores = mappedSelections.map((s) => q.values[s] || 0);
          valScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          
          if (valScore === 0) {
            scoringIssues.defaultedScores.push({
              key,
              answer: selections,
              mappedSelections,
              reason: `No matching values in scoring map. Available values: ${Object.keys(q.values).join(', ')}`
            });
            logAssessmentDebug('sales_performance', {
              message: `No scores found for multi-select answers`,
              key,
              selections,
              mappedSelections,
              availableValues: Object.keys(q.values)
            });
          }
        } catch (e) {
          scoringIssues.defaultedScores.push({
            key,
            answer: mappedAnswers[key],
            reason: `Failed to parse multi-select answer: ${e}`
          });
          logAssessmentDebug('sales_performance', {
            message: `Error processing multi-select answer`,
            key,
            answer: mappedAnswers[key],
            error: e
          });
          valScore = 0;
        }
      }

      if (valScore > 0) {
        total += valScore * q.weight;
        weightSum += q.weight;
      } else {
        console.warn(`Unscored answer for '${key}':`, answer);
      }
    }

    // Log all scoring issues at once
    if (scoringIssues.unmatchedKeys.length > 0 || 
        scoringIssues.typeMismatches.length > 0 || 
        scoringIssues.defaultedScores.length > 0) {
      logAssessmentDebug('sales_performance', {
        message: 'Scoring issues detected',
        issues: scoringIssues
      });
    }

    const raw = weightSum ? total / weightSum : 0;
    const normalized = Math.round((raw + Number.EPSILON) * 2) / 2;

    // Log computed score with scoring issues
    logAssessmentScore('sales_performance', { 
      bracket,
      totalScore: total,
      totalWeight: weightSum,
      normalizedScore: normalized,
      scoringIssues
    });

    // Ensure answers is a plain object before upserting
    const answersObject = typeof answers === 'string' ? JSON.parse(answers) : answers;

    // Upsert into sales_performance_assessment table using the full answers object
    const { error: assessmentError } = await supabase
      .from("sales_performance_assessment")
      .upsert({
        u_id: userId,
        answers: answersObject, // Properly insert as JSONB object
        score: normalized,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (assessmentError) {
      logAssessmentError('sales_performance', {
        error: "Failed to save assessment",
        details: assessmentError,
        attemptedData: {
          u_id: userId,
          answers: answersObject,
          score: normalized
        }
      });
      return NextResponse.json(
        { error: "Failed to save assessment", details: assessmentError },
        { status: 500 }
      );
    }

    // Insert into score_sales_performance table
    const { error: scoreError } = await supabase
      .from("score_sales_performance")
      .insert([
        {
          u_id: userId,
          gmf_score: score,
          bracket_key: bracket,
          score: normalized,
          answers: answersObject,
          version: "v1"
        }
      ]);

    if (scoreError) {
      logAssessmentError('sales_performance', {
        error: "Failed to save score_sales_performance",
        details: scoreError,
        attemptedData: {
          u_id: userId,
          gmf_score: score,
          bracket_key: bracket,
          score: normalized,
          answers: answersObject,
          version: "v1"
        }
      });
      // Do not return here, allow the main assessment to succeed
    }

    return NextResponse.json({ salesPerformanceScore: normalized });
  } catch (error) {
    logAssessmentError('sales_performance', {
      error: "Internal server error",
      details: error
    });
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
