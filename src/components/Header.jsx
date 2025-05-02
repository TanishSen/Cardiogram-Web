import React from "react";
import "./Header.css";

function Header({ userData, onChangeSession }) {
  // Format the date if userData exists
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}, ${date.getFullYear()} | ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  return (
    <div
      className="header"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        backgroundColor: "#fff",
        paddingTop: "0px",
        position: "relative",
      }}
    >
      {/* Session navigation */}
      {onChangeSession && (
        <div
          className="session-navigation"
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            display: "flex",
            gap: "5px",
          }}
        >
          <button
            onClick={() => onChangeSession(-1)}
            title="Previous Session"
            style={{
              fontSize: "16px",
              padding: "4px 8px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            ←
          </button>
          <button
            onClick={() => onChangeSession(1)}
            title="Next Session"
            style={{
              fontSize: "16px",
              padding: "4px 8px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            →
          </button>
        </div>
      )}

      <div
        className="header-title"
        style={{ fontWeight: "bold", fontSize: "36px" }}
      >
        CARDIOGRAM
        <div
          className="header-buttons"
          style={{ display: "flex", gap: "0px", fontSize: "14px" }}
        >
          <div
            className="header-button-primary"
            style={{
              backgroundColor: "#282828",
              color: "white",
              padding: "8px 24px",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <div>{userData?.name || userData?.user_id || "Jaagrav Seal"}</div>
            <div style={{ fontSize: "10px", marginTop: "2px" }}>
              {userData?.user_id || "USR004"}
            </div>
          </div>
          <div
            className="header-button-secondary"
            style={{
              backgroundColor: "white",
              padding: "8px 24px",
              borderRadius: "5px",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid #ccc",
            }}
          >
            <div>Session {userData?.id ? `#${userData.id}` : "UUID"}</div>
            <div style={{ fontSize: "10px", marginTop: "2px" }}>
              {userData?.date
                ? formatDate(userData.date)
                : "22 Jan, 2025 | 20:46"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
