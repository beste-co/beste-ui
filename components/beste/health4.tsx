"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

interface Health4Props {
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  image?: {
    src: string;
    alt: string;
  };
  imagePosition?: "left" | "right";
  floatingCard?: {
    quote: string;
    author: string;
  };
  className?: string;
}

export const health4Demo: Health4Props = {
  eyebrow: "Find your balance",
  heading: "Breathe. Move. Heal.",
  description:
    "A sanctuary for those seeking stillness in motion. We guide you through ancient practices adapted for modern life, helping you reconnect with your body and quiet your mind.",
  buttons: [
    { id: "btn-1", label: "Begin your journey", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "Our approach",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
  image: {
    src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
    alt: "Person in peaceful yoga pose at sunrise",
  },
  imagePosition: "right",
  floatingCard: {
    quote: '"This practice changed my life completely."',
    author: "— Sarah M.",
  },
};

export function Health4({
  eyebrow,
  heading,
  description,
  buttons = [],
  image,
  imagePosition = "right",
  floatingCard,
  className,
}: Health4Props) {
  const isImageRight = imagePosition === "right";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className={cn("max-w-xl", !isImageRight && "lg:order-2")}>
            {eyebrow && (
              <p className="text-xs tracking-widest uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h1 className="mt-4 text-4xl font-light tracking-tight md:text-6xl lg:text-7xl">
                {heading}
              </h1>
            )}
            {description && (
              <p className="mt-4 md:mt-6 text-lg text-muted-foreground md:text-xl">
                {description}
              </p>
            )}
            {buttons.length > 0 && (
              <div className="mt-8 md:mt-12 flex flex-wrap gap-3">
                {buttons.map((button) => (
                  <Button
                    key={button.id}
                    size="lg"
                    variant={button.variant ?? "default"}
                    asChild
                  >
                    <Link href={button.href ?? "#"}>{button.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {image && (
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-square",
                !isImageRight && "lg:order-1"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                className="size-full object-cover"
                width={800}
                height={600}
              />
              {/* Floating testimonial card */}
              {floatingCard && (
                <div
                  className={cn(
                    "absolute bottom-4 max-w-[240px] rounded-xl bg-background/80 p-4 shadow-lg backdrop-blur-sm md:bottom-6 md:p-5",
                    isImageRight ? "left-4 md:left-6" : "right-4 md:right-6"
                  )}
                >
                  <p className="text-sm leading-relaxed italic">
                    {floatingCard.quote}
                  </p>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    {floatingCard.author}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
