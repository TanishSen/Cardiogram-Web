import React, { useState, useEffect } from "react";

function QRSComplex({ sessionData }) {
  const [bloodPressureData, setBloodPressureData] = useState({
    systole: null,
    diastole: null,
  });

  useEffect(() => {
    // If session data is provided, use it directly
    if (sessionData) {
      const systole = sessionData.avg_systole;
      const diastole = sessionData.avg_diastole;

      if (systole !== undefined && diastole !== undefined) {
        setBloodPressureData({ systole, diastole });
      }
    } else {
      // Fallback to fetching data if session data isn't provided
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
            setBloodPressureData({
              systole: data[0].avg_systole,
              diastole: data[0].avg_diastole,
            });
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [sessionData]);

  const { systole, diastole } = bloodPressureData;
  const isLoading = systole === null || diastole === null;
  const bloodPressureText = isLoading
    ? "Loading..."
    : `${systole}/${diastole} mmHg`;

  return (
    <div
      style={{
        borderRadius: "5px",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          color: "#888",
          marginTop: "10px",
        }}
      >
        Blood Pressure
      </div>

      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#fff",
          marginBottom: "10px",
          marginTop: "120px",
        }}
      >
        {bloodPressureText}{" "}
        {!isLoading && (
          <span style={{ fontSize: "12px", fontWeight: "lighter" }}>
            Systole/Diastole
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#ddd",
          marginTop: "20px",
        }}
      >
        Systolic (top) and diastolic (bottom) blood pressure values.
      </div>
    </div>
  );
}

export default QRSComplex;
