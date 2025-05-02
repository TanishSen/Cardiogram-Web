import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeartRate from "../components/HeartRate";
import QRSComplex from "../components/QRSComplex";
import RRInterval from "../components/RRInterval";
import PRInterval from "../components/PRInterval";
import STSegment from "../components/STSegment";
import TWave from "../components/TWave";
import "../App.css";

// Sample session data for fallback in case the API fails
const SAMPLE_SESSION = {
  id: 1,
  user_id: "USR001",
  date: "2025-04-01T08:00:00+00:00",
  avg_bpm: 72,
  avg_systole: 120,
  avg_diastole: 80,
  avg_rr_interval: 850,
  avg_rmssd: 30,
};

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        console.log(`Fetching session data for ID: ${id}`);
        const response = await fetch(
          `https://rmdhlpqhfejbnmqiiakr.supabase.co/rest/v1/session_reports?id=eq.${id}&select=*`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGhscHFoZmVqYm5tcWlpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTA2MDUsImV4cCI6MjA2MTMyNjYwNX0.1SeozpqrB_gfPogq7vIGfTkSVat0LUXIpUERYtoTGPM",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGhscHFoZmVqYm5tcWlpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTA2MDUsImV4cCI6MjA2MTMyNjYwNX0.1SeozpqrB_gfPogq7vIGfTkSVat0LUXIpUERYtoTGPM",
              Prefer: "return=representation",
            },
          }
        );

        if (!response.ok) {
          console.error("API Error Response:", await response.text());
          throw new Error(
            `Failed to fetch session data. Status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Dashboard session data retrieved:", data);

        if (data.length === 0) {
          throw new Error(`No session found with ID: ${id}`);
        }

        setSessionData(data[0]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);

        // Use sample data in development for demonstration purposes
        if (process.env.NODE_ENV === "development") {
          console.warn("Using sample session data for development");
          setSessionData({ ...SAMPLE_SESSION, id: Number(id) || 1 });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  const handleChangeSession = (offset) => {
    // Navigate to previous or next session ID
    const currentId = Number(id) || 1;
    const newId = currentId + offset;
    if (newId > 0) {
      navigate(`/dashboard/${newId}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading session data...</p>
      </div>
    );
  }

  if (error && !sessionData) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button
          onClick={() => navigate("/dashboard/1")}
          className="retry-button"
        >
          Try Default Session
        </button>
      </div>
    );
  }

  // Display the full dashboard with the session data
  return (
    <div className="container">
      <Header userData={sessionData} onChangeSession={handleChangeSession} />
      <div className="grid-layout">
        <div className="grid-item-heart">
          <HeartRate sessionData={sessionData} />
        </div>
        <div className="grid-item-qrs">
          <QRSComplex sessionData={sessionData} />
        </div>
        <div className="grid-item">
          <RRInterval sessionData={sessionData} />
        </div>
        <div className="grid-item">
          <PRInterval sessionData={sessionData} />
        </div>
        <div className="grid-item-red">
          <STSegment sessionData={sessionData} />
        </div>
        <div className="grid-item">
          <TWave sessionData={sessionData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
