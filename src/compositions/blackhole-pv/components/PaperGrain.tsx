import React from "react";
import { useCurrentFrame } from "remotion";

// =================================================================
//  PaperGrain -- Noise texture overlay for warm paper feel
// =================================================================

export const PaperGrain: React.FC<{
  opacity?: number;
  blend?: string;
  scale?: number;
  frequency?: number;
  octaves?: number;
}> = ({
  opacity = 0.04,
  blend = "multiply",
  scale = 200,
  frequency = 0.65,
  octaves = 4,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame * 0.5) % 100;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        mixBlendMode: blend as React.CSSProperties["mixBlendMode"],
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: `${scale}px ${scale}px`,
      }}
    />
  );
};
