"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_b5d8e7"] === "string" &&
    typeof answers["do_b7cc0a"] === "string" &&
    typeof answers["how_fee95e"] === "string"
  );
}

interface Group01Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group01({ answers, onAnswerChange }: Group01Props) {
  const questions = questionConfig.score_1;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_b5d8e7.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_b5d8e7)}
                onValueChange={(value: string) => onAnswerChange("how_b5d8e7", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_b5d8e7.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_b5d8e7-${key}`} />
                    <Label htmlFor={`how_b5d8e7-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.do_b7cc0a.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.do_b7cc0a)}
                onValueChange={(value: string) => onAnswerChange("do_b7cc0a", value)}
                className="space-y-2"
              >
                {Object.entries(questions.do_b7cc0a.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`do_b7cc0a-${key}`} />
                    <Label htmlFor={`do_b7cc0a-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_fee95e.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_fee95e)}
                onValueChange={(value: string) => onAnswerChange("how_fee95e", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_fee95e.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_fee95e-${key}`} />
                    <Label htmlFor={`how_fee95e-${key}`}>{label}</Label>
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
