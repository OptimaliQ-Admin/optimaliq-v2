import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";

export async function submitAssessment(
  u_id: string,
  assessmentType: string,
  answers: Record<string, any>
) {
  try {
    const { data, error } = await supabase
      .from("assessment_answers")
      .insert([
        {
          u_id,
          assessment_type: assessmentType,
          answers,
        },
      ])
      .select();

    if (error) {
      showToast.error(`Error submitting assessment: ${error.message}`);
      throw error;
    }

    showToast.success("Assessment submitted successfully!");
    return data;
  } catch (error) {
    showToast.error("Failed to submit assessment. Please try again.");
    throw error;
  }
}

export async function getAssessmentAnswers(u_id: string, assessmentType: string) {
  try {
    const { data, error } = await supabase
      .from("assessment_answers")
      .select("*")
      .eq("u_id", u_id)
      .eq("assessment_type", assessmentType)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      showToast.error(`Error fetching assessment answers: ${error.message}`);
      throw error;
    }

    return data?.[0];
  } catch (error) {
    showToast.error("Failed to fetch assessment answers. Please try again.");
    throw error;
  }
} 