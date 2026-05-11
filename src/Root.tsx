import { Composition } from "remotion";
import { TextOverlay, type TextOverlayProps } from "./compositions/TextOverlay";
import { KosukumaCard, type KosukumaCardProps } from "./compositions/KosukumaCard";
import { GoodsAnnounce, type GoodsAnnounceProps } from "./compositions/GoodsAnnounce";
import {
  BLACK_HOLE_PV_DURATION,
  BLACK_HOLE_PV_FPS,
  BLACK_HOLE_PV_REVIEW_DURATION,
  BLACK_HOLE_PV_REVIEW_FPS,
  BlackHolePV,
  BlackHolePV60,
} from "./compositions/blackhole-pv/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* テキストオーバーレイ動画（SNS投稿、お知らせ等） */}
      <Composition
        id="TextOverlay"
        component={TextOverlay}
        durationInFrames={1890}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "こすくまくん",
          subtitle: "今日のひとこと",
          body: "みんな遊ぼう！",
          bgColor: "#FFF8E7",
          accentColor: "#FF8C42",
        } satisfies TextOverlayProps}
      />

      {/* こすくまカード（キャラ紹介、グッズ紹介等） */}
      <Composition
        id="KosukumaCard"
        component={KosukumaCard}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          heading: "こすくまグッズ",
          items: ["アクリルスタンド", "ステッカー", "トートバッグ"],
          bgColor: "#FFF0F5",
          accentColor: "#E91E63",
        } satisfies KosukumaCardProps}
      />

      {/* グッズ告知動画（リール/ストーリーズ用 9:16） */}
      <Composition
        id="GoodsAnnounce"
        component={GoodsAnnounce}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          catchCopy: "🐻 ついに来た",
          productName: "こすくま\nアクスタ",
          description: "こすくまくんが初の立体化！\nデスクに置ける手のひらサイズ",
          price: "¥1,980",
          releaseDate: "2026.04.15 発売",
          features: [
            "高さ約8cm アクリル製",
            "全4種（ノーマル・寝顔・遊び・怒り）",
            "専用台座付き",
          ],
          bgGradientFrom: "#667eea",
          bgGradientTo: "#764ba2",
          accentColor: "#FFD700",
        } satisfies GoodsAnnounceProps}
      />
      {/* Black Hole Chrome拡張 PV（16:9 横長） */}
      <Composition
        id="BlackHolePV"
        component={BlackHolePV}
        durationInFrames={BLACK_HOLE_PV_DURATION}
        fps={BLACK_HOLE_PV_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="BlackHolePV60"
        component={BlackHolePV60}
        durationInFrames={BLACK_HOLE_PV_REVIEW_DURATION}
        fps={BLACK_HOLE_PV_REVIEW_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
