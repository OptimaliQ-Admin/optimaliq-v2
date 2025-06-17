//src/components/growthstudio/QuadrantChart.tsx
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

export default function QuadrantChart({ companies, userData, selectedCompany, onSelectCompany }: Props) {
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

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([height, 0]);

    const rScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([20, 40]);

    // Add quadrant backgrounds
    const quadrants = [
      { x1: 0, x2: width / 2, y1: 0, y2: height / 2, fill: "#FEF9C3", label: "Emerging Foundations" },
      { x1: width / 2, x2: width, y1: 0, y2: height / 2, fill: "#EDE9FE", label: "Efficient Executors" },
      { x1: 0, x2: width / 2, y1: height / 2, y2: height, fill: "#DBEAFE", label: "Strategic Builders" },
      { x1: width / 2, x2: width, y1: height / 2, y2: height, fill: "#DCFCE7", label: "Accelerated Performers" },
    ];

    quadrants.forEach((q) => {
      svg
        .append("rect")
        .attr("x", q.x1)
        .attr("y", q.y1)
        .attr("width", q.x2 - q.x1)
        .attr("height", q.y2 - q.y1)
        .style("fill", q.fill)
        .style("opacity", 0.2);

      svg
        .append("text")
        .attr("x", q.x1 + 10)
        .attr("y", q.y1 + 20)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", d3.color(q.fill)?.darker(0.5)?.toString() || "#000000")
        .text(q.label);
    });

    // Add grid lines
    const gridLines = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    gridLines.forEach((value) => {
      // Vertical lines
      svg
        .append("line")
        .attr("x1", xScale(value))
        .attr("x2", xScale(value))
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#e5e7eb")
        .style("stroke-width", value === 3 ? 1.5 : 1)
        .style("stroke-dasharray", "4 4");

      // Horizontal lines
      svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(value))
        .attr("y2", yScale(value))
        .style("stroke", "#e5e7eb")
        .style("stroke-width", value === 3 ? 1.5 : 1)
        .style("stroke-dasharray", "4 4");
    });

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

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
      .text("Strategy Score");

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text("Process Score");

    // Add companies
    const companyCircles = svg
      .selectAll(".company-circle")
      .data(companies)
      .enter()
      .append("circle")
      .attr("class", "company-circle")
      .attr("cx", (d) => xScale(d.strategyScore))
      .attr("cy", (d) => yScale(d.processScore))
      .attr("r", (d) => rScale(d.technologyScore))
      .style("fill", "#CBD5E1")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .style("transition", "all 0.2s");

    // Add user point
    const userCircle = svg
      .append("circle")
      .attr("class", "user-circle")
      .attr("cx", xScale(userData.strategyScore))
      .attr("cy", yScale(userData.processScore))
      .attr("r", rScale(userData.technologyScore))
      .style("fill", "#2563eb")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .style("transition", "all 0.2s");

    // Add labels
    svg
      .selectAll(".company-label")
      .data(companies)
      .enter()
      .append("text")
      .attr("class", "company-label")
      .attr("x", (d) => xScale(d.strategyScore))
      .attr("y", (d) => yScale(d.processScore) - rScale(d.technologyScore) - 5)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text((d) => d.label);

    svg
      .append("text")
      .attr("class", "user-label")
      .attr("x", xScale(userData.strategyScore))
      .attr("y", yScale(userData.processScore) - rScale(userData.technologyScore) - 5)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#2563eb")
      .style("font-weight", "600")
      .text("You");

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

    // Add hover and click interactions
    const handleMouseOver = (event: MouseEvent, d: CompanyData) => {
      d3.select(event.currentTarget as Element)
        .style("stroke", "#2563eb")
        .style("stroke-width", 3);

      tooltip
        .style("visibility", "visible")
        .html(`
          <div class="font-semibold mb-1">${d.label}</div>
          <div>Strategy: ${d.strategyScore.toFixed(1)}</div>
          <div>Process: ${d.processScore.toFixed(1)}</div>
          <div>Technology: ${d.technologyScore.toFixed(1)}</div>
        `)
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`);
    };

    const handleMouseOut = (event: MouseEvent) => {
      const element = event.currentTarget as Element;
      const data = (element as any).__data__ as CompanyData;
      if (selectedCompany !== data.label) {
        d3.select(element)
          .style("stroke", "#ffffff")
          .style("stroke-width", 2);
      }
      tooltip.style("visibility", "hidden");
  };

    const handleClick = (event: MouseEvent, d: CompanyData) => {
      onSelectCompany(d.label === selectedCompany ? null : d.label);
    };

    companyCircles
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);

    userCircle
      .on("mouseover", (event) => {
        d3.select(event.currentTarget)
          .style("stroke", "#2563eb")
          .style("stroke-width", 3);

        tooltip
          .style("visibility", "visible")
          .html(`
            <div class="font-semibold mb-1">You</div>
            <div>Strategy: ${userData.strategyScore.toFixed(1)}</div>
            <div>Process: ${userData.processScore.toFixed(1)}</div>
            <div>Technology: ${userData.technologyScore.toFixed(1)}</div>
          `)
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        if (selectedCompany !== "You") {
          d3.select(event.currentTarget)
            .style("stroke", "#ffffff")
            .style("stroke-width", 2);
        }
        tooltip.style("visibility", "hidden");
      })
      .on("click", () => onSelectCompany(selectedCompany === "You" ? null : "You"));

    // Update selected state
    const updateSelection = () => {
      companyCircles.style("stroke-width", (d) => (d.label === selectedCompany ? 3 : 2));
      userCircle.style("stroke-width", selectedCompany === "You" ? 3 : 2);
    };

    updateSelection();

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [companies, userData, selectedCompany, onSelectCompany]);

  return (
    <Card className="p-6">
        <SectionTitleBar
          title="📊 Strategic Growth Quadrant"
          tooltip="Visualize how businesses compare based on Strategy and Process. Larger bubbles reflect higher Tech maturity."
        />
      <div className="relative mt-6">
        <svg ref={svgRef} className="w-full" style={{ height: "400px" }} />
      </div>
    </Card>
  );
}
