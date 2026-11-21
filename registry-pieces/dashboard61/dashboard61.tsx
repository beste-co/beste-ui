"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/utils";

interface Dashboard61Props {
  title?: string;
  /** The date range pill */
  range?: string;
  total?: { label?: string; value?: string; change?: string };
  /** Daily visitors, oldest first */
  points?: number[];
  pagesTitle?: string;
  pages?: { path?: string; views?: string }[];
  sourcesTitle?: string;
  /** Traffic sources with their share from 0 to 100 */
  sources?: { name?: string; share?: number }[];
  /** Redraw the line on a loop */
  animated?: boolean;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard61Demo: Dashboard61Props = {
  title: "Visitors",
  range: "Last 30 days",
  total: { label: "Unique visitors", value: "12,480", change: "+18%" },
  points: [212, 240, 228, 265, 302, 288, 276, 310, 335, 318, 342, 360, 351, 388, 402, 380, 415, 440, 428, 455, 470, 462, 498, 512, 490, 530, 548, 536, 572, 590],
  pagesTitle: "Top pages",
  pages: [
    { path: "/", views: "5,210" },
    { path: "/menu", views: "3,846" },
    { path: "/visit", views: "1,902" },
  ],
  sourcesTitle: "Sources",
  sources: [
    { name: "Google", share: 54 },
    { name: "Instagram", share: 27 },
    { name: "Direct", share: 19 },
  ],
  animated: true,
  framed: true,
};

// The chart fades out, then wipes back in from the left; the end dot lands last
const STYLES = `
@keyframes dashboard61-chart { 0%, 5% { opacity: 1; clip-path: inset(-8px) } 8% { opacity: 0; clip-path: inset(-8px) } 8.1% { opacity: 0; clip-path: inset(-8px 100% -8px -8px) } 9% { opacity: 1; clip-path: inset(-8px 100% -8px -8px) } 40%, 100% { opacity: 1; clip-path: inset(-8px) } }
@keyframes dashboard61-dot { 0%, 5% { opacity: 1; scale: 1 } 8%, 39% { opacity: 0; scale: 0.4 } 44%, 100% { opacity: 1; scale: 1 } }
.dashboard61-chart { animation: dashboard61-chart 14s cubic-bezier(.65,0,.35,1) infinite }
.dashboard61-dot { animation: dashboard61-dot 14s ease infinite }
@media (prefers-reduced-motion: reduce) { .dashboard61-chart, .dashboard61-dot { animation: none } }
`;

const W = 320;
const H = 96;

// Scale the number inside a label, keeping its sign, unit and thousands commas
function scaleLabel(text: string, factor: number) {
  const match = text.match(/\d[\d,]*/);
  if (!match || /\d\.\d/.test(text)) return text;
  const value = Math.round(Number(match[0].replace(/,/g, "")) * factor);
  return text.replace(match[0], match[0].includes(",") ? value.toLocaleString("en-US") : String(value));
}

const shades = ["bg-foreground", "bg-foreground/45", "bg-foreground/20"];

// A smooth path through the points, scaled into the chart box
function chartPaths(points: number[]) {
  if (points.length < 2) return { line: "", area: "", end: 0 };
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const xy = points.map((value, index) => [(index / (points.length - 1)) * W, H - 6 - ((value - min) / span) * (H - 16)] as const);
  let line = `M${xy[0]![0].toFixed(1)},${xy[0]![1].toFixed(1)}`;
  for (let index = 1; index < xy.length; index++) {
    const [x0, y0] = xy[index - 1]!;
    const [x1, y1] = xy[index]!;
    const mid = (x0 + x1) / 2;
    line += ` C${mid.toFixed(1)},${y0.toFixed(1)} ${mid.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return { line, area: `${line} L${W},${H} L0,${H} Z`, end: xy[xy.length - 1]![1] };
}

export function Dashboard61({
  title,
  range,
  total,
  points = [],
  pagesTitle,
  pages = [],
  sourcesTitle,
  sources = [],
  animated = true,
  framed = true,
  fill = false,
  className,
}: Dashboard61Props) {
  const { line, area, end } = chartPaths(points);
  const gradientId = `dashboard61-fill-${useId().replace(/:/g, "")}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // The figures count the visitors under the part of the line drawn so far
  useEffect(() => {
    const root = rootRef.current;
    const chart = chartRef.current;
    if (!animated || !root || !chart || points.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sums = points.reduce<number[]>((list, value) => [...list, (list[list.length - 1] ?? 0) + value], []);
    const sum = sums[sums.length - 1] || 1;
    const labels = Array.from(root.querySelectorAll<HTMLElement>("[data-count]")).flatMap((element) => (element.firstChild ? [{ node: element.firstChild, text: element.textContent ?? "" }] : []));
    const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-share-bar]"));
    const shareLabels = Array.from(root.querySelectorAll<HTMLElement>("[data-share]"));
    const finals = sources.map((source) => Math.max(0, source.share ?? 0));
    const even = finals.reduce((all, value) => all + value, 0) / (finals.length || 1);
    let frame = 0;
    let visible = true;
    const tick = () => {
      frame = 0;
      const hidden = getComputedStyle(chart).clipPath.match(/([\d.]+)%/);
      const drawn = hidden ? 1 - Number(hidden[1]) / 100 : 1;
      const at = drawn * (points.length - 1);
      const index = Math.floor(at);
      const share = drawn >= 1 ? 1 : drawn <= 0 ? 0 : ((sums[index] ?? 0) + (at - index) * (points[index + 1] ?? 0)) / sum;
      for (const label of labels) {
        const next = scaleLabel(label.text, share);
        if (label.node.nodeValue !== next) label.node.nodeValue = next;
      }
      // Sources start as an even split and settle on their real shares
      finals.forEach((final, index) => {
        const value = even + (final - even) * drawn;
        const bar = bars[index];
        if (bar) bar.style.flexGrow = value.toFixed(2);
        const node = shareLabels[index]?.firstChild;
        const next = `${Math.round(value)}%`;
        if (node && node.nodeValue !== next) node.nodeValue = next;
      });
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      start();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", start);
    start();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      for (const label of labels) label.node.nodeValue = label.text;
      finals.forEach((final, index) => {
        const bar = bars[index];
        if (bar) bar.style.flexGrow = String(final);
        const node = shareLabels[index]?.firstChild;
        if (node) node.nodeValue = `${sources[index]?.share}%`;
      });
    };
  }, [animated, points, total?.value, total?.change, pages, sources]);
  return (
    <div ref={rootRef} className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {animated && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-xl",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div aria-hidden="true" className={cn("flex flex-col gap-5 rounded-2xl bg-card p-5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-start justify-between gap-3">
            {total ? (
              <div>
                <span className="text-muted-foreground">{total.label ?? title}</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-4xl leading-none font-medium tracking-tighter tabular-nums" data-count>{total.value}</span>
                  {total.change && (
                    <span className="flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-1 font-medium tabular-nums">
                      <ArrowUpRight className="size-3" />
                      <span data-count>{total.change}</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-sm font-medium">{title}</span>
            )}
            {range && <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">{range}</span>}
          </div>
          {line && (
            <div className="relative">
              <svg ref={chartRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={cn("block h-28 w-full overflow-visible text-foreground", animated && "dashboard61-chart")}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={area} fill={`url(#${gradientId})`} />
                <path d={line} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <span
                style={{ top: `${(end / H) * 100}%` }}
                className={cn("absolute right-0 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-4 ring-foreground/10", animated && "dashboard61-dot")}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {pages.length > 0 && (
              <div className="flex flex-col gap-2.5 rounded-xl bg-muted p-3.5">
                <span className="text-muted-foreground">{pagesTitle}</span>
                {pages.map((page, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <span className="truncate font-medium">{page.path}</span>
                    <span className="shrink-0 text-muted-foreground tabular-nums" data-count>{page.views}</span>
                  </div>
                ))}
              </div>
            )}
            {sources.length > 0 && (
              <div className="flex flex-col gap-2.5 rounded-xl bg-muted p-3.5">
                <span className="text-muted-foreground">{sourcesTitle}</span>
                {/* One bar split by share, each source a lighter step of the ink */}
                <span className="flex h-1.5 gap-0.5">
                  {sources.map((source, index) => (
                    <span key={index} data-share-bar style={{ flexGrow: Math.max(0, source.share ?? 0) }} className={cn("basis-0 rounded-full", shades[Math.min(index, shades.length - 1)])} />
                  ))}
                </span>
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={cn("size-2 shrink-0 rounded-sm", shades[Math.min(index, shades.length - 1)])} />
                    <span className="min-w-0 flex-1 truncate font-medium">{source.name}</span>
                    <span className="shrink-0 text-muted-foreground tabular-nums" data-share>{`${source.share}%`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
