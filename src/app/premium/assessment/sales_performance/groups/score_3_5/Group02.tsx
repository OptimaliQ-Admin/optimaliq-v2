"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_5f6g7h === "string" &&
    typeof answers.how_8g9h0i === "string" &&
    typeof answers.how_4i5j6k === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_3_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_5f6g7h.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_5f6g7h)}
                onValueChange={(value: string) => onAnswerChange("how_5f6g7h", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_5f6g7h.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_5f6g7h-${key}`} />
                    <Label htmlFor={`how_5f6g7h-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_8g9h0i.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_8g9h0i)}
                onValueChange={(value: string) => onAnswerChange("how_8g9h0i", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_8g9h0i.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_8g9h0i-${key}`} />
                    <Label htmlFor={`how_8g9h0i-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_4i5j6k.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_4i5j6k)}
                onValueChange={(value: string) => onAnswerChange("how_4i5j6k", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_4i5j6k.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_4i5j6k-${key}`} />
                    <Label htmlFor={`how_4i5j6k-${key}`}>{label}</Label>
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
