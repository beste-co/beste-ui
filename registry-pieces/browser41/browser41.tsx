"use client";

import type { LucideIcon } from "lucide-react";
import { Battery, ChartColumn, ChevronLeft, ChevronRight, House, Lock, Sun, UtilityPole, Zap } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AppNavItem {
  label: string;
  icon: LucideIcon;
}

interface FlowNode {
  value: string;
  label: string;
}

interface UpNextItem {
  title: string;
  time: string;
  icon: LucideIcon;
}

interface Browser41Props {
  url: string;
  brand: string;
  nav: AppNavItem[];
  devicesLabel: string;
  devices: string[];
  greeting: string;
  subtitle: string;
  period: string;
  initials: string;
  flow: {
    label: string;
    status: string;
    source: FlowNode;
    home: FlowNode;
    battery: FlowNode;
    grid: FlowNode;
  };
  savings: { label: string; value: string; change: string; bars: number[] };
  forecast: { label: string; total: string; bars: number[] };
  upNext: { label: string; items: UpNextItem[] };
  /** Stretch to the slot it sits in (a hero crop) instead of a scaled-down window */
  fill?: boolean;
  className?: string;
}

export const browser41Demo: Browser41Props = {
  url: "app.sunleaf.io/home",
  brand: "sunleaf",
  nav: [
    { label: "Home", icon: House },
    { label: "Solar", icon: Sun },
    { label: "Battery", icon: Battery },
    { label: "EV charging", icon: Zap },
    { label: "Reports", icon: ChartColumn },
  ],
  devicesLabel: "Devices",
  devices: ["Inverter", "Battery", "Wallbox"],
  greeting: "Good afternoon, Nils",
  subtitle: "Sunny, 24°C · Peak rate starts at 18:00",
  period: "Today",
  initials: "NF",
  flow: {
    label: "Energy flow",
    status: "Live",
    source: { value: "4.8 kW", label: "Solar" },
    home: { value: "2.6 kW", label: "Home" },
    battery: { value: "82%", label: "Battery" },
    grid: { value: "−1.1 kW", label: "Grid" },
  },
  savings: { label: "Saved this month", value: "$86.40", change: "+$12.10 vs last month", bars: [40, 55, 48, 70, 62, 86, 100] },
  forecast: { label: "Solar forecast · Tomorrow", total: "28.4 kWh expected", bars: [8, 18, 32, 50, 70, 88, 100, 94, 76, 54, 30, 12] },
  upNext: {
    label: "Up next",
    items: [
      { title: "Hold battery for peak", time: "18:00", icon: Battery },
      { title: "Charge car to 90%", time: "01:00", icon: Zap },
    ],
  },
};

// Taller bars read darker, so the peak of the day carries the deepest green
function barTone(value: number) {
  if (value <= 20) return "bg-chart-5";
  if (value <= 35) return "bg-chart-4";
  if (value <= 55) return "bg-chart-3";
  if (value < 100) return "bg-chart-2";
  return "bg-chart-1";
}

function FlowArrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 8" className={cn("h-2 max-w-16 flex-1", className)}>
      <path d="M0 4h36M31 0l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
    </svg>
  );
}

/* Outside a block the window is drawn at a fixed size and scaled down to its slot, so its layout never squeezes. */
function useFitScale(active: boolean) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!active || !o || !i) return;
    const update = () => {
      const cs = getComputedStyle(o);
      const w = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      setScale(Math.min(1, w / i.offsetWidth, h > 0 ? h / i.offsetHeight : 1));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(o);
    return () => observer.disconnect();
  }, [active]);

  return { outer, inner, scale };
}

export function Browser41({ fill = false, className, ...app }: Browser41Props) {
  const { outer, inner, scale } = useFitScale(!fill);
  const frame = <AppWindow {...app} className={fill ? "h-full min-h-130 w-full border-primary-foreground/50" : "h-160 w-5xl"} />;

  if (fill) return <div className={cn("relative size-full", className)}>{frame}</div>;

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div ref={inner} style={{ scale: String(scale) }} className="shrink-0">
        {frame}
      </div>
    </div>
  );
}

