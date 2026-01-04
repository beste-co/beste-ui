"use client";

import { Activity, ArrowRight, Heart, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Avatar {
  id: string;
  src: string;
  alt: string;
}

interface SocialProof {
  avatars?: Avatar[];
  rating?: number;
  memberCount?: string;
}

interface FloatingCard {
  enabled?: boolean;
  label?: string;
  value?: string;
}

interface ProgressCard {
  enabled?: boolean;
  label?: string;
  progress?: number;
}

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

interface Hero24Props {
  badge?: {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  socialProof?: SocialProof;
  image?: {
    src: string;
    alt: string;
  };
  floatingCard?: FloatingCard;
  progressCard?: ProgressCard;
  quote?: string;
  className?: string;
}

export const hero24Demo: Hero24Props = {
  badge: {
    label: "AI-Powered Health Coach",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    variant: "default",
  },
  heading: "Your Body, Your Balance.",
  description:
    "Start your journey to a healthier you with personalized nutrition plans, mindfulness practices, and sleep analysis.",
  buttons: [
    {
      id: "btn-1",
      label: "Try for Free",
      href: "https://beste.co",
    },
    {
      id: "btn-2",
      label: "How it Works",
      href: "https://beste.co",
      variant: "outline",
      icon: <ArrowRight className="size-4" />,
    },
  ],
  socialProof: {
    avatars: [
      {
        id: "avatar-1",
        src: "https://i.pravatar.cc/100?img=11",
        alt: "User 1",
      },
      {
        id: "avatar-2",
        src: "https://i.pravatar.cc/100?img=12",
        alt: "User 2",
      },
      {
        id: "avatar-3",
        src: "https://i.pravatar.cc/100?img=13",
        alt: "User 3",
      },
      {
        id: "avatar-4",
        src: "https://i.pravatar.cc/100?img=14",
        alt: "User 4",
      },
    ],
    rating: 5,
    memberCount: "10,000+ Happy Members",
  },
  image: {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=60",
    alt: "Yoga wellness",
  },
  floatingCard: {
    enabled: true,
    label: "Heart Rate",
    value: "72 BPM",
  },
  progressCard: {
    enabled: true,
    label: "Daily Goal",
    progress: 84,
  },
  quote: '"The time you invest in yourself today is the energy of tomorrow."',
};

export function Hero24(props: Hero24Props) {
  const {
    badge,
    heading,
    description,
    buttons,
    socialProof,
    image,
    floatingCard,
    progressCard,
    quote,
    className,
  } = props;

  console.log(props);
  return (
    <section
      className={cn("py-16 md:py-24 relative overflow-hidden", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Content Section */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            {badge && (
              <Badge variant={badge.variant ?? "default"} className="gap-1.5">
                {badge.icon}
                {badge.label}
              </Badge>
            )}

            {heading && (
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                {heading}
              </h1>
            )}

            {description && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
                {description}
              </p>
            )}

            {buttons && buttons.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-4">
                {buttons.map((button) => (
                  <Button
                    key={button.id}
                    size="lg"
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
              </div>
            )}

            {/* Social Proof */}
            {socialProof && (
              <div className="pt-6 flex items-center justify-center md:justify-start gap-4 text-sm">
                {socialProof.avatars && socialProof.avatars.length > 0 && (
                  <div className="flex -space-x-2">
                    {socialProof.avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.alt}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col items-start gap-1">
                  {socialProof.rating && (
                    <div className="flex text-amber-400">
                      {Array.from({ length: socialProof.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                          />
                        )
                      )}
                    </div>
                  )}
                  {socialProof.memberCount && (
                    <p className="font-medium">{socialProof.memberCount}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Media Section */}
          <div className="flex-1 relative w-full max-w-lg mx-auto md:mx-0">
            <div className="relative">
              {/* Background decorations for card */}
              <div className="absolute inset-0 bg-primary rounded-[2rem] rotate-6 opacity-10 scale-95" />
              <div className="absolute inset-0 bg-foreground rounded-[2rem] -rotate-3 opacity-5 scale-95" />

              {/* Main card */}
              <div className="relative overflow-hidden shadow-2xl rounded-[2rem] aspect-[4/5] group">
                {image && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating card - top left */}
                {floatingCard?.enabled && (
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="bg-background/90 backdrop-blur rounded-2xl p-3 shadow-lg flex items-center gap-3">
                      <div className="bg-destructive/10 p-2 rounded-full text-destructive">
                        <Heart className="size-5" fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          {floatingCard.label}
                        </p>
                        <p className="text-sm font-bold">
                          {floatingCard.value}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom content */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="space-y-4">
                    {/* Progress card */}
                    {progressCard?.enabled && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="size-5 text-white" />
                          <span className="text-sm font-medium">
                            {progressCard.label}
                          </span>
                          <span className="ml-auto text-sm font-bold">
                            %{progressCard.progress}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white"
                            style={{ width: `${progressCard.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Quote */}
                    {quote && (
                      <p className="font-medium text-lg leading-tight">
                        {quote}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
