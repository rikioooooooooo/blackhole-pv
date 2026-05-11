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
//  AbsorptionPhysics -- Visual effects for the 3-stage absorption
//
//  Every absorption must have 3 phases:
//  1. GRAVITY phase: Elements near BH start trembling, text warps
//  2. CAPTURE phase: Elements detach, stretch (spaghettification)
//  3. ABSORPTION phase: Elements disappear, BH ring pulses, burst
//
//  This file provides reusable visual effects for each stage.
// =================================================================

// --- Gravitational Tremor Effect ---
// Applied to elements near the BH during gravity phase
export const GravitationalTremor: React.FC<{
  children: React.ReactNode;
  intensity: number;  // 0-1
  noiseId?: string;
}> = ({ children, intensity, noiseId = "tremor" }) => {
  const frame = useCurrentFrame();

  if (intensity <= 0) return <>{children}</>;

  const tremX = noise2D(`${noiseId}-tx`, frame * 0.3, 0) * intensity * 6;
  const tremY = noise2D(`${noiseId}-ty`, 0, frame * 0.3) * intensity * 4;
  const tremScale = 1 - intensity * 0.05;
  const tremSkewX = noise2D(`${noiseId}-skx`, frame * 0.2, 0.5) * intensity * 2;

  return (
    <div
      style={{
        transform: `translate(${tremX}px, ${tremY}px) scale(${tremScale}) skewX(${tremSkewX}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

// --- Spaghettification Effect ---
// Stretches elements toward BH center during capture phase
export const Spaghettification: React.FC<{
  children: React.ReactNode;
  progress: number;  // 0-1
  bhAngle: number;   // angle to BH in degrees
  intensity?: number;
}> = ({ children, progress, bhAngle, intensity = 1 }) => {
  if (progress <= 0) return <>{children}</>;

  const stretchX = 1 + progress * 0.4 * intensity;
  const stretchY = 1 - progress * 0.2 * intensity;
  const rotation = bhAngle * progress * 0.2;

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg) scaleX(${stretchX}) scaleY(${stretchY})`,
        transformOrigin: "center center",
        filter: progress > 0.5 ? `blur(${(progress - 0.5) * 4}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// --- Absorption Shockwave ---
// Ring that expands outward when something is absorbed
export const AbsorptionShockwave: React.FC<{
  x: number;
  y: number;
  triggerFrame: number;
  maxRadius?: number;
  color?: string;
  duration?: number;
}> = ({
  x,
  y,
  triggerFrame,
  maxRadius = 200,
  color = COLORS.lensing,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const age = frame - triggerFrame;

  if (age < 0 || age > duration) return null;

  const progress = age / duration;
  const radius = interpolate(progress, [0, 1], [20, maxRadius]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.5, 0]);
  const borderWidth = interpolate(progress, [0, 1], [3, 0.5]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        border: `${borderWidth}px solid ${color}`,
        opacity,
        boxShadow: `0 0 ${radius * 0.3}px ${color}44`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- BH Ring Pulse ---
// Brief flash/expansion of the BH's accretion ring when absorbing
export const RingPulse: React.FC<{
  x: number;
  y: number;
  baseRadius: number;
  triggerFrame: number;
  duration?: number;
  color?: string;
}> = ({
  x,
  y,
  baseRadius,
  triggerFrame,
  duration = 12,
  color = COLORS.purple,
}) => {
  const frame = useCurrentFrame();
  const age = frame - triggerFrame;

  if (age < 0 || age > duration) return null;

  const progress = age / duration;
  const radius = baseRadius * (1 + progress * 0.3);
  const opacity = interpolate(progress, [0, 0.15, 1], [0, 0.4, 0]);
  const hueShift = progress * 30;

  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, transparent 60%, ${color}${Math.round(opacity * 100).toString(16).padStart(2, "0")} 80%, transparent 100%)`,
        filter: `hue-rotate(${hueShift}deg) blur(4px)`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Particle Trail ---
// Trail of particles following an absorbed element
export const ParticleTrail: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;  // 0-1
  particleCount?: number;
  colors?: string[];
  noiseId?: string;
}> = ({
  startX,
  startY,
  endX,
  endY,
  progress,
  particleCount = 6,
  colors = [COLORS.coral, COLORS.amber, COLORS.lensing],
  noiseId = "trail",
}) => {
  const frame = useCurrentFrame();

  if (progress <= 0 || progress >= 1) return null;

  return (
    <>
      {Array.from({ length: particleCount }, (_, i) => {
        const particleProgress = Math.max(0, progress - i * 0.05);
        if (particleProgress <= 0) return null;

        const px = interpolate(particleProgress, [0, 1], [startX, endX]);
        const py = interpolate(particleProgress, [0, 1], [startY, endY]);
        const spread = noise2D(`${noiseId}-sp-${i}`, frame * 0.05, i) * 15;
        const size = interpolate(i, [0, particleCount - 1], [4, 1.5]);
        const opacity = interpolate(i, [0, particleCount - 1], [0.4, 0.1]) * (1 - progress);
        const color = colors[i % colors.length];

        return (
          <div
            key={`trail-${i}`}
            style={{
              position: "absolute",
              left: px + spread - size / 2,
              top: py + spread * 0.5 - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              boxShadow: `0 0 ${size * 2}px ${color}66`,
              filter: "blur(0.5px)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

// --- Gravitational Warp Overlay ---
// Subtle distortion effect over the entire scene near BH
export const GravitationalWarpOverlay: React.FC<{
  bhX: number;
  bhY: number;
  radius: number;
  intensity: number;
}> = ({ bhX, bhY, radius, intensity }) => {
  const frame = useCurrentFrame();

  if (intensity <= 0) return null;

  const breathe = 1 + 0.05 * noise2D("warp-breathe", frame * 0.02, 0);
  const actualRadius = radius * breathe;
  const opacity = intensity * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: bhX - actualRadius,
        top: bhY - actualRadius,
        width: actualRadius * 2,
        height: actualRadius * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.core}${Math.round(opacity * 20).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />
  );
};

// --- Clean State Transition ---
// Smooth transition effect when content is fully absorbed
export const CleanStateTransition: React.FC<{
  visible: boolean;
  delay?: number;
  children: React.ReactNode;
}> = ({ visible, delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  const entranceSpr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 60, mass: 0.8 },
  });

  const entranceY = interpolate(entranceSpr, [0, 1], [15, 0]);
  const entranceBlur = interpolate(entranceSpr, [0, 1], [6, 0]);

  return (
    <div
      style={{
        transform: `translateY(${entranceY}px)`,
        opacity: entranceSpr,
        filter: entranceBlur > 0.1 ? `blur(${entranceBlur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// --- Absorption Counter ---
// Subtle counter showing absorbed/total elements
export const AbsorptionCounter: React.FC<{
  absorbed: number;
  total: number;
  x: number;
  y: number;
  visible: boolean;
}> = ({ absorbed, total, x, y, visible }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible || absorbed === 0) return null;

  const entranceSpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.4 },
  });

  const opacity = Math.min(0.12, (absorbed / total) * 0.2) * entranceSpr;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: "monospace",
        fontSize: 9,
        color: COLORS.purple,
        opacity,
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {`${absorbed}/${total}`}
    </div>
  );
};

// --- Energy Wisps ---
// Floating energy wisps around the BH during absorption
export const EnergyWisps: React.FC<{
  bhX: number;
  bhY: number;
  count?: number;
  radius?: number;
  active: boolean;
  noiseId?: string;
}> = ({
  bhX,
  bhY,
  count = 8,
  radius = 100,
  active,
  noiseId = "wisp",
}) => {
  const frame = useCurrentFrame();

  if (!active) return null;

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + frame * 0.03;
        const dist = radius * (0.5 + 0.5 * noise2D(`${noiseId}-d-${i}`, frame * 0.02, i));
        const wx = bhX + Math.cos(angle) * dist;
        const wy = bhY + Math.sin(angle) * dist;
        const wSize = 3 + noise2D(`${noiseId}-s-${i}`, frame * 0.04, i) * 2;
        const wOp = 0.15 + 0.1 * Math.sin(frame * 0.08 + i * 1.5);
        const wColor = i % 3 === 0 ? COLORS.coral : i % 3 === 1 ? COLORS.amber : COLORS.lensing;

        return (
          <div
            key={`wisp-${i}`}
            style={{
              position: "absolute",
              left: wx - wSize / 2,
              top: wy - wSize / 2,
              width: wSize,
              height: wSize,
              borderRadius: "50%",
              background: wColor,
              opacity: wOp,
              boxShadow: `0 0 ${wSize * 2}px ${wColor}55`,
              filter: "blur(0.5px)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

// --- Post-Absorption Glow ---
// Warm glow that appears after content is absorbed
export const PostAbsorptionGlow: React.FC<{
  x: number;
  y: number;
  triggerFrame: number;
  radius?: number;
  color?: string;
  duration?: number;
}> = ({
  x,
  y,
  triggerFrame,
  radius = 150,
  color = COLORS.purple,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const age = frame - triggerFrame;

  if (age < 0 || age > duration) return null;

  const progress = age / duration;
  const glowRadius = radius * (0.5 + progress * 0.5);
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.2, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - glowRadius,
        top: y - glowRadius,
        width: glowRadius * 2,
        height: glowRadius * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}${Math.round(opacity * 80).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        filter: "blur(30px)",
        pointerEvents: "none",
      }}
    />
  );
};
