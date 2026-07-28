"use client";

import { cn } from "@/lib/utils";

interface Editor31Props {
  currentBranch?: string;
  incomingBranch?: string;
  currentCode?: string[];
  incomingCode?: string[];
  className?: string;
}

export const editor31Demo: Editor31Props = {
  currentBranch: "HEAD",
  incomingBranch: "feat/onboarding",
  currentCode: ["const greet = (name) =>", "  `Hi, ${name}!`;"],
  incomingCode: [
    "const greet = (name: string) =>",
    "  `Merhaba, ${name}!`;",
  ],
};

export function Editor31({
  currentBranch = "HEAD",
  incomingBranch = "branch",
  currentCode = [],
  incomingCode = [],
  className,
}: Editor31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card font-mono text-xs leading-relaxed shadow-sm">
        <div className="flex items-center justify-between bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <span className="font-bold">{"<<<<<<<"} Current</span>
          <span className="text-xs opacity-80">{currentBranch}</span>
        </div>
        {currentCode.map((l, i) => (
          <code
            key={`c-${i}`}
            className="bg-emerald-50 px-3 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
          >
            {l || "\u00A0"}
          </code>
        ))}
        <div className="bg-muted px-3 py-1 font-bold text-muted-foreground">
          =======
        </div>
        {incomingCode.map((l, i) => (
          <code
            key={`i-${i}`}
            className="bg-sky-50 px-3 text-sky-900 dark:bg-sky-950/50 dark:text-sky-100"
          >
            {l || "\u00A0"}
          </code>
        ))}
        <div className="flex items-center justify-between bg-sky-100 px-3 py-1 text-sky-800 dark:bg-sky-950 dark:text-sky-200">
          <span className="font-bold">{">>>>>>>"} Incoming</span>
          <span className="text-xs opacity-80">{incomingBranch}</span>
        </div>
      </pre>
    </div>
  );
}
