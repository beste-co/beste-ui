"use client";

import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education13Props {
  recipient?: string;
  courseName?: string;
  issuedOn?: string;
  credentialId?: string;
  issuer?: string;
  className?: string;
}

export const education13Demo: Education13Props = {
  recipient: "Beste Sözen",
  courseName: "Advanced React Performance",
  issuedOn: "Issued Apr 23, 2026",
  credentialId: "BSTE-CRT-4K91-ZN12",
  issuer: "Beste Academy",
};

export function Education13({
  recipient,
  courseName,
  issuedOn,
  credentialId,
  issuer,
  className,
}: Education13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative w-full max-w-80 overflow-hidden rounded-xl border-2 border-double border-amber-500/50 bg-gradient-to-br from-amber-50 via-card to-amber-50 p-4 shadow-xl dark:from-amber-950/30 dark:to-amber-950/10">
        <span
          className="pointer-events-none absolute inset-1 rounded-lg border border-amber-500/30"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
            <Award className="size-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            Certificate of completion
          </span>
          <span className="font-serif text-xl italic text-card-foreground">
            {recipient}
          </span>
          <span className="text-xs text-muted-foreground">
            has completed the course
          </span>
          <span className="text-sm font-semibold text-card-foreground">
            {courseName}
          </span>
          <div className="mt-1 flex w-full items-center justify-between border-t border-amber-500/20 pt-2 text-xs">
            <span className="text-muted-foreground">{issuedOn}</span>
            {issuer && <span className="font-semibold text-card-foreground">{issuer}</span>}
          </div>
          {credentialId && (
            <span className="font-mono text-xs text-muted-foreground">
              {credentialId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
