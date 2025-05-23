"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_b5793e === "string" &&
    typeof answers.how_140f94 === "string" &&
    typeof answers.how_3a6376 === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_2_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_b5793e.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_b5793e)}
                onValueChange={(value: string) => onAnswerChange("how_b5793e", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_b5793e.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_b5793e-${key}`} />
                    <Label htmlFor={`how_b5793e-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_140f94.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_140f94)}
                onValueChange={(value: string) => onAnswerChange("how_140f94", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_140f94.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_140f94-${key}`} />
                    <Label htmlFor={`how_140f94-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_3a6376.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_3a6376)}
                onValueChange={(value: string) => onAnswerChange("how_3a6376", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_3a6376.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_3a6376-${key}`} />
                    <Label htmlFor={`how_3a6376-${key}`}>{label}</Label>
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
