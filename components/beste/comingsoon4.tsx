"use client";

import { Code, Heart, Rocket, Sparkles, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FloatingElement {
  id: string;
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  position?: {
    x: number;
    y: number;
  };
}

interface ComingSoon4Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  showFloatingElements?: boolean;
  floatingElements?: FloatingElement[];
  notifyText?: string;
  className?: string;
}

export const comingsoon4Demo: ComingSoon4Props = {
  badge: { label: "Preview", variant: "secondary" },
  heading: "The future is almost here",
  description:
    "We're putting the finishing touches on something extraordinary. Get ready for a new experience.",
  showFloatingElements: true,
  floatingElements: [
    {
      id: "float-1",
      icon: <Rocket className="w-full h-full" />,
      size: "lg",
      position: { x: 10, y: 20 },
    },
    {
      id: "float-2",
      icon: <Star className="w-full h-full" />,
      size: "md",
      position: { x: 85, y: 15 },
    },
    {
      id: "float-3",
      icon: <Sparkles className="w-full h-full" />,
      size: "sm",
      position: { x: 15, y: 70 },
    },
    {
      id: "float-4",
      icon: <Zap className="w-full h-full" />,
      size: "md",
      position: { x: 90, y: 65 },
    },
    {
      id: "float-5",
      icon: <Heart className="w-full h-full" />,
      size: "sm",
      position: { x: 5, y: 45 },
    },
    {
      id: "float-6",
      icon: <Code className="w-full h-full" />,
      size: "lg",
      position: { x: 92, y: 40 },
    },
  ],
  notifyText: "Big things are coming",
};

function FloatingIcon({
  element,
  index,
}: {
  element: FloatingElement;
  index: number;
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  // CSS animation with different delays
  const animationStyle = {
    animation: `float ${3 + (index % 3)}s ease-in-out infinite`,
    animationDelay: `${index * 0.5}s`,
  };

  return (
    <div
      className={cn(
        "absolute text-muted-foreground/20",
        sizeClasses[element.size || "md"]
      )}
      style={{
        left: `${element.position?.x || 50}%`,
        top: `${element.position?.y || 50}%`,
        ...animationStyle,
      }}
    >
      {element.icon}
    </div>
  );
}

export function ComingSoon4({
  badge,
  heading,
  description,
  showFloatingElements = true,
  floatingElements = [],
  notifyText,
  className,
}: ComingSoon4Props) {
  return (
    <section className={cn("py-16 md:py-24 relative overflow-hidden", className)}>
      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-20px) scale(1.2) rotate(10deg);
          }
        }
      `}</style>

      {showFloatingElements && floatingElements.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {floatingElements.map((element, index) => (
            <FloatingIcon key={element.id} element={element} index={index} />
          ))}
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          {badge && (
            <div>
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}

          {heading && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance max-w-4xl">
              {heading}
            </h2>
          )}

          {description && (
            <p className="text-lg md:text-xl text-balance max-w-2xl text-muted-foreground">
              {description}
            </p>
          )}

          {notifyText && (
            <div className="mt-8">
              <motion.div
                className={cn(
                  "inline-flex items-center gap-3 px-6 py-3 rounded-full",
                  "bg-muted border border-border"
                )}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0,0,0,0)",
                    "0 0 0 8px rgba(0,0,0,0.03)",
                    "0 0 0 0 rgba(0,0,0,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="font-medium">{notifyText}</span>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
