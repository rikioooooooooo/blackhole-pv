import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type GoodsAnnounceProps = {
  catchCopy: string;
  productName: string;
  description: string;
  price: string;
  releaseDate: string;
  features: string[];
  bgGradientFrom: string;
  bgGradientTo: string;
  accentColor: string;
};

export const GoodsAnnounce: React.FC<GoodsAnnounceProps> = ({
  catchCopy,
  productName,
  description,
  price,
  releaseDate,
  features,
  bgGradientFrom,
  bgGradientTo,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // === Phase 1: キャッチコピー (0-40f) ===
  const catchScale = spring({ frame, fps, config: { damping: 8, mass: 1.2 } });
  const catchOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const catchFadeOut = interpolate(frame, [35, 50], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase 2: 商品名ドーン (45-90f) ===
  const nameDelay = Math.max(0, frame - 45);
  const nameScale = spring({ frame: nameDelay, fps, config: { damping: 6, mass: 1.5, stiffness: 80 } });
  const nameGlow = interpolate(frame, [45, 60, 75, 90], [0, 1, 1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase 3: 説明テキスト (70f-) ===
  const descOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase 4: 特徴リスト (100f-) ===
  // 各アイテムを順次表示

  // === Phase 5: 価格・日付 (160f-) ===
  const priceDelay = Math.max(0, frame - 160);
  const priceSpring = spring({ frame: priceDelay, fps, config: { damping: 10, mass: 0.8 } });
  const priceScale = interpolate(priceSpring, [0, 1], [0.3, 1]);

  const dateDelay = Math.max(0, frame - 180);
  const dateSpring = spring({ frame: dateDelay, fps, config: { damping: 12 } });

  // === フェードアウト ===
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === 背景アニメーション ===
  const bgRotate = interpolate(frame, [0, durationInFrames], [0, 15]);
  const floatY = Math.sin(frame * 0.05) * 20;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgGradientFrom} 0%, ${bgGradientTo} 100%)`,
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      {/* 背景の浮遊する丸 */}
      {[0, 1, 2, 3, 4].map((i) => {
        const size = 120 + i * 80;
        const x = [15, 75, 45, 85, 25][i];
        const y = [20, 60, 80, 30, 50][i];
        const delay = i * 0.3;
        const float = Math.sin((frame * 0.03) + delay) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accentColor}20, ${accentColor}05)`,
              left: `${x}%`,
              top: `${y}%`,
              transform: `translateY(${float}px) rotate(${bgRotate + i * 20}deg)`,
            }}
          />
        );
      })}

      {/* メインコンテンツ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Phase 1: キャッチコピー */}
        {frame < 55 && (
          <div
            style={{
              position: "absolute",
              transform: `scale(${catchScale})`,
              opacity: catchOpacity * catchFadeOut,
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              textAlign: "center",
              letterSpacing: 8,
              lineHeight: 1.5,
            }}
          >
            {catchCopy}
          </div>
        )}

        {/* Phase 2+: 商品情報 */}
        {frame >= 45 && (
          <>
            {/* 商品名 */}
            <div
              style={{
                transform: `scale(${nameScale}) translateY(${floatY * 0.3}px)`,
                fontSize: 84,
                fontWeight: 900,
                color: "white",
                textShadow: `0 0 ${nameGlow * 40}px ${accentColor}, 0 4px 20px rgba(0,0,0,0.3)`,
                textAlign: "center",
                letterSpacing: 4,
                marginBottom: 20,
              }}
            >
              {productName}
            </div>

            {/* 区切り線 */}
            <div
              style={{
                width: interpolate(frame, [55, 70], [0, 400], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                height: 3,
                backgroundColor: "rgba(255,255,255,0.6)",
                marginBottom: 30,
                borderRadius: 2,
              }}
            />

            {/* 説明 */}
            <div
              style={{
                opacity: descOpacity,
                fontSize: 36,
                color: "rgba(255,255,255,0.9)",
                textAlign: "center",
                lineHeight: 1.6,
                maxWidth: 800,
                marginBottom: 40,
              }}
            >
              {description}
            </div>

            {/* 特徴リスト */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 50 }}>
              {features.map((feat, i) => {
                const featDelay = 100 + i * 12;
                const featSpring = spring({
                  frame: Math.max(0, frame - featDelay),
                  fps,
                  config: { damping: 12, mass: 0.5 },
                });
                const slideX = interpolate(featSpring, [0, 1], [120, 0]);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      opacity: featSpring,
                      transform: `translateX(${slideX}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: accentColor,
                        boxShadow: `0 0 10px ${accentColor}`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ fontSize: 32, color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>
                      {feat}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 価格 */}
            <div
              style={{
                transform: `scale(${priceScale})`,
                opacity: priceSpring,
                fontSize: 72,
                fontWeight: 900,
                color: accentColor,
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                marginBottom: 16,
                filter: `drop-shadow(0 0 20px ${accentColor}60)`,
              }}
            >
              {price}
            </div>

            {/* 発売日 */}
            <div
              style={{
                opacity: dateSpring,
                transform: `translateY(${interpolate(dateSpring, [0, 1], [30, 0])}px)`,
                fontSize: 40,
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: 3,
                padding: "12px 40px",
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: 50,
              }}
            >
              {releaseDate}
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
