import { Easing } from "remotion";

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 60;

export const BLACK_HOLE_PV_FPS = 60;
export const BLACK_HOLE_PV_DURATION = 3780;

export const COLORS = {
  bg: "#F5F0E8",
  core: "#0A0508",
  purple: "#6B3FA0",
  deepPurple: "#2D1B4E",
  coral: "#E07A5F",
  amber: "#F4A261",
  body: "#2A2520",
  stamp: "#8C2F1E",
  warmGray: "#9B958D",
  warmGrayLight: "#E8E2D9",
  warmGrayDark: "#5C564E",
  lensing: "#E8D5FF",
  white: "#FAFAF6",
  lineGreen: "#06C755",
  lineBg: "#7BADE2",
  spamRed: "#D32F2F",
  googleGreen: "#34A853",
  slackActive: "#1264A3",
  slackText: "#D1D2D3",
  lineBubbleSelf: "#06C755",
  lineBubbleOther: "#FFFFFF",
  googleBlue: "#4285F4",
};

export const BH_LAYERS = {
  outerGlow: "#6B3FA0",
  accretionInner: "#6B3FA0",
  accretionMiddle: "#2D1B4E88",
  accretionOuter: "#6B3FA066",
  accretionEdge: "#E07A5F44",
  lensing: "#E8D5FF",
  eventHorizon: "#0A0508",
  core: "#000000",
};

export const FONTS = {
  japanese: "'Axis Std', sans-serif",
  display: "PlayfairDisplay",
  ui: "Inter, system-ui, sans-serif",
  mono: "'SF Mono', Menlo, monospace",
};

export const DURATIONS = {
  s1ColdOpen: 5,
  s2Sweep: 6,
  s3BeforeAfter: 5,
  s4Slack: 6,
  s5Google: 5,
  s6BrowserDemo: 6,
  s7Cookie: 4,
  s8Notification: 4,
  s9YouTube: 8,
  s10Montage: 4,
  s11Spam: 4,
  s12News: 4,
  s13Tos: 4,
  s14GameGrowth: 5,
  s15Restore: 4,
  s16Mother: 7,
  s17Climax: 6,
  s18Outro: 6,
};

export const TRANSITION_FRAMES = 15;

export const SPRING = {
  default: { damping: 14, stiffness: 80, mass: 0.6 },
  heavy: { damping: 200, stiffness: 60, mass: 3 },
  snappy: { damping: 20, stiffness: 150, mass: 0.4 },
  bouncy: { damping: 8, stiffness: 120, mass: 0.4 },
  climax: { damping: 200, stiffness: 60, mass: 3 },
};

export const EASING = {
  cinematic: Easing.bezier(0.22, 1, 0.36, 1),
  elastic: Easing.bezier(0.1, 0.9, 0.2, 1),
  exp: Easing.bezier(0.19, 1, 0.22, 1),
};
