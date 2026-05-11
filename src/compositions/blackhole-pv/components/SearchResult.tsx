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
//  SearchResult -- Google-style search result card
// =================================================================

export const SearchResult: React.FC<{
  title: string;
  url: string;
  description: string;
  delay?: number;
  index?: number;
  fontFamily?: string;
  noiseId?: string;
}> = ({
  title,
  url,
  description,
  delay = 0,
  index = 0,
  fontFamily = "Inter, system-ui, sans-serif",
  noiseId = "sr",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceSpr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.5 },
  });
  const entranceY = interpolate(entranceSpr, [0, 1], [25, 0]);
  const driftX = noise2D(`${noiseId}-${index}-dx`, frame * 0.004, 0) * 2;

  return (
    <div
      style={{
        padding: "12px 0",
        opacity: entranceSpr,
        transform: `translateY(${entranceY}px) translateX(${driftX}px)`,
      }}
    >
      <div style={{ fontFamily, fontSize: 12, color: COLORS.googleGreen, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0f0f0", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.googleBlue}, ${COLORS.googleGreen})` }} />
        </div>
        <span>{url}</span>
      </div>
      <div style={{ fontFamily, fontSize: 18, color: "#1a0dab", fontWeight: 400, lineHeight: 1.3, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontFamily, fontSize: 13, color: "#4d5156", lineHeight: 1.5, maxWidth: 600 }}>
        {description}
      </div>
    </div>
  );
};
