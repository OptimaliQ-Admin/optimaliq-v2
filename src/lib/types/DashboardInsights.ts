// src/lib/types/DashboardInsights.ts

export interface BenchmarkingData {
    strategy: string;
    process: string;
    technology: string;
  }
  
  export interface ScoreItem {
    title: string;
    impact: string;
  }
  
  export interface RoadmapItem {
    task: string;
    expectedImpact: string;
  }
  
  export interface ChartDataPoint {
    month: string;
    userScore: number;
    industryScore: number;
    topPerformerScore: number;
  }
  
  export interface DashboardInsights {
    u_id: string;
    overall_score: number;
    strategy_score: number;
    process_score: number;
    technology_score: number;
    industryAvgScore: number;
    topPerformerScore: number;
    benchmarking: BenchmarkingData;
    strengths: ScoreItem[];
    weaknesses: ScoreItem[];
    roadmap: RoadmapItem[];
    chartData: ChartDataPoint[];
    industry?: string;
    promptRetake?: boolean;
  }
  