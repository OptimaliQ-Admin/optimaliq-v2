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

export default function StrategicAnalysisCard({ userId }: { userId: string }) {
  const quadrantSvgRef = useRef<SVGSVGElement>(null);
  const radarSvgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
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
          throw new Error(errorData.error || "Failed to fetch strategic data");
        }

        const result = await res.json();
        
        if (!result.companies || !result.user) {
          throw new Error("Invalid data format received");
        }

        setData(result);
      } catch (err) {
        console.error("❌ Failed to load strategic data:", err);
        setError(err instanceof Error ? err.message : "Failed to load strategic data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Render Quadrant Chart
  useEffect(() => {
    if (!quadrantSvgRef.current || !data) return;

    // Clear previous chart
    d3.select(quadrantSvgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = quadrantSvgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(quadrantSvgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background with gradient
    const backgroundGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "quadrantBackgroundGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

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
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "url(#quadrantBackgroundGradient)")
      .style("rx", "12")
      .style("ry", "12")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))");

    // Normalize data
    const normalizedCompanies = data.companies.map((company) => ({
      name: company.label,
      strategy_score: company.strategyScore,
      process_score: company.processScore,
      technology_score: company.technologyScore,
    }));

    const normalizedUser = {
      name: "You",
      strategy_score: data.user.strategyScore,
      process_score: data.user.processScore,
      technology_score: data.user.technologyScore,
    };

    const allData = [...normalizedCompanies, normalizedUser];

    // Calculate bounds with padding
    const strategyValues = allData.map(d => d.strategy_score);
    const processValues = allData.map(d => d.process_score);

    const minX = Math.floor(Math.min(...strategyValues)) - 0.3;
    const maxX = Math.ceil(Math.max(...strategyValues)) + 0.3;
    const minY = Math.floor(Math.min(...processValues)) - 0.3;
    const maxY = Math.ceil(Math.max(...processValues)) + 0.3;

    const quadrantMidX = 3;
    const quadrantMidY = 3;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);

    const sizeScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([20, 60]); // Smaller for combined view

    // Add quadrant backgrounds with Salesforce-style gradients
    const quadrants = [
      { 
        x1: minX, x2: quadrantMidX, y1: quadrantMidY, y2: maxY, 
        fill: "url(#strategicBuildersGradient)", 
        label: "Strategic Builders",
        description: "Strong strategy, developing processes"
      },
      { 
        x1: quadrantMidX, x2: maxX, y1: quadrantMidY, y2: maxY, 
        fill: "url(#acceleratedPerformersGradient)", 
        label: "Accelerated Performers",
        description: "High strategy & process maturity"
      },
      { 
        x1: minX, x2: quadrantMidX, y1: minY, y2: quadrantMidY, 
        fill: "url(#emergingFoundationsGradient)", 
        label: "Emerging Foundations",
        description: "Building core capabilities"
      },
      { 
        x1: quadrantMidX, x2: maxX, y1: minY, y2: quadrantMidY, 
        fill: "url(#efficientExecutorsGradient)", 
        label: "Efficient Executors",
        description: "Strong processes, evolving strategy"
      },
    ];

    // Create quadrant gradients
    const defs = svg.append("defs");
    
    const strategicBuildersGradient = defs.append("linearGradient")
      .attr("id", "strategicBuildersGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    strategicBuildersGradient.append("stop").attr("offset", "0%").attr("stop-color", "#dbeafe").attr("stop-opacity", 0.3);
    strategicBuildersGradient.append("stop").attr("offset", "100%").attr("stop-color", "#bfdbfe").attr("stop-opacity", 0.1);

    const acceleratedPerformersGradient = defs.append("linearGradient")
      .attr("id", "acceleratedPerformersGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    acceleratedPerformersGradient.append("stop").attr("offset", "0%").attr("stop-color", "#dcfce7").attr("stop-opacity", 0.3);
    acceleratedPerformersGradient.append("stop").attr("offset", "100%").attr("stop-color", "#bbf7d0").attr("stop-opacity", 0.1);

    const emergingFoundationsGradient = defs.append("linearGradient")
      .attr("id", "emergingFoundationsGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    emergingFoundationsGradient.append("stop").attr("offset", "0%").attr("stop-color", "#fef9c3").attr("stop-opacity", 0.3);
    emergingFoundationsGradient.append("stop").attr("offset", "100%").attr("stop-color", "#fde68a").attr("stop-opacity", 0.1);

    const efficientExecutorsGradient = defs.append("linearGradient")
      .attr("id", "efficientExecutorsGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    efficientExecutorsGradient.append("stop").attr("offset", "0%").attr("stop-color", "#ede9fe").attr("stop-opacity", 0.3);
    efficientExecutorsGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ddd6fe").attr("stop-opacity", 0.1);

    quadrants.forEach(quad => {
      svg
        .append("rect")
        .attr("x", xScale(quad.x1))
        .attr("y", yScale(quad.y2))
        .attr("width", xScale(quad.x2) - xScale(quad.x1))
        .attr("height", yScale(quad.y1) - yScale(quad.y2))
        .style("fill", quad.fill)
        .style("stroke", "#e2e8f0")
        .style("stroke-width", 1)
        .style("rx", "6")
        .style("ry", "6");

      // Add quadrant labels with better spacing for smaller view
      const labelX = quad.x1 === minX ? xScale(quad.x1) + 25 : xScale(quad.x2) - 25;
      const labelY = quad.y1 === minY ? yScale(quad.y1) - 25 : yScale(quad.y2) + 25;
      const textAnchor = quad.x1 === minX ? "start" : "end";
      const dominantBaseline = quad.y1 === minY ? "auto" : "hanging";
      
      // Add main label
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", textAnchor)
        .attr("dominant-baseline", dominantBaseline)
        .style("font-size", "10px")
        .style("font-weight", "700")
        .style("fill", "#374151")
        .text(quad.label);

      // Add description with proper spacing
      const descY = quad.y1 === minY ? labelY - 15 : labelY + 15;
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", descY)
        .attr("text-anchor", textAnchor)
        .attr("dominant-baseline", dominantBaseline)
        .style("font-size", "8px")
        .style("font-weight", "500")
        .style("fill", "#6b7280")
        .text(quad.description);
    });

    // Add midlines
    svg
      .append("line")
      .attr("x1", xScale(quadrantMidX))
      .attr("x2", xScale(quadrantMidX))
      .attr("y1", yScale(minY))
      .attr("y2", yScale(maxY))
      .style("stroke", "#d1d5db")
      .style("stroke-width", 1.5)
      .style("stroke-dasharray", "3 3");

    svg
      .append("line")
      .attr("x1", xScale(minX))
      .attr("x2", xScale(maxX))
      .attr("y1", yScale(quadrantMidY))
      .attr("y2", yScale(quadrantMidY))
      .style("stroke", "#d1d5db")
      .style("stroke-width", 1.5)
      .style("stroke-dasharray", "3 3");

    // Add company dots
    svg
      .selectAll(".company-dot")
      .data(normalizedCompanies)
      .enter()
      .append("circle")
      .attr("class", "company-dot")
      .attr("cx", d => xScale(d.strategy_score))
      .attr("cy", d => yScale(d.process_score))
      .attr("r", d => Math.sqrt(sizeScale(d.technology_score)) / 2)
      .style("fill", "#cbd5e1")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("opacity", 0.7)
      .style("transition", "all 0.3s ease")
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))")
      .on("mouseover", function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.sqrt(sizeScale(d.technology_score)) / 2 + 5)
          .style("opacity", 1)
          .style("stroke-width", 3)
          .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))");

        setHoveredPoint(d.name);
      })
      .on("mouseout", function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.sqrt(sizeScale(d.technology_score)) / 2)
          .style("opacity", 0.7)
          .style("stroke-width", 2)
          .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))");

        setHoveredPoint(null);
      });

    // Add user dot
    const userRadius = Math.sqrt(sizeScale(normalizedUser.technology_score)) / 2;
    svg
      .append("circle")
      .attr("class", "user-dot")
      .attr("cx", xScale(normalizedUser.strategy_score))
      .attr("cy", yScale(normalizedUser.process_score))
      .attr("r", userRadius)
      .style("fill", "url(#userGradient)")
      .style("stroke", "#ffffff")
      .style("stroke-width", 3)
      .style("filter", "drop-shadow(0 2px 6px rgba(37, 99, 235, 0.3))")
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", userRadius + 5)
          .style("stroke-width", 4)
          .style("filter", "drop-shadow(0 3px 8px rgba(37, 99, 235, 0.5))");
        setHoveredPoint("You");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", userRadius)
          .style("stroke-width", 3)
          .style("filter", "drop-shadow(0 2px 6px rgba(37, 99, 235, 0.3))");
        setHoveredPoint(null);
      });

    // Create user gradient
    const userGradient = defs.append("radialGradient")
      .attr("id", "userGradient")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    userGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6");
    userGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1d4ed8");

    // Add user label
    svg
      .append("text")
      .attr("class", "user-label")
      .attr("x", xScale(normalizedUser.strategy_score))
      .attr("y", yScale(normalizedUser.process_score) - userRadius - 8)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "700")
      .style("fill", "#1d4ed8")
      .text("You");

    // Add axis labels
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 25)
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Strategy");

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -25)
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Process");

  }, [data]);

  // Render Radar Chart
  useEffect(() => {
    if (!radarSvgRef.current || !data) return;

    // Clear previous chart
    d3.select(radarSvgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = radarSvgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2 - 30;

    // Create SVG
    const svg = d3
      .select(radarSvgRef.current)
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
      .attr("r", radius + 15)
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
      .style("stroke-width", 1.5);

    // Add axis labels
    const axisLabels = svg
      .selectAll(".axisLabel")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axisLabel")
      .attr("transform", (d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = Math.cos(angle) * (radius + 20);
        const y = Math.sin(angle) * (radius + 20);
        return `translate(${x}, ${y})`;
      });

    axisLabels
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "10px")
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
      .style("stroke-width", 2.5)
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
      .style("stroke-dasharray", "4 2");

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
      .style("stroke-dasharray", "2 4");

    // Add data points
    const addDataPoints = (data: { value: number }[], color: string, className: string) => {
      svg
        .selectAll(`.${className}-point`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `${className}-point`)
        .attr("r", 3)
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
        .style("stroke-width", 1.5);
    };

    addDataPoints(userData, "#1d4ed8", "user");
    addDataPoints(industryData, "#64748b", "industry");
    addDataPoints(topPerformerData, "#059669", "topPerformer");

    // Add legend
    const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${radius + 40}, -${radius / 2})`);
    
    const legendData = [
      { label: "You", color: "#1d4ed8", pattern: "solid" },
      { label: "Industry", color: "#64748b", pattern: "dashed" },
      { label: "Top Performers", color: "#059669", pattern: "dotted" }
    ];

    legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function(d) {
        const g = d3.select(this);
        
        g.append("line")
          .attr("x1", 0)
          .attr("x2", 15)
          .attr("y1", 0)
          .attr("y2", 0)
          .style("stroke", d.color)
          .style("stroke-width", 2)
          .style("stroke-dasharray", d.pattern === "dashed" ? "4 2" : d.pattern === "dotted" ? "2 4" : "none");
        
        g.append("text")
          .attr("x", 20)
          .attr("y", 3)
          .style("font-size", "9px")
          .style("font-weight", "500")
          .style("fill", "#374151")
          .text(d.label);
      });

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
          <div className="h-[400px] bg-gray-100 rounded-xl"></div>
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
          <p className="font-semibold mb-2">⚠️ Error Loading Strategic Analysis</p>
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
      <SectionHeader title="🎯 Strategic Analysis" subtitle="Competitive positioning and benchmark analysis" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quadrant Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 text-sm">Strategic Growth Quadrant</h4>
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Position Analysis
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <svg ref={quadrantSvgRef} className="w-full" style={{ height: "300px" }} />
          </div>
          
          {hoveredPoint && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">{hoveredPoint}</p>
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 text-sm">Competitive Benchmark</h4>
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Multi-dimensional
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <svg ref={radarSvgRef} className="w-full" style={{ height: "300px" }} />
          </div>
          
          <div className="text-xs text-gray-600 leading-relaxed">
            Compare your performance across Strategy, Process, Technology, and Overall metrics against industry benchmarks.
          </div>
        </div>
      </div>

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {data?.companies.length || 0} companies analyzed
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>
    </motion.div>
  );
} 