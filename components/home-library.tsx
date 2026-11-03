"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type ComponentType, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ComponentDemo } from "@/components/component-demo";
import { RegistryComponentDemo } from "@/components/registry-component-demo";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface LibraryItem {
  name: string;
  title: string;
  /** Blocks only: which part of the block a short tile shows, 0 its top and 1 its bottom. */
  focus?: number;
}

interface HomeLibraryProps {
  /** Blocks for the two large squares, then the two wide strips. */
  blocks: { large: LibraryItem[]; wide: LibraryItem[] };
  pieces: LibraryItem[];
  components: LibraryItem[];
  counts: { blocks: number; pieces: number; components: number };
  className?: string;
}

type Slot = "large" | "wide" | "piece" | "component";

/*
 * The bento, in placement order on a four-column grid with dense packing: a large
 * block on the left, a wide strip on the right, then a large block shifted to the
 * middle and a wide strip back on the left, so no two big shapes stack in one column.
 */
const LAYOUT: Slot[] = [
  "large", "piece", "component", "piece", "piece",
  "component", "piece", "wide",
  "piece", "large", "component", "piece", "piece",
  "wide", "piece", "component",
];

const SLOT_CLASS: Record<Slot, string> = {
  large: "min-h-80 sm:col-span-2 lg:row-span-2 lg:min-h-0",
  wide: "min-h-72 sm:col-span-2 lg:min-h-0",
  piece: "lg:min-h-0",
  component: "lg:min-h-0",
};

// On a phone the bento stops after this many tiles; the doors above lead to the rest
const PHONE_LIMIT = 8;

/** A block drawn at desktop width and scaled to its tile, so the tile shows its top like a screenshot. */
function ScaledBlock({ name, focus = 0 }: { name: string; focus?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<{ width: number; scale: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const update = () => {
      const width = element.clientWidth;
      if (width <= 0) return;
      // Narrow tiles get the tablet layout, which reads better than a desktop page shrunk to a stamp
      const canvas = width < 560 ? 1024 : 1440;
      const scale = width / canvas;
      // A short strip shows the block's middle, where the content is, not the section padding above it
      const height = content.current?.offsetHeight ?? 0;
      const top = focus > 0 && height > 0 ? (element.clientHeight - height * scale) * focus : 0;
      setView({ width: canvas, scale, top });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    // The block's height settles after its images and fonts load
    if (content.current) observer.observe(content.current);
    return () => observer.disconnect();
  }, [focus]);

  const block = getBlockObfuscated(name);
  if (!block) return null;
  const Component: ComponentType<Record<string, unknown>> = block.component;

  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden bg-background">
      {/* Always mounted, hidden until measured, so its height can be read before the first placement */}
      <div
        ref={content}
        className={cn("absolute top-0 left-0 origin-top-left", !view && "invisible")}
        style={{ width: view?.width ?? 1440, transform: view ? `translateY(${view.top}px) scale(${view.scale})` : undefined }}
      >
        <Component {...(block.demoProps as Record<string, unknown>)} />
      </div>
    </div>
  );
}

