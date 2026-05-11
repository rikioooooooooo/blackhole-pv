import React from "react";
import { AbsoluteFill } from "remotion";

export const S09GameGrowth: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0508",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#FFFFFF",
          fontFamily: "'Axis Std', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.6,
            marginBottom: 16,
            whiteSpace: "pre-line",
          }}
        >
          {"ゲーム成長演出：\nBHが文字→画像→バナー→動画を\n吸い込んでどんどん大きくなる"}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#FFFFFF",
            letterSpacing: "0.1em",
          }}
        >
          {"実機映像を差し替え予定"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default S09GameGrowth;
