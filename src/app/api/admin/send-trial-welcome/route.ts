import { NextResponse } from "next/server";
import { emailService } from "@/lib/emailService";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const { email, firstName, companyName, trialEndDate } = await req.json();

    if (!email || !firstName || !trialEndDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get base URLs for the email
    const baseUrls = emailService.getBaseUrls();
    
    // Send welcome trial email
    try {
      const result = await emailService.sendWelcomeTrialEmail({
        to: email,
        firstName,
        companyName,
        trialEndDate: emailService.formatTrialEndDate(new Date(trialEndDate)),
        dashboardUrl: `${baseUrls.dashboard}?trial=true`,
      });

      console.log("Trial welcome email sent successfully:", result);

      return NextResponse.json({ 
        success: true,
        message: "Trial welcome email sent successfully"
      });

    } catch (emailError) {
      console.error("Failed to send trial welcome email:", emailError);
      return NextResponse.json({ 
        error: "Failed to send welcome email",
        details: emailError instanceof Error ? emailError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error sending trial welcome email:", error);
    return NextResponse.json({ 
      error: "Unexpected server error" 
    }, { status: 500 });
  }
} 