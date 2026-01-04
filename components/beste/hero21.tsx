"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TransitionType = "fade" | "slide" | "scale" | "flip" | "cube";

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  icon?: React.ReactNode;
}

interface HeroSlide {
  id: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  buttons?: ButtonItem[];
}

interface Hero21Props {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  transition?: TransitionType;
  showCounter?: boolean;
  showNavDots?: boolean;
  showArrows?: boolean;
  accentColor?: string;
  className?: string;
}

export const hero21Demo: Hero21Props = {
  slides: [
    {
      id: "slide-1",
      badge: { label: "Featured", variant: "default" },
      heading: "Discover the Future",
      description:
        "Experience the next generation of digital innovation. Where imagination meets reality.",
      image: {
        src: "https://images.unsplash.com/photo-1765706729547-57ad9c7f2814?q=90&w=2971&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Digital globe visualization",
      },
      buttons: [
        { id: "btn-1", label: "Explore Now", href: "https://beste.co" },
        {
          id: "btn-2",
          label: "Learn More",
          href: "https://beste.co",
          variant: "outline",
        },
      ],
    },
    {
      id: "slide-2",
      badge: { label: "Innovation", variant: "secondary" },
      heading: "Build Tomorrow",
      description:
        "Create extraordinary experiences with cutting-edge technology and seamless design.",
      image: {
        src: "https://images.unsplash.com/photo-1765706729287-953837a94f4d?q=80&w=1588&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Technology circuit board",
      },
      buttons: [
        { id: "btn-1", label: "Get Started", href: "https://beste.co" },
      ],
    },
    {
      id: "slide-3",
      badge: { label: "Premium", variant: "default" },
      heading: "Unlock Potential",
      description:
        "Transform your vision into reality with powerful tools designed for creators.",
      image: {
        src: "https://images.unsplash.com/photo-1765706729055-73ed78d19202?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Abstract digital art",
      },
      buttons: [
        { id: "btn-1", label: "Start Free", href: "https://beste.co" },
        {
          id: "btn-2",
          label: "View Pricing",
          href: "https://beste.co",
          variant: "outline",
        },
      ],
    },
  ],
  autoPlay: true,
  interval: 5000,
  transition: "slide",
  showCounter: true,
  showNavDots: true,
  showArrows: true,
  accentColor: "#7590ca",
};

const getSlideVariants = (transition: TransitionType): Variants => {
  switch (transition) {
    case "slide":
      return {
        enter: (direction: number) => ({
          y: direction > 0 ? "100%" : "-100%",
          opacity: 0,
        }),
        center: {
          y: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          y: direction < 0 ? "100%" : "-100%",
          opacity: 0,
        }),
      };
    case "scale":
      return {
        enter: {
          scale: 0.8,
          opacity: 0,
        },
        center: {
          scale: 1,
          opacity: 1,
        },
        exit: {
          scale: 1.2,
          opacity: 0,
        },
      };
    case "flip":
      return {
        enter: (direction: number) => ({
          rotateX: direction > 0 ? 90 : -90,
          opacity: 0,
        }),
        center: {
          rotateX: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          rotateX: direction < 0 ? 90 : -90,
          opacity: 0,
        }),
      };
    case "cube":
      return {
        enter: (direction: number) => ({
          rotateY: direction > 0 ? 90 : -90,
          x: direction > 0 ? "50%" : "-50%",
          opacity: 0,
        }),
        center: {
          rotateY: 0,
          x: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          rotateY: direction < 0 ? 90 : -90,
          x: direction < 0 ? "50%" : "-50%",
          opacity: 0,
        }),
      };
    default: // fade
      return {
        enter: {
          opacity: 0,
        },
        center: {
          opacity: 1,
        },
        exit: {
          opacity: 0,
        },
      };
  }
};

const getTransitionConfig = (transition: TransitionType): Transition => {
  switch (transition) {
    case "slide":
      return {
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      };
    case "scale":
      return {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
      };
    case "flip":
    case "cube":
      return {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1],
      };
    default:
      return {
        duration: 0.5,
        ease: "easeInOut",
      };
  }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + custom * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.3 },
  },
};

