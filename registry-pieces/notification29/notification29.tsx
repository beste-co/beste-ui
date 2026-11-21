"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification29Props {
  /** The studio that sends the emails */
  sender?: { name: string; image?: string; initial?: string; email?: string };
  /** Subject lines that take turns, e.g. the invite and the password reset */
  subjects?: string[];
  /** The address in the email, after a lock */
  address?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const notification29Demo: Notification29Props = {
  sender: { name: "Halden Studio", image: "https://oud.pics/b/gradients/gradient-silk-orange.webp" },
  subjects: ["You have been invited to edit", "Reset your password"],
  address: "edit.haldenstudio.com",
  framed: true,
};

const STYLES = `
@keyframes notification29-subject { 0% { opacity: 0; transform: translateY(0.5rem); } 5%, 45% { opacity: 1; transform: none; } 50%, 100% { opacity: 0; transform: translateY(-0.5rem); } }
.notification29-subject { opacity: 0; animation: notification29-subject 10s ease infinite; }
@media (prefers-reduced-motion: reduce) { .notification29-subject { animation: none; } .notification29-subject:first-child { opacity: 1; } }
`;

export function Notification29({ sender, subjects = [], address, framed = true, fill = false, className }: Notification29Props) {
  const cycle = subjects.slice(0, 2);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3.5 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {sender && (
            <div className="flex items-center gap-2.5">
              {sender.image ? (
                <img src={sender.image} alt="" className="size-7.5 shrink-0 rounded-full object-cover" />
              ) : sender.initial && (
                <span aria-hidden="true" className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-emerald-900 font-semibold text-emerald-50">
                  {sender.initial}
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-px">
                <span className="truncate text-sm font-semibold">{sender.name}</span>
                {sender.email && <span className="truncate text-muted-foreground">{sender.email}</span>}
              </span>
            </div>
          )}
          {cycle.length > 0 && (
            <div className="grid border-t border-border pt-3.5">
              {cycle.map((subject, index) => (
                <span
                  key={index}
                  className={cn("col-start-1 row-start-1 truncate text-base font-medium tracking-tight", cycle.length > 1 && "notification29-subject")}
                  // The two subjects share one loop, half a cycle apart
                  style={cycle.length > 1 ? { animationDelay: `${-index * 5}s` } : undefined}
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
          {address && (
            <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-2 text-foreground/75">
              <Lock aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
