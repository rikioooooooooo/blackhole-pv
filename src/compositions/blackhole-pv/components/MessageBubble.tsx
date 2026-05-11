import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS } from "../constants";

// =================================================================
//  MessageBubble -- Chat message with spring entrance
//  Supports Slack and LINE styling
// =================================================================

export const MessageBubble: React.FC<{
  text: string;
  sender?: string;
  avatarColor?: string;
  avatarInitial?: string;
  timestamp?: string;
  variant?: "slack" | "line-other" | "line-self";
  delay?: number;
  fontFamily?: string;
  fontSize?: number;
  noiseId?: string;
  index?: number;
}> = ({
  text,
  sender,
  avatarColor = COLORS.slackActive,
  avatarInitial = "K",
  timestamp = "14:32",
  variant = "slack",
  delay = 0,
  fontFamily = "Inter, system-ui, sans-serif",
  fontSize = 14,
  noiseId = "msg",
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceSpr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.5 },
  });
  const entranceY = interpolate(entranceSpr, [0, 1], [20, 0]);
  const entranceScale = interpolate(entranceSpr, [0, 1], [0.95, 1]);
  const driftX = noise2D(`${noiseId}-${index}-dx`, frame * 0.005, 0) * 1.5;

  if (variant === "slack") {
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "6px 20px",
          opacity: entranceSpr,
          transform: `translateY(${entranceY}px) translateX(${driftX}px) scale(${entranceScale})`,
        }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: 6,
            background: avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, color: "#fff", fontFamily, fontSize: 14, fontWeight: 700,
          }}
        >
          {avatarInitial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
            {sender && <span style={{ fontFamily, fontSize: 13, fontWeight: 700, color: COLORS.slackText }}>{sender}</span>}
            <span style={{ fontFamily, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{timestamp}</span>
          </div>
          <div style={{ fontFamily, fontSize, color: COLORS.slackText, lineHeight: 1.5, wordBreak: "break-word" }}>
            {text}
          </div>
        </div>
      </div>
    );
  }

  // LINE variant
  const isSelf = variant === "line-self";
  const bubbleBg = isSelf ? COLORS.lineBubbleSelf : COLORS.lineBubbleOther;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isSelf ? "flex-end" : "flex-start",
        padding: "3px 16px",
        gap: 8,
        opacity: entranceSpr,
        transform: `translateY(${entranceY}px) translateX(${driftX}px) scale(${entranceScale})`,
      }}
    >
      {!isSelf && (
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, color: "#fff", fontFamily, fontSize: 16, fontWeight: 700,
          }}
        >
          {avatarInitial}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: isSelf ? "flex-end" : "flex-start", gap: 2, maxWidth: "75%" }}>
        {!isSelf && sender && (
          <span style={{ fontFamily, fontSize: 11, color: "#fff", opacity: 0.8, marginLeft: 4 }}>{sender}</span>
        )}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, flexDirection: isSelf ? "row-reverse" : "row" }}>
          <div
            style={{
              background: bubbleBg,
              borderRadius: isSelf ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px",
              fontFamily, fontSize: 14, color: "#333", lineHeight: 1.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              maxWidth: "100%", wordBreak: "break-word",
            }}
          >
            {text}
          </div>
          <span style={{ fontFamily, fontSize: 10, color: "rgba(255,255,255,0.5)", flexShrink: 0, whiteSpace: "nowrap" }}>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};
