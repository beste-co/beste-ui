"use client";

import type * as React from "react";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * The exploded page from hero317, as the home hero's centerpiece: one small site
 * taken apart into photo, type and controls that float above their ground sheet.
 */

interface LayeredPage {
  brand: string;
  nav?: string[];
  action?: string;
  photo: string;
  card?: { title: string; detail: string };
  heading: string;
  description?: string;
  buttons?: string[];
}

// The Mira dental studio from the landing13 page
const PAGE: LayeredPage = {
  brand: "Mira",
  nav: ["Treatments", "Visit us"],
  action: "Book",
  photo: "https://oud.pics/b/dental/mira-consultation.webp",
  card: { title: "First visit", detail: "45 minutes" },
  heading: "Calm, careful dentistry for the whole family",
  description: "Unhurried appointments, clear plans and gentle hands.",
  buttons: ["Book a visit", "Treatments"],
};

// Distance between two layers, how far each rises and falls, and the page's lean and turn
const GAP = 60;
const DRIFT = 5;
const TILT = 58;
const TURN = -38;

// "all" paints every part at once, for a card shown whole
type Layer = "all" | "none" | "photo" | "text" | "controls";

const preserve: CSSProperties = { transformStyle: "preserve-3d" };
// The cut edges of the ground sheet and the photo, a step darker than their faces
const sheetEdge = "color-mix(in oklab, var(--card) 78%, var(--foreground))";
const photoEdge = "rgb(46 40 36)";

