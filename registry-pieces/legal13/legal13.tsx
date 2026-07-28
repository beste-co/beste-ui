"use client";

import { CheckCircle2, Clock3, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type SignerState = "signed" | "waiting" | "sent";

interface Signer {
  name: string;
  role: string;
  initials: string;
  state: SignerState;
  at?: string;
  image?: string;
}

interface Legal13Props {
  title?: string;
  signers?: Signer[];
  className?: string;
}

const stateConfig: Record<SignerState, { pill: string; icon: typeof Clock3 }> = {
  signed: {
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  waiting: {
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    icon: Clock3,
  },
  sent: {
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    icon: Mail,
  },
};

export const legal13Demo: Legal13Props = {
  title: "Signature workflow",
  signers: [
    {
      name: "Beste Sözen",
      role: "Counsel",
      initials: "BS",
      state: "signed",
      at: "Apr 23 · 09:12",
      image:
        "https://images.unsplash.com/photo-1599503613556-0f18b122d281?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Kian Okafor",
      role: "CEO · Kestrel",
      initials: "KO",
      state: "waiting",
      image:
        "https://images.unsplash.com/photo-1536759078151-61c8b6f156a8?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3JmdWwlMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Lina Park",
      role: "Witness",
      initials: "LP",
      state: "sent",
    },
  ],
};

export function Legal13({
  title,
  signers = [],
  className,
}: Legal13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {title && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {signers.map((s, idx) => {
            const config = stateConfig[s.state];
            const Icon = config.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 py-2"
              >
                <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.name}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    s.initials
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-card-foreground">
                    {s.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {s.role}
                    {s.at && ` · ${s.at}`}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                    config.pill
                  )}
                >
                  <Icon className="size-3" aria-hidden="true" />
                  {s.state}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
