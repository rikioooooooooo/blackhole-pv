import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS, FONTS, VIDEO_WIDTH, VIDEO_HEIGHT } from "../constants";
import { FontLoader } from "./FontLoader";
import { PaperGrain } from "./PaperGrain";
import { GlowOrb } from "./GlowOrb";

// =================================================================
//  SceneShell -- Shared wrapper for all scenes
//  Provides: camera zoom, vignette, paper grain, corner marks,
//  scene label, ambient glow orbs, subtle aurora
// =================================================================

interface GlowOrbConfig {
  x: number;
  y: number;
  size: number;
  color: string;
  noiseId: string;
  delay?: number;
}

export const SceneShell: React.FC<{
  children: React.ReactNode;
  cameraZoom?: number;
  cameraOrigin?: string;
  sceneLabel?: string;
  glowOrbs?: GlowOrbConfig[];
  showCornerMarks?: boolean;
  showVignette?: boolean;
  showGrain?: boolean;
  showFontLoader?: boolean;
  auroraColor?: string;
  auroraOpacity?: number;
  bgColor?: string;
  /** Additional camera transforms (translate, etc.) */
  cameraExtraTransform?: string;
}> = ({
  children,
  cameraZoom = 1.0,
  cameraOrigin = "center center",
  sceneLabel,
  glowOrbs = [],
  showCornerMarks = true,
  showVignette = true,
  showGrain = true,
  showFontLoader = true,
  auroraColor,
  auroraOpacity = 0.08,
  bgColor = COLORS.bg,
  cameraExtraTransform = "",
}) => {
  const frame = useCurrentFrame();

  // Subtle camera drift (shared across all scenes for organic feel)
  const camDriftX = noise2D("cam-drift-x", frame * 0.004, 0) * 3;
  const camDriftY = noise2D("cam-drift-y", 0, frame * 0.004) * 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        overflow: "hidden",
        transform: `scale(${cameraZoom}) translate(${camDriftX}px, ${camDriftY}px) ${cameraExtraTransform}`,
        transformOrigin: cameraOrigin,
      }}
    >
      {showFontLoader && <FontLoader />}

      {/* Subtle aurora gradient */}
      {auroraColor && (
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "25%",
            width: "50%",
            height: "50%",
            background: `radial-gradient(ellipse, ${auroraColor}${Math.round(auroraOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
            filter: "blur(100px)",
            transform: `translate(${noise2D("aurora-x", frame * 0.006, 0) * 40}px, ${noise2D("aurora-y", 0, frame * 0.006) * 25}px)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Glow orbs */}
      {glowOrbs.map((orb, i) => (
        <GlowOrb
          key={`orb-${i}`}
          x={orb.x}
          y={orb.y}
          size={orb.size}
          color={orb.color}
          noiseId={orb.noiseId}
          delay={orb.delay}
        />
      ))}

      {showGrain && <PaperGrain />}

      {/* Scene content */}
      {children}

      {/* Corner accent marks */}
      {showCornerMarks && (
        <>
          {[
            { left: 40, top: 40, rotate: 0 },
            { left: VIDEO_WIDTH - 64, top: 40, rotate: 90 },
            { left: 40, top: VIDEO_HEIGHT - 64, rotate: 270 },
            { left: VIDEO_WIDTH - 64, top: VIDEO_HEIGHT - 64, rotate: 180 },
          ].map((mark, i) => {
            const markOp = interpolate(frame, [i * 3, i * 3 + 15], [0, 0.06], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={`corner-${i}`}
                style={{
                  position: "absolute",
                  left: mark.left,
                  top: mark.top,
                  width: 24,
                  height: 24,
                  borderLeft: `1.5px solid ${COLORS.warmGray}`,
                  borderTop: `1.5px solid ${COLORS.warmGray}`,
                  transform: `rotate(${mark.rotate}deg)`,
                  opacity: markOp,
                  pointerEvents: "none",
                }}
              />
            );
          })}
        </>
      )}

      {/* Scene label (very subtle) */}
      {sceneLabel && (
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 30,
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: COLORS.warmGray,
            opacity: 0.06,
            letterSpacing: "0.1em",
            pointerEvents: "none",
          }}
        >
          {sceneLabel}
        </div>
      )}

      {/* Vignette */}
      {showVignette && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 40%, ${bgColor}88 100%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// =================================================================
//  SceneTransitionFlash -- Brief white/warm flash between scenes
// =================================================================

export const SceneTransitionFlash: React.FC<{
  triggerFrame: number;
  duration?: number;
  color?: string;
  maxOpacity?: number;
}> = ({
  triggerFrame,
  duration = 8,
  color = "rgba(255, 255, 255, 0.3)",
  maxOpacity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const age = frame - triggerFrame;

  if (age < 0 || age > duration) return null;

  const opacity = interpolate(
    age,
    [0, duration * 0.2, duration],
    [0, maxOpacity, 0],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// =================================================================
//  AbsorptionBurst -- Particle burst when content is absorbed
// =================================================================

export const AbsorptionBurst: React.FC<{
  x: number;
  y: number;
  triggerFrame: number;
  particleCount?: number;
  colors?: string[];
  spread?: number;
  duration?: number;
}> = ({
  x,
  y,
  triggerFrame,
  particleCount = 8,
  colors = [COLORS.coral, COLORS.amber, COLORS.lensing, COLORS.purple],
  spread = 80,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const age = frame - triggerFrame;

  if (age < 0 || age > duration) return null;

  return (
    <>
      {Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2 + noise2D(`burst-a-${i}`, 0, i) * 0.5;
        const dist = age * (spread / duration) + noise2D(`burst-d-${i}`, age * 0.1, i) * 10;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        const pSize = interpolate(age, [0, duration], [4, 1], { extrapolateRight: "clamp" });
        const pOp = interpolate(age, [0, duration * 0.3, duration], [0, 0.6, 0], { extrapolateRight: "clamp" });
        const pColor = colors[i % colors.length];

        return (
          <div
            key={`burst-p-${i}`}
            style={{
              position: "absolute",
              left: px - pSize / 2,
              top: py - pSize / 2,
              width: pSize,
              height: pSize,
              borderRadius: "50%",
              background: pColor,
              opacity: pOp,
              boxShadow: `0 0 ${pSize * 2}px ${pColor}88`,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

// =================================================================
//  CleanStateIndicator -- Shows the value after absorption
// =================================================================

export const CleanStateIndicator: React.FC<{
  text: string;
  visible: boolean;
  x?: number;
  y?: number;
}> = ({ text, visible, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: x !== undefined ? "absolute" : "relative",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * 0.5,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 14,
          color: COLORS.warmGray,
          letterSpacing: "0.1em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// =================================================================
//  HorizontalDivider -- Simple horizontal line with fade entrance
// =================================================================

export const HorizontalDivider: React.FC<{
  width?: number;
  color?: string;
  delay?: number;
  y?: number;
}> = ({
  width = 60,
  color = COLORS.warmGray,
  delay = 0,
  y,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 10], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: y !== undefined ? "absolute" : "relative",
        top: y,
        left: "50%",
        transform: "translateX(-50%)",
        width,
        height: 1,
        background: color,
        borderRadius: 1,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
