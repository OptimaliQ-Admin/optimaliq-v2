import {
  type AssessmentAnswers,
} from "@/lib/types/AssessmentAnswers";// File: refactor/src/utils/stripOtherFields.ts

/**
 * Removes any *_other keys and appends cleaned "Other" values to base field.
 * This ensures only meaningful user responses are stored/submitted.
 */
export function stripOtherFields(answers: AssessmentAnswers): AssessmentAnswers {
    const result: AssessmentAnswers = {};
  
    for (const key in answers) {
      if (key.endsWith("_other")) continue; // skip _other fields
  
      const value = answers[key];
  
      // Handle appending "Other:" values if present
      if (Array.isArray(value)) {
        const otherKey = `${key}_other`;
        const otherValue = answers[otherKey];
  
        const cleaned = value.filter((item: string) => !item.startsWith("Other:"));
  
        if (otherValue && typeof otherValue === "string" && otherValue.trim()) {
          cleaned.push(`Other: ${otherValue.trim()}`);
        }
  
        result[key] = cleaned;
      } else {
        result[key] = value;
      }
    }
  
    return result;
  }
  