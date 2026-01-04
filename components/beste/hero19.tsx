"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TransitionType = "fade" | "slide" | "zoom" | "blur" | "kenBurns";

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

interface Hero19Props {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  transition?: TransitionType;
  showDots?: boolean;
  showArrows?: boolean;
  showPreview?: boolean;
  className?: string;
}

export const hero19Demo: Hero19Props = {
  slides: [
    {
      id: "slide-1",
      badge: { label: "Introducing", variant: "default" },
      heading: "Cinematic Visual Experience",
      description:
        "Create stunning fullscreen presentations that captivate your audience. Seamless transitions, immersive backgrounds, and elegant typography.",
      image: {
        src: "https://images.unsplash.com/photo-1748726254210-67249a8ba93e?q=80&w=1974&auto=format&fit=crop",
        alt: "Mountain landscape at sunset",
      },
      buttons: [
        { id: "btn-1", label: "Get Started", href: "https://beste.co" },
      ],
    },
    {
      id: "slide-2",
      badge: { label: "Design", variant: "default" },
      heading: "Crafted for Excellence",
      description:
        "Every pixel is meticulously designed. Smooth animations and intuitive layouts create an unforgettable user experience.",
      image: {
        src: "https://images.unsplash.com/photo-1742812174813-1eebb4820037?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Serene lake surrounded by mountains",
      },
      buttons: [
        { id: "btn-1", label: "View Portfolio", href: "https://beste.co" },
      ],
    },
    {
      id: "slide-3",
      badge: { label: "Innovation", variant: "secondary" },
      heading: "Build Without Boundaries",
      description:
        "Scale your vision with powerful tools and flexible architecture. Adapt to any screen, any device, any dream.",
      image: {
        src: "https://images.unsplash.com/photo-1762952517610-8d647cabd71c?q=80&w=1299&auto=format&fit=crop",
        alt: "Modern architecture at night",
      },
      buttons: [
        { id: "btn-1", label: "Start Building", href: "https://beste.co" },
      ],
    },
  ],
  autoPlay: true,
  interval: 6000,
  transition: "fade",
  showDots: true,
  showArrows: false,
  showPreview: true,
};

const getSlideVariants = (transition: TransitionType): Variants => {
  switch (transition) {
    case "slide":
      return {
        enter: (direction: number) => ({
          x: direction > 0 ? "100%" : "-100%",
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          x: direction < 0 ? "100%" : "-100%",
          opacity: 0,
        }),
      };
    case "zoom":
      return {
        enter: {
          scale: 1.2,
          opacity: 0,
        },
        center: {
          scale: 1,
          opacity: 1,
        },
        exit: {
          scale: 0.8,
          opacity: 0,
        },
      };
    case "blur":
      return {
        enter: {
          filter: "blur(20px)",
          opacity: 0,
          scale: 1.1,
        },
        center: {
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
        },
        exit: {
          filter: "blur(20px)",
          opacity: 0,
          scale: 0.95,
        },
      };
    case "kenBurns":
      return {
        enter: {
          scale: 1.15,
          opacity: 0,
        },
        center: {
          scale: 1,
          opacity: 1,
        },
        exit: {
          scale: 1.05,
          opacity: 0,
        },
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
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      };
    case "zoom":
    case "blur":
      return {
        duration: 0.8,
        ease: [0.32, 0.72, 0, 1],
      };
    case "kenBurns":
      return {
        duration: 1.2,
        ease: [0.32, 0.72, 0, 1],
      };
    default:
      return {
        duration: 0.6,
        ease: "easeInOut",
      };
  }
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export function Hero19({
  slides,
  autoPlay = true,
  interval = 6000,
  transition = "fade",
  showDots = true,
  showArrows = false,
  showPreview = true,
  className,
}: Hero19Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides.length;
  const currentSlide = slides[currentIndex];
  const nextIndex = (currentIndex + 1) % slideCount;
  const nextSlide = slides[nextIndex];

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
        "relative w-full min-h-[600px] h-screen overflow-hidden bg-black",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Carousel */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionConfig}
          className="absolute inset-0 w-full h-full"
        >
          {currentSlide.image && (
            <div className="w-full h-full relative">
              <Image
                src={currentSlide.image.src}
                alt={currentSlide.image.alt}
                fill
                className="object-cover"
                priority
              />
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 mx-auto px-8 md:px-16 h-full flex flex-col justify-end pb-24 lg:pb-32">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-5 items-start"
            >
              {/* Badge */}
              {currentSlide.badge && (
                <motion.div variants={textVariants} custom={0}>
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
                  variants={textVariants}
                  custom={1}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]"
                >
                  {currentSlide.heading}
                </motion.h1>
              )}

              {/* Description */}
              {currentSlide.description && (
                <motion.p
                  variants={textVariants}
                  custom={2}
                  className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl font-light leading-relaxed"
                >
                  {currentSlide.description}
                </motion.p>
              )}

              {/* Buttons */}
              {currentSlide.buttons && currentSlide.buttons.length > 0 && (
                <motion.div
                  variants={textVariants}
                  custom={3}
                  className="flex flex-wrap gap-3 mt-2"
                >
                  {currentSlide.buttons.map((button) => (
                    <Button
                      key={button.id}
                      variant={button.variant ?? "default"}
                      asChild
                      className={button.icon ? "gap-2" : undefined}
                    >
                      <a href={button.href}>
                        {button.label}
                        {button.icon}
                      </a>
                    </Button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        {autoPlay && slideCount > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              key={currentIndex}
              className="h-full bg-white/50"
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? undefined : "100%" }}
              transition={{
                duration: interval / 1000,
                ease: "linear",
              }}
            />
          </div>
        )}
      </div>

      {/* Next Slide Preview */}
      {showPreview && nextSlide && slideCount > 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-20 lg:bottom-20 right-6 lg:right-8 z-10 hidden md:flex items-center gap-4 cursor-pointer group"
          onClick={() => paginate(1)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              paginate(1);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="text-right text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-1 text-white/50">
              Next
            </p>
            <p className="text-sm font-medium truncate max-w-[140px] text-white/80">
              {nextSlide.heading?.slice(0, 30) || "Next Slide"}
            </p>
          </div>

          <div className="relative w-28 h-16 lg:w-36 lg:h-20 rounded-lg overflow-hidden border border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:scale-105">
            {nextSlide.image && (
              <Image
                src={nextSlide.image.src}
                alt={nextSlide.image.alt}
                fill
                className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight className="text-white size-4" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Arrows */}
      {showArrows && slideCount > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 lg:left-8 lg:right-8 z-30 flex justify-between pointer-events-none">
          <button
            type="button"
            onClick={() => paginate(-1)}
            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 pointer-events-auto group"
          >
            <ChevronLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 pointer-events-auto group"
          >
            <ChevronRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Navigation Dots */}
      {showDots && slideCount > 1 && (
        <div className="absolute bottom-8 left-6 lg:left-8 z-30 flex items-center gap-2">
          <span className="text-[10px] text-white/40 font-mono mr-2">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(slideCount).padStart(2, "0")}
          </span>
          {slides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => goToSlide(idx)}
              className={cn(
                "transition-all duration-500 rounded-full",
                idx === currentIndex
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      )}

      {/* Slide Counter (Mobile) */}
      <div className="absolute top-6 right-6 z-30 md:hidden">
        <span className="text-xs text-white/50 font-mono">
          {currentIndex + 1} / {slideCount}
        </span>
      </div>
    </section>
  );
}
