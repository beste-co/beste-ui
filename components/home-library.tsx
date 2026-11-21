"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useInView } from "react-intersection-observer";
import { AutoCarousel } from "@/components/beste/component/auto-carousel";
import { Button23 } from "@/components/beste/component/button23";
import { ComponentDemo } from "@/components/component-demo";
import { LoginModal } from "@/components/login-modal";
import { RegistryComponentDemo } from "@/components/registry-component-demo";
import { useAuth } from "@/lib/auth-context";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { BACKGROUND_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { getRegistryComponent } from "@/lib/registry-components";
import { hostedLinkProps, PRICING_HREF } from "@/lib/site-links";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface LibraryItem {
  name: string;
  title: string;
  /** Blocks only: which part of the block a short tile shows, 0 its top and 1 its bottom. */
  focus?: number;
}

interface HomeLibraryProps {
  /** The newest blocks, taking turns in the wide tile that opens the bento. */
  featured: LibraryItem[];
  /** Blocks for the large square, then the two wide strips. */
  blocks: { large: LibraryItem[]; wide: LibraryItem[] };
  pieces: LibraryItem[];
  components: LibraryItem[];
  counts: { blocks: number; pieces: number; components: number };
  className?: string;
}

type Slot = "featured" | "large" | "wide" | "piece" | "component";

type Kind = "Block" | "Piece" | "Component";

interface PreviewTarget {
  kind: Kind;
  name: string;
  title: string;
  href: string;
  /** The tile the preview grows out of and shrinks back into. */
  source: HTMLElement;
}

/*
 * The bento, in placement order on a four-column grid with dense packing: the newest
 * blocks across three columns with two tiles stacked beside them, a wide strip on the
 * right, then a large block in the middle and a wide strip back on the left, so no two
 * big shapes stack in one column.
 */
const LAYOUT: Slot[] = [
  "featured", "component", "piece",
  "component", "piece", "wide",
  "piece", "large", "piece", "piece", "piece",
  "wide", "piece", "component",
];

const SLOT_CLASS: Record<Slot, string> = {
  featured: "min-h-80 sm:col-span-2 lg:col-span-3 lg:row-span-2 lg:min-h-0",
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

/** A plain click opens the quick preview from the tile; modified clicks still follow the link. */
function openOnPlainClick(event: MouseEvent<HTMLAnchorElement>, onOpen: (source: HTMLElement) => void) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const tile = event.currentTarget.closest("article");
  if (tile) onOpen(tile);
}

function Tile({
  href,
  kind,
  title,
  framed = false,
  onOpen,
  className,
  children,
}: {
  href: string;
  kind: Kind;
  title: string;
  /** A plain click opens the quick preview; modified clicks still follow the link. */
  onOpen: (source: HTMLElement) => void;
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
      <Link
        href={href}
        onClick={(event) => openOnPlainClick(event, onOpen)}
        aria-label={`${kind}: ${title}`}
        className="absolute inset-0 z-20 cursor-pointer rounded-2xl outline-none"
      />
    </article>
  );
}

/** The newest blocks taking turns in one wide framed tile; each slide opens its own preview. */
function FeaturedTile({
  items,
  onOpen,
  className,
}: {
  items: LibraryItem[];
  onOpen: (item: LibraryItem, source: HTMLElement) => void;
  className?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  const slides = items.map((item) => ({
    label: item.title,
    content: (
      <>
        <div
          inert
          className="pointer-events-none absolute inset-0 select-none transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
        >
          <ScaledBlock name={item.name} focus={item.focus} />
        </div>
        <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 flex max-w-[calc(100%-5rem)] items-center gap-2 rounded-full bg-background/85 py-1 pr-3 pl-1 text-sm shadow-xs backdrop-blur-md">
          <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-foreground/70">New block</span>
          <span className="truncate font-medium">{item.title}</span>
        </div>
        <Link
          href={`/block/${item.name}`}
          onClick={(event) => openOnPlainClick(event, (source) => onOpen(item, source))}
          aria-label={`Block: ${item.title}`}
          className="absolute inset-0 cursor-pointer outline-none"
        />
      </>
    ),
  }));

  return (
    <article
      ref={ref}
      className={cn(
        "group relative isolate min-h-64 overflow-hidden rounded-2xl bg-muted transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring",
        className
      )}
    >
      {/* Same rim as the framed block tiles, with the radius stepped down so the corners stay concentric */}
      <div className="absolute inset-2.5 overflow-hidden rounded-md bg-background">
        {inView && <AutoCarousel aria-label="Newest blocks" className="size-full" slides={slides} duration={6000} transition={1400} />}
      </div>
    </article>
  );
}

const PREVIEW_MS = 500;
const PREVIEW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CLOSE_MS = 340;
const CLOSE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
// The panel only fades at the very edges of the motion, so it never pops in or out over the tile
const EDGE_FADE_MS = 120;

/*
 * The panel, content and all, shrunk evenly onto the tile and cropped to its shape:
 * scaled so it covers the tile, centred on it, and clipped (in the panel's own units)
 * down to the tile's box. Animating to none slides and grows it out of the tile.
 */
function onTile(tile: DOMRect, panel: DOMRect) {
  const scale = Math.max(tile.width / panel.width, tile.height / panel.height);
  const x = tile.left + tile.width / 2 - (panel.left + panel.width / 2);
  const y = tile.top + tile.height / 2 - (panel.top + panel.height / 2);
  const insetX = (panel.width - tile.width / scale) / 2;
  const insetY = (panel.height - tile.height / scale) / 2;
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    clipPath: `inset(${insetY}px ${insetX}px round ${16 / scale}px)`,
  };
}

/** The whole block at desktop width, scaled to the panel and scrollable top to bottom. */
function PreviewBlock({ name }: { name: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<{ width: number; scale: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const update = () => {
      const width = element.clientWidth;
      if (width <= 0) return;
      const canvas = width < 560 ? 1024 : 1440;
      const scale = width / canvas;
      setView({ width: canvas, scale, height: (content.current?.offsetHeight ?? 0) * scale });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (content.current) observer.observe(content.current);
    return () => observer.disconnect();
  }, []);

  const block = getBlockObfuscated(name);
  if (!block) return null;
  const Component: ComponentType<Record<string, unknown>> = block.component;

  return (
    <div ref={frame} className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-background">
      <div className="relative" style={{ height: view?.height }}>
        <div
          ref={content}
          className={cn("absolute top-0 left-0 origin-top-left", !view && "invisible")}
          style={{ width: view?.width ?? 1440, transform: view ? `scale(${view.scale})` : undefined }}
        >
          <Component {...(block.demoProps as Record<string, unknown>)} />
        </div>
      </div>
    </div>
  );
}

// Demos that paint their own ground get the tiles' gray instead of the page white
// Pieces with a fixed drawing larger than a small tile are drawn smaller to fit it
const PIECE_ZOOM: Record<string, number> = { ai62: 0.72 };

const COMPONENT_PROPS: Record<string, Record<string, unknown>> = {
  "glass-lens": { paperColor: "var(--muted)" },
};

/** A component at its own size, not fitted to a card; backgrounds still fill the stage. */
function PreviewComponent({ name }: { name: string }) {
  const meta = getRegistryComponent(name);
  if (!meta) return null;
  if (meta.fullBleed || BACKGROUND_PREVIEW_CATEGORIES.has(meta.category ?? "")) {
    return <RegistryComponentDemo name={name} props={COMPONENT_PROPS[name]} />;
  }
  const Component = meta.component;
  return <Component {...((meta.demoProps ?? {}) as Record<string, unknown>)} {...COMPONENT_PROPS[name]} />;
}

/**
 * A quick look without leaving the page: the panel slides and grows out of the tile
 * with its content already in place, and shrinks back into the tile when closed.
 */
function QuickPreview({ target, onClose }: { target: PreviewTarget; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);
  const closing = useRef(false);

  useLayoutEffect(() => {
    const element = panel.current;
    if (!element) return;
    element.style.transition = "none";
    element.style.transform = "none";
    const start = onTile(target.source.getBoundingClientRect(), element.getBoundingClientRect());
    element.style.transform = start.transform;
    element.style.clipPath = start.clipPath;
    element.style.opacity = "0";
    // Commit the starting state before the transitions begin
    element.getBoundingClientRect();
    element.style.transition = `transform ${PREVIEW_MS}ms ${PREVIEW_EASE}, clip-path ${PREVIEW_MS}ms ${PREVIEW_EASE}, opacity ${EDGE_FADE_MS}ms linear`;
    element.style.transform = "none";
    element.style.clipPath = "inset(0px round 24px)";
    element.style.opacity = "1";
    setShown(true);
    closeButton.current?.focus({ preventScroll: true });
  }, [target.source]);

  const close = useCallback(() => {
    const element = panel.current;
    if (!element || closing.current) return;
    closing.current = true;
    const end = onTile(target.source.getBoundingClientRect(), element.getBoundingClientRect());
    element.style.transition = `transform ${CLOSE_MS}ms ${CLOSE_EASE}, clip-path ${CLOSE_MS}ms ${CLOSE_EASE}, opacity ${EDGE_FADE_MS}ms linear ${CLOSE_MS - EDGE_FADE_MS}ms`;
    element.style.transform = end.transform;
    element.style.clipPath = end.clipPath;
    element.style.opacity = "0";
    setShown(false);
    window.setTimeout(onClose, CLOSE_MS);
  }, [onClose, target.source]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const isBlock = target.kind === "Block";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape and the close button cover the keyboard. */}
      <div
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm transition-opacity ease-out"
        style={{ transitionDuration: `${shown ? PREVIEW_MS : CLOSE_MS}ms`, opacity: shown ? 1 : 0 }}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${target.kind}: ${target.title}`}
        className={cn(
          "relative h-full w-full overflow-hidden rounded-3xl bg-background shadow-2xl will-change-transform",
          isBlock ? "max-h-[52rem] max-w-6xl" : "max-h-[40rem] max-w-3xl"
        )}
      >
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b px-3 py-3 md:px-4">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="shrink-0 rounded-full bg-foreground/10 px-2 py-0.5 text-foreground/70">{target.kind}</span>
              <span className="truncate font-medium">{target.title}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button23 size="sm" asChild label="Open page" tone="dark" direction="right">
                <Link href={target.href} />
              </Button23>
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                aria-label="Close preview"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="relative min-h-0 flex-1">
            {isBlock ? (
              <PreviewBlock name={target.name} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center overflow-auto bg-muted p-6 md:p-10">
                {target.kind === "Piece" ? <ComponentDemo name={target.name} /> : <PreviewComponent name={target.name} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
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
export function HomeLibrary({ featured, blocks, pieces, components, counts, className }: HomeLibraryProps) {
  const router = useRouter();
  const { session, refreshSession } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [preview, setPreview] = useState<PreviewTarget | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);

  // Same as the hero: signed-in visitors go straight to the blocks, everyone else signs up first
  const join = () => {
    if (session?.user) {
      router.push("/blocks");
      return;
    }
    setLoginOpen(true);
  };

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
    if (slot === "featured") {
      if (featured.length === 0) return null;
      shown++;
      return (
        <FeaturedTile
          key={index}
          items={featured}
          onOpen={(item, source) => setPreview({ kind: "Block", name: item.name, title: item.title, href: `/block/${item.name}`, source })}
          className={className}
        />
      );
    }
    if (slot === "piece") {
      const piece = queues.piece.shift();
      if (!piece) return null;
      shown++;
      return (
        <Tile
          key={index}
          href={`/piece/${piece.name}`}
          kind="Piece"
          title={piece.title}
          onOpen={(source) => setPreview({ kind: "Piece", name: piece.name, title: piece.title, href: `/piece/${piece.name}`, source })}
          className={className}
        >
          <div style={{ zoom: PIECE_ZOOM[piece.name] }} className="absolute inset-0 flex items-center justify-center p-4 pb-12">
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
        <Tile
          key={index}
          href={`/component/${item.name}`}
          kind="Component"
          title={item.title}
          onOpen={(source) =>
            setPreview({ kind: "Component", name: item.name, title: item.title, href: `/component/${item.name}`, source })
          }
          className={className}
        >
          <div className="absolute inset-0 flex items-center justify-center p-6 pb-14">
            <RegistryComponentDemo name={item.name} props={COMPONENT_PROPS[item.name]} />
          </div>
        </Tile>
      );
    }
    const item = queues[slot].shift();
    if (!item) return null;
    shown++;
    return (
      <Tile
        key={index}
        href={`/block/${item.name}`}
        kind="Block"
        title={item.title}
        framed
        onOpen={(source) => setPreview({ kind: "Block", name: item.name, title: item.title, href: `/block/${item.name}`, source })}
        className={className}
      >
        <ScaledBlock name={item.name} focus={item.focus ?? (slot === "wide" ? 0.5 : 0)} />
      </Tile>
    );
  });

  return (
    <section className={className}>
      <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className={typography.h2}>One library, every size.</h2>
          <p className={cn(typography.lead, "mt-3")}>
            Full-page blocks, small pieces that bring them to life, and the components underneath, all made to work
            together.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button23 size="sm" label="Join now" tone="dark" direction="right" onClick={join} />
          <Button23 size="sm" asChild label="See our plans" tone="outline">
            <Link href={PRICING_HREF} {...hostedLinkProps} />
          </Button23>
        </div>
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
            <span className="flex flex-col gap-2.5">
              <span className="text-4xl leading-none font-medium tracking-tighter md:text-5xl">{counts[door.key].toLocaleString("en-US")}</span>
              <span className={typography.meta}>{door.note}</span>
            </span>
          </Link>
        ))}
      </nav>

      <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:auto-rows-[16rem] lg:grid-cols-4">
        {tiles}
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
      {preview && <QuickPreview key={preview.href} target={preview} onClose={closePreview} />}
    </section>
  );
}