function Tile({
  href,
  kind,
  title,
  framed = false,
  className,
  children,
}: {
  href: string;
  kind: string;
  title: string;
  /** A thick gray rim around the content, as on the catalogue's block cards, for content whose own edge is the page background. */
  framed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  // Live demos mount once the tile is near the viewport, so sixteen of them never start at once
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  return (
    <article
      ref={ref}
      className={cn(
        "group relative isolate min-h-64 overflow-hidden rounded-2xl bg-muted has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring",
        framed && "transition-colors hover:bg-muted-foreground/15",
        className
      )}
    >
      {/* Framed content sits inset on its own surface; the radius steps down by the rim so the corners stay concentric */}
      <div className={cn("absolute overflow-hidden", framed ? "inset-2.5 rounded-md" : "inset-0")}>
        {/* The demos are live; inert keeps a click or a drag from landing inside them instead of on the link */}
        <div
          inert
          className="pointer-events-none absolute inset-0 select-none transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
        >
          {inView && children}
        </div>
      </div>
      <div className={cn("pointer-events-none absolute z-10 flex items-center gap-2 rounded-full bg-background/85 py-1 pr-3 pl-1 text-sm shadow-xs backdrop-blur-md", framed ? "bottom-5 left-5 max-w-[calc(100%-2.5rem)]" : "bottom-3 left-3 max-w-[calc(100%-1.5rem)]")}>
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-foreground/70">{kind}</span>
        <span className="truncate font-medium">{title}</span>
      </div>
      <Link href={href} aria-label={`${kind}: ${title}`} className="absolute inset-0 z-20 cursor-pointer rounded-2xl outline-none" />
    </article>
  );
}

const DOORS = [
  { key: "blocks", label: "Blocks", href: "/blocks", note: "Full sections, from heroes to footers" },
  { key: "pieces", label: "Pieces", href: "/pieces", note: "Small live widgets that sit inside them" },
  { key: "components", label: "Components", href: "/components", note: "Buttons, inputs and the primitives under it all" },
] as const;

/**
 * The library in one place: three doors straight into each catalogue, then a
 * bento of blocks, pieces and components mixed at the sizes they are used at.
 */
export function HomeLibrary({ blocks, pieces, components, counts, className }: HomeLibraryProps) {
  const queues = {
    large: [...blocks.large],
    wide: [...blocks.wide],
    piece: [...pieces],
    component: [...components],
  };

  let shown = 0;
  const tiles = LAYOUT.map((slot, index) => {
    const phoneHidden = shown >= PHONE_LIMIT ? "hidden sm:block" : "";
    const className = cn(SLOT_CLASS[slot], phoneHidden);
    if (slot === "piece") {
      const piece = queues.piece.shift();
      if (!piece) return null;
      shown++;
      return (
        <Tile key={index} href={`/piece/${piece.name}`} kind="Piece" title={piece.title} className={className}>
          <div className="absolute inset-0 flex items-center justify-center p-4 pb-12">
            <ComponentDemo name={piece.name} />
          </div>
        </Tile>
      );
    }
    if (slot === "component") {
      const item = queues.component.shift();
      if (!item) return null;
      shown++;
      return (
        <Tile key={index} href={`/component/${item.name}`} kind="Component" title={item.title} className={className}>
          <div className="absolute inset-0 flex items-center justify-center p-6 pb-14">
            <RegistryComponentDemo name={item.name} />
          </div>
        </Tile>
      );
    }
    const item = queues[slot].shift();
    if (!item) return null;
    shown++;
    return (
      <Tile key={index} href={`/block/${item.name}`} kind="Block" title={item.title} framed className={className}>
        <ScaledBlock name={item.name} focus={item.focus ?? (slot === "wide" ? 0.5 : 0)} />
      </Tile>
    );
  });

  return (
    <section className={className}>
      <div className="mb-8 max-w-xl md:mb-10">
        <h2 className={typography.h2}>One library, every size.</h2>
        <p className={cn(typography.lead, "mt-3")}>
          Full-page blocks, small pieces that bring them to life, and the components underneath, all made to work
          together.
        </p>
      </div>

      <nav aria-label="Library" className="mb-4 grid gap-3 sm:grid-cols-3 md:mb-5 md:gap-4">
        {DOORS.map((door) => (
          <Link
            key={door.key}
            href={door.href}
            className="group flex cursor-pointer flex-col justify-between gap-8 rounded-2xl bg-muted p-5 transition-colors duration-300 hover:bg-muted-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-6"
          >
            <span className="flex items-center justify-between">
              <span className={typography.h3}>{door.label}</span>
              <span className="flex size-9 items-center justify-center rounded-full bg-background transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-4xl font-medium tracking-tight tabular-nums md:text-5xl">{counts[door.key]}</span>
              <span className={typography.meta}>{door.note}</span>
            </span>
          </Link>
        ))}
      </nav>

      <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:auto-rows-[16rem] lg:grid-cols-4">
        {tiles}
      </div>
    </section>
  );
}
