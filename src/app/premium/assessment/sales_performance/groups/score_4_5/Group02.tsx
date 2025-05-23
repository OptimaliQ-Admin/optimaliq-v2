"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_4q5r6s === "string" &&
    typeof answers.how_7r8s9t === "string" &&
    typeof answers.how_3t4u5v === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_4_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_4q5r6s.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_4q5r6s)}
                onValueChange={(value: string) => onAnswerChange("how_4q5r6s", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_4q5r6s.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_4q5r6s-${key}`} />
                    <Label htmlFor={`how_4q5r6s-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_7r8s9t.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_7r8s9t)}
                onValueChange={(value: string) => onAnswerChange("how_7r8s9t", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_7r8s9t.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_7r8s9t-${key}`} />
                    <Label htmlFor={`how_7r8s9t-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_3t4u5v.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_3t4u5v)}
                onValueChange={(value: string) => onAnswerChange("how_3t4u5v", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_3t4u5v.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_3t4u5v-${key}`} />
                    <Label htmlFor={`how_3t4u5v-${key}`}>{label}</Label>
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
