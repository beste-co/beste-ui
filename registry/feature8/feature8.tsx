"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Ai8 } from "@/components/beste/piece/ai8";
import { Ai22 } from "@/components/beste/piece/ai22";
import { Code1 } from "@/components/beste/piece/code1";
import { Keyboard1 } from "@/components/beste/piece/keyboard1";
import { Search1 } from "@/components/beste/piece/search1";
import { Weather2 } from "@/components/beste/piece/weather2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

type ItemMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

interface CarouselItemData {
  title: string;
  description: string;
  media: ItemMedia;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

interface Feature8Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  items?: CarouselItemData[];
  className?: string;
}

export const feature8Demo: Feature8Props = {
  badge: { label: "Capabilities", variant: "outline" },
  heading: "A toolkit for every surface you ship",
  description:
    "Swipe through the assets that come prebuilt. Each card is a real component you can drop into any block media slot.",
  buttons: [
    { label: "Browse all assets", href: "https://beste.co/components" },
    {
      label: "Read the docs",
      href: "https://beste.co/docs",
      variant: "outline",
    },
  ],
  items: [
    {
      title: "Lightning-fast search",
      description: "A type-aware search field with a keyboard hint, ready for any command palette.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1772289935253-ffb028765564?w=350&q=80&auto=format&fit=crop",
          alt: "Card background",
        },
        component: <Search1 placeholder="Search anything..." shortcut={["⌘", "K"]} />,
      },
    },
    {
      title: "Forecasts that read at a glance",
      description: "Compact weekly weather widget with semantic icons and tabular numbers.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1581966510842-3e8f05f51aa9?w=350&q=80&auto=format&fit=crop",
          alt: "Card background",
        },
        component: (
          <Weather2
            days={[
              { label: "Mon", condition: "sunny", high: 24, low: 15 },
              { label: "Tue", condition: "cloudy", high: 22, low: 14 },
              { label: "Wed", condition: "rainy", high: 18, low: 12 },
              { label: "Thu", condition: "cloudy", high: 19, low: 13 },
              { label: "Fri", condition: "sunny", high: 25, low: 16 },
            ]}
          />
        ),
      },
    },
    {
      title: "Code in the marketing copy",
      description: "Inline snippet for tutorials, release notes, and developer onboarding.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1696815115289-3ac23f81e7e3?w=350&q=80&auto=format&fit=crop",
          alt: "Card background",
        },
        component: <Code1 code='const greeting = "Hello, Beste!";' language="ts" />,
      },
    },
    {
      title: "Shortcuts that travel",
      description:
        "Keyboard hints styled to match the rest of your interface, no extra spacing fiddling.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1581966512658-9081e422f811?w=350&q=80&auto=format&fit=crop",
          alt: "Card background",
        },
        component: <Keyboard1 keys={["⌘", "K"]} label="Quick search" />,
      },
    },
    {
      title: "Conversation that ships in-product",
      description:
        "User and assistant bubbles styled to match your interface. Drop them into help docs, onboarding, or marketing demos without rebuilding chat chrome.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1581966510884-9f1f08ddfbde?w=350&q=80&auto=format&fit=crop",
          alt: "Card background",
        },
        component: (
          <Ai8
            user="What's the capital of Japan?"
            assistant="Tokyo. It's been the capital since 1868, after Kyoto held the title for over a thousand years."
          />
        ),
      },
    },
    {
      title: "Show the model at work",
      description:
        "Tool-call cards reveal what the agent is actually doing — function name, arguments, status — without leaking the full transcript.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1772289935488-c9197bdcf42c?w=350&q=80&auto=format&fit=crop",
          alt: "Card background",
        },
        component: (
          <Ai22
            fn="search_docs"
            args={[
              { key: "query", value: '"rate limiting"' },
              { key: "limit", value: "5" },
            ]}
            status="done"
            tone="violet"
          />
        ),
      },
    },
  ],
};

export function Feature8({
  badge,
  heading,
  description,
  buttons = [],
  items = [],
  className,
}: Feature8Props) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description || buttons.length > 0) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
            )}
            {buttons.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {buttons.map((button, index) => (
                  <Button key={index} variant={button.variant ?? "default"} asChild>
                    <Link href={button.href ?? "#"}>{button.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        className="mx-auto max-w-6xl"
      >
        <CarouselContent className="-ml-4 md:-ml-6">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-4/5 pl-4 md:basis-1/2 md:pl-6 lg:basis-1/3">
              <article className="flex h-full flex-col overflow-hidden rounded-md border bg-card">
                <ItemMediaSurface media={item.media} />
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {items.length > 0 && (
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-2 px-4 md:px-6">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "size-2 rounded-full bg-muted transition-colors hover:bg-muted-foreground/40",
                activeIndex === index && "bg-primary hover:bg-primary"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ItemMediaSurface({ media }: { media: ItemMedia }) {
  const componentBackground =
    media.type === "component" ? (media.background ?? { type: "dots" }) : null;
  const showDots = componentBackground?.type === "dots";

  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b bg-muted/30"
      style={
        showDots
          ? {
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }
          : undefined
      }
    >
      {componentBackground?.type === "image" && (
        <img
          className="absolute inset-0 size-full object-cover"
          src={componentBackground.src}
          alt={componentBackground.alt ?? ""}
          aria-hidden="true"
        />
      )}
      {componentBackground?.type === "video" && (
        <video
          src={componentBackground.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {media.type === "video" ? (
        <video
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={media.alt}
          className="size-full object-cover"
        />
      ) : media.type === "image" ? (
        <img
          className="absolute inset-0 size-full object-cover"
          src={media.src}
          alt={media.alt ?? ""}
        />
      ) : (
        <div className="relative flex size-full items-center justify-center">{media.component}</div>
      )}
    </div>
  );
}
