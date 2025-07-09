import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Get response with pulse details
    const { data: response, error: responseError } = await supabase
      .from('pulse_responses')
      .select(`
        *,
        pulse_delegations (
          strategic_pulses (
            id,
            title,
            department,
            areas_of_focus,
            questions
          )
        )
      `)
      .eq('response_token', token)
      .single();

    if (responseError || !response) {
      return NextResponse.json(
        { error: "Invalid or expired response token" },
        { status: 404 }
      );
    }

    // Check if response is already submitted
    if (response.submitted_at) {
      return NextResponse.json(
        { error: "Response has already been submitted" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      response: {
        id: response.id,
        respondentName: response.respondent_name,
        respondentEmail: response.respondent_email,
        submittedAt: response.submitted_at
      },
      pulse: response.pulse_delegations.strategic_pulses
    });

  } catch (error) {
    console.error("Error getting response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const { answers } = await req.json();

    if (!token || !answers) {
      return NextResponse.json(
        { error: "Token and answers are required" },
        { status: 400 }
      );
    }

    // Get response
    const { data: response, error: responseError } = await supabase
      .from('pulse_responses')
      .select('*')
      .eq('response_token', token)
      .single();

    if (responseError || !response) {
      return NextResponse.json(
        { error: "Invalid response token" },
        { status: 404 }
      );
    }

    // Check if response is already submitted
    if (response.submitted_at) {
      return NextResponse.json(
        { error: "Response has already been submitted" },
        { status: 409 }
      );
    }

    // Update response with answers
    const { error: updateError } = await supabase
      .from('pulse_responses')
      .update({ 
        answers,
        submitted_at: new Date().toISOString()
      })
      .eq('id', response.id);

    if (updateError) {
      console.error("Error updating response:", updateError);
      return NextResponse.json(
        { error: "Failed to submit response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Response submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 