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

export const BLACK_HOLE_PV_FPS = 30;

const secondsToFrames = (seconds: number) => seconds * BLACK_HOLE_PV_FPS;

const SCENES = [
  { key: "S01", durationInFrames: secondsToFrames(3), component: S01ColdOpen },
  { key: "S02", durationInFrames: secondsToFrames(6), component: S02Sweep },
  { key: "S03", durationInFrames: secondsToFrames(6), component: S03Slack },
  { key: "S04", durationInFrames: secondsToFrames(5), component: S04Google },
  { key: "S05", durationInFrames: secondsToFrames(5), component: S05BeforeAfter },
  { key: "S06", durationInFrames: secondsToFrames(4), component: S06Notification },
  { key: "S07", durationInFrames: secondsToFrames(5), component: S07YouTube },
  { key: "S08", durationInFrames: secondsToFrames(4), component: S08News },
  { key: "S09", durationInFrames: secondsToFrames(6), component: S09GameGrowth },
  { key: "S10", durationInFrames: secondsToFrames(7), component: S10Mother },
  { key: "S11", durationInFrames: secondsToFrames(6), component: S11Climax },
  { key: "S12", durationInFrames: secondsToFrames(6), component: S12Outro },
];

export const BLACK_HOLE_PV_DURATION = SCENES.reduce(
  (total, scene) => total + scene.durationInFrames,
  0
);

export const BlackHolePV: React.FC = () => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F0E8" }}>
      {SCENES.map((scene) => {
        const from = cursor;
        cursor += scene.durationInFrames;
        const Component = scene.component;

        return (
          <Sequence key={scene.key} from={from} durationInFrames={scene.durationInFrames}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
