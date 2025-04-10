//src/app/api/tier2/growth_studio/save_simulation/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      strategyChange,
      processChange,
      techChange,
      revenue,
      costs,
      efficiency,
      revenueImpact,
      costSavings,
      efficiencyGain,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { error } = await supabase.from("tier2_simulation_history").insert([
      {
        email,
        strategyChange,
        processChange,
        techChange,
        revenue,
        costs,
        efficiency,
        revenueImpact,
        costSavings,
        efficiencyGain,
      },
    ]);

    if (error) {
      console.error("❌ Failed to save simulation:", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Save Simulation Error:", err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
