"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
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
  const questions = questionConfig.score_3_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_4d1ff3.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_4d1ff3)}
                onValueChange={(value: string) => onAnswerChange("how_4d1ff3", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_4d1ff3.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_4d1ff3-${key}`} />
                    <Label htmlFor={`how_4d1ff3-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_fe4a96.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_fe4a96)}
                onValueChange={(value: string) => onAnswerChange("how_fe4a96", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_fe4a96.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_fe4a96-${key}`} />
                    <Label htmlFor={`how_fe4a96-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_2e3f4g.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_2e3f4g)}
                onValueChange={(value: string) => onAnswerChange("how_2e3f4g", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_2e3f4g.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_2e3f4g-${key}`} />
                    <Label htmlFor={`how_2e3f4g-${key}`}>{label}</Label>
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
