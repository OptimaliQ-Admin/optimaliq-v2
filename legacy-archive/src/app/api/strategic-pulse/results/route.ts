import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all pulses for the user with response data
    const { data: pulses, error: pulsesError } = await supabase
      .from('strategic_pulses')
      .select(`
        *,
        pulse_delegations (
          id,
          delegate_name,
          delegate_email,
          status,
          pulse_responses (
            id,
            respondent_name,
            respondent_email,
            answers,
            submitted_at
          )
        )
      `)
      .eq('owner_u_id', u_id)
      .order('created_at', { ascending: false });

    if (pulsesError) {
      console.error("Error fetching pulses:", pulsesError);
      return NextResponse.json(
        { error: "Failed to fetch pulse data" },
        { status: 500 }
      );
    }

    // Process and aggregate the data
    const processedPulses = pulses?.map((pulse: any) => {
      const totalResponses = pulse.pulse_delegations.reduce((acc: number, delegation: any) => {
        return acc + delegation.pulse_responses.length;
      }, 0);

      const submittedResponses = pulse.pulse_delegations.reduce((acc: number, delegation: any) => {
        return acc + delegation.pulse_responses.filter((r: any) => r.submitted_at).length;
      }, 0);

      // Calculate average scores for scale questions
      const scaleQuestions = pulse.questions.filter((q: any) => q.type === 'scale_1_5');
      const questionAverages: Record<string, number> = {};

      scaleQuestions.forEach((question: any) => {
        const scores: number[] = [];
        
        pulse.pulse_delegations.forEach((delegation: any) => {
          delegation.pulse_responses.forEach((response: any) => {
            if (response.submitted_at && response.answers && response.answers[question.id]) {
              const score = Number(response.answers[question.id]);
              if (!isNaN(score) && score >= 1 && score <= 5) {
                scores.push(score);
              }
            }
          });
        });

        if (scores.length > 0) {
          questionAverages[question.id] = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        }
      });

      // Collect text responses for analysis
      const textQuestions = pulse.questions.filter((q: any) => q.type === 'text');
      const textResponses: Record<string, string[]> = {};

      textQuestions.forEach((question: any) => {
        const responses: string[] = [];
        
        pulse.pulse_delegations.forEach((delegation: any) => {
          delegation.pulse_responses.forEach((response: any) => {
            if (response.submitted_at && response.answers && response.answers[question.id]) {
              const text = response.answers[question.id];
              if (text && text.trim().length > 0) {
                responses.push(text.trim());
              }
            }
          });
        });

        textResponses[question.id] = responses;
      });

      return {
        id: pulse.id,
        title: pulse.title,
        department: pulse.department,
        areas_of_focus: pulse.areas_of_focus,
        questions: pulse.questions,
        created_at: pulse.created_at,
        status: pulse.status,
        totalResponses,
        submittedResponses,
        completionRate: totalResponses > 0 ? (submittedResponses / totalResponses) * 100 : 0,
        questionAverages,
        textResponses,
        delegations: pulse.pulse_delegations.map((delegation: any) => ({
          id: delegation.id,
          delegateName: delegation.delegate_name,
          delegateEmail: delegation.delegate_email,
          status: delegation.status,
          responseCount: delegation.pulse_responses.length,
          submittedCount: delegation.pulse_responses.filter((r: any) => r.submitted_at).length
        }))
      };
    }) || [];

    return NextResponse.json({
      pulses: processedPulses
    });

  } catch (error) {
    console.error("Error in get pulse results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 