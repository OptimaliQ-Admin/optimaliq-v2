interface RoadmapItem { task: string; expectedImpact: string; owner: string; references: string[] }

export function roadmapFromSw(
  weaknesses: { title: string; impact: string; sourceQuestions: string[] }[],
  industry: string
): RoadmapItem[] {
  const items: RoadmapItem[] = [];
  for (const w of weaknesses.slice(0, 3)) {
    if (/ad hoc/i.test(w.title)) {
      items.push({
        task: "Document top 5 core processes and publish SOPs",
        expectedImpact: "Reduce cycle time by 15% in 60 days",
        owner: "Operations Lead",
        references: w.sourceQuestions,
      });
    } else if (/decision/i.test(w.title)) {
      items.push({
        task: "Implement weekly KPI review and decision log",
        expectedImpact: "Improve decision quality and accountability",
        owner: "CEO",
        references: w.sourceQuestions,
      });
    } else if (/funding/i.test(w.title)) {
      items.push({
        task: "Prioritize ROI-positive initiatives; defer non-critical spend",
        expectedImpact: "Free up 10% budget for growth levers",
        owner: "Finance Lead",
        references: w.sourceQuestions,
      });
    }
  }

  if (items.length < 4) {
    items.push({
      task: `Integrate analytics for ${industry} north-star metric`,
      expectedImpact: "Enable data-driven execution",
      owner: "Data/RevOps",
      references: [],
    });
  }

  return items.slice(0, 4);
}


