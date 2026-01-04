"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TransitionType = "fade" | "parallax" | "reveal" | "morphism" | "curtain";

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

interface Hero20Props {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  transition?: TransitionType;
  showThumbnails?: boolean;
  showArrows?: boolean;
  showProgress?: boolean;
  colorMode?: "dark" | "light";
  className?: string;
}

export const hero20Demo: Hero20Props = {
  slides: [
    {
      id: "slide-1",
      badge: { label: "New Release", variant: "default" },
      heading: "Design Without Limits",
      description:
        "Transform your creative vision into reality. Our platform empowers designers and developers to build stunning experiences without constraints.",
      image: {
        src: "https://images.unsplash.com/photo-1764009971892-6bf11e43f210?q=80&w=2670&auto=format&fit=crop",
        alt: "Abstract colorful design",
      },
      buttons: [
        { id: "btn-1", label: "Start Creating", href: "https://beste.co" },
      ],
    },
    {
      id: "slide-2",
      badge: { label: "Featured", variant: "secondary" },
      heading: "Collaborate in Real-time",
      description:
        "Work together seamlessly with your team. Share designs, gather feedback, and iterate faster than ever before.",
      image: {
        src: "https://images.unsplash.com/photo-1666585958614-ade385208fac?q=80&w=2670&auto=format&fit=crop",
        alt: "Creative collaboration workspace",
      },
      buttons: [
        { id: "btn-1", label: "Start Free Trial", href: "https://beste.co" },
      ],
    },
    {
      id: "slide-3",
      badge: { label: "Coming Soon", variant: "default" },
      heading: "AI-Powered Creativity",
      description:
        "Let artificial intelligence enhance your workflow. Generate ideas, optimize layouts, and push the boundaries of design.",
      image: {
        src: "https://images.unsplash.com/photo-1740393076705-69922a4cce76?q=80&w=2608&auto=format&fit=crop",
        alt: "Futuristic AI interface",
      },
      buttons: [
        { id: "btn-1", label: "Join Waitlist", href: "https://beste.co" },
      ],
    },
  ],
  autoPlay: true,
  interval: 5000,
  transition: "parallax",
  showThumbnails: true,
  showArrows: true,
  showProgress: true,
  colorMode: "light",
};

const getSlideVariants = (transition: TransitionType): Variants => {
  switch (transition) {
    case "parallax":
      return {
        enter: (direction: number) => ({
          x: direction > 0 ? "30%" : "-30%",
          scale: 1.1,
          opacity: 0,
        }),
        center: {
          x: 0,
          scale: 1,
          opacity: 1,
        },
        exit: (direction: number) => ({
          x: direction < 0 ? "30%" : "-30%",
          scale: 0.95,
          opacity: 0,
        }),
      };
    case "reveal":
      return {
        enter: {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          opacity: 1,
        },
        center: {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          opacity: 1,
        },
        exit: {
          clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
          opacity: 1,
        },
      };
    case "morphism":
      return {
        enter: {
          filter: "blur(40px) saturate(0)",
          scale: 1.2,
          opacity: 0,
        },
        center: {
          filter: "blur(0px) saturate(1)",
          scale: 1,
          opacity: 1,
        },
        exit: {
          filter: "blur(40px) saturate(0)",
          scale: 0.9,
          opacity: 0,
        },
      };
    case "curtain":
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
    default: // fade
      return {
        enter: {
          opacity: 0,
          scale: 1.05,
        },
        center: {
          opacity: 1,
          scale: 1,
        },
        exit: {
          opacity: 0,
          scale: 0.95,
        },
      };
  }
};

const getTransitionConfig = (transition: TransitionType): Transition => {
  switch (transition) {
    case "parallax":
      return {
        x: { type: "spring", stiffness: 200, damping: 25 },
        scale: { duration: 0.6 },
        opacity: { duration: 0.4 },
      };
    case "reveal":
      return {
        clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      };
    case "morphism":
      return {
        duration: 0.9,
        ease: [0.32, 0.72, 0, 1],
      };
    case "curtain":
      return {
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      };
    default:
      return {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      };
  }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
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
    y: -20,
    transition: { duration: 0.3 },
  },
};

