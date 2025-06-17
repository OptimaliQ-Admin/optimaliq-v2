"use client";

import { useState } from "react";
import QuadrantChart from "./QuadrantChart";
import BarChartCard from "./BarChartCard";

// Sample data - replace with actual data from your API
const sampleCompanies = [
  {
    label: "Company A",
    strategyScore: 4.2,
    processScore: 3.8,
    technologyScore: 4.0,
  },
  {
    label: "Company B",
    strategyScore: 3.5,
    processScore: 4.1,
    technologyScore: 3.7,
  },
  {
    label: "Company C",
    strategyScore: 3.9,
    processScore: 3.6,
    technologyScore: 4.2,
  },
];

const sampleUserData = {
  strategyScore: 3.7,
  processScore: 3.9,
  technologyScore: 3.8,
};

export default function GrowthChartModule() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <QuadrantChart
        companies={sampleCompanies}
        userData={sampleUserData}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
      <BarChartCard
        companies={sampleCompanies}
        userData={sampleUserData}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
    </div>
  );
} 