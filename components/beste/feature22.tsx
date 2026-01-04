"use client";

import {
  Activity,
  Check,
  Circle,
  Loader2,
  Plug,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StepStatus = "done" | "in_progress" | "todo";

interface Step {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  eta?: string;
  status?: StepStatus;
  href?: string;
}

interface Stat {
  id: string;
  label: string;
  value: string;
  description?: string;
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
}

interface Feature22Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  progressLabel?: string;
  stepsCompletedLabel?: string;
  steps?: Step[];
  stats?: Stat[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature22Demo: Feature22Props = {
  badge: { label: "Setup", variant: "secondary" },
  heading: "Launch-ready in a single afternoon",
  description:
    "A pragmatic checklist that keeps your rollout predictable: configure essentials, validate data, and go live with confidence.",
  progressLabel: "Implementation progress",
  stepsCompletedLabel: "steps completed",
  steps: [
    {
      id: "step-1",
      icon: <Plug className="size-6 md:size-8" />,
      title: "Connect your data sources",
      description:
        "Authenticate and validate read permissions. We'll auto-detect schemas and suggest sane defaults.",
      eta: "5–10 min",
      status: "done",
      href: "https://beste.co",
    },
    {
      id: "step-2",
      icon: <ShieldCheck className="size-6 md:size-8" />,
      title: "Configure roles & access",
      description:
        "Define who can view, edit, and publish. Invite teammates and set approval rules.",
      eta: "10–15 min",
      status: "in_progress",
    },
    {
      id: "step-3",
      icon: <Wand2 className="size-6 md:size-8" />,
      title: "Apply templates & standards",
      description:
        "Start from curated templates and enforce consistent typography, spacing, and brand colors across pages.",
      eta: "15–25 min",
      status: "todo",
    },
    {
      id: "step-4",
      icon: <Activity className="size-6 md:size-8" />,
      title: "Enable monitoring",
      description:
        "Track uptime and core events. Set alerts for broken links, failed forms, and slow pages.",
      eta: "10 min",
      status: "todo",
      href: "https://beste.co",
    },
  ],
  stats: [
    {
      id: "stat-1",
      label: "Avg. time to first publish",
      value: "45 min",
      description: "From blank page to deployed site",
    },
    {
      id: "stat-2",
      label: "Guardrails included",
      value: "12 checks",
      description: "Preflight validation before publish",
    },
    {
      id: "stat-3",
      label: "Rollback window",
      value: "30 days",
      description: "One-click restore for changes",
    },
  ],
  buttons: [
    { id: "btn-1", label: "Start a guided setup", href: "https://beste.co" },
  ],
};

const StatusIcon = ({ status }: { status: StepStatus }) => {
  switch (status) {
    case "done":
      return <Check size={14} />;
    case "in_progress":
      return <Loader2 size={14} className="animate-spin" />;
    default:
      return <Circle size={14} />;
  }
};

const getStatusLabel = (status: StepStatus) => {
  switch (status) {
    case "done":
      return "Done";
    case "in_progress":
      return "In progress";
    default:
      return "Todo";
  }
};

export function Feature22({
  badge,
  heading,
  description,
  progressLabel = "Progress",
  stepsCompletedLabel = "steps completed",
  steps = [],
  stats = [],
  buttons = [],
  className,
}: Feature22Props) {
  const { doneCount, progressPercent } = useMemo(() => {
    const done = steps.filter((s) => s.status === "done").length;
    const total = steps.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { doneCount: done, progressPercent: percent };
  }, [steps]);

  if (steps.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            {(badge || heading || description) && (
              <div className="mb-10 flex flex-col gap-4">
                {badge && (
                  <Badge variant={badge.variant ?? "default"} className="w-fit">
                    {badge.label}
                  </Badge>
                )}

                {heading && (
                  <h2 className="text-3xl font-semibold md:text-5xl">
                    {heading}
                  </h2>
                )}

                {description && (
                  <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {steps.map((step) => {
                const status = step.status || "todo";
                const content = (
                  <div className="rounded-lg border bg-muted p-5 md:p-6 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">{step.icon}</div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold md:text-lg">
                              {step.title}
                            </h3>
                            {step.eta && (
                              <span className="text-xs text-muted-foreground">
                                {step.eta}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs text-muted-foreground">
                          <StatusIcon status={status} />
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </div>
                    {step.description && (
                      <div className="mt-2 text-sm md:text-base ml-9 md:ml-11 text-muted-foreground">
                        {step.description}
                      </div>
                    )}
                  </div>
                );

                if (step.href) {
                  return (
                    <Link
                      key={step.id}
                      href={step.href}
                      className="block hover:opacity-80"
                    >
                      {content}
                    </Link>
                  );
                }

                return <div key={step.id}>{content}</div>;
              })}
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 h-fit rounded-lg border bg-muted p-4 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{progressLabel}</p>
                <p className="text-xs text-muted-foreground">
                  {doneCount}/{steps.length} {stepsCompletedLabel}
                </p>
              </div>
              <div className="text-sm font-semibold">{progressPercent}%</div>
            </div>

            <div className="mt-3">
              <Progress value={progressPercent} />
            </div>

            {stats.length > 0 && (
              <div className="mt-6 space-y-3">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-background px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium">{stat.label}</p>
                      {stat.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {buttons.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                {buttons.map((button) => (
                  <Button
                    key={button.id}
                    variant={button.variant ?? "default"}
                    asChild
                    className="w-full"
                  >
                    <Link href={button.href ?? "#"}>{button.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
