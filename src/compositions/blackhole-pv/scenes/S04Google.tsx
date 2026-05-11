import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const S04Google: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0508", justifyContent: "center", alignItems: "center", opacity: fadeIn * fadeOut }}>
      <div style={{ textAlign: "center", color: "#E8E2D9", fontFamily: "'Axis Std', system-ui, sans-serif" }}>
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.6, marginBottom: 16, whiteSpace: "pre-line" }}>
          {"実機映像：Google検索結果を\nBHが吸い込む"}
        </div>
        <div style={{ fontSize: 13, color: "#9B958D", letterSpacing: "0.1em" }}>
          {"\u5B9F\u6A5F\u6620\u50CF\u3092\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
export default S04Google;
