"use client";

import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

export function DiagonalLoading({
  fullScreen = true,
  text,
  className,
  opacity = 0.3,
}: {
  fullScreen?: boolean;
  text?: ReactNode;
  className?: string;
  opacity?: number;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundImage = useMemo(() => {
    if (!mounted) return undefined;
    const isDarkTheme = resolvedTheme === "dark";
    const isPaperTheme = resolvedTheme === "paper";
    const [first, second, third, fourth] = isDarkTheme
      ? ["#303030", "#303030 40px", "#2a2a2a 40px", "#2a2a2a 80px"]
      : isPaperTheme
        ? ["#f5f1e6", "#f5f1e6 40px", "#ede8d9 40px", "#ede8d9 80px"]
        : ["#fff", "#fff 40px", "#f9f9f9 40px", "#f9f9f9 80px"];

    return `repeating-linear-gradient(
      135deg,
      ${first},
      ${second},
      ${third},
      ${fourth}
    )`;
  }, [resolvedTheme, mounted]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-background ${className} ${
        fullScreen ? "w-screen h-dvh" : "w-full h-full"
      }`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage,
          backgroundSize: "200% 200%",
          animation: "diagonal-slide 18s linear infinite",
          animationDirection: "reverse",
          opacity,
        }}
      />
      {text && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {typeof text === "string" ? (
            <span className="text-sm font-medium text-foreground animate-pulse">
              {text}
            </span>
          ) : (
            text
          )}
        </div>
      )}
      <style>{`
        @keyframes diagonal-slide {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
}
