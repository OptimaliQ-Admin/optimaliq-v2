"use client";

import React from "react";
import Group01_Goals from "./groups/Group01_Goals";
import Group02_Positioning from "./groups/Group02_Positioning";
import Group03_Operations from "./groups/Group03_Operations";
import Group04_GrowthStack from "./groups/Group04_GrowthStack";
import Group05_Clarity from "./groups/Group05_Clarity";
import Group06_Benchmarks from "./groups/Group06_Benchmarks";
import Group07_Final from "./groups/Group07_Final";

type StepGroupRendererProps = {
  step: number;
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function StepGroupRenderer({ step, answers, onAnswer }: StepGroupRendererProps) {
  switch (step) {
    case 0:
      return <Group01_Goals answers={answers} onAnswer={onAnswer} />;
    case 1:
      return <Group02_Positioning answers={answers} onAnswer={onAnswer} />;
    case 2:
      return <Group03_Operations answers={answers} onAnswer={onAnswer} />;
    case 3:
      return <Group04_GrowthStack answers={answers} onAnswer={onAnswer} />;
    case 4:
      return <Group05_Clarity answers={answers} onAnswer={onAnswer} />;
    case 5:
      return <Group06_Benchmarks answers={answers} onAnswer={onAnswer} />;
    case 6:
      return <Group07_Final answers={answers} onAnswer={onAnswer} />;
    default:
      return (
        <div className="p-4 border border-red-400 text-red-600 bg-red-50 rounded">
          ❌ Unknown step group: {step}
        </div>
      );
  }
}
