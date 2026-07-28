"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Param {
  name: string;
  type: string;
  active?: boolean;
}

interface Editor17Props {
  fn?: string;
  params?: Param[];
  returnType?: string;
  description?: string;
  className?: string;
}

export const editor17Demo: Editor17Props = {
  fn: "greet",
  params: [
    { name: "name", type: "string", active: true },
    { name: "locale", type: "Locale" },
  ],
  returnType: "string",
  description: "Greet the user with a localized message.",
};

export function Editor17({
  fn = "fn",
  params = [],
  returnType,
  description,
  className,
}: Editor17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
          <span className="text-violet-600 dark:text-violet-400">{fn}</span>
          <span className="text-card-foreground">(</span>
          <span
            className="h-3.5 w-0.5 animate-pulse bg-foreground align-middle"
            aria-hidden="true"
          />
          <span className="text-card-foreground">)</span>
        </div>
        <div className="flex flex-col gap-1 overflow-hidden rounded-md border border-border bg-card px-3 py-2 shadow-md">
          <div className="break-words font-mono text-xs leading-relaxed">
            <span className="text-violet-600 dark:text-violet-400">{fn}</span>
            <span className="text-card-foreground">(</span>
            {params.map((p, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className="text-muted-foreground">, </span>
                )}
                <span
                  className={cn(
                    p.active
                      ? "font-semibold text-card-foreground underline decoration-primary decoration-2 underline-offset-4"
                      : "text-muted-foreground"
                  )}
                >
                  {p.name}
                </span>
                <span className="text-muted-foreground">: </span>
                <span className="text-sky-600 dark:text-sky-400">
                  {p.type}
                </span>
              </Fragment>
            ))}
            <span className="text-card-foreground">)</span>
            {returnType && (
              <>
                <span className="text-muted-foreground">: </span>
                <span className="text-sky-600 dark:text-sky-400">
                  {returnType}
                </span>
              </>
            )}
          </div>
          {description && (
            <span className="text-xs leading-snug text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
