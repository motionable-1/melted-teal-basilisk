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
import { ChatGPTLogo } from "../components/ChatGPTLogo";

const COLORS = {
  bg: "#0D0D0D",
  teal: "#00E0E0",
  blue: "#1A73E8",
  white: "#FFFFFF",
  dark: "#0D0D0D",
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glow pulse
  const glowIntensity = 0.25 + Math.sin(frame / 25) * 0.1;

  // CTA button
  const btnScale = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Cursor animation
  const cursorOpacity = interpolate(frame, [95, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(frame, [100, 130], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const cursorY = interpolate(frame, [100, 130], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Click effect
  const isClicking = frame >= 135 && frame <= 142;
  const clickRipple = spring({
    frame: Math.max(0, frame - 135),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1000,
          height: 600,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,224,224,${glowIntensity}) 0%, transparent 60%)`,
          filter: "blur(100px)",
        }}
      />

      {/* Centered content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Logo */}
        <ChatGPTLogo size={90} color={COLORS.teal} delay={5} />

        {/* Brand name */}
        <TextAnimation
          startFrom={15}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.from(split.chars, {
              opacity: 0,
              y: 30,
              scale: 0.6,
              stagger: 0.04,
              duration: 0.5,
              ease: "back.out(1.7)",
            });
            return tl;
          }}
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: "-0.03em",
          }}
        >
          ChatGPT
        </TextAnimation>

        {/* Tagline */}
        <TextAnimation
          startFrom={35}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 20,
              stagger: 0.08,
              duration: 0.5,
              ease: "power2.out",
            });
            return tl;
          }}
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Start chatting. It&apos;s free.
        </TextAnimation>

        {/* CTA Button */}
        <div style={{ position: "relative", marginTop: 16 }}>
          {/* Click ripple */}
          {frame >= 135 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${clickRipple * 2.5})`,
                width: 250,
                height: 60,
                borderRadius: 30,
                border: `2px solid ${COLORS.teal}`,
                opacity: 1 - clickRipple,
              }}
            />
          )}
          <div
            style={{
              padding: "16px 48px",
              borderRadius: 50,
              background: COLORS.teal,
              color: COLORS.dark,
              fontSize: 20,
              fontWeight: 700,
              transform: `scale(${btnScale * (isClicking ? 0.95 : 1)})`,
              boxShadow: `0 8px 30px rgba(0,224,224,0.35)`,
              cursor: "pointer",
            }}
          >
            Try ChatGPT
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.35)",
            fontWeight: 400,
            marginTop: 8,
            opacity: interpolate(frame, [85, 100], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          chatgpt.com
        </div>
      </div>

      {/* Animated cursor */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(${cursorX + 60}px, ${cursorY + 80}px)`,
          opacity: cursorOpacity,
          zIndex: 20,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L6.35 2.86a.5.5 0 00-.85.35z"
            fill={COLORS.white}
            stroke={COLORS.dark}
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Decorative floating sparkles */}
      {[
        { x: 200, y: 180, d: 10, s: 28 },
        { x: 1650, y: 250, d: 18, s: 22 },
        { x: 350, y: 700, d: 25, s: 20 },
        { x: 1500, y: 650, d: 32, s: 24 },
      ].map((sp, i) => {
        const spScale = spring({
          frame: Math.max(0, frame - sp.d),
          fps,
          config: { damping: 10, stiffness: 200 },
        });
        const drift = Math.sin((frame + i * 50) / 40) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sp.x,
              top: sp.y + drift,
              transform: `scale(${spScale * 0.7})`,
              opacity: spScale * 0.5,
            }}
          >
            <Img
              src={`https://api.iconify.design/lucide/sparkles.svg?color=%2300E0E0&width=${sp.s}`}
              width={sp.s}
              height={sp.s}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