export function Hero21({
  slides,
  autoPlay = true,
  interval = 5000,
  transition = "slide",
  showCounter = true,
  showNavDots = true,
  showArrows = true,
  accentColor = "#7590ca",
  className,
}: Hero21Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides.length;
  const currentSlide = slides[currentIndex];

  const slideVariants = getSlideVariants(transition);
  const transitionConfig = getTransitionConfig(transition);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      if (newDirection === 1) {
        setCurrentIndex((prev) => (prev + 1) % slideCount);
      } else {
        setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
      }
    },
    [slideCount]
  );

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  useEffect(() => {
    if (!autoPlay || slideCount <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slideCount, isPaused]);

  if (!currentSlide || slideCount === 0) return null;

  return (
    <section
      className={cn(
        "relative w-full min-h-[600px] h-screen overflow-hidden bg-neutral-950",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fullscreen Background with AnimatePresence */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionConfig}
          className="absolute inset-0"
          style={{ perspective: "1200px" }}
        >
          {currentSlide.image && (
            <div className="absolute inset-0">
              <Image
                src={currentSlide.image.src}
                alt={currentSlide.image.alt}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-white/5" />
        <div className="absolute left-[90%] top-0 bottom-0 w-px bg-white/5" />
        <div className="absolute top-[20%] left-0 right-0 h-px bg-white/5" />
        <div className="absolute top-[80%] left-0 right-0 h-px bg-white/5" />
      </div>

      {/* Main Content with AnimatePresence */}
      <div className="relative h-full container mx-auto px-8 lg:px-32 flex items-center">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              {currentSlide.badge && (
                <motion.div variants={contentVariants} custom={0}>
                  <Badge
                    variant={currentSlide.badge.variant ?? "default"}
                    className="w-fit"
                  >
                    {currentSlide.badge.label}
                  </Badge>
                </motion.div>
              )}

              {/* Heading */}
              {currentSlide.heading && (
                <motion.h1
                  variants={contentVariants}
                  custom={1}
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-[1.05]"
                >
                  {currentSlide.heading}
                </motion.h1>
              )}

              {/* Description */}
              {currentSlide.description && (
                <motion.p
                  variants={contentVariants}
                  custom={2}
                  className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed"
                >
                  {currentSlide.description}
                </motion.p>
              )}

              {/* Buttons */}
              {currentSlide.buttons && currentSlide.buttons.length > 0 && (
                <motion.div
                  variants={contentVariants}
                  custom={3}
                  className="flex flex-wrap gap-4 mt-4"
                >
                  {currentSlide.buttons.map((button) => (
                    <Button
                      key={button.id}
                      variant={button.variant ?? "default"}
                      asChild
                      className={button.icon ? "gap-2" : undefined}
                    >
                      <Link href={button.href ?? "#"}>
                        {button.label}
                        {button.icon}
                      </Link>
                    </Button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Counter - Left Side */}
      {showCounter && slideCount > 1 && (
        <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-10 w-16">
          <span className="text-6xl lg:text-7xl font-bold text-white/10">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-16" style={{ backgroundColor: accentColor }} />
          <span className="text-sm text-white/40 font-mono">
            {String(slideCount).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Navigation Dots - Right Side */}
      {showNavDots && slideCount > 1 && (
        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
          {slides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => goToSlide(idx)}
              className={cn(
                "transition-all duration-300 rounded-full",
                idx === currentIndex
                  ? "w-3 h-8"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              )}
              style={
                idx === currentIndex
                  ? { backgroundColor: accentColor }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Up/Down Arrows - Bottom Center */}
      {showArrows && slideCount > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <button
            type="button"
            onClick={() => paginate(-1)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all group"
          >
            <ChevronUp className="size-6 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <div className="text-white/40 font-mono text-sm">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(slideCount).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all group"
          >
            <ChevronDown className="size-6 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && slideCount > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
          <motion.div
            key={currentIndex}
            className="h-full"
            style={{ backgroundColor: accentColor }}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? undefined : "100%" }}
            transition={{
              duration: interval / 1000,
              ease: "linear",
            }}
          />
        </div>
      )}
    </section>
  );
}
