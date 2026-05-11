import React from "react";
import { AbsoluteFill } from "remotion";

// =================================================================
//  WarmOverlay -- Color grade overlay for warm cream tone
// =================================================================

export const WarmOverlay: React.FC<{
  color?: string;
  opacity?: number;
  blend?: React.CSSProperties["mixBlendMode"];
}> = ({
  color = "rgba(244, 162, 97, 0.08)",
  opacity = 1,
  blend = "overlay",
}) => {
  return (
    <AbsoluteFill
      style={{
        background: color,
        mixBlendMode: blend,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
