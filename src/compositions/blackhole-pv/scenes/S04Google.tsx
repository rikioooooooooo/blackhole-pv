import React from "react";
import { ShotPlaceholder } from "../components/ShotPlaceholder";

export const S04Google: React.FC = () => {
  return (
    <ShotPlaceholder
      scene="S04"
      title="Google検索結果を吸い込む"
      direction={"Google検索結果のタイトル・スニペットを、\nBHカーソルが横切りながら数行まとめて吸い込む。"}
    />
  );
};
export default S04Google;
