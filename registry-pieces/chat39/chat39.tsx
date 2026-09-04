"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Presence = "online" | "call" | "away" | "typing" | "offline";

interface Member {
  name: string;
  initials: string;
  status: Presence;
}

interface Change {
  member: number;
  status: Presence;
}

interface Chat39Props {
  title?: string;
  members?: Member[];
  changes?: Change[];
  intervalMs?: number;
  className?: string;
}

const dotClasses: Record<Presence, string> = {
  online: "bg-emerald-500",
  call: "bg-sky-500",
  away: "bg-amber-500",
  typing: "bg-emerald-500",
  offline: "bg-muted-foreground/40",
};

const labels: Record<Presence, string> = {
  online: "Online",
  call: "In a call",
  away: "Away",
  typing: "Typing",
  offline: "Offline",
};

export const chat39Demo: Chat39Props = {
  title: "Studio team",
  members: [
    { name: "Nina Simone", initials: "NS", status: "online" },
    { name: "Miles Davis", initials: "MD", status: "call" },
    { name: "Björk", initials: "BJ", status: "away" },
    { name: "Patti Smith", initials: "PS", status: "online" },
    { name: "Fela Kuti", initials: "FK", status: "offline" },
  ],
  changes: [
    { member: 3, status: "typing" },
    { member: 2, status: "online" },
    { member: 3, status: "online" },
    { member: 4, status: "online" },
    { member: 1, status: "online" },
    { member: 0, status: "away" },
    { member: 4, status: "call" },
    { member: 2, status: "typing" },
    { member: 2, status: "away" },
    { member: 0, status: "online" },
    { member: 4, status: "offline" },
    { member: 1, status: "call" },
  ],
};

export function Chat39({
  title = "Team",
  members = [],
  changes = [],
  intervalMs = 1500,
  className,
}: Chat39Props) {
  const [state, setState] = useState<{ tick: number; statuses: Presence[] }>(() => ({
    tick: 0,
    statuses: members.map((m) => m.status),
  }));

  useEffect(() => {
    if (!changes.length) return;
    const id = setInterval(() => {
      setState((prev) => {
        const change = changes[prev.tick % changes.length];
        return {
          tick: prev.tick + 1,
          statuses: prev.statuses.map((s, i) =>
            i === change.member ? change.status : s
          ),
        };
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [changes, intervalMs]);

  const { tick, statuses } = state;
  const online = statuses.filter((s) => s !== "offline" && s !== "away").length;
  const changed = tick > 0 ? changes[(tick - 1) % changes.length]?.member : -1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes chat39-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } } @keyframes chat39-flash { from { background-color: var(--muted); } to { background-color: transparent; } }`}</style>
      <div className="flex w-full max-w-64 flex-col rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium text-card-foreground">{title}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span
              key={online}
              className="inline-block tabular-nums"
              style={{ animation: "chat39-in 300ms ease-out" }}
            >
              {online} online
            </span>
          </span>
        </div>
        <ul className="flex flex-col">
          {members.map((m, i) => {
            const status = statuses[i] ?? m.status;
            return (
              <li
                key={m.name}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                style={changed === i ? { animation: "chat39-flash 900ms ease-out" } : undefined}
              >
                <span className="relative shrink-0" aria-hidden="true">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold transition-opacity duration-500",
                      status === "offline" ? "text-muted-foreground opacity-60" : "text-card-foreground"
                    )}
                  >
                    {m.initials}
                  </span>
                  <span
                    className={cn(
                      "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-card transition-colors duration-500 motion-reduce:transition-none",
                      dotClasses[status]
                    )}
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm text-card-foreground">{m.name}</span>
                  <span className="flex h-4 items-center text-xs text-muted-foreground">
                    <span
                      key={status}
                      className="inline-flex items-center gap-1"
                      style={{ animation: "chat39-in 300ms ease-out" }}
                    >
                      {labels[status]}
                      {status === "typing" && (
                        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="size-1 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                              style={{ animationDelay: `${d * 150}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
