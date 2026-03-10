import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";
import { TextAnimation } from "../../library/components/text/TextAnimation";

const COLORS = {
  bg: "#0D0D0D",
  teal: "#00E0E0",
  blue: "#1A73E8",
  white: "#FFFFFF",
  gray: "#888888",
};

interface FakeWindowProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  delay: number;
}

const FakeWindow: React.FC<FakeWindowProps> = ({ x, y, width, height, rotation, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // Organic drift with multiple frequencies for natural feel
  const t = frame + delay * 17;
  const drift = Math.sin(t / 55) * 10 + Math.sin(t / 33) * 4;
  const driftY = Math.cos(t / 70) * 8 + Math.cos(t / 40) * 3;
  const microRotation = Math.sin(t / 90) * 1.2;

  const exitOpacity = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 12,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(8px)",
        transform: `scale(${scale}) rotate(${rotation + microRotation}deg) translate(${drift}px, ${driftY}px)`,
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 28,
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          gap: 5,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        <div
          style={{
            marginLeft: 12,
            height: 16,
            width: "60%",
            borderRadius: 4,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>
      {/* Fake content lines */}
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {[0.8, 0.6, 0.9, 0.5, 0.7].map((w, i) => (
          <div
            key={i}
            style={{
              height: 8,
              width: `${w * 100}%`,
              borderRadius: 4,
              background: "rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const FloatingIcon: React.FC<{ src: string; x: number; y: number; delay: number; size?: number }> = ({
  src,
  x,
  y,
  delay,
  size = 36,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 200 } });
  const drift = Math.sin((frame + delay * 30) / 50) * 12;
  const driftY = Math.cos((frame + delay * 30) / 70) * 10;
  const exitOp = interpolate(frame, [110, 140], [0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${s}) translate(${drift}px, ${driftY}px)`,
        opacity: exitOp,
      }}
    >
      <Img src={src} width={size} height={size} />
    </div>
  );
};

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: bgOpacity }}>
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* Chaotic browser windows */}
      <FakeWindow x={120} y={80} width={380} height={220} rotation={-4} delay={5} />
      <FakeWindow x={1400} y={120} width={340} height={200} rotation={3} delay={10} />
      <FakeWindow x={700} y={50} width={420} height={240} rotation={-2} delay={8} />
      <FakeWindow x={200} y={450} width={360} height={210} rotation={5} delay={14} />
      <FakeWindow x={1200} y={500} width={400} height={230} rotation={-3} delay={12} />

      {/* Floating search/question icons */}
      <FloatingIcon
        src="https://api.iconify.design/lucide/search.svg?color=%23555555&width=36"
        x={550} y={300} delay={15}
      />
      <FloatingIcon
        src="https://api.iconify.design/lucide/help-circle.svg?color=%23555555&width=36"
        x={1100} y={350} delay={18}
      />
      <FloatingIcon
        src="https://api.iconify.design/lucide/loader.svg?color=%23555555&width=36"
        x={350} y={380} delay={20}
      />

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <TextAnimation
          startFrom={18}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 40,
              rotateX: -30,
              stagger: 0.08,
              duration: 0.6,
              ease: "power3.out",
            });
            return tl;
          }}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: COLORS.white,
            textAlign: "center",
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}
        >
          Endless searching.
        </TextAnimation>

        <TextAnimation
          startFrom={30}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 30,
              stagger: 0.08,
              duration: 0.5,
              ease: "power2.out",
            });
            return tl;
          }}
          style={{
            fontSize: 42,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
          }}
        >
          Scattered answers.
        </TextAnimation>
      </div>
    </AbsoluteFill>
  );
};
