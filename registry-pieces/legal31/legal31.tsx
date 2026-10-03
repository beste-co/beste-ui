"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal31Props {
  documentTitle?: string;
  reference?: string;
  signerName?: string;
  signedAt?: string;
  drawMs?: number;
  bordered?: boolean;
  className?: string;
}

export const legal31Demo: Legal31Props = {
  documentTitle: "Master services agreement",
  signerName: "Nina Simone",
  signedAt: "Signed today at 09:41",
  bordered: false,
};

const SIGNATURE =
  "M6 46 C 18 12, 28 6, 32 24 C 36 40, 24 50, 28 42 C 34 28, 46 12, 54 32 C 60 46, 52 50, 56 42 C 64 24, 78 10, 86 30 C 90 40, 84 48, 90 44 C 102 36, 106 18, 120 22 C 132 26, 126 44, 138 40 C 150 36, 156 20, 170 24 C 178 26, 184 36, 194 30";
const LENGTH = 420;

export function Legal31({
  documentTitle = "Agreement",
  reference,
  signerName = "Signer",
  signedAt,
  drawMs = 1600,
  bordered = false,
  className,
}: Legal31Props) {
  const [drawn, setDrawn] = useState(false);
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setDrawn(true), 220);
    const end = setTimeout(() => setSealed(true), 220 + drawMs);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [drawMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes legal31-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-card-foreground">
              {documentTitle}
            </p>
            {reference && (
              <p className="text-xs text-muted-foreground">
                {reference}
              </p>
            )}
          </div>
          {sealed && (
            <span
              className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              style={{ animation: "legal31-in 400ms ease-out" }}
            >
              Signed
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-full rounded-full bg-muted" />
          <span className="h-1.5 w-11/12 rounded-full bg-muted" />
          <span className="h-1.5 w-3/5 rounded-full bg-muted" />
        </div>

        <div className="rounded-lg border border-dashed border-border p-2">
          <svg
            viewBox="0 0 200 60"
            className="h-14 w-full text-card-foreground"
            role="img"
            aria-label={`Signature of ${signerName}`}
          >
            <path
              d={SIGNATURE}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={LENGTH}
              strokeDashoffset={drawn ? 0 : LENGTH}
              style={{
                transition: `stroke-dashoffset ${drawMs}ms ease-out`,
              }}
            />
          </svg>
          <span className="mt-1 block h-px w-full bg-border" aria-hidden="true" />
        </div>

        <div className="flex items-baseline justify-between text-xs">
          <span className="font-medium text-card-foreground">{signerName}</span>
          {signedAt && (
            <span
              className="text-muted-foreground"
              style={sealed ? { animation: "legal31-in 500ms ease-out" } : undefined}
            >
              {sealed ? signedAt : "Awaiting signature"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
