import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT, FONTS } from "../constants";

// =================================================================
//  SceneDecorations -- Collection of subtle decorative elements
//  Used across scenes for visual polish and Apple PV-level detail
// =================================================================

// --- Corner Accent Marks ---
export const CornerMarks: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
  margin?: number;
}> = ({
  opacity = 0.06,
  size = 24,
  color = COLORS.warmGray,
  margin = 40,
}) => {
  const frame = useCurrentFrame();

  const marks = [
    { left: margin, top: margin, rotate: 0 },
    { left: VIDEO_WIDTH - margin - size, top: margin, rotate: 90 },
    { left: margin, top: VIDEO_HEIGHT - margin - size, rotate: 270 },
    { left: VIDEO_WIDTH - margin - size, top: VIDEO_HEIGHT - margin - size, rotate: 180 },
  ];

  return (
    <>
      {marks.map((mark, i) => {
        const markOp = interpolate(frame, [i * 3, i * 3 + 15], [0, opacity], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={`mark-${i}`}
            style={{
              position: "absolute",
              left: mark.left,
              top: mark.top,
              width: size,
              height: size,
              borderLeft: `1.5px solid ${color}`,
              borderTop: `1.5px solid ${color}`,
              transform: `rotate(${mark.rotate}deg)`,
              opacity: markOp,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

// --- Scene Label ---
export const SceneLabel: React.FC<{
  label: string;
  x?: number;
  y?: number;
  opacity?: number;
}> = ({
  label,
  x = 40,
  y,
  opacity = 0.06,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: y ?? 30,
        fontFamily: FONTS.mono,
        fontSize: 10,
        color: COLORS.warmGray,
        opacity,
        letterSpacing: "0.1em",
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  );
};

// --- Vignette ---
export const Vignette: React.FC<{
  color?: string;
  innerRadius?: number;
}> = ({
  color = COLORS.bg,
  innerRadius = 40,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at center, transparent ${innerRadius}%, ${color}88 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Ambient Aurora ---
export const AmbientAurora: React.FC<{
  color?: string;
  x?: string;
  y?: string;
  size?: string;
  opacity?: number;
  noiseId?: string;
}> = ({
  color = COLORS.purple,
  x = "30%",
  y = "30%",
  size = "50%",
  opacity = 0.08,
  noiseId = "aurora",
}) => {
  const frame = useCurrentFrame();
  const driftX = noise2D(`${noiseId}-x`, frame * 0.008, 0) * 30;
  const driftY = noise2D(`${noiseId}-y`, 0, frame * 0.008) * 20;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(ellipse, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        filter: "blur(100px)",
        transform: `translate(${driftX}px, ${driftY}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Grid Lines (subtle background grid) ---
export const SubtleGrid: React.FC<{
  spacing?: number;
  color?: string;
  opacity?: number;
}> = ({
  spacing = 60,
  color = COLORS.warmGrayLight,
  opacity = 0.04,
}) => {
  const frame = useCurrentFrame();
  const drift = noise2D("grid-drift", frame * 0.003, 0) * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
        transform: `translate(${drift}px, ${drift * 0.5}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Horizontal Rule ---
export const HorizontalRule: React.FC<{
  y: number;
  width?: number;
  color?: string;
  delay?: number;
}> = ({
  y,
  width = 80,
  color = COLORS.warmGray,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.5 },
  });

  const lineWidth = width * spr;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: "50%",
        width: lineWidth,
        height: 1,
        background: color,
        transform: "translateX(-50%)",
        opacity: spr * 0.2,
        borderRadius: 1,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Breathing Dot ---
export const BreathingDot: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  speed?: number;
  noiseId?: string;
}> = ({
  x,
  y,
  size = 6,
  color = COLORS.purple,
  speed = 0.05,
  noiseId = "bdot",
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(frame * speed);
  const drift = noise2D(`${noiseId}-d`, frame * 0.01, 0) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2 + drift,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: pulse * 0.3,
        boxShadow: `0 0 ${size * 2}px ${color}44`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Frame Counter (for editorial feel) ---
export const FrameCounter: React.FC<{
  visible?: boolean;
}> = ({ visible = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  const seconds = Math.floor(frame / fps);
  const frames = frame % fps;
  const timeCode = `${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        bottom: 30,
        fontFamily: FONTS.mono,
        fontSize: 9,
        color: COLORS.warmGray,
        opacity: 0.04,
        letterSpacing: "0.08em",
        pointerEvents: "none",
      }}
    >
      {timeCode}
    </div>
  );
};

// --- Cross Hair (center marker) ---
export const CrossHair: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  opacity?: number;
}> = ({
  x = VIDEO_WIDTH / 2,
  y = VIDEO_HEIGHT / 2,
  size = 30,
  opacity = 0.04,
}) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y,
          width: size,
          height: 0.5,
          background: COLORS.warmGray,
          opacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - size / 2,
          width: 0.5,
          height: size,
          background: COLORS.warmGray,
          opacity,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// --- Scan Lines ---
export const ScanLines: React.FC<{
  opacity?: number;
  spacing?: number;
}> = ({
  opacity = 0.015,
  spacing = 3,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${spacing - 1}px,
          rgba(0,0,0,${opacity}) ${spacing - 1}px,
          rgba(0,0,0,${opacity}) ${spacing}px
        )`,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Gradient Border ---
export const GradientBorder: React.FC<{
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  borderRadius?: number;
  colors?: string[];
  thickness?: number;
  opacity?: number;
  noiseId?: string;
}> = ({
  width = 400,
  height = 300,
  x = 0,
  y = 0,
  borderRadius = 12,
  colors = [COLORS.purple, COLORS.coral, COLORS.amber],
  thickness = 1,
  opacity = 0.15,
  noiseId = "gborder",
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 0.5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius,
        padding: thickness,
        background: `conic-gradient(from ${rotation}deg, ${colors.join(", ")}, ${colors[0]})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: borderRadius - thickness,
          background: COLORS.bg,
        }}
      />
    </div>
  );
};

// --- Floating Text Badge ---
export const FloatingBadge: React.FC<{
  text: string;
  x: number;
  y: number;
  delay?: number;
  color?: string;
  bgColor?: string;
  noiseId?: string;
}> = ({
  text,
  x,
  y,
  delay = 0,
  color = COLORS.warmGrayDark,
  bgColor = "rgba(255,255,255,0.6)",
  noiseId = "badge",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.5 },
  });

  const driftX = noise2D(`${noiseId}-dx`, frame * 0.005, 0) * 3;
  const driftY = noise2D(`${noiseId}-dy`, 0, frame * 0.005) * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: x + driftX,
        top: y + driftY,
        padding: "4px 12px",
        borderRadius: 100,
        background: bgColor,
        fontFamily: FONTS.ui,
        fontSize: 10,
        fontWeight: 500,
        color,
        letterSpacing: "0.05em",
        opacity: spr * 0.8,
        transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
