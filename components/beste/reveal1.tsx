"use client";

import { GripHorizontal, GripVertical } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Reveal1Props {
  heading?: string;
  description?: string;
  beforeImage: {
    src: string;
    alt: string;
  };
  afterImage: {
    src: string;
    alt: string;
  };
  beforeLabel?: string;
  afterLabel?: string;
  orientation?: "horizontal" | "vertical";
  initialPosition?: number;
  showLabels?: boolean;
  dividerWidth?: number;
  className?: string;
}

export const reveal1Demo: Reveal1Props = {
  heading: "See the Transformation",
  description:
    "Drag the slider to compare the before and after results. Experience the difference our solution makes.",
  beforeImage: {
    src: "https://images.unsplash.com/photo-1558370781-d6196949e317?q=80&w=2958&auto=format&fit=crop&sat=-100",
    alt: "Before",
  },
  afterImage: {
    src: "https://images.unsplash.com/photo-1558370781-d6196949e317?q=80&w=2958&auto=format&fit=crop",
    alt: "After",
  },
  beforeLabel: "Before",
  afterLabel: "After",
  showLabels: true,
};

export function Reveal1({
  heading,
  description,
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  orientation = "horizontal",
  initialPosition = 50,
  showLabels = true,
  dividerWidth = 4,
  className,
}: Reveal1Props) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isHorizontal = orientation === "horizontal";

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (isHorizontal) {
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percentage);
      } else {
        const y = clientY - rect.top;
        const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
        setPosition(percentage);
      }
    },
    [isHorizontal]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0];
        if (touch) {
          handleMove(touch.clientX, touch.clientY);
        }
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Header */}
          {(heading || description) && (
            <div className="flex flex-col items-center text-center gap-4">
              {heading && (
                <h2 className="text-2xl sm:text-3xl font-semibold text-balance md:text-5xl">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="max-w-2xl text-base sm:text-lg text-muted-foreground text-balance">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Comparison Container */}
          <div
            ref={containerRef}
            role="slider"
            aria-label="Before/After comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={position}
            tabIndex={0}
            className={cn(
              "relative w-full rounded-lg overflow-hidden shadow-2xl border select-none",
              "aspect-video",
              isHorizontal ? "cursor-ew-resize" : "cursor-ns-resize"
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* After Image (Bottom layer - full) */}
            <div className="absolute inset-0">
              <Image
                src={afterImage.src}
                alt={afterImage.alt}
                fill
                className="object-cover"
              />
            </div>

            {/* Before Image (Top layer - clipped) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: isHorizontal
                  ? `inset(0 ${100 - position}% 0 0)`
                  : `inset(0 0 ${100 - position}% 0)`,
              }}
            >
              <Image
                src={beforeImage.src}
                alt={beforeImage.alt}
                fill
                className="object-cover"
              />
            </div>

            {/* Divider Line */}
            <div
              className={cn(
                "absolute bg-white shadow-lg z-10",
                isHorizontal
                  ? "top-0 bottom-0 -translate-x-1/2"
                  : "left-0 right-0 -translate-y-1/2"
              )}
              style={{
                [isHorizontal ? "left" : "top"]: `${position}%`,
                [isHorizontal ? "width" : "height"]: `${dividerWidth}px`,
              }}
            >
              {/* Handle */}
              <div
                className={cn(
                  "absolute bg-primary text-background rounded-full shadow-xl",
                  "flex items-center justify-center",
                  "w-10 h-10 border-3 border-white",
                  "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "transition-transform",
                  isDragging && "scale-110"
                )}
              >
                {isHorizontal ? (
                  <GripVertical className="size-5 text-background" />
                ) : (
                  <GripHorizontal className="size-5 text-background" />
                )}
              </div>
            </div>

            {/* Labels */}
            {showLabels && (
              <>
                <div
                  className={cn(
                    "absolute z-20 px-3 py-1.5 rounded-full",
                    "bg-black/70 text-white text-sm font-medium backdrop-blur-sm",
                    "top-4 left-4"
                  )}
                >
                  {beforeLabel}
                </div>
                <div
                  className={cn(
                    "absolute z-20 px-3 py-1.5 rounded-full",
                    "bg-black/70 text-white text-sm font-medium backdrop-blur-sm",
                    isHorizontal ? "top-4 right-4" : "bottom-4 left-4"
                  )}
                >
                  {afterLabel}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
