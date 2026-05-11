import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type TextOverlayProps = {
  title: string;
  subtitle: string;
  body: string;
  bgColor: string;
  accentColor: string;
};

export const TextOverlay: React.FC<TextOverlayProps> = ({
  title,
  subtitle,
  body,
  bgColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // タイトル: バウンスイン
  const titleScale = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // サブタイトル: スライドイン (15f遅延)
  const subSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 15 } });
  const subOffset = interpolate(subSpring, [0, 1], [60, 0]);

  // ボディ: フェードイン (30f遅延)
  const bodyOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // フェードアウト
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // アクセントバー
  const barScale = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        opacity: fadeOut,
      }}
    >
      {/* 上部アクセントバー */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: accentColor,
          transform: `scaleX(${barScale})`,
        }}
      />

      {/* タイトル */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          fontSize: 80,
          fontWeight: 900,
          color: "#333",
          textAlign: "center",
          lineHeight: 1.3,
          padding: "0 60px",
        }}
      >
        {title}
      </div>

      {/* サブタイトル */}
      <div
        style={{
          transform: `translateY(${subOffset}px)`,
          opacity: subSpring,
          fontSize: 48,
          fontWeight: 500,
          color: accentColor,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>

      {/* ボディ */}
      <div
        style={{
          opacity: bodyOpacity,
          fontSize: 42,
          fontWeight: 400,
          color: "#555",
          marginTop: 40,
          textAlign: "center",
          padding: "0 80px",
          lineHeight: 1.6,
        }}
      >
        {body}
      </div>

      {/* 下部アクセントバー */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: accentColor,
          transform: `scaleX(${barScale})`,
        }}
      />
    </AbsoluteFill>
  );
};
