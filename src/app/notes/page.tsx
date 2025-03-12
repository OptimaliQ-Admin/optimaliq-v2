import { createClient } from '@supabase/supabase-js';

// ✅ Correctly initialize the Supabase client
const supabase = createClient(
  "https://bsgbodwggpntmfdclhuv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZ2JvZHdnZ3BudG1mZGNsaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNDUzNzMsImV4cCI6MjA1NjYyMTM3M30.Z1aa1fmwddeguHDTqd_oNuY_GppMGHVAASSgGfcG3C4"
);

export default async function Notes() {
  // ✅ Fetch data inside the component
  const { data: notes, error } = await supabase.from("notes").select();

  if (error) {
    console.error("Supabase Error:", error);
    return <p className="text-red-500">Failed to load notes.</p>;
  }

  return (
    <pre className="bg-gray-100 p-4 rounded-md">
      {JSON.stringify(notes, null, 2)}
    </pre>
  );
}
