import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { emailService } from "@/lib/emailService";

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

    // Get delegation with pulse details
    const { data: delegation, error: delegationError } = await supabase
      .from('pulse_delegations')
      .select(`
        *,
        strategic_pulses (
          id,
          title,
          department,
          areas_of_focus,
          questions
        )
      `)
      .eq('delegation_token', token)
      .single();

    if (delegationError || !delegation) {
      return NextResponse.json(
        { error: "Invalid or expired delegation token" },
        { status: 404 }
      );
    }

    // Check if delegation is expired
    if (new Date() > new Date(delegation.expires_at)) {
      return NextResponse.json(
        { error: "Delegation token has expired" },
        { status: 410 }
      );
    }

    // Check if delegation is already completed
    if (delegation.status === 'completed') {
      return NextResponse.json(
        { error: "Delegation has already been completed" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      delegation: {
        id: delegation.id,
        delegateEmail: delegation.delegate_email,
        delegateName: delegation.delegate_name,
        status: delegation.status,
        expiresAt: delegation.expires_at
      },
      pulse: delegation.strategic_pulses
    });

  } catch (error) {
    console.error("Error getting delegation:", error);
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
    const { teamMembers } = await req.json();

    if (!token || !teamMembers || !Array.isArray(teamMembers)) {
      return NextResponse.json(
        { error: "Token and team members array are required" },
        { status: 400 }
      );
    }

    // Get delegation
    const { data: delegation, error: delegationError } = await supabase
      .from('pulse_delegations')
      .select('*')
      .eq('delegation_token', token)
      .single();

    if (delegationError || !delegation) {
      return NextResponse.json(
        { error: "Invalid delegation token" },
        { status: 404 }
      );
    }

    // Check if delegation is expired
    if (new Date() > new Date(delegation.expires_at)) {
      return NextResponse.json(
        { error: "Delegation token has expired" },
        { status: 410 }
      );
    }

    // Mark delegation as completed
    const { error: updateError } = await supabase
      .from('pulse_delegations')
      .update({ status: 'completed' })
      .eq('id', delegation.id);

    if (updateError) {
      console.error("Error updating delegation:", updateError);
      return NextResponse.json(
        { error: "Failed to update delegation" },
        { status: 500 }
      );
    }

    // Create response records for each team member with unique tokens
    const responseRecords = teamMembers.map((member: any) => ({
      delegation_id: delegation.id,
      respondent_email: member.email,
      respondent_name: member.name,
      response_token: crypto.randomBytes(32).toString('hex'),
      answers: {}
    }));

    if (responseRecords.length > 0) {
      const { data: createdResponses, error: responsesError } = await supabase
        .from('pulse_responses')
        .insert(responseRecords)
        .select();

      if (responsesError) {
        console.error("Error creating responses:", responsesError);
        // Don't fail the request if responses fail
      } else if (createdResponses) {
        // Send individual response emails to team members
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
          
          for (const response of createdResponses) {
            const responseUrl = `${baseUrl}/pulse/respond/${response.response_token}`;
            
            await emailService.sendPulseResponseEmail({
              to: response.respondent_email,
              respondentName: response.respondent_name,
              pulseTitle: delegation.strategic_pulses?.title || 'Strategic Pulse Check',
              responseUrl
            });
          }
        } catch (emailError) {
          console.error("Error sending response emails:", emailError);
          // Don't fail the request if emails fail
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Team members assigned successfully"
    });

  } catch (error) {
    console.error("Error assigning team members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 