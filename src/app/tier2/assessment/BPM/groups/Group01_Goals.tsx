"use client";

import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import DropdownQuestion from "@/components/questions/DropdownQuestion";
import React, { useEffect, useState } from "react";
import { getQuestionsByScore } from "@/lib/getQuestionsByScore";

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
  score: number;
};

export default function Group01_Goals({ answers, onAnswer, score }: Props) {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    getQuestionsByScore(score).then(setQuestions).catch(console.error);
  }, [score]);

  if (!questions.length) return <p>Loading questions…</p>;

  return (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const key = `bpm_q_${q.id}`;
        const value = answers[key];

        switch (q.type) {
          case "multiple_choice":
            return (
              <MultipleChoiceQuestion
                key={key}
                question={q.question}
                options={q.options} // assuming options are already parsed from JSON
                value={value}
                onChange={(val) => onAnswer(key, val)}
              />
            );
          case "textarea":
          default:
            return (
              <TextAreaQuestion
                key={key}
                question={q.question}
                value={value}
                onChange={(val) => onAnswer(key, val)}
              />
            );
        }
      })}
    </div>
  );
}
