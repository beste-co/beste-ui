"use client";

import Image from "next/image";
import { FluidGradient } from "@/components/beste/component/fluid-gradient";
import { FrostedGradient } from "@/components/beste/component/frosted-gradient";
import { InkFluid } from "@/components/beste/component/ink-fluid";
import { MeshGradient } from "@/components/beste/component/mesh-gradient";
import { WaveGradient } from "@/components/beste/component/wave-gradient";
import { isAnimatedBackdrop } from "@/lib/piece-backdrop";

const FILL = "absolute! inset-0 h-full min-h-0";

/** The surface behind a piece on its stage: a gradient image, or one of the live backgrounds in light colors. */
export function PieceBackdrop({ value, sizes }: { value: string; sizes: string }) {
  if (!isAnimatedBackdrop(value)) {
    return <Image src={value} alt="" fill sizes={sizes} className="object-cover" />;
  }
  // Fixed light palettes, not theme tokens: the piece's own card carries the theme
  if (value === "mesh") {
    return (
      <MeshGradient
        colors={["#fde7df", "#ffc2ad", "#f6c6d9", "#d4c8ff", "#fff3e6", "#cfe6ff"]}
        speed={0.5}
        softness={0.6}
        grain={0.15}
        interactive={false}
        className={FILL}
      />
    );
  }
  if (value === "ink") {
    return (
      <InkFluid
        groundColor="#f5f1ea"
        pigments={["#9db7e3", "#f2a98f", "#c9b3e8"]}
        fade={0.25}
        interactive={false}
        className={FILL}
      />
    );
  }
  if (value === "wave") {
    return (
      <WaveGradient
        colors={["#f6efe6", "#f9d2c0", "#f6c6d9", "#d4c8ff", "#cfe6ff", "#fff8ef"]}
        speed={0.5}
        glow={0.3}
        interactive={false}
        className={FILL}
      />
    );
  }
  if (value === "frosted") {
    return (
      <FrostedGradient
        colors={["#ffb8a3", "#ffe0a3", "#a9c1ff", "#d6c5ff", "#a8e6d8", "#ffc6df"]}
        backgroundColor="#f5f1ea"
        speed={0.6}
        className={FILL}
      />
    );
  }
  return (
    <FluidGradient
      colors={["#f4ead8", "#f3cdb4", "#d4e2f3", "#e6d8f0", "#fbf3e6"]}
      speed={0.6}
      contrast={0.35}
      className={FILL}
    />
  );
}
