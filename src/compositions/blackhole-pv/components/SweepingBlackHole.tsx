import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { BH_LAYERS, COLORS, EASING } from "../constants";

// =================================================================
//  SweepingBlackHole -- Moving black hole with momentum
//  Horizontal movement, motion stretch, trailing particles
// =================================================================

export const SweepingBlackHole: React.FC<{
  startX: number;
  endX: number;
  y: number;
  startFrame: number;
  durationFrames: number;
  size?: number;
  showTrail?: boolean;
}> = ({
  startX,
  endX,
  y,
  startFrame,
  durationFrames,
  size = 300,
  showTrail = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  if (localFrame < -10 || localFrame > durationFrames + 30) return null;

  const moveProgress = interpolate(
    localFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.cinematic },
  );
  const currentX = interpolate(moveProgress, [0, 1], [startX, endX]);

  const velocity = Math.abs(
    interpolate(
      localFrame,
      [0, durationFrames * 0.2, durationFrames * 0.8, durationFrames],
      [0, 1, 1, 0.2],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  );
  const stretchX = 1 + velocity * 0.12;
  const stretchY = 1 - velocity * 0.04;

  const entranceSpr = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  const breathe = 1 + 0.02 * noise2D("sweep-breathe", frame * 0.02, 0);

  const diskRotation = (frame * 360) / (6 * fps);
  const innerRingRotation = (frame * 360) / (4 * fps);
  const lensingRotation = (frame * 360) / (10 * fps);
  const glowIntensity = 0.8 + 0.2 * noise2D("sweep-glow", frame * 0.015, 0);

  const r = size / 2;
  const totalScale = entranceSpr * breathe;

  // Shockwave on appearance
  const shockProgress = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shockSize = interpolate(shockProgress, [0, 1], [r, r * 4]);
  const shockOpacity = interpolate(shockProgress, [0, 0.2, 1], [0, 0.5, 0]);

  // Trail particles (max 20)
  const trailParticles = showTrail
    ? Array.from({ length: 20 }, (_, i) => {
        const age = localFrame - i * 1.5;
        if (age < 0 || age > durationFrames) return null;
        const trailProgress = interpolate(
          age,
          [0, durationFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.cinematic },
        );
        const trailX = interpolate(trailProgress, [0, 1], [startX, endX]);
        const spread = noise2D(`trail-s-${i}`, frame * 0.02, i) * 40;
        const trailY = y + spread;
        const trailSize = interpolate(i, [0, 19], [8, 2]);
        const trailOpacity = interpolate(i, [0, 19], [0.5, 0.05]) * velocity;
        const trailColor = i % 3 === 0 ? COLORS.purple : i % 3 === 1 ? COLORS.coral : COLORS.amber;

        return (
          <div
            key={`trail-${i}`}
            style={{
              position: "absolute",
              left: trailX - trailSize / 2,
              top: trailY - trailSize / 2,
              width: trailSize,
              height: trailSize,
              borderRadius: "50%",
              background: trailColor,
              opacity: trailOpacity,
              boxShadow: `0 0 ${trailSize}px ${trailColor}88`,
              filter: "blur(1px)",
            }}
          />
        );
      })
    : null;

  // Field lines
  const fieldLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.03;
    const lineLength = r * (1.2 + 0.3 * Math.sin(frame * 0.05 + i * 2));
    const x1 = Math.cos(angle) * r * 0.7;
    const y1 = Math.sin(angle) * r * 0.7;
    const x2 = Math.cos(angle) * lineLength;
    const y2 = Math.sin(angle) * lineLength;
    const lineOpacity = 0.1 + 0.1 * Math.sin(frame * 0.08 + i);

    return (
      <line
        key={`field-${i}`}
        x1={r + x1}
        y1={r + y1}
        x2={r + x2}
        y2={r + y2}
        stroke={COLORS.lensing}
        strokeWidth="1"
        opacity={lineOpacity * velocity}
        strokeLinecap="round"
      />
    );
  });

  return (
    <>
      {trailParticles}

      {/* Shockwave ring */}
      <div
        style={{
          position: "absolute",
          left: currentX - shockSize,
          top: y - shockSize,
          width: shockSize * 2,
          height: shockSize * 2,
          borderRadius: "50%",
          border: `2px solid ${COLORS.lensing}`,
          opacity: shockOpacity,
          boxShadow: `0 0 30px ${COLORS.purple}44`,
          pointerEvents: "none",
        }}
      />

      {/* Main black hole body */}
      <div
        style={{
          position: "absolute",
          left: currentX - r,
          top: y - r,
          width: size,
          height: size,
          transform: `scale(${totalScale}) scaleX(${stretchX}) scaleY(${stretchY})`,
          opacity: entranceSpr,
        }}
      >
        <svg
          width={size}
          height={size}
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
        >
          {fieldLines}
        </svg>

        {/* Outer purple glow */}
        <div
          style={{
            position: "absolute",
            inset: -r * 0.8,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BH_LAYERS.outerGlow}35 0%, transparent 70%)`,
            filter: "blur(25px)",
            transform: `rotate(${lensingRotation}deg)`,
          }}
        />

        {/* Outer accretion ring */}
        <div
          style={{
            position: "absolute",
            inset: -r * 0.35,
            borderRadius: "50%",
            background: `conic-gradient(from ${diskRotation}deg, ${COLORS.purple}55, ${COLORS.coral}44, ${COLORS.amber}33, ${COLORS.purple}55)`,
            filter: "blur(12px)",
            opacity: glowIntensity * 0.7,
          }}
        />

        {/* Main accretion disk */}
        <div
          style={{
            position: "absolute",
            inset: -r * 0.15,
            borderRadius: "50%",
            background: `conic-gradient(
              from ${diskRotation}deg,
              ${BH_LAYERS.accretionMiddle} 0deg,
              ${BH_LAYERS.accretionOuter} 60deg,
              ${BH_LAYERS.accretionEdge} 120deg,
              ${BH_LAYERS.accretionMiddle} 180deg,
              ${BH_LAYERS.accretionOuter} 240deg,
              ${BH_LAYERS.accretionEdge} 300deg,
              ${BH_LAYERS.accretionMiddle} 360deg
            )`,
            filter: "blur(5px)",
            opacity: glowIntensity * 0.9,
          }}
        />

        {/* Inner bright ring -- lensing */}
        <div
          style={{
            position: "absolute",
            inset: r * 0.08,
            borderRadius: "50%",
            border: `2px solid ${BH_LAYERS.lensing}`,
            boxShadow: `
              0 0 ${14 * glowIntensity}px ${BH_LAYERS.lensing}99,
              inset 0 0 ${10 * glowIntensity}px ${BH_LAYERS.lensing}55
            `,
            transform: `rotate(${-innerRingRotation}deg)`,
            opacity: glowIntensity * 0.9,
          }}
        />

        {/* Event horizon */}
        <div
          style={{
            position: "absolute",
            inset: r * 0.15,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BH_LAYERS.eventHorizon} 60%, ${BH_LAYERS.accretionInner}88 100%)`,
          }}
        />

        {/* Core -- SOLID FLAT BLACK */}
        <div
          style={{
            position: "absolute",
            inset: r * 0.25,
            borderRadius: "50%",
            background: BH_LAYERS.core,
          }}
        />
      </div>
    </>
  );
};
