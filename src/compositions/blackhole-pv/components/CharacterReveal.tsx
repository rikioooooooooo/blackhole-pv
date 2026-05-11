import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// =================================================================
//  CharacterReveal -- Spring-staggered per-character entrance
// =================================================================

export const CharacterReveal: React.FC<{
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  offsetY?: number;
  blur?: boolean;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: string;
}> = ({
  text,
  style,
  delay = 0,
  stagger = 2,
  springConfig = { damping: 12, stiffness: 100, mass: 0.4 },
  offsetY = 30,
  blur = false,
  color,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = text.split("");

  return (
    <span
      style={{
        display: "inline-block",
        color,
        fontSize,
        fontFamily,
        fontWeight,
        letterSpacing,
        ...style,
      }}
    >
      {chars.map((char, i) => {
        const charDelay = delay + i * stagger;
        const spr = spring({
          frame: Math.max(0, frame - charDelay),
          fps,
          config: springConfig,
        });

        const yOffset = offsetY * (1 - spr);
        const blurVal = blur ? 8 * (1 - spr) : 0;
        const scaleVal = 0.8 + 0.2 * spr;

        return (
          <span
            key={`${i}-${char}`}
            style={{
              display: "inline-block",
              transform: `translateY(${yOffset}px) scale(${scaleVal})`,
              opacity: spr,
              filter: blurVal > 0.1 ? `blur(${blurVal}px)` : undefined,
              whiteSpace: char === " " ? "pre" : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

// =================================================================
//  WordReveal -- Word-by-word spring entrance
// =================================================================

export const WordReveal: React.FC<{
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  offsetY?: number;
  blur?: boolean;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: string;
  lineHeight?: number;
}> = ({
  text,
  style,
  delay = 0,
  stagger = 3,
  springConfig = { damping: 14, stiffness: 80, mass: 0.5 },
  offsetY = 25,
  blur = false,
  color,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  lineHeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span
      style={{
        display: "inline-block",
        color,
        fontSize,
        fontFamily,
        fontWeight,
        letterSpacing,
        lineHeight,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger;
        const spr = spring({
          frame: Math.max(0, frame - wordDelay),
          fps,
          config: springConfig,
        });

        const yOffset = offsetY * (1 - spr);
        const blurVal = blur ? 6 * (1 - spr) : 0;
        const scaleVal = 0.85 + 0.15 * spr;

        return (
          <span
            key={`word-${i}`}
            style={{
              display: "inline-block",
              transform: `translateY(${yOffset}px) scale(${scaleVal})`,
              opacity: spr,
              filter: blurVal > 0.1 ? `blur(${blurVal}px)` : undefined,
              marginRight: "0.3em",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
