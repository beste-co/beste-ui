"use client";

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
  bordered?: boolean;
  className?: string;
}

const stateConfig: Record<SignerState, { pill: string }> = {
  signed: {
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  waiting: {
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  sent: {
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
};

export const legal13Demo: Legal13Props = {
  signers: [
    {
      name: "Nils Frahm",
      role: "Counsel",
      initials: "NF",
      state: "signed",
      image:
        "https://images.unsplash.com/photo-1599503613556-0f18b122d281?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Hania Rani",
      role: "CEO",
      initials: "HR",
      state: "waiting",
      image:
        "https://images.unsplash.com/photo-1536759078151-61c8b6f156a8?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3JmdWwlMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Ólafur Arnalds",
      role: "Witness",
      initials: "ÓA",
      state: "sent",
    },
  ],
  bordered: false,
};

export function Legal13({
  title,
  signers = [],
  bordered = false,
  className,
}: Legal13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {title && (
          <span className="text-xs font-semibold text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {signers.map((s, idx) => {
            const config = stateConfig[s.state];
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
                    "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                    config.pill
                  )}
                >
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
