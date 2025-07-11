//src/app/api/dashboard/marketing_playbook/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    // Fetch AI-generated marketing insights
    const { data: aiInsights, error: aiError } = await supabase
      .from("realtime_marketing_playbook")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch cron-generated marketing playbook summary
    const { data: cronPlaybook, error: cronError } = await supabase
      .from("realtime_marketing_playbook")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (aiError && cronError) {
      console.error("❌ No marketing playbook found:", aiError);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Combine the data
    const response = {
      aiInsights: aiInsights || null,
      cronPlaybook: cronPlaybook || null,
      lastUpdated: aiInsights?.createdat || cronPlaybook?.createdat
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error("🔥 Error fetching marketing playbook:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
