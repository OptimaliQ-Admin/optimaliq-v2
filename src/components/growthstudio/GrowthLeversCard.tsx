"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface GrowthLever {
  id: string;
  lever_text: string;
  is_completed: boolean;
}

interface GrowthLeversCardProps {
  userId: string;
}

export default function GrowthLeversCard({ userId }: GrowthLeversCardProps) {
  const [levers, setLevers] = useState<GrowthLever[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevers = async () => {
      try {
        const response = await fetch("/api/growth_studio/levers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: userId }),
        });

        if (!response.ok) throw new Error("Failed to fetch growth levers");

        const result = await response.json();
        setLevers(result.levers || []);
      } catch (error) {
        console.error("Error fetching growth levers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevers();
  }, [userId]);

  const handleLeverToggle = async (leverId: string, isCompleted: boolean) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { error } = await supabase
        .from("growth_lever_progress")
        .upsert({
          u_id: userId,
          lever_text: levers.find(l => l.id === leverId)?.lever_text,
          is_completed: isCompleted,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "u_id,lever_text"
        });

      if (error) throw error;

      setLevers(levers.map(lever =>
        lever.id === leverId ? { ...lever, is_completed: isCompleted } : lever
      ));
    } catch (error) {
      console.error("Error updating lever status:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Growth Levers</h3>
        <div className="space-y-4">
          {levers.map((lever) => (
            <div key={lever.id} className="flex items-start space-x-3">
              <Checkbox
                id={lever.id}
                checked={lever.is_completed}
                onCheckedChange={(checked: boolean) => handleLeverToggle(lever.id, checked)}
              />
              <label
                htmlFor={lever.id}
                className="text-sm text-gray-700 leading-relaxed"
              >
                {lever.lever_text}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 