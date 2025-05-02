import { useEffect, useState } from "react";

function STSegment({ sessionData }) {
  const [avgBPM, setAvgBPM] = useState(null);

  useEffect(() => {
    // If sessionData is passed as a prop, use it directly
    if (sessionData && sessionData.avg_bpm !== undefined) {
      setAvgBPM(sessionData.avg_bpm);
    } else {
      // Otherwise fetch data (fallback for direct component usage)
      fetch(
        "https://rmdhlpqhfejbnmqiiakr.supabase.co/rest/v1/session_reports?select=*",
        {
          method: "GET",
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
            setAvgBPM(data[0].avg_bpm);
          }
        })
        .catch((err) => {
          console.error("API error:", err);
        });
    }
  }, [sessionData]);

  return (
    <div
      style={{
        borderRadius: "5px",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: "18px", color: "white", marginTop: "10px" }}>
        avg_bpm
      </div>

      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        {avgBPM !== null ? avgBPM : "Loading..."}{" "}
        <span style={{ fontSize: "24px" }}>avg BPM</span>
      </div>

      <div style={{ fontSize: "14px", color: "white", marginTop: "100px" }}>
        this is the description placeholder for this tab about this specific
        tab.
      </div>
    </div>
  );
}

export default STSegment;
