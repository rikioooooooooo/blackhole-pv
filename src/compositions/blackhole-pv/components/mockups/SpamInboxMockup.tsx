import React from "react";

interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isStarred: boolean;
  isSpam: boolean;
}

interface SpamInboxMockupProps {
  emails: EmailMessage[];
}

export const SpamInboxMockup: React.FC<SpamInboxMockupProps> = ({ emails }) => {
  const flexRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #dadce0",
        borderRadius: 8,
        fontFamily: "Roboto, sans-serif",
        fontSize: 14,
        color: "#3c4043",
        backgroundColor: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as const,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          ...flexRow,
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid #dadce0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            ...flexRow,
            backgroundColor: "#e8f0fe",
            borderRadius: 8,
            padding: "8px 15px",
            flexGrow: 1,
            marginRight: 20,
          }}
        >
          <span style={{ fontSize: 18, marginRight: 10, color: "#5f6368" }}>
            &#128269;
          </span>
          <span style={{ fontSize: 15, color: "#5f6368" }}>Search mail</span>
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          ...flexRow,
          padding: "8px 20px",
          borderBottom: "1px solid #dadce0",
          backgroundColor: "#f6f6f6",
          flexShrink: 0,
          gap: 8,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            border: "1px solid #dadce0",
            borderRadius: 2,
            backgroundColor: "#fff",
            marginRight: 8,
          }}
        />
        {["Archive", "Delete", "Report spam"].map((btn) => (
          <div
            key={btn}
            style={{
              padding: "6px 12px",
              border: "1px solid #dadce0",
              borderRadius: 4,
              backgroundColor: "#f6f6f6",
              fontSize: 13,
              color: "#3c4043",
            }}
          >
            {btn}
          </div>
        ))}
      </div>

      {/* Email list */}
      <div style={{ flexGrow: 1, overflowY: "auto" as const }}>
        {emails.map((email) => (
          <div
            key={email.id}
            style={{
              ...flexRow,
              padding: "12px 20px",
              borderBottom: "1px solid #dadce0",
              backgroundColor: email.isSpam ? "#fff0f0" : "#fff",
              justifyContent: "space-between",
            }}
          >
            <div style={flexRow}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: "1px solid #dadce0",
                  borderRadius: 2,
                  marginRight: 10,
                  backgroundColor: "#fff",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "#f7cb44",
                  fontSize: 18,
                  marginRight: 10,
                  flexShrink: 0,
                }}
              >
                {email.isStarred ? "\u2605" : "\u2606"}
              </span>
              {email.isSpam && (
                <span
                  style={{
                    color: "#ea4335",
                    fontSize: 16,
                    marginRight: 5,
                    fontWeight: "bold",
                  }}
                >
                  &#9888;
                </span>
              )}
              <div
                style={{
                  fontWeight: email.isSpam ? "normal" : "bold",
                  marginRight: 15,
                  minWidth: 120,
                  color: email.isSpam ? "#ea4335" : "#3c4043",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email.sender}
              </div>
              <div
                style={{
                  flexGrow: 1,
                  marginRight: 10,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#3c4043",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{email.subject}</span>
                <span style={{ color: "#5f6368" }}> - {email.preview}</span>
              </div>
            </div>
            <div
              style={{
                minWidth: 80,
                textAlign: "right" as const,
                fontSize: 13,
                color: "#5f6368",
                flexShrink: 0,
              }}
            >
              {email.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
