import { createClient } from '@/utils/supabase/server';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(https://bsgbodwggpntmfdclhuv.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZ2JvZHdnZ3BudG1mZGNsaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNDUzNzMsImV4cCI6MjA1NjYyMTM3M30.Z1aa1fmwddeguHDTqd_oNuY_GppMGHVAASSgGfcG3C4)

const { data, error } = await supabase
  .from('todos')
  .select()

export default async function Notes() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}