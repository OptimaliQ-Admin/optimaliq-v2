"use client";  // ✅ This makes the file a Client Component

import { useState, useEffect } from "react";
import axios from "axios";

export default function ScoreWidget() {
  const [score, setScore] = useState(4);
  const [insight, setInsight] = useState("Loading insights...");

  useEffect(() => {
    axios.post("/api/getInsights", { score })
      .then((response) => {
        setInsight(response.data.insight);
      })
      .catch(() => {
        setInsight("Error generating insights. Please try again.");
      });
  }, [score]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">Business Score</h2>
      <p className="text-4xl font-bold text-blue-600">{score}</p>
      <p className="mt-4 text-gray-600">{insight}</p>
    </div>
  );
}
