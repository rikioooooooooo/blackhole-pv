import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { noise2D } from "@remotion/noise";

// =================================================================
//  GlowOrb -- Pulsing orb with noise-driven breathing
// =================================================================

export const GlowOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay?: number;
  pulseSpeed?: number;
  noiseId?: string;
}> = ({
  x,
  y,
  size,
  color,
  delay = 0,
  pulseSpeed = 0.03,
  noiseId = "orb",
}) => {
  const frame = useCurrentFrame();

  const scale =
    0.8 +
    0.15 * Math.sin((frame + delay) * pulseSpeed) +
    0.05 * noise2D(`${noiseId}-pulse`, frame * 0.02, 0);

  const opacity = interpolate(frame, [0, 30], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  const driftX = noise2D(`${noiseId}-dx`, frame * 0.008, 0) * 8;
  const driftY = noise2D(`${noiseId}-dy`, 0, frame * 0.008) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2 + driftX,
        top: y - size / 2 + driftY,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 40%, transparent 70%)`,
        transform: `scale(${scale})`,
        opacity,
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
    />
  );
};
