import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import csv from "csv-parser";
function generateWhyItMatters(trend) {
  const insights = {
    "Data-Driven Decision Making": "Companies using data-driven decision-making see 23% higher profitability and improved customer targeting.",
    "Client Retention Strategies": "Firms with structured retention strategies increase customer lifetime value by up to 35%.",
    "AI-Powered Insights": "Organizations leveraging AI for insights identify market shifts 40% faster than competitors.",
    "AI Automation for Workflows": "Businesses automating workflows reduce operational costs by 30% while improving efficiency.",
  };
  return insights[trend] || "This trend enhances competitive advantage and operational efficiency.";
}

function generateGrowthExplanation(trend) {
  const growthInsights = {
    "Data-Driven Decision Making": "Data-driven firms achieve 20-30% faster revenue growth due to real-time adaptability.",
    "Client Retention Strategies": "Strong retention programs can increase repeat purchases by 50%, stabilizing revenue streams.",
    "AI-Powered Insights": "AI-driven market insights allow businesses to make proactive rather than reactive decisions.",
    "AI Automation for Workflows": "Companies automating workflows see a 2x improvement in process efficiency and accuracy.",
  };
  return growthInsights[trend] || "This trend contributes to sustainable business growth and market resilience.";
}

function generateImpactExplanation(trend) {
  const impactInsights = {
    "Data-Driven Decision Making": "Businesses implementing data-driven strategies outperform competitors by 18% in efficiency.",
    "Client Retention Strategies": "Retention-focused businesses report up to 60% higher net revenue growth vs competitors.",
    "AI-Powered Insights": "Leveraging AI insights can improve forecasting accuracy by 45%, reducing financial risk.",
    "AI Automation for Workflows": "Automated workflows reduce errors by 40%, ensuring smoother business operations.",
  };
  return impactInsights[trend] || "This impact metric reflects industry-leading trends for innovation and profitability.";
}

// ✅ Function to fetch trends for the user's industry
export async function POST(req: Request) {
  try {
    const { industry } = await req.json();
    console.log("🔍 Fetching trends for industry:", industry);

    if (!industry) {
      return NextResponse.json({ error: "Missing industry parameter" }, { status: 400 });
    }

    const trendsPath = path.resolve(process.cwd(), "ml/industry_trends.csv");
    const trends: any[] = [];

    // ✅ Read CSV and filter trends
    if (fs.existsSync(trendsPath)) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(trendsPath)
          .pipe(csv())
          .on("data", (row) => {
            if (row.industry === industry) {
              trends.push({
                trend: row.emerging_trends,
                aiAdoption: parseFloat(row.AI_adoption_rate),
                growthPotential: parseFloat(row.growth_potential),
                impactScore: (!isNaN(parseFloat(row.relevance)) ? parseFloat(row.relevance) : 1) *
                 (!isNaN(parseFloat(row.growth_potential)) ? parseFloat(row.growth_potential) : 1),
                whyItMatters: generateWhyItMatters(row.emerging_trends),
                growthPotentialExplanation: `Rated ${row.growth_potential}/10 – ${generateGrowthExplanation(row.emerging_trends)}`,
                impactScoreExplanation: `Impact Score: ${!isNaN(parseFloat(trends[trends.length - 1]?.impactScore)) ? parseFloat(trends[trends.length - 1]?.impactScore).toFixed(1) : "N/A"} – ${generateImpactExplanation(row.emerging_trends)}`,

              });
              
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });
    }

    // ✅ Ensure unique trends before returning
    const uniqueTrends = Array.from(new Map(trends.map((t) => [t.trend, t])).values());

    // ✅ Sort by impact score (highest first)
    uniqueTrends.sort((a, b) => b.impactScore - a.impactScore);
    const topTrends = uniqueTrends.slice(0, 5); // Return only top 5 trends

    console.log("🔥 Filtered Unique Top Trends:", topTrends);

    return NextResponse.json({ industry, topTrends });

  } catch (error) {
    console.error("🚨 Error fetching trends:", error);
    return NextResponse.json({ error: "Failed to retrieve trends" }, { status: 500 });
  }
}
