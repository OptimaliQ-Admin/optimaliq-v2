"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_12d26c === "string" &&
    typeof answers.how_1f869b === "string" &&
    typeof answers.how_c8eb2a === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_1_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_12d26c.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_12d26c)}
                onValueChange={(value: string) => onAnswerChange("how_12d26c", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_12d26c.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_12d26c-${key}`} />
                    <Label htmlFor={`how_12d26c-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_1f869b.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_1f869b)}
                onValueChange={(value: string) => onAnswerChange("how_1f869b", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_1f869b.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_1f869b-${key}`} />
                    <Label htmlFor={`how_1f869b-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_c8eb2a.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_c8eb2a)}
                onValueChange={(value: string) => onAnswerChange("how_c8eb2a", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_c8eb2a.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_c8eb2a-${key}`} />
                    <Label htmlFor={`how_c8eb2a-${key}`}>{label}</Label>
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
