import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { emailService } from "@/lib/emailService";
import crypto from "crypto";

// Assessment type configurations
const ASSESSMENT_CONFIGS = {
  sales: {
    title: "Sales Performance Assessment",
    description: "This assessment evaluates your sales pipeline, conversion rates, and sales effectiveness to identify opportunities for improvement."
  },
  bpm: {
    title: "Business Process Maturity Assessment",
    description: "This assessment analyzes your business processes and workflows to identify areas for optimization and scalability."
  },
  tech_stack: {
    title: "Technology Stack Assessment",
    description: "This assessment evaluates your current technology infrastructure and identifies gaps for digital transformation."
  },
  strategic_maturity: {
    title: "Strategic Maturity Assessment",
    description: "This assessment evaluates your organization's strategic planning and execution capabilities."
  },
  marketing_effectiveness: {
    title: "Marketing Effectiveness Assessment",
    description: "This assessment measures how well your marketing drives engagement and results."
  },
  ai_readiness: {
    title: "AI & Automation Readiness Assessment",
    description: "This assessment evaluates your organization's readiness to leverage AI and automation."
  },
  competitive_benchmarking: {
    title: "Competitive Benchmarking Assessment",
    description: "This assessment compares your business performance against industry standards."
  },
  customer_experience: {
    title: "Customer Experience Assessment",
    description: "This assessment evaluates customer satisfaction and experience across touchpoints."
  },
  digital_transformation: {
    title: "Digital Transformation Assessment",
    description: "This assessment evaluates your readiness for digital transformation success."
  },
  leadership: {
    title: "Leadership & Team Performance Assessment",
    description: "This assessment evaluates team alignment, leadership effectiveness, and culture."
  }
} as const;

export async function POST(req: Request) {
  try {
    const { assessmentType, inviteeEmail, inviteeName, customMessage } = await req.json();

    // Validate required fields
    if (!assessmentType || !inviteeEmail || !inviteeName) {
      return NextResponse.json({ 
        error: "Missing required fields: assessmentType, inviteeEmail, inviteeName" 
      }, { status: 400 });
    }

    // Validate assessment type
    if (!ASSESSMENT_CONFIGS[assessmentType as keyof typeof ASSESSMENT_CONFIGS]) {
      return NextResponse.json({ 
        error: "Invalid assessment type" 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteeEmail)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, { status: 400 });
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has Strategic plan (required for delegation)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("subscription_status, subscription_plan, first_name, last_name, company")
      .eq("u_id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (userData.subscription_status !== "active") {
      return NextResponse.json({ 
        error: "Active subscription required for assessment delegation" 
      }, { status: 403 });
    }

    // Check if user has Strategic plan
    if (userData.subscription_plan !== "strategic") {
      return NextResponse.json({ 
        error: "Assessment delegation requires Strategic plan" 
      }, { status: 403 });
    }

    // Check invitation limits (50 per day)
    const today = new Date().toISOString().split('T')[0];
    const { count: invitationCount } = await supabase
      .from("assessment_invitations")
      .select("*", { count: "exact", head: true })
      .eq("inviter_u_id", user.id)
      .gte("created_at", today);

    if (invitationCount && invitationCount >= 50) {
      return NextResponse.json({ 
        error: "Daily invitation limit reached (50 invitations per day)" 
      }, { status: 429 });
    }

    // Generate secure invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save invitation to database
    const { error: dbError } = await supabase
      .from("assessment_invitations")
      .insert({
        inviter_u_id: user.id,
        invitee_email: inviteeEmail.toLowerCase(),
        invitee_name: inviteeName,
        assessment_type: assessmentType,
        invitation_token: invitationToken,
        expires_at: expiresAt.toISOString(),
        custom_message: customMessage || null
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 });
    }

    // Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
    const invitationUrl = `${baseUrl}/assessment/invitation/${invitationToken}`;
    
    const assessmentConfig = ASSESSMENT_CONFIGS[assessmentType as keyof typeof ASSESSMENT_CONFIGS];
    const inviterName = `${userData.first_name} ${userData.last_name}`.trim();
    const inviterCompany = userData.company || "your organization";

    try {
      await emailService.sendAssessmentInvitationEmail({
        to: inviteeEmail,
        firstName: inviteeName.split(' ')[0] || inviteeName,
        inviterName,
        inviterCompany,
        assessmentTitle: assessmentConfig.title,
        assessmentDescription: assessmentConfig.description,
        invitationUrl,
        expiresAt: expiresAt.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        customMessage
      });

      console.log(`Assessment invitation sent to ${inviteeEmail} for ${assessmentType}`);

      return NextResponse.json({ 
        success: true, 
        message: "Assessment invitation sent successfully",
        invitationToken 
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      
      // Clean up the database record if email fails
      await supabase
        .from("assessment_invitations")
        .delete()
        .eq("invitation_token", invitationToken);

      return NextResponse.json({ 
        error: "Failed to send invitation email" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error creating assessment invitation:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 