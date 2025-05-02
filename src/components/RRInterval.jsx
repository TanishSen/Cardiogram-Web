import React, { useState, useEffect } from "react";

function RRInterval({ sessionData }) {
  const [rrIntervalData, setRrIntervalData] = useState(null);

  useEffect(() => {
    // If session data is provided, update the RR interval data
    if (sessionData && sessionData.avg_rr_interval) {
      setRrIntervalData(sessionData.avg_rr_interval);
    }
  }, [sessionData]);

  const styles = {
    container: {
      padding: "20px",
      borderRadius: "8px",
      textAlign: "left",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      color: "#888",
      fontSize: "18px",
      marginBottom: "110px",
      textAlign: "left",
    },
    value: {
      fontSize: "48px",
      fontWeight: "bold",
      color: "#000",
      marginBottom: "10px",
    },
    unit: {
      fontSize: "24px",
      fontWeight: "normal",
      color: "#888",
      marginLeft: "5px",
    },
    description: {
      color: "#888",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>RR Interval</div>
      <div style={styles.value}>
        {rrIntervalData !== null ? rrIntervalData : "Loading..."}{" "}
        <span style={styles.unit}>ms</span>
      </div>
      <div style={styles.description}>
        Time between consecutive heartbeats. Normal range: 750-900ms.
      </div>
    </div>
  );
}

export default RRInterval;
