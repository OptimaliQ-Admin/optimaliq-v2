import { createClient } from "@supabase/supabase-js";

export type TelemetryStage = "features" | "scoring" | "insights" | "sync";

export async function recordTelemetry(params: {
  userId?: string;
  sessionId?: string;
  stage: TelemetryStage;
  inputHash?: string;
  usedModel?: string;
  promptVersion?: string | null;
  featureVersion?: string | null;
  durationMs?: number;
  success?: boolean;
  fallbackUsed?: boolean;
}) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await supabase.from("ai_run_telemetry").insert({
      user_id: params.userId ?? null,
      session_id: params.sessionId ?? null,
      stage: params.stage,
      input_hash: params.inputHash ?? null,
      used_model: params.usedModel ?? null,
      prompt_version: params.promptVersion ?? null,
      feature_version: params.featureVersion ?? null,
      duration_ms: params.durationMs ?? null,
      success: params.success ?? false,
      fallback_used: params.fallbackUsed ?? false,
    });
  } catch {}
}
