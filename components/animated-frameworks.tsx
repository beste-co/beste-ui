"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const frameworks = ["Next.js", "Astro", "Remix", "TanStack", "Gatsby", "Vite"];

export function AnimatedFrameworks() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % frameworks.length);
        setIsAnimating(false);
      }, 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative">
      <span
        className={cn(
          "inline-block transition-all duration-200",
          isAnimating
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        )}
      >
        {frameworks[currentIndex]}
      </span>
    </span>
  );
}
