"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["decision_making"] === "string" &&
    typeof answers["trust_level"] === "string" &&
    typeof answers["conflict_resolution"] === "string" &&
    typeof answers["accountability_culture"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: decision_making */}
      <MultipleChoiceQuestion
        question="How are most decisions made within your team?"
        options={[
          { value: "top_down", label: "Top-down — leaders make the calls" },
          { value: "informal_input", label: "Informally — input is considered" },
          { value: "collaborative", label: "Collaboratively — we make decisions together" },
          { value: "empowered", label: "Empowered — individuals are trusted to decide" },
        ]}
        value={answers["decision_making"] || ""}
        onChange={(val) => onAnswer("decision_making", val)}
      />

      {/* Question 5: trust_level */}
      <MultipleChoiceQuestion
        question="How would you describe the level of trust among your team members?"
        options={[
          { value: "low_trust", label: "Low — people withhold or avoid sharing" },
          { value: "some_trust", label: "Some — we’re careful with what we say" },
          { value: "moderate_trust", label: "Moderate — we’re open but cautious" },
          { value: "high_trust", label: "High — we’re honest, transparent, and supportive" },
        ]}
        value={answers["trust_level"] || ""}
        onChange={(val) => onAnswer("trust_level", val)}
      />

      {/* Question 6: conflict_resolution */}
      <MultipleChoiceQuestion
        question="How are conflicts typically handled within your team?"
        options={[
          { value: "avoid", label: "We avoid or ignore them" },
          { value: "in_the_moment", label: "We address them in the moment if needed" },
          { value: "structured", label: "We use structured conversations or tools" },
          { value: "proactive", label: "We proactively surface and resolve issues" },
        ]}
        value={answers["conflict_resolution"] || ""}
        onChange={(val) => onAnswer("conflict_resolution", val)}
      />

      {/* Question 7: accountability_culture */}
      <MultipleChoiceQuestion
        question="How do you promote accountability across your team?"
        options={[
          { value: "rarely", label: "We rarely discuss or reinforce accountability" },
          { value: "reminders", label: "We use reminders and check-ins" },
          { value: "metrics", label: "We tie accountability to goals or metrics" },
          { value: "peer_expectations", label: "We build a culture of peer expectations and ownership" },
        ]}
        value={answers["accountability_culture"] || ""}
        onChange={(val) => onAnswer("accountability_culture", val)}
      />
    </div>
  );
}
