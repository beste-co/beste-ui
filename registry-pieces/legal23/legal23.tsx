"use client";

import { cn } from "@/lib/utils";

interface Citation {
  label: string;
  court?: string;
  holding?: string;
}

interface Legal23Props {
  title?: string;
  citations?: Citation[];
  bordered?: boolean;
  className?: string;
}

export const legal23Demo: Legal23Props = {
  citations: [
    {
      label: "Smith v. Beste Labs, 42 F.4th 318 (2d Cir. 2023)",
      holding: "Applied heightened standard to data-retention claims.",
    },
    {
      label: "In re Kestrel Sec. Litig., 2024 WL 118822",
      holding: "Denied motion to dismiss on reliance pleading.",
    },
  ],
  bordered: false,
};

export function Legal23({
  title,
  citations = [],
  bordered = false,
  className,
}: Legal23Props) {
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
        <div className="flex flex-col gap-2">
          {citations.map((c, idx) => (
            <div
              key={idx}
              className="rounded-md bg-muted p-2 text-sm"
            >
              <span className="block text-xs font-semibold text-card-foreground">
                {c.label}
              </span>
              {c.court && (
                <span className="block text-xs text-muted-foreground">
                  {c.court}
                </span>
              )}
              {c.holding && (
                <span className="mt-1 block text-sm italic text-card-foreground">
                  {c.holding}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
