"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import { usePremiumUser } from "@/context/PremiumUserContext";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Lever {
  text: string;
  isCompleted: boolean;
}

export default function GrowthLeversCard() {
  const { user } = usePremiumUser();
  const [levers, setLevers] = useState<Lever[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (user?.u_id) {
      fetchLevers();
    }
  }, [user?.u_id]);

  const fetchLevers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/growth_studio/levers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_id: user?.u_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch growth levers");
      }

      const data = await response.json();
      setLevers(data.levers);
    } catch (err) {
      console.error("Error fetching levers:", err);
      setError(err instanceof Error ? err.message : "Failed to load growth levers");
    } finally {
      setLoading(false);
    }
  };

  const handleLeverToggle = async (index: number) => {
    try {
      const updatedLevers = [...levers];
      const newStatus = !updatedLevers[index].isCompleted;
      updatedLevers[index].isCompleted = newStatus;
      setLevers(updatedLevers);

      // If completing a lever, show confetti
      if (newStatus) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Upsert the progress directly with Supabase
      const { error: upsertError } = await supabase
        .from("growth_lever_progress")
        .upsert({
          u_id: user?.u_id,
          lever_text: updatedLevers[index].text,
          is_completed: newStatus,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'u_id,lever_text'
        });

      if (upsertError) {
        throw upsertError;
      }
    } catch (err) {
      console.error("Error updating lever:", err);
      // Revert the change if the update failed
      const updatedLevers = [...levers];
      updatedLevers[index].isCompleted = !updatedLevers[index].isCompleted;
      setLevers(updatedLevers);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <CardContent>
          <div className="text-center text-red-600">
            <p className="font-semibold mb-2">⚠️ Error Loading Growth Levers</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent>
        <SectionTitleBar
          title="🚀 Growth Levers"
          tooltip="Key actions to accelerate your growth. Check them off as you complete them."
        />

        <div className="mt-4 space-y-3">
          {levers.map((lever, index) => (
            <div key={index} className="flex items-start gap-3">
              <Checkbox
                id={`lever-${index}`}
                checked={lever.isCompleted}
                onCheckedChange={() => handleLeverToggle(index)}
                className="mt-1"
              />
              <label
                htmlFor={`lever-${index}`}
                className={`text-sm leading-tight ${
                  lever.isCompleted ? "text-gray-500 line-through" : "text-gray-700"
                }`}
              >
                {lever.text}
              </label>
            </div>
          ))}
        </div>

        {showConfetti && (
          <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
      </CardContent>
    </Card>
  );
} 