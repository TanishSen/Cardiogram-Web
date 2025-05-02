import { useState, useEffect } from "react";

function TWave({ sessionData }) {
  const [systoleValue, setSystoleValue] = useState(null);
  const [diastoleValue, setDiastoleValue] = useState(null);

  const systoleMinValue = 70; //90
  const systoleMaxValue = 180;

  const diastoleMinValue = 50; //60
  const diastoleMaxValue = 120;

  const svgWidth = 300;
  const svgHeight = 220;

  const systoleCenterX = svgWidth / 2;
  const systoleCenterY = svgHeight / 2;
  const systoleRadius = 90;
  const systoleArcWidth = 25; //20

  const diastoleOffsetX = 0;
  const diastoleOffsetY = 0;
  const diastoleCenterX = systoleCenterX + diastoleOffsetX;
  const diastoleCenterY = systoleCenterY + diastoleOffsetY;
  const diastoleRadius = 60;
  const diastoleArcWidth = 15;

  const startAngle = Math.PI;
  const endAngle = 0;
  const totalAngleRad = Math.PI;

  useEffect(() => {
    // If session data is provided, use it directly
    if (
      sessionData &&
      sessionData.avg_systole !== undefined &&
      sessionData.avg_diastole !== undefined
    ) {
      setSystoleValue(sessionData.avg_systole);
      setDiastoleValue(sessionData.avg_diastole);
    } else {
      // Fallback to fetching if session data is not available
      fetch(
        "https://rmdhlpqhfejbnmqiiakr.supabase.co/rest/v1/session_reports?select=*",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGhscHFoZmVqYm5tcWlpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTA2MDUsImV4cCI6MjA2MTMyNjYwNX0.1SeozpqrB_gfPogq7vIGfTkSVat0LUXIpUERYtoTGPM",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGhscHFoZmVqYm5tcWlpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTA2MDUsImV4cCI6MjA2MTMyNjYwNX0.1SeozpqrB_gfPogq7vIGfTkSVat0LUXIpUERYtoTGPM",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setSystoleValue(data[0].avg_systole);
            setDiastoleValue(data[0].avg_diastole);
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [sessionData]);

  const generateArc = (start, end, rad, centerX, centerY) => {
    const startX = centerX + Math.cos(start) * rad;
    const startY = centerY - Math.sin(start) * rad;
    const endX = centerX + Math.cos(end) * rad;
    const endY = centerY - Math.sin(end) * rad;
    const largeArcFlag = Math.abs(end - start) > Math.PI ? 1 : 0;

    return `M ${startX} ${startY} A ${rad} ${rad} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  if (systoleValue === null || diastoleValue === null) {
    return <div>Loading...</div>;
  }

  const systoleStartRatio = 0;
  const systoleEndRatio =
    (systoleValue - systoleMinValue) / (systoleMaxValue - systoleMinValue);
  const systoleStartAngle = startAngle - systoleStartRatio * totalAngleRad;
  const systoleEndAngle = startAngle - systoleEndRatio * totalAngleRad;
  const systoleArcPath = generateArc(
    systoleStartAngle,
    systoleEndAngle,
    systoleRadius,
    systoleCenterX,
    systoleCenterY
  );

  const diastoleStartRatio = 0;
  const diastoleEndRatio =
    (diastoleValue - diastoleMinValue) / (diastoleMaxValue - diastoleMinValue);
  const diastoleStartAngle = startAngle - diastoleStartRatio * totalAngleRad;
  const diastoleEndAngle = startAngle - diastoleEndRatio * totalAngleRad;
  const diastoleArcPath = generateArc(
    diastoleStartAngle,
    diastoleEndAngle,
    diastoleRadius,
    diastoleCenterX,
    diastoleCenterY
  );

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
      paddingTop: "1rem",
    },
    container: {
      position: "relative",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      paddingTop: "1rem",
    },
    textContainer: {
      textAlign: "center",
    },
    description: {
      fontSize: "12px",
      color: "#666",
    },
    arcBlue: {
      stroke: "url(#systoleGradient)",
      strokeWidth: systoleArcWidth,
      fill: "none",
      filter: "drop-shadow(0 2px 4px rgba(48, 182, 217, 0.4))",
      strokeLinecap: "round",
    },
    arcGreen: {
      stroke: "url(#diastoleGradient)",
      strokeWidth: diastoleArcWidth,
      fill: "none",
      filter: "drop-shadow(0 2px 4px rgba(76, 175, 80, 0.4))",
      strokeLinecap: "round",
    },
    value: {
      fontSize: "24px",
      fontWeight: "bold",
      fill: "#333",
      filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))",
    },
    smallValue: {
      fontSize: "16px",
      fontWeight: "bold",
      fill: "#333",
      filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <defs>
            <linearGradient
              id="systoleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#30b6d9" />
              <stop offset="100%" stopColor="#3dc7eb" />
            </linearGradient>
            <linearGradient
              id="diastoleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#4caf50" />
              <stop offset="100%" stopColor="#6fcf97" />
            </linearGradient>
          </defs>

          <path d={systoleArcPath} style={styles.arcBlue} />
          <text
            x={systoleCenterX}
            y={systoleCenterY - 15}
            textAnchor="middle"
            dominantBaseline="middle"
            style={styles.value}
          >
            {systoleValue}
          </text>

          <path d={diastoleArcPath} style={styles.arcGreen} />
          <text
            x={diastoleCenterX}
            y={diastoleCenterY + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            style={styles.smallValue}
          >
            {diastoleValue}
          </text>
        </svg>
      </div>

      <div style={styles.textContainer}>
        <p style={styles.description}>
          Avg Systole: Ideally 110–120 mmHg (hypertension 140, hypotension 90).
          Avg Diastole: Ideally 70–80 mmHg (hypertension 90, hypotension 60).
        </p>
      </div>
    </div>
  );
}

export default TWave;
