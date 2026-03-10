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

const TogglePill: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 200 },
  });
  const toggleX = interpolate(progress, [0, 1], [2, 26]);
  const bgColor = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: interpolate(frame, [delay - 5, delay + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.white }}>AI Power</span>
      <div
        style={{
          width: 52,
          height: 28,
          borderRadius: 14,
          background: bgColor > 0.5 ? COLORS.teal : "rgba(255,255,255,0.2)",
          position: "relative",
          transition: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: toggleX,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: COLORS.white,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
};

export const InterfaceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Chat window entrance
  const windowY = interpolate(
    spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 120 } }),
    [0, 1],
    [600, 0]
  );

  const windowScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Glow pulse
  const glowPulse = 0.4 + Math.sin(frame / 30) * 0.15;

  // Sparkles
  const sparkleScale = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Teal glow behind the interface */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 900,
          height: 600,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,224,224,${glowPulse}) 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Chat interface window */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${windowY}px) scale(${windowScale})`,
          width: 700,
          height: 480,
          borderRadius: 20,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,224,224,0.1), 0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            height: 56,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ChatGPTLogo size={28} color={COLORS.teal} delay={25} />
            <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.white }}>ChatGPT</span>
          </div>
          <TogglePill delay={40} />
        </div>

        {/* Chat area */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* User message */}
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "70%",
              padding: "12px 18px",
              borderRadius: "18px 18px 4px 18px",
              background: COLORS.teal,
              color: COLORS.dark,
              fontSize: 15,
              fontWeight: 500,
              opacity: interpolate(frame, [55, 70], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [55, 70], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            }}
          >
            How can AI help me work smarter?
          </div>

          {/* AI response */}
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "75%",
              display: "flex",
              gap: 10,
              opacity: interpolate(frame, [75, 90], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [75, 90], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(0,224,224,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ChatGPTLogo size={18} color={COLORS.teal} delay={80} />
            </div>
            {(() => {
              const fullText = "I can help you brainstorm ideas, draft emails, analyze data, write code, and so much more — all in a natural conversation.";
              const streamProgress = interpolate(frame, [80, 140], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const visibleChars = Math.floor(streamProgress * fullText.length);
              return (
                <div
                  style={{
                    padding: "12px 18px",
                    borderRadius: "18px 18px 18px 4px",
                    background: "rgba(255,255,255,0.08)",
                    color: COLORS.white,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {fullText.slice(0, visibleChars)}
                  {visibleChars < fullText.length && visibleChars > 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: 14,
                        background: COLORS.teal,
                        marginLeft: 2,
                        opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0.3,
                      }}
                    />
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Input bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 40,
              borderRadius: 20,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              color: "rgba(255,255,255,0.35)",
              fontSize: 14,
            }}
          >
            Ask anything...
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: COLORS.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src="https://api.iconify.design/lucide/arrow-up.svg?color=%230D0D0D&width=20"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      {/* Floating sparkles */}
      <div
        style={{
          position: "absolute",
          top: 160,
          right: 300,
          transform: `scale(${sparkleScale})`,
          opacity: sparkleScale * 0.8,
        }}
      >
        <Img
          src="https://api.iconify.design/lucide/sparkles.svg?color=%2300E0E0&width=40"
          width={40}
          height={40}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 280,
          transform: `scale(${sparkleScale * 0.7})`,
          opacity: sparkleScale * 0.5,
        }}
      >
        <Img
          src="https://api.iconify.design/lucide/sparkles.svg?color=%231A73E8&width=32"
          width={32}
          height={32}
        />
      </div>

      {/* Title text overlay */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <TextAnimation
          startFrom={20}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: -30,
              scale: 0.8,
              stagger: 0.12,
              duration: 0.6,
              ease: "back.out(1.7)",
            });
            return tl;
          }}
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: "-0.03em",
          }}
        >
          <span>Meet </span>
          <span style={{ color: COLORS.teal }}>ChatGPT</span>
        </TextAnimation>

        <TextAnimation
          startFrom={35}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 20,
              stagger: 0.06,
              duration: 0.4,
              ease: "power2.out",
            });
            return tl;
          }}
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Your AI assistant for everything
        </TextAnimation>
      </div>
    </AbsoluteFill>
  );
};
