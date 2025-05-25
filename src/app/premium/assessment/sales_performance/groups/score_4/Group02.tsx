"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_1d7838"] === "string" &&
    typeof answers["what&apos;s_6ec1f3"] === "string" &&
    typeof answers["how_de0081"] === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export default function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_4;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_9k0l1m.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_9k0l1m)}
                onValueChange={(value: string) => onAnswerChange("how_9k0l1m", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_9k0l1m.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_9k0l1m-${key}`} />
                    <Label htmlFor={`how_9k0l1m-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_2l3m4n.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_2l3m4n)}
                onValueChange={(value: string) => onAnswerChange("how_2l3m4n", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_2l3m4n.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_2l3m4n-${key}`} />
                    <Label htmlFor={`how_2l3m4n-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_8n9o0p.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_8n9o0p)}
                onValueChange={(value: string) => onAnswerChange("how_8n9o0p", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_8n9o0p.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_8n9o0p-${key}`} />
                    <Label htmlFor={`how_8n9o0p-${key}`}>{label}</Label>
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
