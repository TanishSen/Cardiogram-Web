import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Header.css";
import "./LoginPage.css";

// Sample session data structure for reference and fallback
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

// Demo data in case the API doesn't return anything
const DEMO_SESSIONS = [
  SAMPLE_SESSION,
  { id: 2, user_id: "USR001", date: "2025-04-25T15:30:00Z", avg_bpm: 68 },
  { id: 3, user_id: "USR002", date: "2025-04-30T09:15:00Z", avg_bpm: 75 },
];

const LoginPage = () => {
  const [sessionId, setSessionId] = useState("");
  const [allSessions, setAllSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDemoData, setUseDemoData] = useState(false);
  const navigate = useNavigate();

  // Fetch all sessions on component mount
  useEffect(() => {
    fetchAllSessions();
  }, []);

  const fetchAllSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://rmdhlpqhfejbnmqiiakr.supabase.co/rest/v1/session_reports?select=*",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGhscHFoZmVqYm5tcWlpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTA2MDUsImV4cCI6MjA2MTMyNjYwNX0.1SeozpqrB_gfPogq7vIGfTkSVat0LUXIpUERYtoTGPM",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGhscHFoZmVqYm5tcWlpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTA2MDUsImV4cCI6MjA2MTMyNjYwNX0.1SeozpqrB_gfPogq7vIGfTkSVat0LUXIpUERYtoTGPM",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }

      const data = await response.json();
      console.log("All sessions retrieved:", data);

      // Check if we got data back
      if (data && data.length > 0) {
        console.log(
          "Available session IDs:",
          data.map((session) => ({
            id: session.id,
            idType: typeof session.id,
          }))
        );
        setAllSessions(data);
      } else {
        console.log("No sessions retrieved from API, using demo data");
        setUseDemoData(true);
        setAllSessions(DEMO_SESSIONS);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      console.log("Using demo data due to API error");
      setError("Could not connect to session database. Using demo data.");
      setUseDemoData(true);
      setAllSessions(DEMO_SESSIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionIdChange = (e) => {
    setSessionId(e.target.value);
    setError(null); // Clear any previous errors when input changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sessionId) {
      setError("Please enter a session ID");
      return;
    }

    console.log("Input session ID:", sessionId, "Type:", typeof sessionId);

    // Convert to number if it's numeric
    const inputIdAsNumber = !isNaN(sessionId) ? Number(sessionId) : null;

    // Check if user entered a USER ID instead of session ID
    const possibleUserSessions = allSessions.filter(
      (session) =>
        session.user_id &&
        session.user_id.toString().toLowerCase() ===
          sessionId.toString().toLowerCase()
    );

    if (possibleUserSessions.length > 0) {
      setError(
        `"${sessionId}" is a User ID, not a Session ID. Available Session IDs for this user: ${possibleUserSessions
          .map((s) => s.id)
          .join(", ")}`
      );
      return;
    }

    // Find the session by ID
    const foundSession = allSessions.find((session) => {
      return (
        session.id === inputIdAsNumber || session.id.toString() === sessionId
      );
    });

    console.log("Found session:", foundSession);

    if (foundSession) {
      navigate(`/dashboard/${foundSession.id}`);
    } else {
      setError(
        `Session ID ${sessionId} not found. Please enter a numeric session ID (example: 1, 2, 3).`
      );
    }
  };

  // Quick way to use a demo session ID
  const useDemo = () => {
    if (DEMO_SESSIONS.length > 0) {
      setSessionId(String(DEMO_SESSIONS[0].id));
    }
  };

  // Add a new function to handle clicking on session list items
  const handleSessionClick = (session) => {
    // Set the session ID in the input field
    setSessionId(String(session.id));

    // Navigate directly to the dashboard
    navigate(`/dashboard/${session.id}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CARDIOGRAM</h1>
        <h2>Session Login</h2>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading session data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="sessionId">
                Enter Session ID (numeric only):
              </label>
              <input
                type="text"
                id="sessionId"
                value={sessionId}
                onChange={handleSessionIdChange}
                placeholder="Session ID (e.g. 1, 2, 3)"
              />
              <div className="input-hint">Enter the numeric session ID</div>
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="submit-button">
              Submit
            </button>

            {useDemoData && (
              <div className="demo-notice">
                <p>
                  Using demo data. Available session IDs:{" "}
                  {DEMO_SESSIONS.map((s) => s.id).join(", ")}
                </p>
                <button type="button" className="demo-button" onClick={useDemo}>
                  Use Demo Session
                </button>
              </div>
            )}

            {/* Debug helper to show available IDs */}
            <div className="debug-info">
              <details>
                <summary>Available Session IDs (Debug)</summary>
                {/* <div className="session-id-example">
                  <p>Example session structure:</p>
                  <pre>
                    {`{
  "id": 1,         <- This is the Session ID you should enter
  "user_id": "USR001",
  "date": "2025-04-01T08:00:00+00:00",
  ...
}`}
                  </pre>
                </div> */}
                <ul>
                  {allSessions.map((session) => (
                    <li
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="clickable-session"
                    >
                      <strong>Session ID: {session.id}</strong> - User:{" "}
                      {session.user_id || "Unknown"} -
                      {session.date
                        ? ` Date: ${new Date(
                            session.date
                          ).toLocaleDateString()}`
                        : ""}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
