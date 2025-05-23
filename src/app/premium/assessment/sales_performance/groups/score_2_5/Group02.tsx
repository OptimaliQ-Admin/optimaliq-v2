"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_5f6g7h"] === "string" &&
    typeof answers["how_8g9h0i"] === "string" &&
    typeof answers["how_4i5j6k"] === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export default function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_2_5;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_4cd27c.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_4cd27c)}
                onValueChange={(value: string) => onAnswerChange("how_4cd27c", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_4cd27c.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_4cd27c-${key}`} />
                    <Label htmlFor={`how_4cd27c-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_68cbdb.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_68cbdb)}
                onValueChange={(value: string) => onAnswerChange("how_68cbdb", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_68cbdb.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_68cbdb-${key}`} />
                    <Label htmlFor={`how_68cbdb-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_d30c39.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_d30c39)}
                onValueChange={(value: string) => onAnswerChange("how_d30c39", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_d30c39.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_d30c39-${key}`} />
                    <Label htmlFor={`how_d30c39-${key}`}>{label}</Label>
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
