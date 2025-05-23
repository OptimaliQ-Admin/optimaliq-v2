"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["what's_3164b1"] === "string" &&
    typeof answers["if_4526b6"] === "string" &&
    typeof answers["how_142ca2"] === "string"
  );
}

interface Group03Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export default function Group03({ answers, onAnswerChange }: Group03Props) {
  const questions = questionConfig.score_1;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                What's the biggest obstacle you face when trying to close more deals?
              </Label>
              <Textarea
                placeholder="E.g., high CAC, unclear process, lead quality"
                value={getStringAnswer(answers["what's_3164b1"])}
                onChange={(e) => onAnswerChange("what's_3164b1", e.target.value)}
                maxLength={300}
                className="min-h-[100px]"
              />
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                If you could improve one part of your sales process today, what would it be and why?
              </Label>
              <Textarea
                placeholder="E.g., improve discovery, track deals better, reduce no-shows"
                value={getStringAnswer(answers["if_4526b6"])}
                onChange={(e) => onAnswerChange("if_4526b6", e.target.value)}
                maxLength={300}
                className="min-h-[100px]"
              />
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_142ca2.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_142ca2)}
                onValueChange={(value: string) => onAnswerChange("how_142ca2", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_142ca2.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_142ca2-${key}`} />
                    <Label htmlFor={`how_142ca2-${key}`}>{label}</Label>
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
