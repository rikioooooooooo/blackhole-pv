import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS } from "../constants";

// =================================================================
//  GravitationalField -- Visual distortion near black hole
//  Radial lines, warped grid, pulling effect visualization
// =================================================================

export const GravitationalField: React.FC<{
  x: number;
  y: number;
  radius: number;
  intensity?: number;
  lineCount?: number;
  noiseId?: string;
}> = ({
  x,
  y,
  radius,
  intensity = 1,
  lineCount = 16,
  noiseId = "grav",
}) => {
  const frame = useCurrentFrame();
  const globalOpacity = interpolate(intensity, [0, 1], [0, 0.3]);

  return (
    <svg
      style={{
        position: "absolute",
        left: x - radius * 2,
        top: y - radius * 2,
        width: radius * 4,
        height: radius * 4,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {/* Radial pull lines */}
      {Array.from({ length: lineCount }, (_, i) => {
        const angle = (i / lineCount) * Math.PI * 2 + frame * 0.02;
        const innerR = radius * 0.4;
        const outerR =
          radius * (1.5 + 0.3 * noise2D(`${noiseId}-r-${i}`, frame * 0.02, i));
        const lineOpacity =
          globalOpacity *
          (0.5 + 0.5 * Math.sin(frame * 0.08 + i * 1.2));

        const cx = radius * 2;
        const cy = radius * 2;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR;

        return (
          <line
            key={`pull-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={COLORS.lensing}
            strokeWidth="0.8"
            opacity={lineOpacity}
            strokeLinecap="round"
          />
        );
      })}

      {/* Warped concentric rings */}
      {Array.from({ length: 4 }, (_, i) => {
        const ringR = radius * (0.6 + i * 0.3);
        const warp = noise2D(`${noiseId}-warp-${i}`, frame * 0.015, i * 5) * 8;
        const ringOpacity = globalOpacity * interpolate(i, [0, 3], [0.4, 0.1]);

        return (
          <circle
            key={`ring-${i}`}
            cx={radius * 2 + warp}
            cy={radius * 2 + warp * 0.5}
            r={ringR}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth="0.5"
            opacity={ringOpacity}
            strokeDasharray="4 8"
          />
        );
      })}

      {/* Spiral arms */}
      {Array.from({ length: 4 }, (_, i) => {
        const spiralPoints: string[] = [];
        const armOffset = (i / 4) * Math.PI * 2;
        for (let t = 0; t < 40; t++) {
          const angle = armOffset + t * 0.15 + frame * 0.01;
          const r = radius * 0.3 + t * radius * 0.025;
          const sx = radius * 2 + Math.cos(angle) * r;
          const sy = radius * 2 + Math.sin(angle) * r;
          spiralPoints.push(`${sx},${sy}`);
        }
        const spiralOp = globalOpacity * 0.3;

        return (
          <polyline
            key={`spiral-${i}`}
            points={spiralPoints.join(" ")}
            fill="none"
            stroke={COLORS.lensing}
            strokeWidth="0.5"
            opacity={spiralOp}
            strokeLinecap="round"
          />
        );
      })}

      {/* Particle dots along distortion field */}
      {Array.from({ length: 12 }, (_, i) => {
        const dotAngle = (i / 12) * Math.PI * 2 + frame * 0.03;
        const dotR = radius * (0.8 + 0.2 * Math.sin(frame * 0.04 + i * 2));
        const dx = radius * 2 + Math.cos(dotAngle) * dotR;
        const dy = radius * 2 + Math.sin(dotAngle) * dotR;
        const dotSize = 2 + noise2D(`grav-dot-${i}`, frame * 0.03, i) * 1.5;
        const dotOp = globalOpacity * (0.3 + 0.2 * Math.sin(frame * 0.08 + i));

        return (
          <circle
            key={`grav-dot-${i}`}
            cx={dx}
            cy={dy}
            r={dotSize / 2}
            fill={COLORS.coral}
            opacity={dotOp}
          />
        );
      })}
    </svg>
  );
};
