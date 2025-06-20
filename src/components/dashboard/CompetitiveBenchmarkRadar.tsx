"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

interface CompanyPoint {
  label: string;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
}

interface UserPoint {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
}

interface APIResponse {
  companies: CompanyPoint[];
  user: UserPoint;
}

export default function CompetitiveBenchmarkRadar({ userId }: { userId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/growth_studio/quadrant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: userId }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch benchmark data");
        }

        const result = await res.json();
        
        if (!result.companies || !result.user) {
          throw new Error("Invalid data format received");
        }

        setData(result);
      } catch (err) {
        console.error("❌ Failed to load benchmark data:", err);
        setError(err instanceof Error ? err.message : "Failed to load benchmark data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 80, right: 80, bottom: 80, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2 - 40;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // Add background with gradient
    const backgroundGradient = svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "radarBackgroundGradient")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");

    backgroundGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8fafc")
      .attr("stop-opacity", 0.8);

    backgroundGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.3);

    svg
      .append("circle")
      .attr("r", radius + 20)
      .style("fill", "url(#radarBackgroundGradient)")
      .style("stroke", "#e2e8f0")
      .style("stroke-width", 1);

    // Define dimensions
    const dimensions = [
      { name: "Strategy", icon: "🎯" },
      { name: "Process", icon: "⚙️" },
      { name: "Technology", icon: "🚀" },
      { name: "Overall", icon: "🏆" }
    ];

    const angleSlice = (Math.PI * 2) / dimensions.length;

    // Create scales
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 5]);

    // Draw circular grid
    const levels = 5;
    const gridCircles = svg
      .selectAll(".gridCircle")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => (radius / levels) * d)
      .style("fill", "none")
      .style("stroke", "#e2e8f0")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "2 4");

    // Draw axis lines
    const axisLines = svg
      .selectAll(".axisLine")
      .data(dimensions)
      .enter()
      .append("line")
      .attr("class", "axisLine")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => Math.cos(angleSlice * i - Math.PI / 2) * radius)
      .attr("y2", (d, i) => Math.sin(angleSlice * i - Math.PI / 2) * radius)
      .style("stroke", "#d1d5db")
      .style("stroke-width", 2);

    // Add axis labels
    const axisLabels = svg
      .selectAll(".axisLabel")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axisLabel")
      .attr("transform", (d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = Math.cos(angle) * (radius + 30);
        const y = Math.sin(angle) * (radius + 30);
        return `translate(${x}, ${y})`;
      });

    axisLabels
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text((d, i) => `${d.icon} ${d.name}`);

    // Prepare data for radar
    const radarData = {
      user: {
        strategy: data.user.strategyScore,
        process: data.user.processScore,
        technology: data.user.technologyScore,
        overall: data.user.score
      },
      topPerformer: {
        strategy: Math.max(...data.companies.map(c => c.strategyScore)),
        process: Math.max(...data.companies.map(c => c.processScore)),
        technology: Math.max(...data.companies.map(c => c.technologyScore)),
        overall: Math.max(...data.companies.map(c => c.score))
      },
      industryAvg: {
        strategy: d3.mean(data.companies.map(c => c.strategyScore)) || 0,
        process: d3.mean(data.companies.map(c => c.processScore)) || 0,
        technology: d3.mean(data.companies.map(c => c.technologyScore)) || 0,
        overall: d3.mean(data.companies.map(c => c.score)) || 0
      }
    };

    // Create radar line generator
    const radarLine = d3
      .lineRadial<{ value: number }>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => angleSlice * i - Math.PI / 2);

    // Draw user radar
    const userData = [
      { value: radarData.user.strategy },
      { value: radarData.user.process },
      { value: radarData.user.technology },
      { value: radarData.user.overall }
    ];

    // Create user gradient
    const userGradient = svg.append("defs").append("linearGradient")
      .attr("id", "userRadarGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    userGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.8);
    userGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1d4ed8").attr("stop-opacity", 0.4);

    svg
      .append("path")
      .datum(userData)
      .attr("class", "userRadar")
      .attr("d", radarLine)
      .style("fill", "url(#userRadarGradient)")
      .style("stroke", "#1d4ed8")
      .style("stroke-width", 3)
      .style("opacity", 0.8);

    // Draw industry average radar
    const industryData = [
      { value: radarData.industryAvg.strategy },
      { value: radarData.industryAvg.process },
      { value: radarData.industryAvg.technology },
      { value: radarData.industryAvg.overall }
    ];

    svg
      .append("path")
      .datum(industryData)
      .attr("class", "industryRadar")
      .attr("d", radarLine)
      .style("fill", "none")
      .style("stroke", "#64748b")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "6 3");

    // Draw top performer radar
    const topPerformerData = [
      { value: radarData.topPerformer.strategy },
      { value: radarData.topPerformer.process },
      { value: radarData.topPerformer.technology },
      { value: radarData.topPerformer.overall }
    ];

    // Create top performer gradient
    const topPerformerGradient = svg.append("defs").append("linearGradient")
      .attr("id", "topPerformerRadarGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    topPerformerGradient.append("stop").attr("offset", "0%").attr("stop-color", "#10b981").attr("stop-opacity", 0.3);
    topPerformerGradient.append("stop").attr("offset", "100%").attr("stop-color", "#059669").attr("stop-opacity", 0.1);

    svg
      .append("path")
      .datum(topPerformerData)
      .attr("class", "topPerformerRadar")
      .attr("d", radarLine)
      .style("fill", "url(#topPerformerRadarGradient)")
      .style("stroke", "#059669")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "3 6");

    // Add data points
    const addDataPoints = (data: { value: number }[], color: string, className: string) => {
      svg
        .selectAll(`.${className}-point`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `${className}-point`)
        .attr("r", 4)
        .attr("cx", (d: { value: number }, i: number) => {
          const angle = angleSlice * i - Math.PI / 2;
          return Math.cos(angle) * rScale(d.value);
        })
        .attr("cy", (d: { value: number }, i: number) => {
          const angle = angleSlice * i - Math.PI / 2;
          return Math.sin(angle) * rScale(d.value);
        })
        .style("fill", color)
        .style("stroke", "#ffffff")
        .style("stroke-width", 2);
    };

    addDataPoints(userData, "#1d4ed8", "user");
    addDataPoints(industryData, "#64748b", "industry");
    addDataPoints(topPerformerData, "#059669", "topPerformer");

    // Add performance zones
    const zones = [
      { name: "Excellence", min: 4.5, max: 5.0, color: "#10b981", opacity: 0.1 },
      { name: "Competitive", min: 3.5, max: 4.5, color: "#f59e0b", opacity: 0.08 },
      { name: "Developing", min: 2.5, max: 3.5, color: "#ef4444", opacity: 0.06 }
    ];

    zones.forEach(zone => {
      const zoneData = [
        { value: zone.max },
        { value: zone.max },
        { value: zone.max },
        { value: zone.max }
      ];

      svg
        .append("path")
        .datum(zoneData)
        .attr("class", `zone-${zone.name}`)
        .attr("d", radarLine)
        .style("fill", zone.color)
        .style("opacity", zone.opacity)
        .style("stroke", "none");
    });

    // Add legend
    const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${radius + 60}, -${radius / 2})`);
    
    const legendData = [
      { label: "You", color: "#1d4ed8", pattern: "solid" },
      { label: "Industry Average", color: "#64748b", pattern: "dashed" },
      { label: "Top Performers", color: "#059669", pattern: "dotted" }
    ];

    legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .each(function(d) {
        const g = d3.select(this);
        
        g.append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 0)
          .attr("y2", 0)
          .style("stroke", d.color)
          .style("stroke-width", 3)
          .style("stroke-dasharray", d.pattern === "dashed" ? "6 3" : d.pattern === "dotted" ? "3 6" : "none");
        
        g.append("text")
          .attr("x", 30)
          .attr("y", 4)
          .style("font-size", "12px")
          .style("font-weight", "500")
          .style("fill", "#374151")
          .text(d.label);
      });

    // Add performance insights
    const userAvg = (radarData.user.strategy + radarData.user.process + radarData.user.technology + radarData.user.overall) / 4;
    const industryAvg = (radarData.industryAvg.strategy + radarData.industryAvg.process + radarData.industryAvg.technology + radarData.industryAvg.overall) / 4;
    const topPerformerAvg = (radarData.topPerformer.strategy + radarData.topPerformer.process + radarData.topPerformer.technology + radarData.topPerformer.overall) / 4;

    const performanceGap = topPerformerAvg - userAvg;
    const industryGap = userAvg - industryAvg;

    // Add insight text
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", radius + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text(`Performance Gap: ${performanceGap.toFixed(1)} points to top performers`);

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", radius + 80)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", "#6b7280")
      .text(`You're ${industryGap > 0 ? '+' : ''}${industryGap.toFixed(1)} points above industry average`);

  }, [data]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-[500px] bg-gray-100 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">⚠️ Error Loading Benchmark</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader title="📊 Competitive Benchmark Radar" subtitle="Multi-dimensional comparison against industry peers and top performers" />
      
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Comprehensive analysis of your competitive positioning across all key dimensions compared to industry benchmarks.
      </p>

      <div className="relative">
        <svg ref={svgRef} className="w-full" style={{ height: "500px" }} />
      </div>

      {/* Performance summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-lg">💡</div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Competitive Insights</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your radar profile shows strong positioning in key areas. Focus on closing gaps in underperforming dimensions 
              to reach top performer status.
            </p>
          </div>
        </div>
      </div>

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {data?.companies.length || 0} companies benchmarked
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>
    </motion.div>
  );
} 