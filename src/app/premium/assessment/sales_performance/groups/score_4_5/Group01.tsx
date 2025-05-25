"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_1d7838"] === "string" &&
    typeof answers["what&apos;s_6ec1f3"] === "string" &&
    typeof answers["how_de0081"] === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export default function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_4_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_18515e.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_18515e)}
                onValueChange={(value: string) => onAnswerChange("how_18515e", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_18515e.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_18515e-${key}`} />
                    <Label htmlFor={`how_18515e-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_70b7b8.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_70b7b8)}
                onValueChange={(value: string) => onAnswerChange("how_70b7b8", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_70b7b8.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_70b7b8-${key}`} />
                    <Label htmlFor={`how_70b7b8-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_1p2q3r.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_1p2q3r)}
                onValueChange={(value: string) => onAnswerChange("how_1p2q3r", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_1p2q3r.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_1p2q3r-${key}`} />
                    <Label htmlFor={`how_1p2q3r-${key}`}>{label}</Label>
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
