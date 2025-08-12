// src/app/api/growth-plan/levers/[id]/ics/route.ts
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET(_req: Request, context: any) {
  const { params } = context;
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: lever } = await supabase
    .from("growth_plan_levers")
    .select("title, description, due_date")
    .eq("id", params.id)
    .single();
  if (!lever || !lever.due_date) return NextResponse.json({ error: "No due date" }, { status: 404 });

  const dt = new Date(lever.due_date);
  const start = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDt = new Date(dt.getTime() + 60 * 60 * 1000);
  const end = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${params.id}@optimaliq.ai`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OptimaliQ//GrowthPlan//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(lever.title)}`,
    `DESCRIPTION:${escapeICS(lever.description || '')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename=lever-${params.id}.ics`
    }
  });
}

function escapeICS(text: string) {
  return text.replace(/[\\,;]/g, match => ({'\\':'\\\\', ',':'\\,',';':'\\;'}[match] as string)).replace(/\n/g, '\\n');
}


