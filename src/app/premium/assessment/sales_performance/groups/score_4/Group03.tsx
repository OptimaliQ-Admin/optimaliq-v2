"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers.what_89a231 === "string" &&
    typeof answers.what_3164b1 === "string" &&
    typeof answers.what_89a231 === "string"
  );
}

interface Group03Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group03({ answers, onAnswerChange }: Group03Props) {
  const questions = questionConfig.score_4;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                What sales metrics are most important to you right now?
              </Label>
              <Textarea
                placeholder="E.g., lead-to-close ratio, deal size, win rate, etc."
                value={getStringAnswer(answers.what_89a231)}
                onChange={(e) => onAnswerChange("what_89a231", e.target.value)}
                maxLength={300}
                className="min-h-[100px]"
              />
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                What's the biggest obstacle you face when trying to close more deals?
              </Label>
              <Textarea
                placeholder="E.g., high CAC, unclear process, lead quality"
                value={getStringAnswer(answers.what_3164b1)}
                onChange={(e) => onAnswerChange("what_3164b1", e.target.value)}
                maxLength={300}
                className="min-h-[100px]"
              />
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                What's one sales behavior or process you'd want your team to do more consistently?
              </Label>
              <Textarea
                placeholder="E.g., follow-ups, demo delivery, deal qualification"
                value={getStringAnswer(answers.what_89a231)}
                onChange={(e) => onAnswerChange("what_89a231", e.target.value)}
                maxLength={300}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