/** One page, laid out once: each layer paints only its own parts, so the layers always register. `shade` paints them as a shadow. */
function Page({ page, layer, shade = false }: { page: LayeredPage; layer: Layer; shade?: boolean }) {
  const on = (own: Layer) => (own === layer ? undefined : "invisible");
  const ink = shade ? "text-black" : undefined;
  const quiet = shade ? "text-black" : "text-muted-foreground";
  return (
    <div style={preserve} className="flex flex-col p-7 text-left">
      <div className="flex h-9 items-center justify-between gap-4">
        <span className={cn("text-lg font-medium tracking-tight", ink, on("text"))}>{page.brand}</span>
        <span className="flex items-center gap-5">
          {page.nav?.map((item, index) => (
            <span key={index} className={cn("text-sm", quiet, on("text"))}>
              {item}
            </span>
          ))}
          {page.action && (
            <span className={cn("inline-flex h-9 items-center rounded-full px-4 text-sm", shade ? "bg-black text-transparent" : "bg-primary text-primary-foreground", on("controls"))}>{page.action}</span>
          )}
        </span>
      </div>
      <div style={preserve} className="relative mt-4 h-55">
        {layer === "photo" && shade && <div className="absolute inset-0 rounded-2xl bg-black" />}
        {layer === "photo" && !shade && (
          <>
            <div style={{ transform: "translateZ(-4px)", background: photoEdge }} className="absolute inset-0 rounded-2xl" />
            <div style={{ transform: "translateZ(-2px)", background: photoEdge }} className="absolute inset-0 rounded-2xl" />
            <img src={page.photo} alt="" decoding="async" className="absolute inset-0 size-full rounded-2xl object-cover ring-1 ring-black/5" />
          </>
        )}
        {layer === "controls" && page.card && (
          <div
            className={cn(
              "absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl py-2.5 pr-4 pl-2.5",
              shade ? "bg-black text-transparent" : "bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_20px_-6px_rgb(0_0_0/0.2)] ring-1 ring-foreground/10",
            )}
          >
            <span className={cn("grid size-9 place-items-center rounded-xl", !shade && "bg-muted")}>
              <span className={cn("size-2 rounded-full", !shade && "bg-primary")} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm leading-tight font-medium">{page.card.title}</span>
              <span className={cn("text-sm leading-tight", !shade && "text-muted-foreground")}>{page.card.detail}</span>
            </span>
          </div>
        )}
      </div>
      <p className={cn("mt-10 text-3xl leading-[1.1] font-medium tracking-tight text-balance", ink, on("text"))}>{page.heading}</p>
      {page.description && <p className={cn("mt-3 text-base leading-relaxed", quiet, on("text"))}>{page.description}</p>}
      {page.buttons && page.buttons.length > 0 && (
        <div className={cn("mt-6 flex gap-2", on("controls"))}>
          {page.buttons.map((label, index) => (
            <span
              key={index}
              className={cn(
                "inline-flex h-11 items-center rounded-full px-5 text-base whitespace-nowrap",
                shade ? "bg-black text-transparent" : index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground ring-1 ring-inset ring-border",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** Draws one layer of a scene; `shade` asks for the same shapes as a flat shadow. */
type Render = (layer: Layer, shade: boolean) => React.ReactNode;

/**
 * The shell every scene shares: a ground sheet that holds the whole layout, three
 * layers floating above it with their shadows, and a pane of glass on top.
 */
function LayerStack({ render, tint, gap = GAP, width = "w-110", scale, className }: { render: Render; tint?: string; gap?: number; width?: string; scale: string; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;
    // Reduced motion keeps the composed, separated pose from the first paint
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let inView = false;
    let spread = 1;
    let pointer = 1;
    let last = 0;
    let time = 0;

    const tick = (now: number) => {
      frame = 0;
      const delta = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      time += delta;
      // Apart while the stage is in view, together by the time it has scrolled most of the way out
      const rect = stage.getBoundingClientRect();
      const scrolled = clamp((window.innerHeight * 0.48 - rect.top) / (rect.height * 0.4), 0, 1);
      spread += (Math.min(1 - smooth(scrolled), pointer) - spread) * (1 - Math.exp(-delta * 5));
      scene.style.setProperty("--layers-s", spread.toFixed(4));
      for (let level = 1; level <= 4; level++) {
        // The rise and fall eases in over the first second, so the first frame matches the still pose
        const height = spread * (gap * level + Math.sin(time * 0.9 + level * 1.15) * DRIFT * Math.min(1, time));
        scene.style.setProperty(`--layers-z${level}`, `${height.toFixed(2)}px`);
      }
      if (inView && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (frame || !inView || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      schedule();
    });
    observer.observe(stage);
    document.addEventListener("visibilitychange", schedule);

    // The stage is inert, so the pointer is read from the window: the nearer it is to the page, the closer the layers come
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      pointer = smooth(clamp((Math.hypot(x, y) - 0.35) / 0.55, 0, 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("pointermove", onMove);
    };
  }, [gap]);

  // The first paint is the separated pose; the loop then drives the same variables
  const pose = {
    "--layers-s": 1,
    "--layers-z1": `${gap}px`,
    "--layers-z2": `${gap * 2}px`,
    "--layers-z3": `${gap * 3}px`,
    "--layers-z4": `${gap * 4}px`,
    transformStyle: "preserve-3d",
    transform: `rotateX(${TILT}deg) rotateZ(${TURN}deg) translateZ(calc(var(--layers-s) * ${-gap * 2}px))`,
  } as CSSProperties;
  const lift = (level: number): CSSProperties => ({ transform: `translateZ(var(--layers-z${level}))`, transformStyle: "preserve-3d" });
  // A layer's shadow lies on the ground sheet: the higher the layer, the further it falls and the softer it gets
  const cast = (level: number): CSSProperties => ({
    transform: `translate3d(calc(var(--layers-z${level}) * 0.06), calc(var(--layers-z${level}) * 0.2), 1px)`,
    filter: `blur(${3 + level * 3}px)`,
    opacity: `calc(var(--layers-s) * ${(0.26 - level * 0.04).toFixed(2)})`,
  });
  const levels: Layer[] = ["photo", "text", "controls"];

  return (
    <div ref={stageRef} aria-hidden="true" className={cn("relative select-none", className)}>
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", width, scale)}>
        <div style={{ perspective: "2600px" }}>
          <div ref={sceneRef} style={pose} className="relative will-change-transform">
            {/* The shadow the whole card throws on the table */}
            <div style={{ transform: "translate3d(14px, 46px, -34px)", filter: "blur(30px)" }} className="absolute inset-3 rounded-3xl bg-black/25" />
            {/* Ground sheet, with a cut edge under it; the hidden layout inside gives the scene its size */}
            <div style={{ transform: "translateZ(-9px)", background: sheetEdge }} className="absolute inset-0 rounded-3xl" />
            <div style={{ transform: "translateZ(-6px)", background: sheetEdge }} className="absolute inset-0 rounded-3xl" />
            <div style={{ transform: "translateZ(-3px)", background: sheetEdge }} className="absolute inset-0 rounded-3xl" />
            <div className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
              {tint && <div style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${tint} 60%, transparent), transparent 52%)` }} className="absolute inset-0" />}
              {render("none", false)}
            </div>
            {levels.map((layer, index) => (
              <div key={`shade-${layer}`} style={cast(index + 1)} className="absolute inset-0">
                {render(layer, true)}
              </div>
            ))}
            {levels.map((layer, index) => (
              <div key={layer} style={lift(index + 1)} className="absolute inset-0 text-card-foreground">
                {render(layer, false)}
              </div>
            ))}
            {/* A pane of glass on top, gone once the card is whole */}
            <div
              style={{
                transform: "translateZ(var(--layers-z4))",
                opacity: "var(--layers-s)",
                background: "linear-gradient(125deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.05) 36%, rgb(255 255 255 / 0) 62%)",
              }}
              className="absolute inset-0 rounded-3xl border border-white/70 shadow-[0_0_0_1px_rgb(20_24_40/0.07)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** The class helpers a small scene paints with: each part names the layer it belongs to. */
function painter(layer: Layer, shade: boolean) {
  const hide = (own: Layer) => layer !== "all" && own !== layer && "invisible";
  return {
    shade,
    /** A filled shape: its own colors, or flat black as a shadow */
    fill: (own: Layer, shape: string, colors: string) => cn(shape, hide(own), shade ? "bg-black text-transparent" : colors),
    /** Type: its own color, or black as a shadow */
    ink: (own: Layer, shape: string, colors = "") => cn(shape, hide(own), shade ? "text-black" : colors),
  };
}

/** An agent installing a block over MCP: bubbles on the first layer, words on the second, ticks and the result on top. */
const renderAgent: Render = (layer, shade) => {
  const p = painter(layer, shade);
  const calls = ["search_blocks", "get_block", "install_block"];
  return (
    <div className="flex flex-col gap-3 p-5 text-left">
      <p className={p.ink("text", "text-base font-medium tracking-tight")}>Claude Code</p>
      <div className="relative">
        <div className={p.fill("photo", "absolute inset-0 rounded-2xl", "bg-muted")} />
        <p className={p.ink("text", "relative px-3.5 py-3 text-sm leading-snug")}>Add a pricing section with three plans.</p>
      </div>
      {calls.map((call) => (
        <div key={call} className="relative flex h-10 items-center gap-2.5 px-3">
          <div className={p.fill("photo", "absolute inset-0 rounded-xl", "bg-card ring-1 ring-foreground/10")} />
          <span className={p.fill("controls", "relative size-4 rounded-full", "bg-emerald-500")} />
          <span className={p.ink("text", "relative text-sm font-medium")}>{call}</span>
        </div>
      ))}
      <span className={p.fill("controls", "mt-1 inline-flex h-9 w-fit items-center rounded-full px-4 text-sm", "bg-primary text-primary-foreground")}>Installed pricing92</span>
    </div>
  );
};

/** A product card: the photo, then its name and price, then the swatches and the button. */
const renderProduct: Render = (layer, shade) => {
  const p = painter(layer, shade);
  return (
    <div className="flex flex-col p-5 text-left">
      <div className="relative h-40">
        {shade ? (
          <div className={p.fill("photo", "absolute inset-0 rounded-2xl", "")} />
        ) : (
          <img src="https://oud.pics/b/beste/object-bowls.webp" alt="" decoding="async" className={cn("absolute inset-0 size-full rounded-2xl object-cover ring-1 ring-black/5", layer !== "photo" && layer !== "all" && "invisible")} />
        )}
        <span className={p.fill("controls", "absolute top-3 left-3 inline-flex h-7 items-center rounded-full px-3 text-sm", "bg-card text-card-foreground shadow-md")}>New</span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className={p.ink("text", "text-lg font-medium tracking-tight")}>Stoneware bowls</p>
        <p className={p.ink("text", "text-lg font-medium")}>€36</p>
      </div>
      <p className={p.ink("text", "mt-1 text-sm", "text-muted-foreground")}>Set of two, glazed by hand</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex gap-1.5">
          {["bg-[#c4673f]", "bg-[#5d8468]", "bg-foreground"].map((color) => (
            <span key={color} className={p.fill("controls", "size-6 rounded-full", color)} />
          ))}
        </span>
        <span className={p.fill("controls", "inline-flex h-10 items-center rounded-full px-4.5 text-sm", "bg-primary text-primary-foreground")}>Add to cart</span>
      </div>
    </div>
  );
};

/** A plan card: the tinted list panel, then the plan and its lines, then the ticks and the button. */
const renderPlan: Render = (layer, shade) => {
  const p = painter(layer, shade);
  const lines = ["Unlimited projects", "Your own domain", "Priority support"];
  return (
    <div className="flex flex-col p-5 text-left">
      <div className="flex items-center justify-between gap-3">
        <p className={p.ink("text", "text-lg font-medium tracking-tight")}>Studio</p>
        <span className={p.fill("controls", "inline-flex h-7 items-center rounded-full px-3 text-sm", "bg-foreground text-background")}>Popular</span>
      </div>
      <p className={p.ink("text", "mt-3 text-5xl leading-none font-medium tracking-tighter")}>$29</p>
      <p className={p.ink("text", "mt-1.5 text-sm", "text-muted-foreground")}>a month, billed yearly</p>
      <div className="relative mt-4 flex flex-col gap-2.5 p-3.5">
        <div className={p.fill("photo", "absolute inset-0 rounded-2xl", "bg-muted")} />
        {lines.map((line) => (
          <div key={line} className="relative flex items-center gap-2.5">
            <span className={p.fill("controls", "size-4 shrink-0 rounded-full", "bg-foreground")} />
            <span className={p.ink("text", "text-sm")}>{line}</span>
          </div>
        ))}
      </div>
      <span className={p.fill("controls", "mt-4 inline-flex h-10 items-center justify-center rounded-full text-sm", "bg-primary text-primary-foreground")}>Start free trial</span>
    </div>
  );
};

/** A stats card: the bars, then the figure and its label, then the range switch and the change chip. */
const renderStats: Render = (layer, shade) => {
  const p = painter(layer, shade);
  const bars = [34, 52, 44, 68, 58, 82, 96];
  return (
    <div className="flex flex-col p-5 text-left">
      <div className="flex items-center justify-between gap-3">
        <p className={p.ink("text", "text-sm", "text-muted-foreground")}>Visitors</p>
        <span className={p.fill("controls", "inline-flex h-7 items-center rounded-full px-3 text-sm", "bg-muted text-foreground")}>30 days</span>
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <p className={p.ink("text", "text-4xl leading-none font-medium tracking-tighter")}>12,480</p>
        <span className={p.fill("controls", "inline-flex h-6 items-center rounded-full px-2 text-sm", "bg-emerald-500/15 text-emerald-700")}>+18%</span>
      </div>
      <div className="mt-5 flex h-32 items-end gap-2">
        {bars.map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} className={p.fill("photo", "flex-1 rounded-lg", index === bars.length - 1 ? "bg-primary" : "bg-foreground/15")} />
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        {["Mon", "Wed", "Fri", "Sun"].map((day) => (
          <span key={day} className={p.ink("text", "text-sm", "text-muted-foreground")}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

/** A review card: the portrait and the quote panel, the words, then the stars. */
const renderReview: Render = (layer, shade) => {
  const p = painter(layer, shade);
  return (
    <div className="flex flex-col p-5 text-left">
      <span className="flex gap-1">
        {[0, 1, 2, 3, 4].map((star) => (
          <Star key={star} className={p.ink("controls", "size-4.5 fill-current", "text-amber-400")} />
        ))}
      </span>
      <div className="relative mt-4">
        <div className={p.fill("photo", "absolute inset-0 rounded-2xl", "bg-muted")} />
        <p className={p.ink("text", "relative p-4 text-base leading-snug font-medium tracking-tight")}>We swapped our whole landing page in an afternoon, and it finally looks designed.</p>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <img src="https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=400&h=400&auto=format&fit=crop" alt="" decoding="async" className={cn("size-11 rounded-full object-cover", layer !== "photo" && layer !== "all" && "invisible")} />
        <span className="flex flex-col">
          <span className={p.ink("text", "text-sm leading-tight font-medium")}>Esperanza Spalding</span>
          <span className={p.ink("text", "text-sm leading-tight", "text-muted-foreground")}>Founder, Kiln</span>
        </span>
      </div>
    </div>
  );
};

/** A booking card: the day grid, its labels, then the chosen day, the times and the button. */
const renderBooking: Render = (layer, shade) => {
  const p = painter(layer, shade);
  const days = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  return (
    <div className="flex flex-col p-5 text-left">
      <div className="flex items-center justify-between gap-3">
        <p className={p.ink("text", "text-lg font-medium tracking-tight")}>Book a visit</p>
        <p className={p.ink("text", "text-sm", "text-muted-foreground")}>December</p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <span
            key={day}
            className={cn(
              "flex aspect-square items-center justify-center rounded-full text-sm",
              day === 12 ? p.fill("controls", "", "bg-primary text-primary-foreground") : p.fill("photo", "", day % 7 === 0 ? "bg-transparent text-muted-foreground/50" : "bg-muted text-foreground"),
            )}
          >
            {day}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-1.5">
        {["9:30", "11:00", "14:30"].map((time, index) => (
          <span key={time} className={p.fill("controls", "inline-flex h-9 flex-1 items-center justify-center rounded-full text-sm", index === 1 ? "bg-foreground text-background" : "bg-card text-card-foreground ring-1 ring-inset ring-border")}>
            {time}
          </span>
        ))}
      </div>
      <span className={p.fill("controls", "mt-4 inline-flex h-10 items-center justify-center rounded-full text-sm", "bg-primary text-primary-foreground")}>Confirm 11:00</span>
    </div>
  );
};

const SMALL_SCENES = {
  agent: { render: renderAgent, tint: "#f9dbc5" },
  product: { render: renderProduct, tint: "#e9dccb" },
  plan: { render: renderPlan, tint: "#d9dcf5" },
  stats: { render: renderStats, tint: "#cfe3e0" },
  review: { render: renderReview, tint: "#f6e3bd" },
  booking: { render: renderBooking, tint: "#dfe7d4" },
};

export type HomeHeroScene = keyof typeof SMALL_SCENES;
export const HOME_HERO_SCENES = Object.keys(SMALL_SCENES) as HomeHeroScene[];

/** The home hero's centerpiece: one page taken apart into its layers. */
export function HomeHeroLayers({ className }: { className?: string }) {
  return <LayerStack render={(layer, shade) => <Page page={PAGE} layer={layer} shade={shade} />} scale="scale-[0.56] min-[26rem]:scale-[0.66] sm:scale-[0.8] md:scale-[0.96] lg:scale-[1.06]" className={className} />;
}

/** A small card shown whole and flat, drawn smaller and quieter so the layered page keeps the eye. */
export function HomeHeroFlatCard({ scene, zoom = 0.72, className }: { scene: keyof typeof SMALL_SCENES; /** Drawn size, 1 being the card's own */ zoom?: number; className?: string }) {
  const { render, tint } = SMALL_SCENES[scene];
  return (
    // The same frosted rim the pieces wear, so drawn cards and pieces read as one family
    <div aria-hidden="true" style={{ zoom }} className={cn("w-75 shrink-0 rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md select-none", className)}>
      <div className="relative overflow-hidden rounded-2xl bg-card text-card-foreground">
        <div style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${tint} 60%, transparent), transparent 52%)` }} className="absolute inset-0" />
        <div className="relative">{render("all", false)}</div>
      </div>
    </div>
  );
}
