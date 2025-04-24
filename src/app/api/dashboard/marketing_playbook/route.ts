//src/app/api/tier2/dashboard/insight/marketing_playbook/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("realtime_marketing_playbook")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error("❌ No marketing playbook found:", error);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("🔥 Error fetching marketing playbook:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
