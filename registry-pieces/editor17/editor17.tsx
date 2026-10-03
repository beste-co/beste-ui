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
  bordered?: boolean;
  className?: string;
}

export const editor17Demo: Editor17Props = {
  fn: "greet",
  params: [
    { name: "name", type: "string", active: true },
    { name: "locale", type: "Locale" },
  ],
  returnType: "string",
  bordered: false,
};

export function Editor17({
  fn = "fn",
  params = [],
  returnType,
  description,
  bordered = false,
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
        <div className={cn("rounded-md bg-card px-3 py-2 text-xs shadow-sm", bordered && "border border-border")}>
          <span className="text-violet-600 dark:text-violet-400">{fn}</span>
          <span className="text-card-foreground">(</span>
          <span
            className="h-3.5 w-0.5 animate-pulse bg-foreground align-middle"
            aria-hidden="true"
          />
          <span className="text-card-foreground">)</span>
        </div>
        <div className={cn("flex flex-col gap-1 overflow-hidden rounded-md bg-card px-3 py-2 shadow-md", bordered && "border border-border")}>
          <div className="break-words text-xs leading-relaxed">
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
