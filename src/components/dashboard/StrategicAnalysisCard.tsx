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

    // Setup dimensions - MUCH LARGER for executive view with better spacing
    const margin = { top: 80, right: 80, bottom: 80, left: 80 }; // Increased margins for breathing room
    const width = quadrantSvgRef.current.clientWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom; // Increased from 500 to 600

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

    // Reduced bubble sizes to prevent overlap
    const sizeScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([8, 22]); // Reduced from 15-45 to 8-22 (about half the size)

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
    strategicBuildersGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.1);
    strategicBuildersGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1d4ed8").attr("stop-opacity", 0.05);

    const acceleratedPerformersGradient = defs.append("linearGradient")
      .attr("id", "acceleratedPerformersGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    acceleratedPerformersGradient.append("stop").attr("offset", "0%").attr("stop-color", "#10b981").attr("stop-opacity", 0.1);
    acceleratedPerformersGradient.append("stop").attr("offset", "100%").attr("stop-color", "#059669").attr("stop-opacity", 0.05);

    const emergingFoundationsGradient = defs.append("linearGradient")
      .attr("id", "emergingFoundationsGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    emergingFoundationsGradient.append("stop").attr("offset", "0%").attr("stop-color", "#f59e0b").attr("stop-opacity", 0.1);
    emergingFoundationsGradient.append("stop").attr("offset", "100%").attr("stop-color", "#d97706").attr("stop-opacity", 0.05);

    const efficientExecutorsGradient = defs.append("linearGradient")
      .attr("id", "efficientExecutorsGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    efficientExecutorsGradient.append("stop").attr("offset", "0%").attr("stop-color", "#8b5cf6").attr("stop-opacity", 0.1);
    efficientExecutorsGradient.append("stop").attr("offset", "100%").attr("stop-color", "#7c3aed").attr("stop-opacity", 0.05);

    // Draw quadrants
    quadrants.forEach((quadrant, index) => {
      svg
        .append("rect")
        .attr("x", xScale(quadrant.x1))
        .attr("y", yScale(quadrant.y2))
        .attr("width", xScale(quadrant.x2) - xScale(quadrant.x1))
        .attr("height", yScale(quadrant.y1) - yScale(quadrant.y2))
        .style("fill", quadrant.fill)
        .style("rx", "8")
        .style("ry", "8");

      // Calculate text dimensions for proper centering
      const labelText = quadrant.label;
      const descriptionText = quadrant.description;
      
      // Estimate text width (approximate - in a real app you'd measure actual text)
      const labelWidth = labelText.length * 9; // Approximate character width
      const descriptionWidth = descriptionText.length * 7; // Smaller font
      const maxTextWidth = Math.max(labelWidth, descriptionWidth);
      
      // Position labels in corners based on quadrant
      let labelX, labelY, textAnchor, dominantBaseline;
      let bgX, bgY, bgWidth, bgHeight;
      
      if (index === 0) { // Strategic Builders (top-left)
        labelX = xScale(quadrant.x1) + 20;
        labelY = yScale(quadrant.y2) + 20;
        textAnchor = "start";
        dominantBaseline = "hanging";
        bgX = labelX - 5;
        bgY = labelY - 5;
        bgWidth = maxTextWidth + 10;
        bgHeight = 60;
      } else if (index === 1) { // Accelerated Performers (top-right)
        labelX = xScale(quadrant.x2) - 20;
        labelY = yScale(quadrant.y2) + 20;
        textAnchor = "end";
        dominantBaseline = "hanging";
        bgX = labelX - maxTextWidth - 5;
        bgY = labelY - 5;
        bgWidth = maxTextWidth + 10;
        bgHeight = 60;
      } else if (index === 2) { // Emerging Foundations (bottom-left)
        labelX = xScale(quadrant.x1) + 20;
        labelY = yScale(quadrant.y1) - 20;
        textAnchor = "start";
        dominantBaseline = "auto";
        bgX = labelX - 5;
        bgY = labelY - 55;
        bgWidth = maxTextWidth + 10;
        bgHeight = 60;
      } else { // Efficient Executors (bottom-right)
        labelX = xScale(quadrant.x2) - 20;
        labelY = yScale(quadrant.y1) - 20;
        textAnchor = "end";
        dominantBaseline = "auto";
        bgX = labelX - maxTextWidth - 5;
        bgY = labelY - 55;
        bgWidth = maxTextWidth + 10;
        bgHeight = 60;
      }

      // Add background for better text readability - properly centered
      // svg
      //   .append("rect")
      //   .attr("x", bgX)
      //   .attr("y", bgY)
      //   .attr("width", bgWidth)
      //   .attr("height", bgHeight)
      //   .style("fill", "rgba(255, 255, 255, 0.95)")
      //   .style("rx", "8")
      //   .style("ry", "8")
      //   .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))");

      // Add label text
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY - 8)
        .attr("text-anchor", textAnchor)
        .attr("dominant-baseline", dominantBaseline)
        .style("font-size", "16px")
        .style("font-weight", "700")
        .style("fill", "#374151")
        .text(quadrant.label);

      // Add description text
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY + 12)
        .attr("text-anchor", textAnchor)
        .attr("dominant-baseline", dominantBaseline)
        .style("font-size", "12px")
        .style("fill", "#6b7280")
        .text(quadrant.description);
    });

    // Add grid lines
    const gridLines = svg.append("g").attr("class", "grid");

    // Vertical grid lines
    gridLines
      .selectAll(".grid-line-vertical")
      .data(xScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "grid-line-vertical")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "#e5e7eb")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "2 2");

    // Horizontal grid lines
    gridLines
      .selectAll(".grid-line-horizontal")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "grid-line-horizontal")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .style("stroke", "#e5e7eb")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "2 2");

    // Add axis labels with larger text and better positioning
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "700")
      .style("fill", "#374151")
      .text("Strategy Score");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "700")
      .style("fill", "#374151")
      .text("Process Score");

    // Add axis tick marks (1-5)
    const tickValues = [1, 2, 3, 4, 5];
    
    // X-axis tick marks (bottom)
    svg
      .selectAll(".x-tick")
      .data(tickValues)
      .enter()
      .append("g")
      .attr("class", "x-tick")
      .attr("transform", d => `translate(${xScale(d)}, ${height + 10})`)
      .each(function(d) {
        const g = d3.select(this);
        
        // Tick line
        g.append("line")
          .attr("y1", 0)
          .attr("y2", 6)
          .style("stroke", "#6b7280")
          .style("stroke-width", 2);
        
        // Tick label
        g.append("text")
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "600")
          .style("fill", "#374151")
          .text(d);
      });

    // Y-axis tick marks (left)
    svg
      .selectAll(".y-tick")
      .data(tickValues)
      .enter()
      .append("g")
      .attr("class", "y-tick")
      .attr("transform", d => `translate(-10, ${yScale(d)})`)
      .each(function(d) {
        const g = d3.select(this);
        
        // Tick line
        g.append("line")
          .attr("x1", 0)
          .attr("x2", -6)
          .style("stroke", "#6b7280")
          .style("stroke-width", 2);
        
        // Tick label
        g.append("text")
          .attr("x", -15)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .style("font-size", "14px")
          .style("font-weight", "600")
          .style("fill", "#374151")
          .text(d);
      });

    // Add data points with better spacing and visibility
    const points = svg
      .selectAll(".data-point")
      .data(allData)
      .enter()
      .append("g")
      .attr("class", "data-point")
      .style("cursor", "pointer");

    // Add circles with better sizing and enhanced user visibility
    points
      .append("circle")
      .attr("cx", d => xScale(d.strategy_score))
      .attr("cy", d => yScale(d.process_score))
      .attr("r", d => sizeScale(d.technology_score))
      .style("fill", d => d.name === "You" ? "#1d4ed8" : "#64748b")
      .style("stroke", "#ffffff")
      .style("stroke-width", d => d.name === "You" ? 4 : 3)
      .style("opacity", d => d.name === "You" ? 0.9 : 0.7)
      .style("filter", d => d.name === "You" ? "drop-shadow(0 2px 4px rgba(29, 78, 216, 0.3))" : "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("opacity", 1)
          .style("stroke-width", d.name === "You" ? 5 : 4)
          .style("filter", d.name === "You" ? "drop-shadow(0 3px 6px rgba(29, 78, 216, 0.5))" : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))");
        setHoveredPoint(`${d.name}: Strategy ${d.strategy_score.toFixed(1)}, Process ${d.process_score.toFixed(1)}, Technology ${d.technology_score.toFixed(1)}`);
      })
      .on("mouseout", function() {
        const d = d3.select(this).datum() as any;
        d3.select(this)
          .style("opacity", d.name === "You" ? 0.9 : 0.7)
          .style("stroke-width", d.name === "You" ? 4 : 3)
          .style("filter", d.name === "You" ? "drop-shadow(0 2px 4px rgba(29, 78, 216, 0.3))" : "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))");
        setHoveredPoint(null);
      });

    // Add labels for user point with better visibility
    points
      .append("text")
      .attr("x", d => xScale(d.strategy_score))
      .attr("y", d => yScale(d.process_score) - sizeScale(d.technology_score) - 15)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "700")
      .style("fill", d => d.name === "You" ? "#1d4ed8" : "#64748b")
      .style("opacity", d => d.name === "You" ? 1 : 0)
      .style("text-shadow", "0 1px 2px rgba(255, 255, 255, 0.8)")
      .text(d => d.name);

  }, [data]);

  // Render Radar Chart
  useEffect(() => {
    if (!radarSvgRef.current || !data) return;

    // Clear previous chart
    d3.select(radarSvgRef.current).selectAll("*").remove();

    // Setup dimensions - MUCH LARGER for executive view
    const margin = { top: 80, right: 80, bottom: 80, left: 80 }; // Increased margins
    const width = radarSvgRef.current.clientWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom; // Increased from 500 to 600
    const radius = Math.min(width, height) / 2 - 60; // Increased radius for better visibility

    // Create SVG
    const svg = d3
      .select(radarSvgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

    // Add background circle with enhanced styling
    svg
      .append("circle")
      .attr("r", radius)
      .style("fill", "url(#radarBackgroundGradient)")
      .style("stroke", "#e5e7eb")
      .style("stroke-width", 2)
      .style("filter", "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))");

    // Create background gradient
    const backgroundGradient = svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "radarBackgroundGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    backgroundGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8fafc")
      .attr("stop-opacity", 0.9);

    backgroundGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.4);

    // Prepare radar data
    const radarData = {
      user: {
        strategy: data.user.strategyScore,
        process: data.user.processScore,
        technology: data.user.technologyScore,
        overall: data.user.score
      },
      industryAvg: {
        strategy: 3.2,
        process: 3.1,
        technology: 3.3,
        overall: 3.2
      },
      topPerformer: {
        strategy: 4.5,
        process: 4.4,
        technology: 4.6,
        overall: 4.5
      }
    };

    // Create scales
    const rScale = d3.scaleLinear().domain([0, 5]).range([0, radius]);
    const angleSlice = (Math.PI * 2) / 4;

    // Create radar line generator
    const radarLine = d3.lineRadial<{ value: number }>()
      .radius(d => rScale(d.value))
      .angle((d, i) => angleSlice * i - Math.PI / 2);

    // Add concentric circles with enhanced styling
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      
      // Add subtle background fill for each level
      svg
        .append("circle")
        .attr("r", levelRadius)
        .style("fill", i % 2 === 0 ? "rgba(59, 130, 246, 0.02)" : "rgba(16, 185, 129, 0.02)")
        .style("stroke", "none");

      svg
        .append("circle")
        .attr("r", levelRadius)
        .style("fill", "none")
        .style("stroke", "#e5e7eb")
        .style("stroke-width", 1.5)
        .style("stroke-dasharray", "2 2");

      // Add level labels with better positioning
      svg
        .append("text")
        .attr("x", 0)
        .attr("y", -levelRadius + 20)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", "#6b7280")
        .text(i);
    }

    // Add axis lines and labels with enhanced styling
    const axisLabels = ["Strategy", "Process", "Technology", "Overall"];
    axisLabels.forEach((label, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * (radius + 40);
      const y = Math.sin(angle) * (radius + 40);

      // Add axis lines with better styling
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", Math.cos(angle) * radius)
        .attr("y2", Math.sin(angle) * radius)
        .style("stroke", "#d1d5db")
        .style("stroke-width", 2);

      // Add axis labels with background for better readability
      const labelGroup = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);

      // Add background rectangle for label
      const labelText = labelGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .style("fill", "#374151")
        .text(label);

      // Get text dimensions and add background
      const bbox = (labelText.node() as SVGTextElement).getBBox();
      labelGroup.insert("rect", "text")
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 4)
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 8)
        .style("fill", "rgba(255, 255, 255, 0.9)")
        .style("rx", "4")
        .style("ry", "4")
        .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))");

      // Move text to front
      labelText.raise();
    });

    // POLAR AREA STYLE (amCharts-like) — wedges per axis, keeping our data/colors
    // Gradients for user wedges
    const defsPolar = svg.append("defs");
    const userPolarGradient = defsPolar.append("linearGradient")
      .attr("id", "userPolarGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    userPolarGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.9);
    userPolarGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1d4ed8").attr("stop-opacity", 0.7);

    const sectorWidth = angleSlice * 0.7; // leave gaps between sectors

    const axisValues = [
      { key: "strategy", i: 0 },
      { key: "process", i: 1 },
      { key: "technology", i: 2 },
      { key: "overall", i: 3 }
    ] as const;

    const getAngleCenter = (i: number) => angleSlice * i - Math.PI / 2;

    // Draw bands for industry and top performer as thin ring segments per axis
    axisValues.forEach(({ key, i }) => {
      const center = getAngleCenter(i);
      const start = center - sectorWidth / 2;
      const end = center + sectorWidth / 2;

      const industryVal = (radarData.industryAvg as any)[key];
      const topVal = (radarData.topPerformer as any)[key];
      const userVal = (radarData.user as any)[key];

      const arc = d3.arc<any>();

      // Industry band (neutral)
      svg.append("path")
        .attr("d", arc({ innerRadius: Math.max(0, rScale(industryVal) - 5), outerRadius: rScale(industryVal), startAngle: start, endAngle: end }))
        .style("fill", "#94a3b8")
        .style("opacity", 0.35);

      // Top performer band (green)
      svg.append("path")
        .attr("d", arc({ innerRadius: Math.max(0, rScale(topVal) - 5), outerRadius: rScale(topVal), startAngle: start, endAngle: end }))
        .style("fill", "#10b981")
        .style("opacity", 0.35);

      // User wedge (primary, full sector)
      svg.append("path")
        .attr("d", arc({ innerRadius: 0, outerRadius: rScale(userVal), startAngle: start, endAngle: end }))
        .style("fill", "url(#userPolarGradient)")
        .style("filter", "drop-shadow(0 4px 8px rgba(29, 78, 216, 0.25))");

      // Value badge dot at wedge tip
      const tipX = Math.cos(center) * rScale(userVal);
      const tipY = Math.sin(center) * rScale(userVal);
      svg.append("circle")
        .attr("cx", tipX)
        .attr("cy", tipY)
        .attr("r", 5)
        .style("fill", "#1d4ed8")
        .style("stroke", "#fff")
        .style("stroke-width", 2);
    });

    // Legend
    const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${radius + 60}, -${radius / 2})`);
    const legendData = [
      { label: "You", color: "#1d4ed8" },
      { label: "Industry Avg (band)", color: "#94a3b8" },
      { label: "Top Performer (band)", color: "#10b981" }
    ];
    legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 26})`)
      .each(function(d) {
        const g = d3.select(this);
        g.append("rect").attr("width", 18).attr("height", 12).attr("rx", 2).attr("ry", 2).style("fill", d.color).style("opacity", d.label.startsWith("You") ? 1 : 0.35);
        g.append("text").attr("x", 26).attr("y", 10).style("font-size", "13px").style("fill", "#374151").text(d.label);
      });

  }, [data]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-[600px] bg-gray-100 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
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
      className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader 
        title="🎯 Strategic Analysis" 
        subtitle="Comprehensive competitive positioning and benchmark analysis to understand your market position" 
      />
      
      {/* Executive-level chart layout - Full width, larger charts */}
      <div className="space-y-8">
        {/* Quadrant Chart - Full Width */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Strategic Growth Quadrant</h3>
            <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Position Analysis
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <svg ref={quadrantSvgRef} className="w-full" style={{ height: "600px" }} />
          </div>
          
          {hoveredPoint && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <p className="text-sm text-blue-700 font-medium">{hoveredPoint}</p>
            </motion.div>
          )}
        </div>

        {/* Radar Chart - Full Width */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Competitive Benchmark Analysis</h3>
            <div className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Multi-dimensional
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <svg ref={radarSvgRef} className="w-full" style={{ height: "600px" }} />
          </div>
          
          <div className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Compare your performance across Strategy, Process, Technology, and Overall metrics against industry benchmarks and top performers.
          </div>
        </div>
      </div>

      {/* Executive-style footer */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            {data?.companies.length || 0} companies analyzed
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai • Strategic Intelligence</span>
        </div>
      </div>
    </motion.div>
  );
} 