import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { noise2D } from "@remotion/noise";

// =================================================================
//  BrowserWindow -- Glass morphism browser chrome with light/dark
// =================================================================

export const BrowserWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  url?: string;
  theme?: "light" | "dark";
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  entranceDelay?: number;
  noiseId?: string;
}> = ({
  children,
  title,
  url,
  theme = "dark",
  width = 1400,
  height = 800,
  x,
  y,
  entranceDelay = 0,
  noiseId = "bw",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === "dark";

  const entranceSpr = spring({
    frame: Math.max(0, frame - entranceDelay),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.5 },
  });
  const entranceScale = interpolate(entranceSpr, [0, 1], [0.92, 1]);
  const entranceBlur = interpolate(entranceSpr, [0, 1], [10, 0]);
  const entranceY = interpolate(entranceSpr, [0, 1], [30, 0]);

  const driftX = noise2D(`${noiseId}-dx`, frame * 0.006, 0) * 3;
  const driftY = noise2D(`${noiseId}-dy`, 0, frame * 0.006) * 3;

  const bgColor = isDark ? "rgba(15, 15, 17, 0.85)" : "rgba(255, 255, 255, 0.92)";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const titleBarBg = isDark
    ? "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0))"
    : "linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0))";
  const urlBarBg = isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)";
  const textColor = isDark ? "#a1a1aa" : "#6b7280";
  const titleColor = isDark ? "#ffffff" : "#0A0A0A";

  return (
    <div
      style={{
        position: x !== undefined ? "absolute" : "relative",
        left: x !== undefined ? x + driftX : undefined,
        top: y !== undefined ? y + driftY + entranceY : undefined,
        width,
        height,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: bgColor,
        backdropFilter: "blur(20px)",
        border: `1px solid ${borderColor}`,
        boxShadow: isDark
          ? "0 40px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 20px 40px rgba(0,0,0,0.5)"
          : "0 30px 60px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05) inset",
        display: "flex",
        flexDirection: "column" as const,
        transform: `scale(${entranceScale})`,
        opacity: entranceSpr,
        filter: entranceBlur > 0.5 ? `blur(${entranceBlur}px)` : undefined,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          background: titleBarBg,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56", boxShadow: "0 0 8px rgba(255,95,86,0.3)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E", boxShadow: "0 0 8px rgba(255,189,46,0.3)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F", boxShadow: "0 0 8px rgba(39,201,63,0.3)" }} />
        </div>

        <div
          style={{
            flex: 1,
            height: 28,
            background: urlBarBg,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            padding: "0 12px",
          }}
        >
          {url ? (
            <span style={{ fontSize: 11, color: textColor, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, letterSpacing: "0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {url}
            </span>
          ) : title ? (
            <span style={{ fontSize: 11, color: textColor, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, letterSpacing: "0.02em" }}>
              <span style={{ color: titleColor }}>{title}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", background: isDark ? "rgba(0,0,0,0.2)" : "rgba(250,250,250,0.5)" }}>
        {children}
      </div>
    </div>
  );
};
