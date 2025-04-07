"use client";

import React from "react";
import DynamicBpmGroup from "./groups/DynamicBpmGroup"; 
import Group01_Goals from "./groups/Group01_Goals";
import Group02_Positioning from "./groups/Group02_Positioning";
import Group03_Operations from "./groups/Group03_Operations";
import Group04_GrowthStack from "./groups/Group04_GrowthStack";
import Group05_Clarity from "./groups/Group05_Clarity";
import Group06_Benchmarks from "./groups/Group06_Benchmarks";
import Group07_Final from "./groups/Group07_Final";

type Props = {
  step: number;
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
  bpmQuestions?: any[];
};


export default function StepGroupRenderer({ step, answers, onAnswer, bpmQuestions }: Props) {
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
      case 7:
        return (
          <DynamicBpmGroup
            questions={bpmQuestions?.slice(0, 3) || []}
            answers={answers}
            onAnswer={onAnswer}
          />
        );
      case 8:
        return (
          <DynamicBpmGroup
            questions={bpmQuestions?.slice(3, 6) || []}
            answers={answers}
            onAnswer={onAnswer}
          />
        );
      case 9:
        return (
          <DynamicBpmGroup
            questions={bpmQuestions?.slice(6, 9) || []}
            answers={answers}
            onAnswer={onAnswer}
          />
        );
      default:
        return null;
    }
  
}
