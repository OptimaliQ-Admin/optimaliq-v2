"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitor_focus"] === "string" &&
    typeof answers["win_loss_feedback"] === "string" &&
    typeof answers["category_ranking_tracking"] === "string" &&
    typeof answers["competitive_tools_usage"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: competitor_focus */}
      <MultipleChoiceQuestion
        question="How clearly does your team understand your key competitors?"
        options={[
          { value: "little_understanding", label: "Little understanding of who we compete with" },
          { value: "general_sense", label: "We have a general sense, but it’s not consistent" },
          { value: "aligned_on_competitors", label: "Most teams are aligned on top competitors" },
          { value: "shared_internal_docs", label: "We have shared internal docs and training" },
        ]}
        value={getStringAnswer(answers["competitor_focus"])}
        onChange={(val) => onAnswer("competitor_focus", val)}
      />

      {/* Question 5: win_loss_feedback */}
      <MultipleChoiceQuestion
        question="Do you capture feedback about why deals or customers are won/lost to competitors?"
        options={[
          { value: "no_feedback", label: "No — we rarely ask" },
          { value: "informal_feedback", label: "Informally through sales conversations" },
          { value: "occasional_surveys", label: "Occasional win/loss surveys or notes" },
          { value: "systematic_tracking", label: "Systematic tracking and reporting" },
        ]}
        value={getStringAnswer(answers["win_loss_feedback"])}
        onChange={(val) => onAnswer("win_loss_feedback", val)}
      />

      {/* Question 6: category_ranking_tracking */}
      <MultipleChoiceQuestion
        question="Do you track your company’s position in the market or category (rankings, reviews, share)?"
        options={[
          { value: "not_tracked", label: "No, not tracked" },
          { value: "ad_hoc", label: "Ad hoc through review sites or anecdotal info" },
          { value: "tracked_manually", label: "Tracked manually on a few channels" },
          { value: "monitored_analytics", label: "Monitored with analytics or third-party tools" },
        ]}
        value={getStringAnswer(answers["category_ranking_tracking"])}
        onChange={(val) => onAnswer("category_ranking_tracking", val)}
      />

      {/* Question 7: competitive_tools_usage */}
      <MultipleChoiceQuestion
        question="Do you use any tools or services to monitor competitive activity?"
        options={[
          { value: "no_tools", label: "No — we don’t monitor competition" },
          { value: "free_alerts", label: "We use free alerts or social feeds" },
          { value: "limited_tools", label: "We use 1-2 basic tools (e.g. SimilarWeb)" },
          { value: "integrated_stack", label: "Yes — we use a full stack for tracking" },
        ]}
        value={getStringAnswer(answers["competitive_tools_usage"])}
        onChange={(val) => onAnswer("competitive_tools_usage", val)}
      />
    </div>
  );
}
