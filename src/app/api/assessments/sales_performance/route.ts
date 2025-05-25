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

// Add semantic to obfuscated key mapping by bracket
const salesSemanticToObfuscatedKeyMap: Record<string, Record<string, string>> = {
  "score_1": {
    "lead_generation": "how_b5d8e7",
    "sales_process": "do_b7cc0a",
    "pipeline_tracking": "how_fee95e",
    "sales_team": "who_5d9558",
    "follow_ups": "how_454fc5",
    "lead_qualification": "which_01150c",
    "pricing_proposals": "how_142ca2"
  },
  "score_1_5": {
    "lead_assignment": "how_2c42b7",
    "forecast_confidence": "how_79028c",
    "pipeline_review": "how_47b050",
    "sales_discovery": "how_12d26c",
    "deal_progression": "how_1f869b",
    "stage_consistency": "how_c8eb2a"
  },
  "score_2": {
    "sales_stages": "how_64a8d1",
    "pipeline_accuracy": "how_7d8dcb",
    "lead_prioritization": "how_0fa447",
    "followup_tracking": "how_a76658",
    "sales_operations": "how_5589a0",
    "sales_preparation": "how_92a11d",
    "conversation_documentation": "how_1e24f7"
  },
  "score_2_5": {
    "activity_tracking": "how_b5793e",
    "sales_targets": "how_140f94",
    "sales_reporting": "how_3a6376",
    "strategy_adjustment": "how_4cd27c",
    "pipeline_review_frequency": "how_68cbdb",
    "deal_insights": "how_d30c39",
    "stage_consistency": "how_4a7d74"
  },
  "score_3": {
    "pipeline_stages": "how_c7b9f7",
    "pipeline_accuracy": "what_84c5f2",
    "opportunity_prioritization": "how_8f9d2a",
    "followup_management": "how_1a3b4c",
    "sales_metrics": "how_5d6e7f",
    "sales_preparation": "how_2d3e4f"
  },
  "score_3_5": {
    "sales_preparation": "how_4d1ff3",
    "interaction_documentation": "how_fe4a96",
    "delivery_handoff": "how_2e3f4g",
    "activity_tracking": "how_5f6g7h",
    "sales_targets": "how_8g9h0i",
    "sales_metrics": "how_4i5j6k"
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

    // Map old keys to new semantic keys
    const mappedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      // First map semantic keys to obfuscated keys for scoring using the current bracket
      const bracketMap = salesSemanticToObfuscatedKeyMap[bracket] || {};
      const obfuscatedKey = bracketMap[key] || key;
      acc[obfuscatedKey] = value;
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
        const valueMap = valueMapping[key];
        const mappedValue = valueMap ? valueMap[answer as string] : answer;
        valScore = q.values[mappedValue as string] || 0;
        
        if (valScore === 0) {
          scoringIssues.defaultedScores.push({
            key,
            answer,
            mappedValue,
            reason: `No matching value in scoring map. Available values: ${Object.keys(q.values).join(', ')}`
          });
          logAssessmentDebug('sales_performance', {
            message: `No score found for multiple choice answer`,
            key,
            answer,
            mappedValue,
            availableValues: Object.keys(q.values)
          });
        }
      }

      if (q.type === "multi_select") {
        try {
          const selections: string[] = Array.isArray(answer) ? answer : JSON.parse(answer as string);
          // Map old values to new semantic values if needed
          const valueMap = valueMapping[key];
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
            answer,
            reason: `Failed to parse multi-select answer: ${e}`
          });
          logAssessmentDebug('sales_performance', {
            message: `Error processing multi-select answer`,
            key,
            answer,
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
