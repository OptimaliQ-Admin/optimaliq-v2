"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_2c42b7"] === "string" &&
    typeof answers["how_79028c"] === "string" &&
    typeof answers["how_47b050"] === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export default function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_1_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_2c42b7.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_2c42b7)}
                onValueChange={(value: string) => onAnswerChange("how_2c42b7", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_2c42b7.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_2c42b7-${key}`} />
                    <Label htmlFor={`how_2c42b7-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_79028c.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_79028c)}
                onValueChange={(value: string) => onAnswerChange("how_79028c", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_79028c.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_79028c-${key}`} />
                    <Label htmlFor={`how_79028c-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_47b050.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_47b050)}
                onValueChange={(value: string) => onAnswerChange("how_47b050", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_47b050.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_47b050-${key}`} />
                    <Label htmlFor={`how_47b050-${key}`}>{label}</Label>
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