function AppWindow({ className, ...app }: Omit<Browser41Props, "fill">) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl", className)}>
      <div className="flex h-12 shrink-0 items-center gap-4 border-b border-border bg-muted px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-green-500" />
        </div>
        <div className="hidden gap-2.5 text-muted-foreground md:flex">
          <ChevronLeft className="size-4" />
          <ChevronRight className="size-4" />
        </div>
        <div className="mx-auto flex h-8 max-w-md flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-card text-sm text-muted-foreground">
          <Lock className="size-3" />
          {app.url}
        </div>
        <div className="hidden w-12 md:block" />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-52 shrink-0 flex-col gap-1 border-r border-border px-3.5 py-5 text-sm text-muted-foreground md:flex">
          <div className="flex items-center gap-2 px-2 pb-4">
            <svg viewBox="0 0 32 32" aria-hidden="true" className="size-6">
              <rect width="32" height="32" rx="10" className="fill-primary" />
              <path d="M9 21c0-7 5-12 14-12 0 9-5 14-12 14" className="fill-secondary" />
            </svg>
            <span className="font-serif text-base font-medium text-foreground">{app.brand}</span>
          </div>
          {app.nav.map((item, index) => (
            <div key={index} className={cn("flex items-center gap-2.5 rounded-md px-2.5 py-2", index === 0 && "bg-primary font-semibold text-primary-foreground")}>
              <item.icon className="size-4" />
              {item.label}
            </div>
          ))}
          <div className="px-2.5 pt-4 pb-1.5 font-semibold">{app.devicesLabel}</div>
          {app.devices.map((device, index) => (
            <div key={index} className="flex items-center justify-between px-2.5 py-1.5">
              {device}
              <span className="size-2 rounded-full bg-chart-3" />
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 bg-muted p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold tracking-tight">{app.greeting}</div>
              <div className="mt-0.5 text-sm text-muted-foreground">{app.subtitle}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold md:block">{app.period}</div>
              <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{app.initials}</div>
            </div>
          </div>

          <div className="grid gap-3.5 md:grid-cols-5">
            <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 text-primary-foreground md:col-span-3">
              <div className="flex items-center justify-between text-sm">
                <div className="text-primary-foreground/75">{app.flow.label}</div>
                <div className="flex items-center gap-1.5 font-semibold text-secondary">
                  <span className="size-1.5 rounded-full bg-secondary" />
                  {app.flow.status}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Sun className="size-5" />
                  </span>
                  <div className="text-sm font-bold">{app.flow.source.value}</div>
                  <div className="text-sm text-primary-foreground/70">{app.flow.source.label}</div>
                </div>
                <FlowArrow className="text-secondary" />
                <div className="flex flex-col items-center gap-1.5">
                  <span className="flex size-13 items-center justify-center rounded-full bg-card text-chart-2">
                    <House className="size-6" />
                  </span>
                  <div className="text-sm font-bold">{app.flow.home.value}</div>
                  <div className="text-sm text-primary-foreground/70">{app.flow.home.label}</div>
                </div>
                <FlowArrow className="text-primary-foreground/50" />
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2.5 py-1.5">
                    <Battery className="size-3.5 text-secondary" />
                    {app.flow.battery.label} <b>{app.flow.battery.value}</b>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2.5 py-1.5">
                    <UtilityPole className="size-3.5" />
                    {app.flow.grid.label} <b>{app.flow.grid.value}</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 md:col-span-2">
              <div>
                <div className="text-sm text-muted-foreground">{app.savings.label}</div>
                <div className="mt-0.5 font-serif text-3xl font-medium tracking-tight">{app.savings.value}</div>
                <div className="mt-0.5 text-sm font-semibold text-chart-2">{app.savings.change}</div>
              </div>
              <div className="flex h-12 items-end gap-1">
                {app.savings.bars.map((value, index) => (
                  <span
                    key={index}
                    style={{ height: `${value}%` }}
                    className={cn(
                      "flex-1 rounded-xs",
                      index === app.savings.bars.length - 1 ? "bg-chart-2" : index === app.savings.bars.length - 2 ? "bg-chart-4" : "bg-accent",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3.5 md:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-4 md:col-span-3">
              <div className="mb-3.5 flex items-center justify-between text-sm">
                <div className="font-semibold">{app.forecast.label}</div>
                <div className="font-semibold text-chart-2">{app.forecast.total}</div>
              </div>
              <div className="flex h-24 items-end gap-1">
                {app.forecast.bars.map((value, index) => (
                  <span key={index} style={{ height: `${value}%` }} className={cn("flex-1 rounded-xs", barTone(value))} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 md:col-span-2">
              <div className="text-sm font-semibold">{app.upNext.label}</div>
              {app.upNext.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm">
                  <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <item.icon className="size-3.5" />
                  </span>
                  <div className="flex-1">{item.title}</div>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
