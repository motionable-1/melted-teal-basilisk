import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Artifact,
  interpolate,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

import { blurDissolve } from "../library/components/layout/transitions/presentations/blurDissolve";
import { FloatingOrbs } from "./components/FloatingOrbs";
import { HeroScene } from "./scenes/HeroScene";
import { InterfaceScene } from "./scenes/InterfaceScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { OutroScene } from "./scenes/OutroScene";

const { fontFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// Load JetBrains Mono for code blocks
loadJetBrains("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

// Audio URLs
const MUSIC_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/music/1773163327652_hcr52iqi4zf_music_Modern__clean_electr.mp3";
const WHOOSH_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773163298423_pu3vdddoej_sfx_Modern_sleek_digital_UI_whoosh.mp3";
const POP_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773163300743_cj2in2hj5gj_sfx_Subtle_soft_digital_pop_click_.mp3";
const CHIME_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773163303147_jsckxrsa9k_sfx_Gentle_ambient_tech_chime__AI_.mp3";

// Scene durations
const SCENE_1 = 150; // 5s
const TRANSITION = 18; // 0.6s
const SCENE_2 = 168; // 5.6s
const SCENE_3 = 450; // 15s
const SCENE_4 = 180; // 6s

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade out at the very end
  const endFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      <AbsoluteFill
        style={{
          fontFamily,
          backgroundColor: "#0D0D0D",
          opacity: endFade,
        }}
      >
        {/* Global floating orbs background (persists across all scenes) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <FloatingOrbs />
        </div>

        {/* Scene transitions */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={SCENE_1}>
              <HeroScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={blurDissolve()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />

            <TransitionSeries.Sequence durationInFrames={SCENE_2}>
              <InterfaceScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={blurDissolve()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />

            <TransitionSeries.Sequence durationInFrames={SCENE_3}>
              <FeaturesScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={blurDissolve()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />

            <TransitionSeries.Sequence durationInFrames={SCENE_4}>
              <OutroScene />
            </TransitionSeries.Sequence>
          </TransitionSeries>
        </div>

        {/* ─── Audio Layer ─── */}
        {/* Background music */}
        <Audio
          src={MUSIC_URL}
          volume={(f) =>
            interpolate(f, [0, fps * 2, fps * 27, fps * 30], [0, 0.18, 0.18, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />

        {/* SFX: Whoosh on first transition (~5s = frame 150) */}
        <Sequence from={SCENE_1 - 10}>
          <Audio src={WHOOSH_URL} volume={0.25} />
        </Sequence>

        {/* SFX: Chime on interface reveal */}
        <Sequence from={SCENE_1 + 15}>
          <Audio src={CHIME_URL} volume={0.2} />
        </Sequence>

        {/* SFX: Pop on toggle */}
        <Sequence from={SCENE_1 + 45}>
          <Audio src={POP_URL} volume={0.3} />
        </Sequence>

        {/* SFX: Whoosh on second transition */}
        <Sequence from={SCENE_1 + SCENE_2 - TRANSITION - 10}>
          <Audio src={WHOOSH_URL} volume={0.2} />
        </Sequence>

        {/* SFX: Pops on feature switches */}
        {[110, 220, 330].map((offset, i) => (
          <Sequence
            key={i}
            from={SCENE_1 + SCENE_2 - TRANSITION + offset - 5}
          >
            <Audio src={POP_URL} volume={0.2} />
          </Sequence>
        ))}

        {/* SFX: Whoosh on final transition */}
        <Sequence from={SCENE_1 + SCENE_2 + SCENE_3 - TRANSITION * 2 - 10}>
          <Audio src={WHOOSH_URL} volume={0.2} />
        </Sequence>

        {/* SFX: Chime on outro logo */}
        <Sequence from={SCENE_1 + SCENE_2 + SCENE_3 - TRANSITION * 2 + 10}>
          <Audio src={CHIME_URL} volume={0.25} />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};
