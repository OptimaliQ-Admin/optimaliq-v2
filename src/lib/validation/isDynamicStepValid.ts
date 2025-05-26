import { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

const validationConfig: Record<string, Record<number, string[]>> = {
  score_1: {
    0: ["task_consistency", "process_documentation", "team_training", "process_ownership", "process_questions", "process_confidence", "process_tools", "workflow_ownership", "process_improvement", "operations_approach"],
    1: ["process_standardization", "process_metrics", "process_automation", "process_improvement_frequency"],
    2: ["process_governance", "process_technology", "process_analytics"]
  },
  score_1_5: {
    0: ["process_standardization_1_5", "process_metrics_1_5", "process_automation_1_5"],
    1: ["process_standardization", "process_metrics", "process_automation", "process_improvement_frequency"],
    2: ["process_governance", "process_technology", "process_analytics"]
  },
  score_2: {
    0: ["process_standardization", "process_metrics", "process_automation", "process_improvement_frequency"],
    1: ["process_governance", "process_technology", "process_analytics"],
    2: ["process_optimization", "process_innovation", "process_culture"]
  },
  score_2_5: {
    0: ["process_governance_2_5", "process_technology_2_5", "process_analytics_2_5"],
    1: ["process_governance", "process_technology", "process_analytics"],
    2: ["process_optimization", "process_innovation", "process_culture"]
  },
  score_3: {
    0: ["process_governance", "process_technology", "process_analytics"],
    1: ["process_optimization", "process_innovation", "process_culture"],
    2: ["process_maturity", "process_excellence", "process_transformation"]
  },
  score_3_5: {
    0: ["process_optimization_3_5", "process_innovation_3_5", "process_culture_3_5"],
    1: ["process_optimization", "process_innovation", "process_culture"],
    2: ["process_maturity", "process_excellence", "process_transformation"]
  },
  score_4: {
    0: ["process_optimization", "process_innovation", "process_culture"],
    1: ["process_maturity", "process_excellence", "process_transformation"],
    2: ["process_maturity", "process_excellence", "process_transformation"]
  },
  score_4_5: {
    0: ["process_maturity_4_5", "process_excellence_4_5", "process_transformation_4_5"],
    1: ["process_maturity", "process_excellence", "process_transformation"],
    2: ["process_maturity", "process_excellence", "process_transformation"]
  },
  score_5: {
    0: ["process_maturity", "process_excellence", "process_transformation"],
    1: ["process_maturity", "process_excellence", "process_transformation"],
    2: ["process_maturity", "process_excellence", "process_transformation"]
  }
};

export const isDynamicStepValid = (
  score: number,
  step: number,
  formAnswers: AssessmentAnswers
): boolean => {
  // Normalize score to get the appropriate bracket
  const normalizedScore = normalizeScore(score);
  
  // Get the required questions for this step and score bracket
  const requiredQuestions = validationConfig[normalizedScore]?.[step] || [];
  
  // Check if all required questions have valid answers
  return requiredQuestions.every((questionKey) => {
    const answer = formAnswers[questionKey];
    
    // Handle different question types
    if (Array.isArray(answer)) {
      // For multi-select questions, check if at least one option is selected
      return answer.length > 0;
    }
    
    // For text area questions, allow empty strings
    if (questionKey === "process_improvement") {
      return true;
    }
    
    // For all other questions, check for non-empty values
    return answer !== undefined && answer !== null && answer !== "";
  });
};

const normalizeScore = (score: number): string => {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}; 