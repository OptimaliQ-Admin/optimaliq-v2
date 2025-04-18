"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["how_2c42b7"] === "string" &&
    typeof answers["how_79028c"] === "string" &&
    Array.isArray(answers["what_dcd0de"]) &&
    answers["what_dcd0de"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  const selectedTools = answers["what_dcd0de"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: how_2c42b7 */}
      <MultipleChoiceQuestion
        question="How are new leads currently distributed or assigned to team members?"
        options={[
          { value: "Leads_are_unassigned_or_handled_ad_hoc", label: "Leads are unassigned or handled ad hoc" },
          { value: "Theyre_assigned_manually_by_the_owner_leader", label: "They’re assigned manually by the owner/leader" },
          { value: "Each_rep_manages_their_own_leads_independently", label: "Each rep manages their own leads independently" },
          { value: "Leads_are_routed_based_on_role_territory_or_fit", label: "Leads are routed based on role, territory, or fit" },
        ]}
        value={answers["how_2c42b7"] || ""}
        onChange={(val) => onAnswer("how_2c42b7", val)}
      />

      {/* Question 2: how_79028c */}
      <MultipleChoiceQuestion
        question="How confident are you in your ability to predict how much revenue will close this month or quarter?"
        options={[
          { value: "Not_confident_at_all", label: "Not confident at all" },
          { value: "Somewhat___we_have_rough_ideas", label: "Somewhat — we have rough ideas" },
          { value: "Mostly___we_track_some_metrics", label: "Mostly — we track some metrics" },
          { value: "Very_confident___we_forecast_based_on_deal_data", label: "Very confident — we forecast based on deal data" },
        ]}
        value={answers["how_79028c"] || ""}
        onChange={(val) => onAnswer("how_79028c", val)}
      />

      {/* Question 3: what_dcd0de */}
      <MultiSelectQuestion
        question="What systems or tools do you use to manage your sales activity?"
        options={[
          { value: "CRM_HubSpot_Salesforce_etc", label: "CRM (HubSpot, Salesforce, etc.)" },
          { value: "Spreadsheets_or_Google_Sheets", label: "Spreadsheets or Google Sheets" },
          { value: "Task_or_project_tools_Asana_Trello", label: "Task or project tools (Asana, Trello)" },
          { value: "Calendar_email_integrations", label: "Calendar/email integrations" },
          { value: "Automated_follow_up_or_cadence_tools", label: "Automated follow-up or cadence tools" },
        ]}
        selected={selectedTools}
        onChange={(val) => onAnswer("what_dcd0de", val)}
        maxSelect={5}
      />
    </div>
  );
}
