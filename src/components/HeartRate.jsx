import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./HeartRate.css";

function HeartRate({ sessionData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heartRateData, setHeartRateData] = useState(null);

  // Generate sample data for visualization (this would be replaced with actual data in a real app)
  const xData = Array.from({ length: 30 }, (_, i) => i + 1);

  // Generate y-data with a pattern that resembles heart rate if real data isn't available
  const generateYData = (avgBpm) => {
    // Use avg_bpm to add some variability to the visualization
    const baseBpm = avgBpm || 72;
    const variability = baseBpm / 100;

    return [
      0,
      0.1 * variability,
      0.2 * variability,
      0.5 * variability,
      -0.1 * variability,
      -0.5 * variability,
      0,
      1.2 * variability,
      -0.4 * variability,
      0.2 * variability,
      0.1 * variability,
      0.3 * variability,
      -0.2 * variability,
      -0.6 * variability,
      0,
      1.1 * variability,
      -0.3 * variability,
      0.1 * variability,
      0.2 * variability,
      0.4 * variability,
      -0.1 * variability,
      -0.5 * variability,
      0,
      1.3 * variability,
      -0.4 * variability,
      0.2 * variability,
      0.1 * variability,
      0.3 * variability,
      -0.2 * variability,
      -0.6 * variability,
    ];
  };

  useEffect(() => {
    // If session data is provided, update the heart rate data
    if (sessionData && sessionData.avg_bpm) {
      setHeartRateData(sessionData.avg_bpm);
    }
  }, [sessionData]);

  const yData = generateYData(heartRateData);
  const shiftedYData = yData.map((y) => y + 0.7);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`heart-rate-container ${isExpanded ? "expanded" : ""}`}>
      {isExpanded && (
        <div className="background-overlay" onClick={toggleExpand}></div>
      )}
      <div
        className="heart-rate-graph"
        onClick={toggleExpand}
        style={{ zIndex: isExpanded ? 1000 : 1 }}
      >
        {/* Display current heart rate data from session */}
        {heartRateData && (
          <div className="heart-rate-info">
            <span className="heart-rate-value">{heartRateData}</span>
            <span className="heart-rate-unit">BPM</span>
          </div>
        )}

        <div className="heart-rate-scrollable">
          <LineChart
            xAxis={[
              {
                data: xData,
                disableLine: true,
                disableTicks: true,
                disableAxisListener: true,
                label: "",
                tickLabelStyle: { display: "none" },
                scaleType: "linear",
              },
            ]}
            yAxis={[
              {
                disableLine: true,
                disableTicks: true,
                label: "",
                tickLabelStyle: { display: "none" },
                min: Math.min(...shiftedYData) - 0.5,
                max: Math.max(...shiftedYData) + 0.5,
              },
            ]}
            series={[
              {
                data: shiftedYData,
                showMark: ({ index }) => index % 2 === 0,
                color: "url(#heartRateGradient)",
                curveStyle: { strokeWidth: 5 },
                valueFormatter: () => "",
              },
            ]}
            height={isExpanded ? 500 : 310}
            width={isExpanded ? 1400 : 1150}
            slotProps={{ legend: { hidden: true } }}
            tooltip={{ trigger: "none" }}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            disableAxisListener={true}
          >
            <defs>
              <linearGradient
                id="heartRateGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#4E4E4E", stopOpacity: 0.5 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#FE2549", stopOpacity: 0.1 }}
                />
              </linearGradient>
            </defs>
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default HeartRate;
