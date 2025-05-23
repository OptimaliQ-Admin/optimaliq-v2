"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.how_64a8d1 === "string" &&
    typeof answers.how_7d8dcb === "string" &&
    typeof answers.how_0fa447 === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_2;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_64a8d1.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_64a8d1)}
                onValueChange={(value: string) => onAnswerChange("how_64a8d1", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_64a8d1.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_64a8d1-${key}`} />
                    <Label htmlFor={`how_64a8d1-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_7d8dcb.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_7d8dcb)}
                onValueChange={(value: string) => onAnswerChange("how_7d8dcb", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_7d8dcb.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_7d8dcb-${key}`} />
                    <Label htmlFor={`how_7d8dcb-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_0fa447.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_0fa447)}
                onValueChange={(value: string) => onAnswerChange("how_0fa447", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_0fa447.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_0fa447-${key}`} />
                    <Label htmlFor={`how_0fa447-${key}`}>{label}</Label>
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
