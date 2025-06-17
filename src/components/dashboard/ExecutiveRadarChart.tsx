//src/components/dashboard/ExecutiveRadarChart.tsx
"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import SectionTitleBar from "./SectionTitleBar";

interface Props {
  strategy: number;
  process: number;
  technology: number;
  industryAvg: number;
  topPerformer: number;
}

const ExecutiveRadarChart: React.FC<Props> = ({
  strategy,
  process,
  technology,
  industryAvg,
  topPerformer,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Data setup
    const data = [
      { axis: "Strategy", value: strategy },
      { axis: "Process", value: process },
      { axis: "Technology", value: technology },
    ];

    const industryData = [
      { axis: "Strategy", value: industryAvg },
      { axis: "Process", value: industryAvg },
      { axis: "Technology", value: industryAvg },
    ];

    const topPerformerData = [
      { axis: "Strategy", value: topPerformer },
      { axis: "Process", value: topPerformer },
      { axis: "Technology", value: topPerformer },
    ];

    // Chart dimensions and margins
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Create SVG group
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // Scale setup
    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 5]);

    // Draw the circular grid
    const levels = 5;
    const gridCircles = svg
      .selectAll(".gridCircle")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => (radius / levels) * d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);

    // Draw the axes
    const axes = svg
      .selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    // Add the lines
    axes
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(5) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(5) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("class", "line")
      .style("stroke", "#CDCDCD")
      .style("stroke-width", "1px");

    // Add the labels with improved positioning and styling
    const labelRadius = rScale(5) + 20;
    axes
      .append("text")
      .attr("x", (d, i) => labelRadius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => labelRadius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .attr("fill", "#374151") // text-gray-700
      .text((d) => d.axis);

    // Draw the radar chart
    const radarLine = d3
      .lineRadial<{ axis: string; value: number }>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Add the radar chart for each dataset
    const radarArea = d3
      .areaRadial<{ axis: string; value: number }>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .innerRadius(0)
      .outerRadius((d) => rScale(d.value));

    // Draw the radar chart for "You"
    svg
      .append("path")
      .datum(data)
      .attr("class", "radarArea")
      .attr("d", radarArea)
      .style("fill", "#3b82f6")
      .style("fill-opacity", 0.6)
      .style("stroke", "#3b82f6")
      .style("stroke-width", "2px");

    // Draw the radar chart for "Industry Avg"
    svg
      .append("path")
      .datum(industryData)
      .attr("class", "radarArea")
      .attr("d", radarLine)
      .style("fill", "none")
      .style("stroke", "#6b7280")
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "4,4");

    // Draw the radar chart for "Top Performers"
    svg
      .append("path")
      .datum(topPerformerData)
      .attr("class", "radarArea")
      .attr("d", radarLine)
      .style("fill", "none")
      .style("stroke", "#10b981")
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "2,2");

    // Add dots for each data point
    const dots = svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", "#3b82f6")
      .style("stroke", "#fff")
      .style("stroke-width", "2px");

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

    dots
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d.axis}</strong><br/>
             You: ${d.value.toFixed(1)}<br/>
             Industry Avg: ${industryAvg.toFixed(1)}<br/>
             Top Performers: ${topPerformer.toFixed(1)}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });

    // Cleanup function
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [strategy, process, technology, industryAvg, topPerformer]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="mb-6">
        <SectionTitleBar
          title="🎯 Capability Comparison"
          tooltip="Compare your strategy, process, and technology maturity to industry benchmarks."
        />
        <p className="text-gray-500 text-sm leading-relaxed mt-2">
          Compare your maturity across Strategy, Process, and Technology against industry averages and top performers.
          See how close you are to enterprise excellence.
        </p>
      </div>

      <div className="h-[600px] w-full">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="flex justify-around text-sm text-gray-700 font-medium pt-6 mt-2">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          You
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-600 rounded-sm"></div>
          Industry Avg
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 rounded-sm"></div>
          Top Performers
        </span>
      </div>
    </div>
  );
};

export default ExecutiveRadarChart;