export function Hero20({
  slides,
  autoPlay = true,
  interval = 5000,
  transition = "parallax",
  showThumbnails = true,
  showArrows = true,
  showProgress = true,
  colorMode = "light",
  className,
}: Hero20Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides.length;
  const currentSlide = slides[currentIndex];

  const slideVariants = getSlideVariants(transition);
  const transitionConfig = getTransitionConfig(transition);

  // Color mode styles
  const isDark = colorMode === "dark";
  const bgClass = isDark
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-br from-slate-50 via-white to-slate-100";
  const headingColor = isDark ? "text-white" : "text-slate-900";
  const descriptionColor = isDark ? "text-slate-400" : "text-slate-600";
  const counterPrimaryColor = isDark ? "text-white/20" : "text-slate-300";
  const counterSecondaryColor = isDark ? "text-white/40" : "text-slate-500";
  const counterLineColor = isDark ? "bg-white/20" : "bg-slate-300";
  const progressBgActive = isDark ? "bg-white/20" : "bg-slate-400/30";
  const progressBgInactive = isDark
    ? "bg-white/10 hover:bg-white/20"
    : "bg-slate-300/50 hover:bg-slate-400/50";

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
        "relative w-full lg:min-h-[600px] lg:h-screen overflow-hidden",
        bgClass,
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient Glow Effects */}
      <div
        className={cn(
          "absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none",
          isDark ? "bg-violet-500/20" : "bg-violet-500/10"
        )}
      />
      <div
        className={cn(
          "absolute bottom-1/4 -right-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none",
          isDark ? "bg-cyan-500/20" : "bg-cyan-500/10"
        )}
      />

      {/* Main Content Grid */}
      <div className="relative lg:h-full container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:h-full lg:items-center py-12 lg:py-0">
          {/* Left Side - Content */}
          <div className="relative z-10 order-2 lg:order-1">
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
                    className={cn(
                      "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]",
                      headingColor
                    )}
                  >
                    {currentSlide.heading}
                  </motion.h1>
                )}

                {/* Description */}
                {currentSlide.description && (
                  <motion.p
                    variants={contentVariants}
                    custom={2}
                    className={cn(
                      "text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed",
                      descriptionColor
                    )}
                  >
                    {currentSlide.description}
                  </motion.p>
                )}

                {/* Buttons */}
                {currentSlide.buttons && currentSlide.buttons.length > 0 && (
                  <motion.div
                    variants={contentVariants}
                    custom={3}
                    className="flex flex-wrap gap-4 mt-2"
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

            {/* Slide Counter */}
            <div className="hidden lg:flex items-center gap-4 mt-12">
              <span className={cn("text-5xl font-bold", counterPrimaryColor)}>
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <div className={cn("w-16 h-[2px]", counterLineColor)} />
              <span className={cn("text-lg", counterSecondaryColor)}>
                {String(slideCount).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Right Side - Media */}
          <div className="relative order-1 lg:order-2 h-[300px] sm:h-[400px] lg:h-[70%]">
            {/* Main Media Container */}
            <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Glassmorphism Border Effect */}
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border border-white/10 z-10 pointer-events-none" />
              <div className="absolute -inset-[1px] rounded-2xl lg:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-white/10 z-0 pointer-events-none" />

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
                >
                  {currentSlide.image && (
                    <Image
                      src={currentSlide.image.src}
                      alt={currentSlide.image.alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  {/* Inner Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {showArrows && slideCount > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 pointer-events-auto group"
                  >
                    <ChevronLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 pointer-events-auto group"
                  >
                    <ChevronRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {showThumbnails && slideCount > 1 && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:-bottom-6 flex items-center gap-2 lg:gap-3 p-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                {slides.map((slide, idx) => (
                  <button
                    type="button"
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    className={cn(
                      "relative overflow-hidden rounded-lg transition-opacity duration-300 w-14 h-10 lg:w-16 lg:h-12",
                      idx === currentIndex
                        ? "opacity-100 ring-2 ring-white/50"
                        : "opacity-50 hover:opacity-80"
                    )}
                  >
                    {slide.image && (
                      <Image
                        src={slide.image.src}
                        alt={slide.image.alt}
                        fill
                        className="object-cover"
                      />
                    )}
                    {idx === currentIndex && showProgress && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: isPaused ? undefined : "100%" }}
                        transition={{
                          duration: interval / 1000,
                          ease: "linear",
                        }}
                        key={`progress-${currentIndex}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vertical Progress Indicator */}
      {showProgress && slideCount > 1 && (
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-10">
          {slides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => goToSlide(idx)}
              className="relative group"
            >
              <div
                className={cn(
                  "w-1 transition-all duration-500 rounded-full overflow-hidden",
                  idx === currentIndex
                    ? `h-12 ${progressBgActive}`
                    : `h-6 ${progressBgInactive}`
                )}
              >
                {idx === currentIndex && (
                  <motion.div
                    className="w-full bg-gradient-to-b from-violet-400 to-cyan-400"
                    initial={{ height: "0%" }}
                    animate={{ height: isPaused ? undefined : "100%" }}
                    transition={{
                      duration: interval / 1000,
                      ease: "linear",
                    }}
                    key={`vprogress-${currentIndex}`}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
