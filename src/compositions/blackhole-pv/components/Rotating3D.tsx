import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { noise2D } from "@remotion/noise";

// =================================================================
//  Rotating3DSphere -- Wireframe sphere with dual ring axes
// =================================================================

export const Rotating3DSphere: React.FC<{
  size?: number;
  color?: string;
  ringCount?: number;
  speed?: number;
  x?: number;
  y?: number;
  delay?: number;
  noiseId?: string;
}> = ({
  size = 200,
  color = "rgba(107, 63, 160, 0.25)",
  ringCount = 5,
  speed = 1,
  x = 0,
  y = 0,
  delay = 0,
  noiseId = "sphere",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  const driftX = noise2D(`${noiseId}-drift-x`, frame * 0.008, 0) * 6;
  const driftY = noise2D(`${noiseId}-drift-y`, 0, frame * 0.008) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2 + driftX,
        top: y - size / 2 + driftY,
        width: size,
        height: size,
        perspective: 1000,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.5, 1])})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${frame * 0.5 * speed + noise2D(`${noiseId}-sx`, frame * 0.01, 0) * 10}deg) rotateY(${frame * 0.8 * speed}deg)`,
        }}
      >
        {Array.from({ length: ringCount }, (_, i) => {
          const angle = (i / ringCount) * 180;
          return (
            <div
              key={`v-${i}`}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1.5px solid ${color}`,
                transform: `rotateY(${angle}deg)`,
                backfaceVisibility: "visible",
              }}
            />
          );
        })}
        {Array.from({ length: ringCount }, (_, i) => {
          const angle = (i / ringCount) * 180;
          return (
            <div
              key={`h-${i}`}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1px solid ${color}`,
                transform: `rotateX(${angle}deg)`,
                backfaceVisibility: "visible",
                opacity: 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// =================================================================
//  FloatingDiamond -- 3D rotating diamond with glow option
// =================================================================

export const FloatingDiamond: React.FC<{
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  speed?: number;
  delay?: number;
  noiseId?: string;
  glow?: boolean;
  glowColor?: string;
}> = ({
  size = 60,
  color = "rgba(107, 63, 160, 0.3)",
  x = 0,
  y = 0,
  speed = 1,
  delay = 0,
  noiseId = "dia",
  glow = false,
  glowColor = "#6B3FA0",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const rotX = frame * 1.5 * speed;
  const rotY = frame * 2 * speed;
  const floatY = noise2D(`${noiseId}-fy`, frame * 0.015, 0) * 15;
  const floatX = noise2D(`${noiseId}-fx`, 0, frame * 0.015) * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: x + floatX,
        top: y + floatY,
        width: size,
        height: size,
        perspective: 600,
        opacity: entrance * 0.8,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(45deg) scale(${interpolate(entrance, [0, 1], [0, 1])})`,
          background: color,
          boxShadow: glow
            ? `0 0 30px ${glowColor}44, 0 0 60px ${glowColor}22`
            : undefined,
        }}
      />
    </div>
  );
};

// =================================================================
//  FloatingRing -- 3D ring that rotates and drifts
// =================================================================

export const FloatingRing: React.FC<{
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  speed?: number;
  delay?: number;
  noiseId?: string;
  thickness?: number;
}> = ({
  size = 100,
  color = "rgba(107, 63, 160, 0.2)",
  x = 0,
  y = 0,
  speed = 1,
  delay = 0,
  noiseId = "ring",
  thickness = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 70 },
  });

  const rotX = frame * 1.2 * speed + noise2D(`${noiseId}-rx`, frame * 0.01, 0) * 10;
  const rotY = frame * 0.8 * speed;
  const floatX = noise2D(`${noiseId}-fx`, frame * 0.012, 0) * 10;
  const floatY = noise2D(`${noiseId}-fy`, 0, frame * 0.012) * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2 + floatX,
        top: y - size / 2 + floatY,
        width: size,
        height: size,
        perspective: 800,
        opacity: entrance * 0.6,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${interpolate(entrance, [0, 1], [0.3, 1])})`,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: `${thickness}px solid ${color}`,
            backfaceVisibility: "visible",
          }}
        />
      </div>
    </div>
  );
};
