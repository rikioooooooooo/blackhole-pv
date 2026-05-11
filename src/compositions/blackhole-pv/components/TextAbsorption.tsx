import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS } from "../constants";

type Direction = "ltr" | "rtl" | "center";

type TextUnit = {
  char: string;
  index: number;
  ordinal: number;
  isBreak: boolean;
};

type CharLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

const clamp01 = (value: number): number => {
  return Math.min(1, Math.max(0, value));
};

const getColor = (key: string, fallback: string): string => {
  const palette = COLORS as unknown as Record<string, string>;
  return palette[key] ?? fallback;
};

export const TextAbsorption: React.FC<{
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  letterSpacing?: string;
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
  /** 0 = nothing absorbed, 1 = all absorbed */
  absorptionProgress: number;
  /** Direction of absorption sweep */
  direction?: Direction;
  /** Black hole center for spiral animation */
  bhX?: number;
  bhY?: number;
  /** Container position */
  containerX?: number;
  containerY?: number;
  maxWidth?: number;
  /** Show spiral copies that fly toward BH */
  showSpirals?: boolean;
  /** Entrance delay per character (frames) */
  entranceStagger?: number;
  /** Frame when entrance begins */
  entranceStart?: number;
  fontWeight?: number | string;
}> = ({
  text,
  fontSize,
  fontFamily,
  color,
  letterSpacing,
  lineHeight = 1.6,
  textAlign = "center",
  absorptionProgress,
  direction = "ltr",
  bhX = 960,
  bhY = 540,
  containerX = 0,
  containerY = 0,
  maxWidth,
  showSpirals = true,
  entranceStagger = 0.5,
  entranceStart = 0,
  fontWeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [layouts, setLayouts] = useState<Array<CharLayout | null>>([]);

  const progress = clamp01(absorptionProgress);

  const units = useMemo<TextUnit[]>(() => {
    let ordinal = 0;

    return Array.from(text).map((char, index) => {
      const isBreak = char === "\n";
      const unit: TextUnit = {
        char,
        index,
        ordinal: isBreak ? -1 : ordinal,
        isBreak,
      };

      if (!isBreak) {
        ordinal++;
      }

      return unit;
    });
  }, [text]);

  const totalAbsorbableChars = useMemo(() => {
    return units.filter((unit) => !unit.isBreak).length;
  }, [units]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const measured = units.map((unit) => {
      if (unit.isBreak) {
        return null;
      }

      const element = charRefs.current[unit.index];

      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      const y = rect.top - containerRect.top;
      const width = rect.width;
      const height = rect.height;

      return {
        x,
        y,
        width,
        height,
        cx: x + width / 2,
        cy: y + height / 2,
      };
    });

    setLayouts(measured);
  }, [
    units,
    fontSize,
    fontFamily,
    letterSpacing,
    lineHeight,
    fontWeight,
    maxWidth,
    textAlign,
  ]);

  const measuredLayouts = layouts.filter(
    (layout): layout is CharLayout => layout !== null
  );

  const bounds = useMemo(() => {
    if (measuredLayouts.length === 0) {
      return null;
    }

    const minCx = Math.min(...measuredLayouts.map((layout) => layout.cx));
    const maxCx = Math.max(...measuredLayouts.map((layout) => layout.cx));
    const minX = Math.min(...measuredLayouts.map((layout) => layout.x));
    const maxX = Math.max(
      ...measuredLayouts.map((layout) => layout.x + layout.width)
    );

    return {
      minCx,
      maxCx,
      minX,
      maxX,
      centerX: (minX + maxX) / 2,
      width: Math.max(1, maxX - minX),
    };
  }, [measuredLayouts]);

  const bhLocalX = bhX - containerX;
  const bhLocalY = bhY - containerY;

  const getAbsorptionThreshold = (
    unit: TextUnit,
    layout: CharLayout | null
  ): number => {
    if (totalAbsorbableChars <= 1) {
      return 0;
    }

    if (layout && bounds) {
      if (direction === "ltr") {
        return clamp01(
          interpolate(
            layout.cx,
            [bounds.minCx, bounds.maxCx],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          )
        );
      }

      if (direction === "rtl") {
        return clamp01(
          interpolate(
            layout.cx,
            [bounds.minCx, bounds.maxCx],
            [1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          )
        );
      }

      const center = Number.isFinite(bhLocalX) ? bhLocalX : bounds.centerX;
      const maxDistance = Math.max(
        Math.abs(bounds.minCx - center),
        Math.abs(bounds.maxCx - center),
        1
      );

      return clamp01(Math.abs(layout.cx - center) / maxDistance);
    }

    const fallbackLinear =
      unit.ordinal / Math.max(1, totalAbsorbableChars - 1);

    if (direction === "ltr") {
      return fallbackLinear;
    }

    if (direction === "rtl") {
      return 1 - fallbackLinear;
    }

    const centerOrdinal = (totalAbsorbableChars - 1) / 2;
    const maxOrdinalDistance = Math.max(centerOrdinal, 1);

    return clamp01(Math.abs(unit.ordinal - centerOrdinal) / maxOrdinalDistance);
  };

  const getAbsorbT = (threshold: number): number => {
    const progressWindow = Math.max(0.045, 1 / Math.max(totalAbsorbableChars, 1));
    const localProgress = (progress - threshold) / progressWindow;

    if (localProgress <= 0) {
      return 0;
    }

    return clamp01(
      spring({
        frame: localProgress * 18,
        fps,
        config: {
          damping: 18,
          stiffness: 130,
          mass: 0.7,
        },
      })
    );
  };

  const getSpiralPosition = ({
    layout,
    unit,
    t,
  }: {
    layout: CharLayout;
    unit: TextUnit;
    t: number;
  }) => {
    const targetLeft = bhLocalX - layout.width / 2;
    const targetTop = bhLocalY - layout.height / 2;

    const baseX = interpolate(t, [0, 1], [layout.x, targetLeft], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const baseY = interpolate(t, [0, 1], [layout.y, targetTop], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const distanceToBh = Math.hypot(targetLeft - layout.x, targetTop - layout.y);
    const maxOrbit = Math.min(120, Math.max(24, distanceToBh * 0.22));

    const orbitRadius = interpolate(
      t,
      [0, 0.22, 1],
      [0, maxOrbit, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    const directionSign =
      direction === "rtl" ? -1 : unit.ordinal % 2 === 0 ? 1 : -1;

    const noise = noise2D(
      "text-absorption-spiral",
      unit.index * 0.173,
      frame * 0.012
    );

    const angle =
      unit.ordinal * 0.71 +
      noise * 0.9 +
      t * Math.PI * 5.4 * directionSign;

    return {
      x: baseX + Math.cos(angle) * orbitRadius,
      y: baseY + Math.sin(angle) * orbitRadius,
      angle,
    };
  };

  const trailColor = getColor("cyan", getColor("accent", color));
  const particleColor = getColor("purple", trailColor);

  const spiralCopies = units.flatMap((unit) => {
    if (!showSpirals || unit.isBreak) {
      return [];
    }

    const layout = layouts[unit.index];

    if (!layout) {
      return [];
    }

    const threshold = getAbsorptionThreshold(unit, layout);
    const absorbT = getAbsorbT(threshold);

    if (absorbT <= 0.001 || absorbT >= 0.995) {
      return [];
    }

    const copyOpacity = interpolate(
      absorbT,
      [0, 0.12, 0.76, 1],
      [0, 1, 0.95, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    if (copyOpacity <= 0.001) {
      return [];
    }

    const position = getSpiralPosition({
      layout,
      unit,
      t: absorbT,
    });

    const scale = interpolate(absorbT, [0, 0.75, 1], [1, 0.72, 0.08], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const rotation = interpolate(
      absorbT,
      [0, 1],
      [0, direction === "rtl" ? -420 : 420],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    const particles = [0.14, 0.28, 0.42].map((lag, trailIndex) => {
      const trailT = clamp01(absorbT - lag);

      if (trailT <= 0.001) {
        return null;
      }

      const trailPosition = getSpiralPosition({
        layout,
        unit,
        t: trailT,
      });

      const noise = noise2D(
        "text-absorption-particle",
        unit.index * 0.31 + trailIndex,
        frame * 0.035
      );

      const size = interpolate(
        trailIndex,
        [0, 2],
        [3.5, 1.8],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );

      const particleOpacity =
        copyOpacity *
        interpolate(trailIndex, [0, 2], [0.42, 0.12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

      return (
        <div
          key={`particle-${unit.index}-${trailIndex}`}
          style={{
            position: "absolute",
            left: trailPosition.x + layout.width / 2,
            top: trailPosition.y + layout.height / 2,
            width: size,
            height: size,
            borderRadius: 999,
            backgroundColor: trailIndex === 0 ? trailColor : particleColor,
            opacity: particleOpacity,
            transform: `translate(-50%, -50%) translate(${noise * 8}px, ${
              -noise * 6
            }px)`,
            boxShadow: `0 0 ${size * 3}px ${trailColor}`,
            pointerEvents: "none",
          }}
        />
      );
    });

    const visibleChar = unit.char === " " ? "\u00A0" : unit.char;

    return [
      ...particles,
      <span
        key={`spiral-${unit.index}`}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          display: "inline-block",
          fontSize,
          fontFamily,
          fontWeight,
          lineHeight,
          letterSpacing,
          color,
          opacity: copyOpacity,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: "50% 50%",
          textShadow: `0 0 ${interpolate(
            absorbT,
            [0, 1],
            [0, 18],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          )}px ${trailColor}`,
          whiteSpace: "pre",
          pointerEvents: "none",
        }}
      >
        {visibleChar}
      </span>,
    ];
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: containerX,
        top: containerY,
        width: maxWidth ?? "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontSize,
          fontFamily,
          color,
          lineHeight,
          textAlign,
          letterSpacing,
          fontWeight,
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
          pointerEvents: "none",
        }}
      >
        {units.map((unit) => {
          if (unit.isBreak) {
            return <br key={`br-${unit.index}`} />;
          }

          const layout = layouts[unit.index] ?? null;
          const threshold = getAbsorptionThreshold(unit, layout);
          const absorbT = getAbsorbT(threshold);

          const entranceT = spring({
            frame: Math.max(
              0,
              frame - entranceStart - unit.ordinal * entranceStagger
            ),
            fps,
            config: {
              damping: 18,
              stiffness: 120,
              mass: 0.8,
            },
          });

          const entranceOpacity = interpolate(
            entranceT,
            [0, 0.55, 1],
            [0, 0.82, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const absorbedOpacity = interpolate(
            absorbT,
            [0, 0.45, 1],
            [1, 0.18, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const inlineOpacity = entranceOpacity * absorbedOpacity;

          const entranceY = interpolate(entranceT, [0, 1], [14, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const absorbScale = interpolate(absorbT, [0, 1], [1, 0.82], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const visibleChar = unit.char === " " ? "\u00A0" : unit.char;

          return (
            <span
              key={`char-${unit.index}`}
              ref={(element) => {
                charRefs.current[unit.index] = element;
              }}
              style={{
                display: "inline-block",
                position: "relative",
                opacity: inlineOpacity,
                whiteSpace: "pre",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${entranceY}px) scale(${absorbScale})`,
                  transformOrigin: "50% 50%",
                  pointerEvents: "none",
                }}
              >
                {visibleChar}
              </span>
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {spiralCopies}
      </div>
    </div>
  );
};
