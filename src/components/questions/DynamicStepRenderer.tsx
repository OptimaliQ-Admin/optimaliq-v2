"use client";

import React, { useEffect, useState } from "react";
import DynamicQuestion from "./DynamicQuestion";

type QuestionType = "multiple_choice" | "multi_select" | "text_area";

type QuestionOption = {
  label: string;
  score: number;
};

type Question = {
  label: string;
  type: QuestionType;
  options?: Record<string, QuestionOption>;
};

type ScoreConfig = {
  [key: string]: Question;
};

type Props = {
  score: number;
  step: number;
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
  configPath?: string;
};

function normalizeScore(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}

export default function DynamicStepRenderer({
  score,
  step,
  answers,
  onAnswer,
  configPath = "/api/assessments/data/question_config.json"
}: Props) {
  const [questionConfig, setQuestionConfig] = useState<Record<string, ScoreConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(configPath);
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }
        const config = await response.json();
        setQuestionConfig(config);
      } catch (err) {
        console.error("Error loading question config:", err);
        setError(err instanceof Error ? err.message : "Failed to load question config");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [configPath]);

  if (loading) {
    return <div className="p-6 text-center">Loading questions...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  const normalizedScore = normalizeScore(score);
  const scoreConfig = questionConfig[normalizedScore];

  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return null;
  }

  // Get questions for the current step
  const questions = Object.entries(scoreConfig).slice(step * 3, (step + 1) * 3);

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      {questions.map(([key, question]) => {
        // Handle different question structures
        const questionType = question.type as QuestionType;
        const questionOptions = 'options' in question ? question.options as Record<string, QuestionOption> : undefined;

        return (
          <DynamicQuestion
            key={key}
            question={question.label}
            type={questionType}
            options={questionOptions}
            selected={answers[key]}
            onChange={(value) => onAnswer(key, value)}
            maxSelect={questionType === "multi_select" ? 5 : undefined}
          />
        );
      })}
    </div>
  );
} 