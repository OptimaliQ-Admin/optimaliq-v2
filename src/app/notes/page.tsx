import { supabase } from "@/lib/supabase"; // Make sure to import your Supabase client

export default async function Notes() {
  try {
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
  } catch (err) {
    console.error("Unexpected Error:", err);
    return <p className="text-red-500">Something went wrong.</p>;
  }
}
