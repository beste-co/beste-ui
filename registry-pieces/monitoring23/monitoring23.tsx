"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Server {
  name: string;
  region: string;
  cpu: number;
  memory: number;
}

interface Monitoring23Props {
  servers?: Server[];
  warnAt?: number;
  criticalAt?: number;
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

interface Reading {
  cpu: number;
  memory: number;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const monitoring23Demo: Monitoring23Props = {
  servers: [
    { name: "web-01", region: "fra1", cpu: 42, memory: 61 },
    { name: "web-02", region: "iad1", cpu: 67, memory: 58 },
    { name: "worker-01", region: "sfo1", cpu: 23, memory: 74 },
  ],
  warnAt: 70,
  criticalAt: 90,
  tone: "sky",
};

function walk(value: number, base: number): number {
  const drift = (Math.random() - 0.5) * 16;
  const pull = (base - value) * 0.15;
  const spike = Math.random() < 0.06 ? 22 : 0;
  return Math.max(3, Math.min(99, Math.round(value + drift + pull + spike)));
}

export function Monitoring23({
  servers = [],
  warnAt = 70,
  criticalAt = 90,
  intervalMs = 900,
  tone = "sky",
  className,
}: Monitoring23Props) {
  const [readings, setReadings] = useState<Reading[]>(() =>
    servers.map((s) => ({ cpu: s.cpu, memory: s.memory }))
  );

  const baseRef = useRef(servers);
  baseRef.current = servers;

  useEffect(() => {
    const id = setInterval(() => {
      setReadings((prev) =>
        prev.map((r, i) => {
          const base = baseRef.current[i];
          return {
            cpu: walk(r.cpu, base?.cpu ?? r.cpu),
            memory: walk(r.memory, base?.memory ?? r.memory),
          };
        })
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const barClass = (v: number) =>
    v >= criticalAt ? "bg-rose-500" : v >= warnAt ? "bg-amber-500" : barClasses[tone];

  const dotClass = (cpu: number, memory: number) => {
    const peak = Math.max(cpu, memory);
    return peak >= criticalAt ? "bg-rose-500" : peak >= warnAt ? "bg-amber-500" : "bg-emerald-500";
  };

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 divide-y divide-border rounded-xl border border-border bg-card shadow-sm">
        {servers.map((server, i) => {
          const reading = readings[i] ?? { cpu: server.cpu, memory: server.memory };
          const dot = dotClass(reading.cpu, reading.memory);
          return (
            <div key={server.name} className="flex flex-col gap-1.5 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-card-foreground">
                  <span className="relative flex size-1.5" aria-hidden="true">
                    <span
                      className={cn(
                        "absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
                        dot
                      )}
                    />
                    <span className={cn("relative inline-flex size-1.5 rounded-full", dot)} />
                  </span>
                  <span className="font-mono">{server.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{server.region}</span>
              </div>
              {(["cpu", "memory"] as const).map((key) => {
                const value = reading[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-xs uppercase text-muted-foreground">
                      {key === "cpu" ? "CPU" : "MEM"}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <span
                        className={cn(
                          "block h-full rounded-full transition-all duration-700 ease-in-out motion-reduce:transition-none",
                          barClass(value)
                        )}
                        style={{ width: `${value}%` }}
                      />
                    </span>
                    <span className="w-8 shrink-0 text-right text-xs tabular-nums text-card-foreground">
                      {value}%
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
