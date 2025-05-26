// Map semantic keys to scoring map keys
export const salesSemanticToScoringKeyMap: Record<string, Record<string, string>> = {
  "score_1": {
    "lead_generation": "lead_generation",
    "sales_process": "sales_process",
    "pipeline_tracking": "pipeline_tracking",
    "sales_team": "sales_team",
    "follow_ups": "follow_ups",
    "lead_qualification": "lead_qualification",
    "pricing_proposals": "pricing_proposals",
    "sales_metrics": "sales_metrics"
  },
  "score_1_5": {
    "lead_assignment": "lead_assignment",
    "forecast_confidence": "forecast_confidence",
    "pipeline_review": "pipeline_review",
    "sales_discovery": "sales_discovery",
    "deal_progression": "deal_progression",
    "stage_consistency": "stage_consistency"
  },
  "score_2": {
    "sales_stages": "sales_stages",
    "pipeline_accuracy": "pipeline_accuracy",
    "lead_prioritization": "lead_prioritization",
    "followup_management": "followup_management",
    "sales_preparation": "sales_preparation",
    "call_documentation": "call_documentation",
    "handoff_process": "handoff_process"
  },
  "score_2_5": {
    "activity_tracking": "activity_management",
    "sales_targets": "sales_targets",
    "sales_reporting": "reporting_system",
    "strategy_adjustment": "strategy_adjustment",
    "pipeline_review_frequency": "performance_review",
    "deal_insights": "sales_communication",
    "stage_consistency": "pipeline_management"
  },
  "score_3": {
    "deal_velocity": "deal_velocity",
    "forecast_accuracy": "forecast_accuracy",
    "sales_optimization": "sales_optimization",
    "performance_analytics": "performance_analytics",
    "sales_metrics": "sales_metrics",
    "pricing_strategy": "pricing_strategy"
  },
  "score_3_5": {
    "roi_measurement": "roi_measurement",
    "sales_effectiveness": "sales_effectiveness",
    "sales_optimization": "sales_optimization",
    "performance_monitoring": "performance_monitoring",
    "sales_analytics": "sales_analytics",
    "pricing_optimization": "pricing_optimization"
  },
  "score_4": {
    "data_driven_strategy": "data_driven_strategy",
    "sales_methodology": "sales_methodology",
    "sales_intelligence": "sales_intelligence",
    "resource_allocation": "resource_allocation",
    "lead_scoring": "lead_scoring",
    "process_adaptation": "process_adaptation"
  },
  "score_4_5": {
    "team_capacity": "team_capacity",
    "sales_experimentation": "sales_experimentation",
    "sales_insights": "sales_insights",
    "resource_planning": "resource_planning",
    "lead_evaluation": "lead_evaluation",
    "process_evolution": "process_evolution"
  },
  "score_5": {
    "customer_feedback": "customer_feedback",
    "sales_culture": "sales_culture",
    "sales_automation": "sales_automation",
    "resource_strategy": "resource_strategy",
    "opportunity_assessment": "opportunity_assessment",
    "process_innovation": "process_innovation"
  }
}; 