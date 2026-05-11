import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { FONTS } from "../constants";
import {usePvCurrentFrame as useCurrentFrame} from "../timing";

type ShotPlaceholderProps = {
  scene: string;
  title: string;
  direction: string;
};

export const ShotPlaceholder: React.FC<ShotPlaceholderProps> = ({
  scene,
  title,
  direction,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const y = interpolate(frame, [0, 36], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 44%, rgba(75,51,104,0.13), transparent 34%), #0A0508",
        color: "#E8E2D9",
        fontFamily: FONTS.japanese,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 46,
          fontFamily: FONTS.ui,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: "rgba(232,226,217,0.42)",
        }}
      >
        {scene}
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 980,
          transform: `translate(-50%, calc(-50% + ${y}px))`,
          opacity: fadeIn,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "rgba(232,226,217,0.58)",
            marginBottom: 30,
          }}
        >
          実機映像予定
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            lineHeight: 1.28,
            color: "#FAFAF6",
            marginBottom: 42,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "rgba(232,226,217,0.48)",
            marginBottom: 16,
          }}
        >
          撮りたい映像
        </div>
        <div
          style={{
            fontSize: 27,
            fontWeight: 760,
            lineHeight: 1.58,
            color: "#E8E2D9",
            whiteSpace: "pre-line",
          }}
        >
          {direction}
        </div>
      </div>
    </AbsoluteFill>
  );
};
