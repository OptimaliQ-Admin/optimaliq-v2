import {
  type AssessmentAnswers,
} from "@/lib/types/AssessmentAnswers";// 📁 refactor/src/utils/initialAssessmentValidators.ts

import Group01_Goals, { isGroup01Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group01_Goals";
import Group02_Positioning, { isGroup02Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group02_Positioning";
import Group03_Operations, { isGroup03Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group03_Operations";
import Group04_GrowthStack, { isGroup04Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group04_GrowthStack";
import Group05_Clarity, { isGroup05Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group05_Clarity";
import Group06_Benchmarks, { isGroup06Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group06_Benchmarks";
import Group07_Final, { isGroup07Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group07_Final";
import Group08_BusinessOverview, { isGroup08Complete } from "@/app/premium/onboarding/initial-assessment/groups/Group08_BusinessOverview";

export const stepValidators: Record<number, (answers: AssessmentAnswers) => boolean> = {
  0: isGroup01Complete,
  1: isGroup02Complete,
  2: isGroup03Complete,
  3: isGroup04Complete,
  4: isGroup05Complete,
  5: isGroup06Complete,
  6: isGroup08Complete,
  7: isGroup07Complete,
};

export const onboardingGroups = [
  Group01_Goals,
  Group02_Positioning,
  Group03_Operations,
  Group04_GrowthStack,
  Group05_Clarity,
  Group06_Benchmarks,
  Group08_BusinessOverview,
  Group07_Final,
];
