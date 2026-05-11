import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type KosukumaCardProps = {
  heading: string;
  items: string[];
  bgColor: string;
  accentColor: string;
};

export const KosukumaCard: React.FC<KosukumaCardProps> = ({
  heading,
  items,
  bgColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headingScale = spring({ frame, fps, config: { damping: 10, mass: 1 } });

  const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        padding: 80,
      }}
    >
      {/* 背景デコ */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          backgroundColor: accentColor,
          opacity: 0.08,
          top: -100,
          right: -100,
          transform: `scale(${spring({ frame, fps, config: { damping: 20 } })})`,
        }}
      />

      {/* ヘディング */}
      <div
        style={{
          transform: `scale(${headingScale})`,
          fontSize: 72,
          fontWeight: 900,
          color: "#333",
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        {heading}
      </div>

      {/* アイテムリスト */}
      {items.map((item, i) => {
        const delay = 20 + i * 15;
        const itemSpring = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 12, mass: 0.6 },
        });
        const slideX = interpolate(itemSpring, [0, 1], [-80, 0]);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 32,
              transform: `translateX(${slideX}px)`,
              opacity: itemSpring,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: accentColor,
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: 48, fontWeight: 600, color: "#444" }}>
              {item}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
