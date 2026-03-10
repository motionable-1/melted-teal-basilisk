import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";


const COLORS = {
  bg: "#0D0D0D",
  teal: "#00E0E0",
  blue: "#1A73E8",
  white: "#FFFFFF",
  dark: "#0D0D0D",
};

/* ─── Feature Tab Bar ─── */
const FeatureTab: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  delay: number;
}> = ({ icon, label, active, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 180 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: s,
        transform: `scale(${s}) translateY(${(1 - s) * 20}px)`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: active ? COLORS.teal : "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active ? "0 4px 20px rgba(0,224,224,0.3)" : "none",
        }}
      >
        <Img
          src={`https://api.iconify.design/lucide/${icon}.svg?color=${active ? "%230D0D0D" : "%23888888"}&width=28`}
          width={28}
          height={28}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: active ? 700 : 400,
          color: active ? COLORS.teal : "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Chat Demo ─── */
const ChatDemo: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const typeProgress = interpolate(localFrame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const userMsg = "Write me a marketing email for our new product launch";
  const aiMsg =
    "Subject: Introducing Our Game-Changing New Product! 🚀\n\nDear Valued Customer,\n\nWe're thrilled to announce the launch of [Product Name] — designed to transform the way you...";
  const visibleUserChars = Math.floor(typeProgress * userMsg.length);
  const aiOpacity = interpolate(localFrame, [65, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aiReveal = interpolate(localFrame, [65, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleAiChars = Math.floor(aiReveal * aiMsg.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "20px 40px" }}>
      {/* User bubble */}
      <div style={{ alignSelf: "flex-end", maxWidth: "65%" }}>
        <div
          style={{
            padding: "14px 20px",
            borderRadius: "20px 20px 4px 20px",
            background: COLORS.teal,
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {userMsg.slice(0, visibleUserChars)}
          {visibleUserChars < userMsg.length && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 18,
                background: COLORS.dark,
                marginLeft: 2,
                opacity: Math.sin(localFrame * 0.3) > 0 ? 1 : 0,
              }}
            />
          )}
        </div>
      </div>
      {/* AI response */}
      <div style={{ alignSelf: "flex-start", maxWidth: "70%", opacity: aiOpacity }}>
        <div
          style={{
            padding: "14px 20px",
            borderRadius: "20px 20px 20px 4px",
            background: "rgba(255,255,255,0.08)",
            color: COLORS.white,
            fontSize: 15,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {aiMsg.slice(0, visibleAiChars)}
          {visibleAiChars < aiMsg.length && aiOpacity > 0.5 && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 16,
                background: COLORS.teal,
                marginLeft: 2,
                opacity: Math.sin(localFrame * 0.3) > 0 ? 1 : 0,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Voice Demo ─── */
const VoiceDemo: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const barCount = 32;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        padding: "30px 40px",
      }}
    >
      {/* Waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, height: 120 }}>
        {Array.from({ length: barCount }).map((_, i) => {
          const phase = (localFrame * 0.15 + i * 0.4) % (Math.PI * 2);
          const h = 20 + Math.abs(Math.sin(phase)) * 80 + Math.sin(i * 0.6 + localFrame * 0.08) * 20;
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: Math.max(8, h),
                borderRadius: 3,
                background: `linear-gradient(180deg, ${COLORS.teal}, ${COLORS.blue})`,
                opacity: 0.6 + Math.sin(phase) * 0.4,
              }}
            />
          );
        })}
      </div>
      {/* Label */}
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.6)",
          fontWeight: 500,
          opacity: interpolate(localFrame, [10, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        🎙️ Voice interaction — talk naturally, get instant answers
      </div>
    </div>
  );
};

/* ─── Code Demo ─── */
const CodeDemo: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const codeLines = [
    { text: "async function analyzeData(input) {", color: "#C792EA" },
    { text: "  const results = await ai.process(input);", color: "#82AAFF" },
    { text: '  console.log("Analysis complete ✓");', color: "#C3E88D" },
    { text: "  return results.summary;", color: "#F78C6C" },
    { text: "}", color: "#C792EA" },
  ];

  return (
    <div style={{ padding: "20px 40px" }}>
      <div
        style={{
          borderRadius: 16,
          background: "#1E1E2E",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Code header */}
        <div
          style={{
            height: 40,
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: 12, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            analysis.js
          </span>
        </div>
        {/* Code content */}
        <div style={{ padding: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 17, lineHeight: 2 }}>
          {codeLines.map((line, i) => {
            const lineDelay = 15 + i * 15;
            const lineOpacity = interpolate(localFrame, [lineDelay, lineDelay + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const lineX = interpolate(localFrame, [lineDelay, lineDelay + 12], [-30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  color: line.color,
                  opacity: lineOpacity,
                  transform: `translateX(${lineX}px)`,
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── Summarize Demo ─── */
const SummarizeDemo: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const shrinkProgress = interpolate(localFrame, [20, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bullets = [
    "Revenue grew 23% year-over-year",
    "Customer satisfaction at all-time high (94%)",
    "3 new product lines launching in Q2",
  ];

  return (
    <div style={{ padding: "20px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Long text block */}
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          transform: `scaleY(${1 - shrinkProgress * 0.7})`,
          opacity: 1 - shrinkProgress,
          transformOrigin: "top",
          overflow: "hidden",
        }}
      >
        {[0.9, 1, 0.85, 0.95, 0.7, 0.88, 1, 0.75].map((w, i) => (
          <div
            key={i}
            style={{
              height: 10,
              width: `${w * 100}%`,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
        ))}
      </div>

      {/* Bullet points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bullets.map((text, i) => {
          const bulletDelay = 50 + i * 12;
          const bulletOp = interpolate(localFrame, [bulletDelay, bulletDelay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const bulletX = interpolate(localFrame, [bulletDelay, bulletDelay + 15], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: bulletOp,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: COLORS.teal,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 18, color: COLORS.white, fontWeight: 500 }}>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Main Features Scene ─── */
export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 4 features: chat(0-110), voice(110-220), code(220-330), summarize(330-450)
  const features = [
    { id: "chat", icon: "message-circle", label: "Chat", start: 0, end: 110 },
    { id: "voice", icon: "mic", label: "Voice", start: 110, end: 220 },
    { id: "code", icon: "code", label: "Code", start: 220, end: 330 },
    { id: "summarize", icon: "file-text", label: "Summarize", start: 330, end: 450 },
  ];

  const activeIndex = features.findIndex((f) => frame >= f.start && frame < f.end);

  // Feature title
  const titles = ["Conversational AI", "Voice Interaction", "Code Generation", "Smart Summaries"];
  const subtitles = [
    "Natural conversations on any topic",
    "Talk naturally, get instant answers",
    "Write, debug, and explain code",
    "Distill documents to key insights",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 800,
          height: 500,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,224,224,0.15) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Feature tab bar */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 40,
          zIndex: 10,
        }}
      >
        {features.map((f, i) => (
          <FeatureTab
            key={f.id}
            icon={f.icon}
            label={f.label}
            active={i === Math.max(0, activeIndex)}
            delay={5 + i * 4}
          />
        ))}
      </div>

      {/* Title area */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {features.map((f, i) => {
          const isActive = i === Math.max(0, activeIndex);
          const featureOpacity = isActive
            ? interpolate(
                frame,
                [f.start, f.start + 12, f.end - 12, f.end],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 0;

          return isActive ? (
            <div key={f.id} style={{ opacity: featureOpacity, textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.02em" }}>
                {titles[i]}
              </div>
              <div style={{ fontSize: 20, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {subtitles[i]}
              </div>
            </div>
          ) : null;
        })}
      </div>

      {/* Feature demos */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 420,
        }}
      >
        {features.map((f, i) => {
          const localFrame = frame - f.start;
          const isVisible = frame >= f.start && frame < f.end;
          const featureOpacity = isVisible
            ? interpolate(
                frame,
                [f.start, f.start + 10, f.end - 10, f.end],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 0;

          if (!isVisible) return null;

          return (
            <div key={f.id} style={{ position: "absolute", inset: 0, opacity: featureOpacity }}>
              {f.id === "chat" && <ChatDemo localFrame={localFrame} />}
              {f.id === "voice" && <VoiceDemo localFrame={localFrame} />}
              {f.id === "code" && <CodeDemo localFrame={localFrame} />}
              {f.id === "summarize" && <SummarizeDemo localFrame={localFrame} />}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
