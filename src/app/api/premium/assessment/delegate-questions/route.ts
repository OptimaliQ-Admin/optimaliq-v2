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

// Valid question keys for each assessment type
const VALID_QUESTION_KEYS = {
  sales: [
    'pipeline_stages', 'conversion_rates', 'lead_quality', 'sales_process',
    'customer_segments', 'sales_team_performance', 'sales_tools', 'sales_metrics'
  ],
  marketing_effectiveness: [
    'marketing_channels', 'campaign_performance', 'lead_generation', 'brand_awareness',
    'content_strategy', 'marketing_automation', 'roi_measurement'
  ],
  bpm: [
    'process_documentation', 'workflow_efficiency', 'automation_level', 'quality_control',
    'process_metrics', 'continuous_improvement'
  ],
  tech_stack: [
    'current_tools', 'integration_capabilities', 'data_management', 'security_measures',
    'scalability', 'user_adoption'
  ],
  customer_experience: [
    'customer_journey', 'touchpoint_quality', 'feedback_collection', 'resolution_time',
    'customer_satisfaction', 'loyalty_programs'
  ]
} as const;

export async function POST(req: Request) {
  try {
    const { assessmentType, delegateEmail, delegateName, questionKeys, customMessage }: {
      assessmentType: string;
      delegateEmail: string;
      delegateName: string;
      questionKeys: string[];
      customMessage?: string;
    } = await req.json();

    // Validate required fields
    if (!assessmentType || !delegateEmail || !delegateName || !questionKeys || !Array.isArray(questionKeys)) {
      return NextResponse.json({ 
        error: "Missing required fields: assessmentType, delegateEmail, delegateName, questionKeys" 
      }, { status: 400 });
    }

    // Validate assessment type
    if (!ASSESSMENT_CONFIGS[assessmentType as keyof typeof ASSESSMENT_CONFIGS]) {
      return NextResponse.json({ 
        error: "Invalid assessment type" 
      }, { status: 400 });
    }

    // Validate question keys
    const validKeys = VALID_QUESTION_KEYS[assessmentType as keyof typeof VALID_QUESTION_KEYS];
    if (!validKeys) {
      return NextResponse.json({ 
        error: "Question delegation not available for this assessment type" 
      }, { status: 400 });
    }

    const invalidKeys = questionKeys.filter((key: string) => !(validKeys as readonly string[]).includes(key));
    if (invalidKeys.length > 0) {
      return NextResponse.json({ 
        error: `Invalid question keys: ${invalidKeys.join(', ')}` 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(delegateEmail)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, { status: 400 });
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has Strategic plan and appropriate role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("subscription_status, subscription_plan, first_name, last_name, title")
      .eq("u_id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (userData.subscription_status !== "active") {
      return NextResponse.json({ 
        error: "Active subscription required for question delegation" 
      }, { status: 403 });
    }

    if (userData.subscription_plan !== "strategic") {
      return NextResponse.json({ 
        error: "Question delegation requires Strategic plan" 
      }, { status: 403 });
    }

    // Check if user has appropriate role for delegation
    const userTitle = userData.title?.toLowerCase() || '';
    const isVPSales = userTitle.includes('vp') && userTitle.includes('sales');
    const isVPMarketing = userTitle.includes('vp') && userTitle.includes('marketing');
    const isManager = userTitle.includes('manager') || userTitle.includes('director');

    if (!isVPSales && !isVPMarketing && !isManager) {
      return NextResponse.json({ 
        error: "Question delegation requires VP-level or Manager role" 
      }, { status: 403 });
    }

    // Check delegation limits (20 per day)
    const today = new Date().toISOString().split('T')[0];
    const { count: delegationCount } = await supabase
      .from("question_delegations")
      .select("*", { count: "exact", head: true })
      .eq("delegator_u_id", user.id)
      .gte("created_at", today);

    if (delegationCount && delegationCount >= 20) {
      return NextResponse.json({ 
        error: "Daily delegation limit reached (20 delegations per day)" 
      }, { status: 429 });
    }

    // Generate secure delegation token
    const delegationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save delegation to database
    const { error: dbError } = await supabase
      .from("question_delegations")
      .insert({
        delegator_u_id: user.id,
        delegate_email: delegateEmail.toLowerCase(),
        delegate_name: delegateName,
        assessment_type: assessmentType,
        question_keys: questionKeys,
        delegation_token: delegationToken,
        expires_at: expiresAt.toISOString(),
        custom_message: customMessage || null
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to create delegation" }, { status: 500 });
    }

    // Send delegation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
    const delegationUrl = `${baseUrl}/assessment/delegation/${delegationToken}`;
    
    const assessmentConfig = ASSESSMENT_CONFIGS[assessmentType as keyof typeof ASSESSMENT_CONFIGS];
    const delegatorName = `${userData.first_name} ${userData.last_name}`.trim();

    try {
      await emailService.sendQuestionDelegationEmail({
        to: delegateEmail,
        firstName: delegateName.split(' ')[0] || delegateName,
        delegatorName,
        assessmentTitle: assessmentConfig.title,
        questionCount: questionKeys.length,
        delegationUrl,
        expiresAt: expiresAt.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        customMessage
      });

      console.log(`Question delegation sent to ${delegateEmail} for ${assessmentType}`);

      return NextResponse.json({ 
        success: true, 
        message: "Question delegation sent successfully",
        delegationToken 
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      
      // Clean up the database record if email fails
      await supabase
        .from("question_delegations")
        .delete()
        .eq("delegation_token", delegationToken);

      return NextResponse.json({ 
        error: "Failed to send delegation email" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error creating question delegation:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 