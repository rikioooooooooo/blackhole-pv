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
import S12Outro from "./scenes/S12Outro";
import {PvTimingProvider} from "./timing";
import {FontLoader} from "./components/FontLoader";

export const BLACK_HOLE_PV_BASE_FPS = 30;
export const BLACK_HOLE_PV_FPS = 30;
export const BLACK_HOLE_PV_REVIEW_FPS = 60;

const secondsToFrames = (seconds: number, fps: number) => seconds * fps;

const SCENES = [
  { key: "S01", seconds: 3, component: S01ColdOpen },
  { key: "S02", seconds: 6, component: S02Sweep },
  { key: "S03", seconds: 6, component: S03Slack },
  { key: "S04", seconds: 5, component: S04Google },
  { key: "S05", seconds: 5, component: S05BeforeAfter },
  { key: "S06", seconds: 6, component: S06Notification },
  { key: "S07", seconds: 5, component: S07YouTube },
  { key: "S08", seconds: 4, component: S08News },
  { key: "S09", seconds: 6, component: S09GameGrowth },
  { key: "S10", seconds: 7, component: S10Mother },
  { key: "S12", seconds: 6, component: S12Outro },
];

const getDuration = (fps: number) => SCENES.reduce(
  (total, scene) => total + secondsToFrames(scene.seconds, fps),
  0
);

export const BLACK_HOLE_PV_DURATION = getDuration(BLACK_HOLE_PV_FPS);
export const BLACK_HOLE_PV_REVIEW_DURATION = getDuration(BLACK_HOLE_PV_REVIEW_FPS);

type BlackHolePVProps = {
  outputFps?: number;
};

export const BlackHolePV: React.FC<BlackHolePVProps> = ({
  outputFps = BLACK_HOLE_PV_FPS,
}) => {
  let cursor = 0;
  const frameScale = outputFps / BLACK_HOLE_PV_BASE_FPS;

  return (
    <PvTimingProvider frameScale={frameScale}>
      <AbsoluteFill style={{ backgroundColor: "#F5F0E8" }}>
      <FontLoader />
      {SCENES.map((scene) => {
        const from = cursor;
        const durationInFrames = secondsToFrames(scene.seconds, outputFps);
        cursor += durationInFrames;
        const Component = scene.component;

        return (
          <Sequence key={scene.key} from={from} durationInFrames={durationInFrames}>
            <Component />
          </Sequence>
        );
      })}
      </AbsoluteFill>
    </PvTimingProvider>
  );
};

export const BlackHolePV60: React.FC = () => (
  <BlackHolePV outputFps={BLACK_HOLE_PV_REVIEW_FPS} />
);
