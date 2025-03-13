import { supabase } from "@/lib/supabase";

export default async function Notes() {
  try {
    const { data: notes, error } = await supabase.from("User_T1").select();

    if (error) {
      console.error("Supabase Error:", error);
      return <p className="text-red-500">Failed to load notes.</p>;
    }

    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Notes</h2>
        {notes.length > 0 ? (
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(notes, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-600">No notes found.</p>
        )}
      </div>
    );
  } catch (err) {
    console.error("Unexpected Error:", err);
    return <p className="text-red-500">Something went wrong.</p>;
  }
}
