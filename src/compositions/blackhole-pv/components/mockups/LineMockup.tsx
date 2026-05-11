import React from "react";

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

interface LineMockupProps {
  headerTitle?: string;
  messages: Message[];
  statusTime?: string;
  inputPlaceholder?: string;
}

export const LineMockup: React.FC<LineMockupProps> = ({
  headerTitle = "お母さん",
  messages,
  statusTime = "9:41",
  inputPlaceholder = "Aa",
}) => {
  return (
    <div
      style={{
        width: 375,
        height: 812,
        backgroundColor: "black",
        borderRadius: 40,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "white",
          borderRadius: 35,
          margin: 5,
          position: "relative",
          display: "flex",
          flexDirection: "column" as const,
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
            height: 44,
            color: "black",
            fontSize: 15,
            fontWeight: 600,
            backgroundColor: "white",
            flexShrink: 0,
          }}
        >
          <div style={{ fontWeight: "bold" }}>{statusTime}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {/* Signal bars */}
            <div style={{ display: "flex", alignItems: "flex-end", height: 10, marginRight: 5 }}>
              {[4, 7, 10, 13].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 2,
                    height: h,
                    backgroundColor: i < 2 ? "#ccc" : "black",
                    borderRadius: 1,
                    marginRight: 1,
                  }}
                />
              ))}
            </div>
            {/* Battery */}
            <div
              style={{
                width: 24,
                height: 12,
                border: "1px solid black",
                borderRadius: 3,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 10,
                  backgroundColor: "black",
                  margin: 1,
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  width: 2,
                  height: 6,
                  backgroundColor: "black",
                  position: "absolute",
                  top: 3,
                  right: -4,
                  borderRadius: "0 1px 1px 0",
                }}
              />
            </div>
          </div>
        </div>

        {/* LINE header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#06C755",
            color: "white",
            height: 56,
            padding: "0 15px",
            fontSize: 17,
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderLeft: "2px solid white",
                borderBottom: "2px solid white",
                transform: "rotate(45deg)",
                marginLeft: 5,
              }}
            />
            <span style={{ marginLeft: 8, fontSize: 15, fontWeight: "normal" }}>
              Talk
            </span>
          </div>
          <div style={{ flexGrow: 1, textAlign: "center" }}>{headerTitle}</div>
          <div style={{ width: 60 }} />
        </div>

        {/* Chat area */}
        <div
          style={{
            flexGrow: 1,
            backgroundColor: "#F2F2F2",
            padding: 10,
            overflowY: "auto" as const,
            display: "flex",
            flexDirection: "column" as const,
            gap: 8,
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor: "#D9F8C6",
                  borderRadius: "15px 15px 15px 0px",
                  padding: "8px 12px",
                  maxWidth: "75%",
                  wordBreak: "break-word" as const,
                  fontSize: 15,
                  lineHeight: 1.4,
                  boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
                }}
              >
                {message.text}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#888",
                  marginTop: 2,
                  marginLeft: 5,
                }}
              >
                {message.timestamp}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            padding: "8px 15px",
            borderTop: "1px solid #eee",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flexGrow: 1,
              backgroundColor: "#F7F7F7",
              borderRadius: 20,
              padding: "8px 12px",
              minHeight: 20,
              fontSize: 15,
              color: "#999",
            }}
          >
            {inputPlaceholder}
          </div>
          <div
            style={{
              width: 24,
              height: 24,
              backgroundColor: "#06C755",
              borderRadius: "50%",
              marginLeft: 8,
            }}
          />
        </div>
      </div>
    </div>
  );
};
