"use client";

import { cn } from "@/lib/utils";

interface Dashboard54Props {
  month?: string;
  /** The orange marked event that keeps slipping a week */
  event?: string;
  /** Seven single-letter weekday labels */
  weekdays?: string[];
  className?: string;
}

export const dashboard54Demo: Dashboard54Props = {
  month: "April",
  event: "Launch",
  weekdays: ["M", "T", "W", "T", "F", "S", "S"],
};

const XS = [60, 80, 100, 120, 140, 160, 180];
const YS = [92, 113, 134, 155, 176];

const STYLES = `
@keyframes dashboard54-slip { 0% { opacity: 0; transform: none } 6%, 16% { opacity: 1; transform: none } 24%, 36% { transform: translateY(21px) } 44%, 56% { transform: translateY(42px) } 64%, 86% { opacity: 1; transform: translateY(63px) } 94%, 100% { opacity: 0; transform: translateY(63px) } }
@keyframes dashboard54-g0 { 0%, 18% { opacity: 0 } 24%, 86% { opacity: 1 } 94%, 100% { opacity: 0 } }
@keyframes dashboard54-g1 { 0%, 38% { opacity: 0 } 44%, 86% { opacity: 1 } 94%, 100% { opacity: 0 } }
@keyframes dashboard54-g2 { 0%, 58% { opacity: 0 } 64%, 86% { opacity: 1 } 94%, 100% { opacity: 0 } }
.dashboard54-slip { animation: dashboard54-slip 13s cubic-bezier(.45,0,.25,1) infinite }
.dashboard54-g0 { opacity: 0; animation: dashboard54-g0 13s ease infinite }
.dashboard54-g1 { opacity: 0; animation: dashboard54-g1 13s ease infinite }
.dashboard54-g2 { opacity: 0; animation: dashboard54-g2 13s ease infinite }
@media (prefers-reduced-motion: reduce) {
  .dashboard54-slip, .dashboard54-g0, .dashboard54-g1, .dashboard54-g2 { animation: none }
  .dashboard54-slip { transform: translateY(63px) }
  .dashboard54-g0, .dashboard54-g1, .dashboard54-g2 { opacity: 1 }
}
`;

export function Dashboard54({ month, event, weekdays = [], className }: Dashboard54Props) {
  // A month that starts on a Wednesday, 30 days
  const days = Array.from({ length: 30 }, (_, index) => {
    const slot = index + 2;
    return { day: index + 1, x: XS[slot % 7] ?? 0, y: YS[Math.floor(slot / 7)] ?? 0, weekend: slot % 7 >= 5 };
  });
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 214" aria-hidden="true" className="w-full max-w-66 overflow-visible">
        <ellipse cx="120" cy="206" rx="84" ry="5" className="fill-foreground/5" />
        <rect x="44" y="26" width="152" height="172" rx="10" className="fill-card stroke-border" />
        <rect x="45" y="27" width="150" height="28" rx="9" className="fill-background" />
        <line x1="45" y1="55" x2="195" y2="55" className="stroke-border" />
        <rect x="79" y="17" width="7" height="17" rx="3.5" className="fill-card stroke-border" />
        <rect x="154" y="17" width="7" height="17" rx="3.5" className="fill-card stroke-border" />
        {month && (
          <text x="56" y="44" fontSize="8" className="fill-muted-foreground">
            {month}
          </text>
        )}
        {event && (
          <>
            <circle cx="150" cy="41.5" r="3" fill="none" className="stroke-chart-1" />
            <text x="157" y="44" fontSize="6.5" className="fill-muted-foreground">
              {event}
            </text>
          </>
        )}
        {weekdays.slice(0, 7).map((weekday, index) => (
          <text key={index} x={XS[index]} y="72" textAnchor="middle" fontSize="6.5" className="fill-muted-foreground/60">
            {weekday}
          </text>
        ))}
        {days.map(({ day, x, y, weekend }) => (
          <text key={day} x={x} y={y} textAnchor="middle" fontSize="7" className={weekend ? "fill-muted-foreground/50" : "fill-muted-foreground"}>
            {day}
          </text>
        ))}
        {[0, 1, 2].map((index) => (
          <circle key={index} cx="140" cy={89.5 + index * 21} r="8.5" fill="none" strokeDasharray="2 2" className={cn("stroke-muted-foreground/40", `dashboard54-g${index}`)} />
        ))}
        <g className="dashboard54-slip">
          <circle cx="140" cy="89.5" r="8.5" fill="none" className="stroke-chart-1" />
          <circle cx="140" cy="89.5" r="12" fill="none" className="stroke-chart-1/20" />
        </g>
      </svg>
    </div>
  );
}
