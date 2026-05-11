import React from "react";
import { ShotPlaceholder } from "../components/ShotPlaceholder";

export const S07YouTube: React.FC = () => {
  return (
    <ShotPlaceholder
      scene="S07"
      title="YouTubeコメント・サムネを吸い込む"
      direction={"YouTube画面でコメント欄や関連動画サムネの文字を\nBHカーソルが吸い込み、画面のノイズが減っていく。"}
    />
  );
};
export default S07YouTube;
