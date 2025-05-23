"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_1a3b4c === "string" &&
    typeof answers.how_5d6e7f === "string" &&
    typeof answers.how_2d3e4f === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_3;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_1a3b4c.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_1a3b4c)}
                onValueChange={(value: string) => onAnswerChange("how_1a3b4c", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_1a3b4c.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_1a3b4c-${key}`} />
                    <Label htmlFor={`how_1a3b4c-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_5d6e7f.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_5d6e7f)}
                onValueChange={(value: string) => onAnswerChange("how_5d6e7f", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_5d6e7f.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_5d6e7f-${key}`} />
                    <Label htmlFor={`how_5d6e7f-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_2d3e4f.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_2d3e4f)}
                onValueChange={(value: string) => onAnswerChange("how_2d3e4f", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_2d3e4f.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_2d3e4f-${key}`} />
                    <Label htmlFor={`how_2d3e4f-${key}`}>{label}</Label>
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
