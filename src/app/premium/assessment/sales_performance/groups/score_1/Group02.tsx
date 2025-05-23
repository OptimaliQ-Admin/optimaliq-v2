"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import questionConfig from '@/app/api/assessments/data/sales_question_config.json';
import type { AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/types/AssessmentAnswers";

export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["who_5d9558"] === "string" &&
    typeof answers["how_454fc5"] === "string" &&
    typeof answers["which_01150c"] === "string" &&
    typeof answers["how_142ca2"] === "string"
  );
}

interface Group02Props {
  answers: AssessmentAnswers;
  onAnswerChange: (questionKey: string, answer: string) => void;
}

export function Group02({ answers, onAnswerChange }: Group02Props) {
  const questions = questionConfig.score_1;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.who_5d9558.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.who_5d9558)}
                onValueChange={(value: string) => onAnswerChange("who_5d9558", value)}
                className="space-y-2"
              >
                {Object.entries(questions.who_5d9558.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`who_5d9558-${key}`} />
                    <Label htmlFor={`who_5d9558-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.how_454fc5.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.how_454fc5)}
                onValueChange={(value: string) => onAnswerChange("how_454fc5", value)}
                className="space-y-2"
              >
                {Object.entries(questions.how_454fc5.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`how_454fc5-${key}`} />
                    <Label htmlFor={`how_454fc5-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {questions.which_01150c.label}
              </Label>
              <RadioGroup
                value={getStringAnswer(answers.which_01150c)}
                onValueChange={(value: string) => onAnswerChange("which_01150c", value)}
                className="space-y-2"
              >
                {Object.entries(questions.which_01150c.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`which_01150c-${key}`} />
                    <Label htmlFor={`which_01150c-${key}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question 4 */}
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
