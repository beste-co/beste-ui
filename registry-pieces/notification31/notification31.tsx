"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Notification31Toast {
  title: string;
  description?: string;
  time?: string;
  /** A small picture in the tile, e.g. the client's logo; a tick when unset */
  image?: string;
}

interface Notification31Props {
  /** Newest first; up to three are shown */
  toasts?: Notification31Toast[];
  /** Frosted rim around the stack, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const notification31Demo: Notification31Props = {
  toasts: [
    { title: "Ownership accepted", description: "Oriel Skin Studio now owns oriel.studio", time: "now", image: "https://oud.pics/b/beste/oriel-studio.webp" },
    { title: "Commission started", description: "20% of their Pro, every year they stay", time: "now" },
    { title: "Content access kept", description: "You can still edit sections for them", time: "1m" },
  ],
  framed: true,
};

// All toasts show on the opening frame; they leave together and come back one by one
const STYLES = `
@keyframes notification31-in { 0%, 68% { opacity: 1; transform: translateY(0) scale(1) } 74%, 80% { opacity: 0; transform: translateY(-10px) scale(.97) } 86%, 100% { opacity: 1; transform: translateY(0) scale(1) } }
.notification31-toast { animation: notification31-in 12s cubic-bezier(.2,.8,.2,1) infinite both }
@media (prefers-reduced-motion: reduce) { .notification31-toast { animation: none } }
`;

export function Notification31({ toasts = [], framed = true, fill = false, className }: Notification31Props) {
  const shown = toasts.slice(0, 3);
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <ul className={cn("flex w-full flex-col gap-2", !fill && "max-w-76")} aria-hidden="true">
        {shown.map((toast, index) => (
          // Later toasts arrive a beat after the first
          <li key={index} className="notification31-toast" style={{ animationDelay: `${index * 0.35}s` }}>
            <div className={cn(framed && "rounded-[1.25rem] border border-card/70 bg-card/35 p-1 shadow-xl shadow-foreground/5 backdrop-blur-md")}>
              <div className={cn("flex items-center gap-3 rounded-2xl bg-card px-3 py-2.5 text-card-foreground", !framed && "border border-border shadow-lg")}>
                {toast.image ? (
                  <img src={toast.image} alt="" loading="lazy" decoding="async" className="size-8 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Check className="size-4" strokeWidth={2} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium tracking-tight">{toast.title}</span>
                    {toast.time && <span className="shrink-0 text-xs text-muted-foreground">{toast.time}</span>}
                  </span>
                  {toast.description && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{toast.description}</span>}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
