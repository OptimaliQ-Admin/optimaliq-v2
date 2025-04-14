"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup03Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["agility"] === "string" &&
    answers["agility"].trim().length > 0 &&

    typeof answers["ai_driven_processes"] === "string" &&
    answers["ai_driven_processes"].trim().length > 0 &&

    typeof answers["benchmarking"] === "string" &&
    answers["benchmarking"].trim().length > 0 &&

    typeof answers["north_star"] === "string" &&
    answers["north_star"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {

  return (
    <div className="space-y-10">

      {/* Question 7: agility */}
      <MultipleChoiceQuestion
        question="How does your BPM framework support experimentation and rapid iteration?"
        options={[
          { value: "It doesn’t — change is slow", label: "It doesn’t — change is slow" },
          { value: "Some teams can test and adapt", label: "Some teams can test and adapt" },
          { value: "It supports agile process improvement", label: "It supports agile process improvement" },
          { value: "Experimentation is built into the system", label: "Experimentation is built into the system" },
        ]}
        value={answers["agility"] || ""}
        onChange={(val) => onAnswer("agility", val)}
      />


      {/* Question 8: ai_driven_processes */}
      <MultipleChoiceQuestion
        question="To what extent are your business processes informed or driven by AI or machine learning today?"
        options={[
          { value: "Not at all", label: "Not at all" },
          { value: "In a few workflows", label: "In a few workflows" },
          { value: "In most core functions", label: "In most core functions" },
          { value: "AI is embedded across all major processes", label: "AI is embedded across all major processes" },
        ]}
        value={answers["ai_driven_processes"] || ""}
        onChange={(val) => onAnswer("ai_driven_processes", val)}
      />

      {/* Question 9: benchmarking */}
      <MultipleChoiceQuestion
        question="How do you benchmark your BPM performance against the broader industry or competitors?"
        options={[
          { value: "We don’t benchmark", label: "We don’t benchmark" },
          { value: "Informal or anecdotal comparisons", label: "Informal or anecdotal comparisons" },
          { value: "Structured internal benchmarking", label: "Structured internal benchmarking" },
          { value: "Ongoing external benchmarking with industry metrics", label: "Ongoing external benchmarking with industry metrics" },
        ]}
        value={answers["benchmarking"] || ""}
        onChange={(val) => onAnswer("benchmarking", val)}
      />



      {/* Question 10: north_star */}
      <TextAreaQuestion
        question="What is your BPM North Star for the next 12 months?"
        placeholder="E.g.,"
        value={answers["north_star"] || ""}
        onChange={(val) => onAnswer("north_star", val)}
        maxLength={300}
      />

    </div>
  );
}
