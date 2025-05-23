"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_c7b9f7 === "string" &&
    typeof answers.what_84c5f2 === "string" &&
    typeof answers.how_8f9d2a === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_3;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_c7b9f7.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_c7b9f7)}
                onValueChange={(value: string) => onAnswerChange("how_c7b9f7", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_c7b9f7.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_c7b9f7-${key}`} />
                    <Label htmlFor={`how_c7b9f7-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.what_84c5f2.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.what_84c5f2)}
                onValueChange={(value: string) => onAnswerChange("what_84c5f2", value)}
                className="space-y-2"
              >
                {Object.entries(questions.what_84c5f2.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`what_84c5f2-${key}`} />
                    <Label htmlFor={`what_84c5f2-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_8f9d2a.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_8f9d2a)}
                onValueChange={(value: string) => onAnswerChange("how_8f9d2a", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_8f9d2a.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_8f9d2a-${key}`} />
                    <Label htmlFor={`how_8f9d2a-${key}`}>{label}</Label>
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
