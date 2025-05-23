"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_4cd27c"] === "string" &&
    typeof answers["how_68cbdb"] === "string" &&
    typeof answers["how_d30c39"] === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export default function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_2;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_a76658.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_a76658)}
                onValueChange={(value: string) => onAnswerChange("how_a76658", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_a76658.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_a76658-${key}`} />
                    <Label htmlFor={`how_a76658-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_5589a0.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_5589a0)}
                onValueChange={(value: string) => onAnswerChange("how_5589a0", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_5589a0.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_5589a0-${key}`} />
                    <Label htmlFor={`how_5589a0-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_92a11d.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_92a11d)}
                onValueChange={(value: string) => onAnswerChange("how_92a11d", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_92a11d.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_92a11d-${key}`} />
                    <Label htmlFor={`how_92a11d-${key}`}>{label}</Label>
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
