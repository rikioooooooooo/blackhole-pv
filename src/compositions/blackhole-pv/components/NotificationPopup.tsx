import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { noise2D } from "@remotion/noise";

// =================================================================
//  NotificationPopup -- Notification toast with spring bounce
// =================================================================

const ICON_PATHS: Record<string, string> = {
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  cart: "M9 22A1 1 0 1 0 9 20 1 1 0 0 0 9 22ZM20 22A1 1 0 1 0 20 20 1 1 0 0 0 20 22ZM1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

export const NotificationPopup: React.FC<{
  text: string;
  icon?: string;
  iconColor?: string;
  bgColor?: string;
  x: number;
  y: number;
  delay?: number;
  index?: number;
  width?: number;
  fontFamily?: string;
  noiseId?: string;
}> = ({
  text,
  icon = "bell",
  iconColor = "#2196F3",
  bgColor = "rgba(255, 255, 255, 0.95)",
  x,
  y,
  delay = 0,
  index = 0,
  width = 280,
  fontFamily = "Inter, system-ui, sans-serif",
  noiseId = "notif",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceSpr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.4 },
  });
  const entranceScale = interpolate(entranceSpr, [0, 1], [0.3, 1]);
  const entranceY = interpolate(entranceSpr, [0, 1], [-30, 0]);
  const driftX = noise2D(`${noiseId}-${index}-dx`, frame * 0.005, 0) * 2;
  const driftY = noise2D(`${noiseId}-${index}-dy`, 0, frame * 0.005) * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: x + driftX,
        top: y + driftY + entranceY,
        width,
        opacity: entranceSpr,
        transform: `scale(${entranceScale})`,
      }}
    >
      <div
        style={{
          background: bgColor,
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${iconColor}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON_PATHS[icon] || ICON_PATHS.bell} />
          </svg>
        </div>
        <div style={{ fontFamily, fontSize: 12, color: "#333", lineHeight: 1.4, fontWeight: 500, flex: 1, minWidth: 0, overflow: "hidden" }}>
          {text}
        </div>
        <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </div>
      </div>
    </div>
  );
};
