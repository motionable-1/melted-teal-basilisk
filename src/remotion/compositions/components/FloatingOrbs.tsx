import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface OrbProps {
  x: number;
  y: number;
  size: number;
  color: string;
  speed?: number;
  delay?: number;
}

const Orb: React.FC<OrbProps> = ({ x, y, size, color, speed = 0.3, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame + delay * fps) / fps;

  const dx = Math.sin(t * speed * 1.2) * 40;
  const dy = Math.cos(t * speed * 0.8) * 30;
  const scale = 1 + Math.sin(t * speed * 0.5) * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        filter: "blur(60px)",
        opacity: 0.6,
      }}
    />
  );
};

export const FloatingOrbs: React.FC = () => {
  return (
    <>
      <Orb x={15} y={20} size={400} color="rgba(0,224,224,0.35)" speed={0.25} delay={0} />
      <Orb x={70} y={60} size={350} color="rgba(26,115,232,0.3)" speed={0.3} delay={2} />
      <Orb x={50} y={10} size={300} color="rgba(0,224,224,0.2)" speed={0.2} delay={4} />
      <Orb x={80} y={25} size={250} color="rgba(26,115,232,0.25)" speed={0.35} delay={1} />
      <Orb x={25} y={70} size={280} color="rgba(0,224,224,0.2)" speed={0.28} delay={3} />
    </>
  );
};
