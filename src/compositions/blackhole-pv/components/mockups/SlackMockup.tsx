import React from "react";

const colors = {
  sidebarBg: "#3F0E40",
  mainBg: "#1A1D21",
  messageText: "#D1D2D3",
  accentColor: "#E01E5A",
  onlineGreen: "#38A73F",
  secondaryText: "#A0A1A2",
  borderColor: "#2D3035",
  workspaceBorder: "#5A2A5B",
  white: "white",
};

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface SlackMockupProps {
  messages: Message[];
  selectedUser: string;
}

export const SlackMockup: React.FC<SlackMockupProps> = ({
  messages,
  selectedUser,
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          width: 260,
          backgroundColor: colors.sidebarBg,
          color: colors.messageText,
          paddingTop: 20,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column" as const,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: colors.white,
            fontSize: 18,
            fontWeight: 900,
            padding: "0 16px 20px 16px",
            borderBottom: `1px solid ${colors.workspaceBorder}`,
            marginBottom: 10,
          }}
        >
          Workspace Inc.
        </div>

        <div
          style={{
            color: colors.secondaryText,
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            padding: "8px 16px",
            marginTop: 10,
          }}
        >
          CHANNELS
        </div>
        {["general", "random", "project-a"].map(
          (ch) => (
            <div
              key={ch}
              style={{
                padding: "4px 16px",
                fontSize: 15,
                color: colors.messageText,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ color: colors.secondaryText, marginRight: 8 }}>
                #
              </span>
              {ch}
            </div>
          ),
        )}

        <div
          style={{
            color: colors.secondaryText,
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            padding: "8px 16px",
            marginTop: 10,
          }}
        >
          DIRECT MESSAGES
        </div>
        <div
          style={{
            padding: "4px 16px",
            fontSize: 15,
            backgroundColor: colors.accentColor,
            color: colors.white,
            borderRadius: 4,
            margin: "0 8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.onlineGreen,
              marginRight: 8,
            }}
          />
          {selectedUser}
        </div>
        {["tanaka_m", "suzuki_y"].map((dm) => (
          <div
            key={dm}
            style={{
              padding: "4px 16px",
              fontSize: 15,
              color: colors.messageText,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: colors.onlineGreen,
                marginRight: 8,
              }}
            />
            {dm}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column" as const,
          backgroundColor: colors.mainBg,
          color: colors.messageText,
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: `1px solid ${colors.borderColor}`,
            height: 50,
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginRight: 8 }}>
            {selectedUser}
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.onlineGreen,
              marginRight: 8,
            }}
          />
          <div style={{ fontSize: 14, color: colors.secondaryText }}>
            Online
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto" as const,
            padding: 20,
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  backgroundColor: colors.accentColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: colors.white,
                  fontWeight: 900,
                  fontSize: 18,
                  marginRight: 10,
                  flexShrink: 0,
                }}
              >
                K
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    marginBottom: 2,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, marginRight: 8 }}>
                    {message.sender}
                  </div>
                  <div style={{ fontSize: 12, color: colors.secondaryText }}>
                    {message.timestamp}
                  </div>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.4, wordBreak: "break-word" as const }}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: `1px solid ${colors.borderColor}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              backgroundColor: colors.borderColor,
              borderRadius: 8,
              padding: "10px 15px",
              fontSize: 15,
              color: colors.secondaryText,
            }}
          >
            Message {selectedUser}
          </div>
        </div>
      </div>
    </div>
  );
};
