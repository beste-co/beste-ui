"use client";

import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal7Props {
  filename?: string;
  pages?: number;
  size?: string;
  sha?: string;
  className?: string;
}

export const legal7Demo: Legal7Props = {
  filename: "MSA-2026-0421-signed.pdf",
  pages: 18,
  size: "1.8 MB",
  sha: "sha256: 9f2c…4a81",
};

export function Legal7({
  filename,
  pages = 0,
  size,
  sha,
  className,
}: Legal7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="relative flex size-11 shrink-0 items-center justify-center rounded-md bg-rose-500/10 text-rose-500">
          <FileText className="size-5" aria-hidden="true" />
          <span className="absolute bottom-0 left-0 rounded-br-md rounded-tl-md bg-rose-500 px-1 font-mono text-xs font-bold text-white">
            PDF
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {filename && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {pages} pages · {size}
          </span>
          {sha && (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {sha}
            </span>
          )}
        </div>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background hover:opacity-90"
          aria-label="Download"
        >
          <Download className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
