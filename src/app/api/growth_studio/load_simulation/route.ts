//src/app/api/tier2/growth_studio/load_simulation/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tier2_simulation_history")
      .select("*")
      .eq("email", email)
      .order("createdat", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("❌ Failed to load simulation:", error);
      return NextResponse.json({ error: "Failed to fetch simulation" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("🚨 API Error:", err);
    return NextResponse.json({ error: getErrorMessage(err) || "Unexpected error" }, { status: 500 });
  }
}
