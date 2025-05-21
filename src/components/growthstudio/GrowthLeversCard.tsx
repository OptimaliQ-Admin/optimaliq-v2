"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { createClient } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GrowthLeversCard() {
  const { user } = usePremiumUser();
  const [levers, setLevers] = useState<string[]>([]);
  const [completedLevers, setCompletedLevers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.u_id) return;

    const fetchLevers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/growth_studio/levers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: user.u_id }),
        });

        if (!res.ok) throw new Error("Failed to fetch levers");

        const data = await res.json();
        if (data.levers) {
          setLevers(data.levers);
        }
      } catch (err) {
        console.error("Error fetching levers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCompletedLevers = async () => {
      try {
        const { data, error } = await supabase
          .from("growth_lever_progress")
          .select("lever_text")
          .eq("u_id", user.u_id)
          .eq("is_completed", true);

        if (error) throw error;
        setCompletedLevers(new Set(data.map(item => item.lever_text)));
      } catch (err) {
        console.error("Error fetching completed levers:", err);
      }
    };

    fetchLevers();
    fetchCompletedLevers();
  }, [user?.u_id]);

  const handleLeverToggle = async (lever: string) => {
    try {
      const newStatus = !completedLevers.has(lever);
      
      const { error: upsertError } = await supabase
        .from("growth_lever_progress")
        .upsert({
          u_id: user?.u_id,
          lever_text: lever,
          is_completed: newStatus,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "u_id,lever_text"
        });

      if (upsertError) throw upsertError;

      setCompletedLevers(prev => {
        const newSet = new Set(prev);
        if (newStatus) {
          newSet.add(lever);
        } else {
          newSet.delete(lever);
        }
        return newSet;
      });
    } catch (err) {
      console.error("Error updating lever:", err);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">🚀 Growth Levers</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {levers.map((lever, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Checkbox
                  id={`lever-${index}`}
                  checked={completedLevers.has(lever)}
                  onCheckedChange={() => handleLeverToggle(lever)}
                />
                <label
                  htmlFor={`lever-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {lever}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 