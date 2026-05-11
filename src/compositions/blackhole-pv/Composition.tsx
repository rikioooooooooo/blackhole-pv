import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import S01ColdOpen from "./scenes/S01ColdOpen";
import S02Sweep from "./scenes/S02Sweep";
import S03Slack from "./scenes/S03Slack";
import S04Google from "./scenes/S04Google";
import S05BeforeAfter from "./scenes/S05BeforeAfter";
import S06Notification from "./scenes/S06Notification";
import S07YouTube from "./scenes/S07YouTube";
import S08News from "./scenes/S08News";
import S09GameGrowth from "./scenes/S09GameGrowth";
import S10Mother from "./scenes/S10Mother";
import S11Climax from "./scenes/S11Climax";
import S12Outro from "./scenes/S12Outro";

export const BlackHolePV: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F0E8" }}>
      <Sequence from={0} durationInFrames={90}><S01ColdOpen /></Sequence>
      <Sequence from={90} durationInFrames={180}><S02Sweep /></Sequence>
      <Sequence from={270} durationInFrames={180}><S03Slack /></Sequence>
      <Sequence from={450} durationInFrames={150}><S04Google /></Sequence>
      <Sequence from={600} durationInFrames={150}><S05BeforeAfter /></Sequence>
      <Sequence from={750} durationInFrames={120}><S06Notification /></Sequence>
      <Sequence from={870} durationInFrames={150}><S07YouTube /></Sequence>
      <Sequence from={1020} durationInFrames={120}><S08News /></Sequence>
      <Sequence from={1140} durationInFrames={180}><S09GameGrowth /></Sequence>
      <Sequence from={1320} durationInFrames={210}><S10Mother /></Sequence>
      <Sequence from={1530} durationInFrames={180}><S11Climax /></Sequence>
      <Sequence from={1710} durationInFrames={180}><S12Outro /></Sequence>
    </AbsoluteFill>
  );
};
