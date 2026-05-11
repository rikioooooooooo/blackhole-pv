import React from "react";
import { ShotPlaceholder } from "../components/ShotPlaceholder";

export const S05BeforeAfter: React.FC = () => {
  return (
    <ShotPlaceholder
      scene="S05"
      title="ページ全体を空白にする"
      direction={"ニュース/記事ページの本文・見出し・UI要素を吸い込み切り、\n最後にページがほぼ真っ白になるビフォーアフター。"}
    />
  );
};
export default S05BeforeAfter;
