import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS, FONTS } from "../constants";

// =================================================================
//  LineUI -- LINE messenger UI components
//  Realistic LINE chat interface elements
// =================================================================

// --- LINE Chat Header ---
export const LineChatHeader: React.FC<{
  name: string;
  statusText?: string;
  showCallButtons?: boolean;
}> = ({
  name,
  statusText,
  showCallButtons = true,
}) => {
  return (
    <div
      style={{
        height: 56,
        background: COLORS.lineGreen,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Back button */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>

      {/* Center: name and status */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          {name}
        </div>
        {statusText && (
          <div
            style={{
              fontFamily: FONTS.ui,
              fontSize: 10,
              color: "rgba(255,255,255,0.7)",
              marginTop: 1,
            }}
          >
            {statusText}
          </div>
        )}
      </div>

      {/* Call buttons */}
      {showCallButtons && (
        <div style={{ display: "flex", gap: 14 }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
          </svg>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>
      )}
    </div>
  );
};

// --- LINE Status Bar ---
export const LineStatusBar: React.FC<{
  time?: string;
  batteryLevel?: number;
}> = ({
  time = "18:42",
  batteryLevel = 75,
}) => {
  return (
    <div
      style={{
        height: 44,
        background: COLORS.lineGreen,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Time */}
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 12,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {time}
      </div>

      {/* Right side: signal + wifi + battery */}
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {/* Signal bars */}
        <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          {[5, 7, 9, 11].map((h, i) => (
            <div
              key={`sig-${i}`}
              style={{
                width: 3,
                height: h,
                background: "#fff",
                borderRadius: 1,
              }}
            />
          ))}
        </div>

        {/* WiFi icon */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M5 12.55A11 11 0 0 1 19 12.55" />
          <path d="M8.53 16.11A6 6 0 0 1 15.47 16.11" />
          <circle cx="12" cy="19" r="1" fill="#fff" />
        </svg>

        {/* Battery */}
        <div
          style={{
            width: 22,
            height: 10,
            border: "1.5px solid #fff",
            borderRadius: 3,
            padding: 1,
            marginLeft: 2,
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${batteryLevel}%`,
              height: "100%",
              background: batteryLevel > 20 ? "#fff" : "#FF5252",
              borderRadius: 1,
            }}
          />
          {/* Battery nub */}
          <div
            style={{
              position: "absolute",
              right: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 2,
              height: 5,
              background: "#fff",
              borderRadius: "0 1px 1px 0",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- LINE Message Input Area ---
export const LineInputArea: React.FC = () => {
  return (
    <div
      style={{
        height: 52,
        background: "rgba(255,255,255,0.95)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: 6,
      }}
    >
      {/* Camera button */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>

      {/* Sticker button */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#999"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>

      {/* Text input */}
      <div
        style={{
          flex: 1,
          height: 36,
          borderRadius: 20,
          background: "#f2f2f2",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          fontFamily: FONTS.ui,
          fontSize: 13,
          color: "#bbb",
        }}
      >
        Aa
      </div>

      {/* Microphone button */}
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#999"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>
    </div>
  );
};

// --- LINE Date Divider ---
export const LineDateDivider: React.FC<{
  date?: string;
  delay?: number;
}> = ({
  date = "今日",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.5 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 0",
        opacity: spr,
      }}
    >
      <div
        style={{
          padding: "3px 12px",
          borderRadius: 100,
          background: "rgba(0,0,0,0.15)",
          fontFamily: FONTS.ui,
          fontSize: 11,
          color: "#fff",
          letterSpacing: "0.02em",
        }}
      >
        {date}
      </div>
    </div>
  );
};

// --- LINE Read Receipt ---
export const LineReadReceipt: React.FC<{
  visible?: boolean;
}> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <span
      style={{
        fontFamily: FONTS.ui,
        fontSize: 9,
        color: "rgba(255,255,255,0.4)",
        display: "inline-block",
        marginLeft: 4,
      }}
    >
      Read
    </span>
  );
};

// --- LINE Phone Mockup Frame ---
export const PhoneMockupFrame: React.FC<{
  children: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}> = ({
  children,
  x = 280,
  y = 50,
  width = 840,
  height = 980,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 40,
        background: "#1a1a1a",
        padding: 10,
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) inset",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 30,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
