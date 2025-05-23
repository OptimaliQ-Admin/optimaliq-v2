"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_1579c0 === "string" &&
    typeof answers.how_ed3928 === "string" &&
    typeof answers.how_6j7k8l === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_4;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_1579c0.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_1579c0)}
                onValueChange={(value: string) => onAnswerChange("how_1579c0", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_1579c0.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_1579c0-${key}`} />
                    <Label htmlFor={`how_1579c0-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_ed3928.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_ed3928)}
                onValueChange={(value: string) => onAnswerChange("how_ed3928", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_ed3928.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_ed3928-${key}`} />
                    <Label htmlFor={`how_ed3928-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_6j7k8l.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_6j7k8l)}
                onValueChange={(value: string) => onAnswerChange("how_6j7k8l", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_6j7k8l.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_6j7k8l-${key}`} />
                    <Label htmlFor={`how_6j7k8l-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
