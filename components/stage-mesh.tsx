"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@/components/beste/component/mesh-gradient";

type PartOfDay = "dawn" | "morning" | "afternoon" | "lateAfternoon" | "evening" | "night";

function partOfDay(hour: number): PartOfDay {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 15) return "afternoon";
  if (hour >= 15 && hour < 18) return "lateAfternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

// One palette per part of the day, the same six the builder login uses
const MOODS: Record<PartOfDay, string[]> = {
  dawn: ["#fde7df", "#ffb4a2", "#ff7f6e", "#f6c6d9", "#c9b8ff", "#fff3e6"],
  morning: ["#f4fbe9", "#d6f2c4", "#fff1a8", "#bfe4ff", "#e8f6ff", "#ffffff"],
  afternoon: ["#eef6ff", "#bfe0ff", "#8cc4ff", "#fff6d6", "#d9f0ff", "#ffffff"],
  lateAfternoon: ["#fff1d6", "#ffc97a", "#f5a05b", "#fbd9a0", "#f4b3a0", "#fff8ec"],
  evening: ["#2b174a", "#ff7a45", "#ff4f7b", "#ffb86b", "#7b3fb8", "#f2a3c7"],
  night: ["#070b1f", "#1a2458", "#34307a", "#ff9b52", "#0f1638", "#5a3d8c"],
};

/** The gradient a playground stage puts behind a see-through piece; its colors follow the visitor's clock. */
export function StageMesh() {
  // The clock is only known on the client
  const [part, setPart] = useState<PartOfDay>("morning");
  useEffect(() => {
    const update = () => setPart(partOfDay(new Date().getHours()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <MeshGradient
      colors={MOODS[part]}
      speed={0.6}
      scale={1.1}
      distortion={0.6}
      swirl={0.3}
      softness={0.6}
      grain={0.2}
      transition={1.8}
      seed={5}
      interactive={false}
      className="absolute! inset-0 h-full"
    />
  );
}
