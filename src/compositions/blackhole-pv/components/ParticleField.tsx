import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeStar } from "@remotion/shapes";
import { makeTransform, rotate } from "@remotion/animation-utils";
import { VIDEO_WIDTH, VIDEO_HEIGHT, COLORS } from "../constants";

// =================================================================
//  ParticleField -- Star particles + warm floating dots
// =================================================================

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

const createParticles = (count: number, prefix: string): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 7 + prefix.charCodeAt(0) + 1) * VIDEO_WIDTH,
    y: seededRandom(i * 13 + prefix.charCodeAt(0) + 3) * VIDEO_HEIGHT,
    size: seededRandom(i * 3 + prefix.charCodeAt(0) + 5) * 3 + 1,
    speed: seededRandom(i * 11 + prefix.charCodeAt(0) + 7) * 0.5 + 0.2,
    opacity: seededRandom(i * 17 + prefix.charCodeAt(0) + 9) * 0.4 + 0.1,
    delay: seededRandom(i * 23 + prefix.charCodeAt(0) + 11) * 60,
  }));

export const ParticleField: React.FC<{
  fadeInDuration?: number;
  color?: string;
  particleCount?: number;
  prefix?: string;
  showStars?: boolean;
  starCount?: number;
  starPrefix?: string;
}> = ({
  fadeInDuration = 2,
  color = COLORS.warmGray,
  particleCount = 50,
  prefix = "pf",
  showStars = true,
  starCount = 15,
  starPrefix = "sf",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(
    frame,
    [0, fadeInDuration * fps],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const particles = React.useMemo(
    () => createParticles(particleCount, prefix),
    [particleCount, prefix],
  );

  const starParticles = React.useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        x: random(`${starPrefix}-x-${i}`) * VIDEO_WIDTH,
        y: random(`${starPrefix}-y-${i}`) * VIDEO_HEIGHT,
        size: random(`${starPrefix}-s-${i}`) * 20 + 8,
        speed: random(`${starPrefix}-sp-${i}`) * 0.4 + 0.1,
        delay: random(`${starPrefix}-d-${i}`) * 30,
      })),
    [starCount, starPrefix],
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const drift = noise2D(`${prefix}-drift-${i}`, (frame + p.delay) * 0.015 * p.speed, i * 5) * 30;
        const floatY = noise2D(`${prefix}-floaty-${i}`, i * 5, (frame + p.delay) * 0.012 * p.speed) * 20;
        const pulse = 0.5 + 0.5 * Math.sin((frame + p.delay) * 0.05);

        return (
          <div
            key={`dot-${i}`}
            style={{
              position: "absolute",
              left: p.x + drift,
              top: p.y + floatY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity * pulse * globalOpacity,
              filter: p.size > 2.5 ? "blur(1px)" : undefined,
            }}
          />
        );
      })}

      {showStars &&
        starParticles.map((s, i) => {
          const starPath = makeStar({
            points: 4,
            innerRadius: s.size * 0.3,
            outerRadius: s.size,
          });
          const drift = noise2D(`${starPrefix}-drift-${i}`, frame * 0.015 * s.speed, i * 10);
          const driftY = noise2D(`${starPrefix}-drifty-${i}`, i * 10, frame * 0.015 * s.speed);
          const pulse = Math.sin(frame * 0.08 + i * 2) * 0.4 + 0.4;
          const starOpacity = interpolate(
            frame,
            [s.delay, s.delay + 15],
            [0, pulse * 0.25],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const starRotation = frame * s.speed * 2;
          const starColor =
            i % 4 === 0
              ? COLORS.purple
              : i % 4 === 1
                ? COLORS.coral
                : i % 4 === 2
                  ? COLORS.amber
                  : COLORS.warmGray;

          return (
            <svg
              key={`star-${i}`}
              width={s.size * 2.5}
              height={s.size * 2.5}
              viewBox={`0 0 ${starPath.width} ${starPath.height}`}
              style={{
                position: "absolute",
                left: s.x + drift * 20,
                top: s.y + driftY * 20,
                opacity: starOpacity * globalOpacity,
                transform: makeTransform([rotate(`${starRotation}deg`)]),
              }}
            >
              <path d={starPath.path} fill="none" stroke={starColor} strokeWidth="1" />
            </svg>
          );
        })}
    </div>
  );
};
