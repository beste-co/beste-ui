"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "success" | "info" | "warning";
type Phase = "enter" | "shown" | "leave";

interface Toast {
  title: string;
  body?: string;
  kind?: Kind;
}

interface Notification22Props {
  toasts?: Toast[];
  intervalMs?: number;
  maxVisible?: number;
  className?: string;
}

interface Entry {
  id: number;
  toast: Toast;
  phase: Phase;
}

const icons: Record<Kind, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

const iconClasses: Record<Kind, string> = {
  success: "text-emerald-500",
  info: "text-sky-500",
  warning: "text-amber-500",
};

// Reserve room for the whole stack so the oldest toast is never clipped at the top.
const stackHeights: Record<number, string> = {
  1: "h-24",
  2: "h-40",
  3: "h-56",
  4: "h-72",
};

export const notification22Demo: Notification22Props = {
  toasts: [
    { kind: "success", title: "Changes saved", body: "Your profile is up to date." },
    { kind: "info", title: "New comment", body: "Nina Simone replied to your note." },
    { kind: "warning", title: "Storage almost full", body: "92% of 50 GB used." },
    { kind: "success", title: "Invite sent", body: "Miles Davis will get an email." },
    { kind: "info", title: "Export ready", body: "Q3 report is available to download." },
  ],
};

export function Notification22({
  toasts = [],
  intervalMs = 1500,
  maxVisible = 3,
  className,
}: Notification22Props) {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const first = toasts[0];
    return first ? [{ id: 0, toast: first, phase: "shown" }] : [];
  });
  const listRef = useRef<Entry[]>(entries);
  const nextIdRef = useRef(1);

  useEffect(() => {
    if (toasts.length <= 1) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };
    const commit = () => setEntries([...listRef.current]);

    const push = () => {
      const id = nextIdRef.current++;
      const toast = toasts[id % toasts.length];
      if (!toast) return;
      const live = listRef.current.filter((e) => e.phase !== "leave");
      const oldest = live.length >= maxVisible ? live[0] : undefined;
      if (oldest) {
        const oldestId = oldest.id;
        listRef.current = listRef.current.map((e) =>
          e.id === oldestId ? { ...e, phase: "leave" as const } : e
        );
        later(() => {
          listRef.current = listRef.current.filter((e) => e.id !== oldestId);
          commit();
        }, 520);
      }
      listRef.current = [
        ...listRef.current,
        { id, toast, phase: "enter" },
      ];
      commit();
      later(() => {
        listRef.current = listRef.current.map((e) =>
          e.id === id ? { ...e, phase: "shown" as const } : e
        );
        commit();
      }, 60);
    };

    const iv = setInterval(push, intervalMs);
    return () => {
      clearInterval(iv);
      timers.forEach(clearTimeout);
    };
  }, [toasts, intervalMs, maxVisible]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 flex-col justify-end overflow-hidden",
          stackHeights[maxVisible] ?? "h-56"
        )}
      >
        {entries.map((entry) => {
          const kind = entry.toast.kind ?? "info";
          const Icon = icons[kind];
          const shown = entry.phase === "shown";
          return (
            <div
              key={entry.id}
              className="grid transition-all duration-500 ease-in-out motion-reduce:transition-none"
              style={{ gridTemplateRows: shown ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden px-1">
                <div
                  className={cn(
                    "mb-2 flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 shadow-md transition-all duration-500 ease-out motion-reduce:transition-none",
                    shown ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                  )}
                >
                  <Icon
                    className={cn("mt-0.5 size-4 shrink-0", iconClasses[kind])}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {entry.toast.title}
                    </p>
                    {entry.toast.body && (
                      <p className="truncate text-xs text-muted-foreground">
                        {entry.toast.body}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss"
                    className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-card-foreground"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
