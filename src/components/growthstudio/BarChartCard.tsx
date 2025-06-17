"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

interface CompanyData {
  label: string;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
}

interface UserData {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
}

interface Props {
  companies: CompanyData[];
  userData: UserData;
  selectedCompany: string | null;
  onSelectCompany: (company: string | null) => void;
}

export default function BarChartCard({ companies, userData, selectedCompany, onSelectCompany }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 60, right: 40, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background rectangle
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "#f9fafb")
      .style("rx", "8")
      .style("ry", "8")
      .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))");

    // Prepare data
    const metrics = ["Strategy", "Process", "Technology"];
    const data = companies.map((company) => ({
      label: company.label,
      Strategy: company.strategyScore,
      Process: company.processScore,
      Technology: company.technologyScore,
    }));

    // Add user data
    data.push({
      label: "You",
      Strategy: userData.strategyScore,
      Process: userData.processScore,
      Technology: userData.technologyScore,
    });

    // Scales
    const x0 = d3.scaleBand().domain(data.map((d) => d.label)).range([0, width]).padding(0.2);
    const x1 = d3.scaleBand().domain(metrics).range([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, 5]).range([height, 0]);

    // Add grid lines
    const gridLines = [1, 2, 3, 4, 5];
    gridLines.forEach((value) => {
      svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(value))
        .attr("y2", y(value))
        .style("stroke", "#e5e7eb")
        .style("stroke-width", value === 3 ? 1.5 : 1)
        .style("stroke-dasharray", "4 4");
    });

    // Add axes
    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y).ticks(5);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .style("color", "#6b7280")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .style("color", "#6b7280")
      .style("font-size", "12px");

    // Add axis labels
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text("Companies");

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text("Score");

    // Color scale
    const color = d3.scaleOrdinal().domain(metrics).range(["#2563eb", "#7c3aed", "#059669"]);

    // Add bars
    const bars = svg
      .selectAll(".company-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "company-group")
      .attr("transform", (d) => `translate(${x0(d.label)},0)`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onSelectCompany(d.label === selectedCompany ? null : d.label));

    bars
      .selectAll("rect")
      .data((d) => metrics.map((key) => ({ key, value: d[key as keyof typeof d] as number })))
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.key) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key) as string)
      .style("opacity", (d, i, nodes) => {
        const parentNode = nodes[i].parentNode as Element;
        const companyData = d3.select(parentNode).datum() as { label: string };
        return selectedCompany === null || selectedCompany === companyData.label ? 1 : 0.3;
      })
      .style("transition", "opacity 0.2s");

    // Add tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #e5e7eb")
      .style("border-radius", "0.5rem")
      .style("padding", "0.75rem")
      .style("font-size", "0.875rem")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)");

    // Add hover interactions
    bars
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.8);
        tooltip
          .style("visibility", "visible")
          .html(`
            <div class="font-semibold mb-1">${d.label}</div>
            <div>Strategy: ${d.Strategy.toFixed(1)}</div>
            <div>Process: ${d.Process.toFixed(1)}</div>
            <div>Technology: ${d.Technology.toFixed(1)}</div>
          `)
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        tooltip.style("visibility", "hidden");
      });

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [companies, userData, selectedCompany, onSelectCompany]);

  return (
    <Card className="p-6">
      <SectionTitleBar
        title="📈 Performance Metrics"
        tooltip="Compare your scores across Strategy, Process, and Technology with other companies."
      />
      <div className="relative mt-6">
        <svg ref={svgRef} className="w-full" style={{ height: "400px" }} />
      </div>
    </Card>
  );
} 