"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_9w0x1y === "string" &&
    typeof answers.how_2x3y4z === "string" &&
    typeof answers.how_8z9a0b === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_9w0x1y.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_9w0x1y)}
                onValueChange={(value: string) => onAnswerChange("how_9w0x1y", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_9w0x1y.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_9w0x1y-${key}`} />
                    <Label htmlFor={`how_9w0x1y-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_2x3y4z.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_2x3y4z)}
                onValueChange={(value: string) => onAnswerChange("how_2x3y4z", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_2x3y4z.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_2x3y4z-${key}`} />
                    <Label htmlFor={`how_2x3y4z-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_8z9a0b.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_8z9a0b)}
                onValueChange={(value: string) => onAnswerChange("how_8z9a0b", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_8z9a0b.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_8z9a0b-${key}`} />
                    <Label htmlFor={`how_8z9a0b-${key}`}>{label}</Label>
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
