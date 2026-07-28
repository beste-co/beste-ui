"use client";

import { Cpu, HardDrive, MemoryStick, Network } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

type Resource = "cpu" | "memory" | "disk" | "network";

interface Monitoring2Props {
  resource?: Resource;
  value?: number;
  tone?: Tone;
  cpuLabel?: string;
  memoryLabel?: string;
  diskLabel?: string;
  networkLabel?: string;
  className?: string;
}

const resourceIcons: Record<Resource, typeof Cpu> = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
  network: Network,
};

const barClasses: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const textClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-700 dark:text-emerald-400",
  sky: "text-sky-700 dark:text-sky-400",
  violet: "text-violet-700 dark:text-violet-400",
  amber: "text-amber-700 dark:text-amber-400",
  rose: "text-rose-700 dark:text-rose-400",
};

export const monitoring2Demo: Monitoring2Props = {
  resource: "cpu",
  value: 72,
  tone: "emerald",
  cpuLabel: "CPU",
  memoryLabel: "Memory",
  diskLabel: "Disk",
  networkLabel: "Network",
};

export function Monitoring2({
  resource = "cpu",
  value = 0,
  tone = "emerald",
  cpuLabel = "CPU",
  memoryLabel = "Memory",
  diskLabel = "Disk",
  networkLabel = "Network",
  className,
}: Monitoring2Props) {
  const labels: Record<Resource, string> = {
    cpu: cpuLabel,
    memory: memoryLabel,
    disk: diskLabel,
    network: networkLabel,
  };
  const Icon = resourceIcons[resource];
  const safe = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-56 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-muted-foreground">
              {labels[resource]}
            </span>
          </div>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              textClasses[tone]
            )}
          >
            {safe}%
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <span
            className={cn(
              "block h-full rounded-full transition-all",
              barClasses[tone]
            )}
            style={{ width: `${safe}%` }}
          />
        </div>
      </div>
    </div>
  );
}
