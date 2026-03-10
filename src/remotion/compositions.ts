import { Main } from "./compositions/Main";

// Scene durations: 150 + 168 + 450 + 180 = 948
// Transitions: 3 × 18 = 54
// Total: 948 - 54 = 894 frames (~29.8s at 30fps)
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: 894,
  fps: 30,
  width: 1920,
  height: 1080,
};
