import { type AssessmentAnswers } from "../types/AssessmentAnswers";

export function stripUnusedOtherFields(answers: AssessmentAnswers): AssessmentAnswers {
  const result: AssessmentAnswers = { ...answers };
  
  // Remove any fields that end with "_other" if their corresponding main field is not "other"
  Object.keys(result).forEach((key) => {
    if (key.endsWith("_other")) {
      const mainKey = key.replace("_other", "");
      if (result[mainKey] !== "other") {
        delete result[key];
      }
    }
  });

  return result;
} 