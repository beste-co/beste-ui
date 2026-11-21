"use client";

import { cn } from "@/lib/utils";

interface Editor68Props {
  label?: string;
  /** The value before the edit, shown struck through. Leave empty for a plain value */
  before?: string;
  after?: string;
  /** Loop from the old value alone to the struck old value plus the new one */
  animate?: boolean;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor68Demo: Editor68Props = {
  label: "Skin workshop",
  before: "12 May",
  after: "9 June",
  animate: true,
  framed: true,
};

const STYLES = `
@keyframes editor68-old { 0%, 40% { opacity: 1; } 45%, 90% { opacity: 0; } 95%, 100% { opacity: 1; } }
@keyframes editor68-new { 0%, 46% { opacity: 0; transform: translateY(4px); } 51%, 85% { opacity: 1; transform: none; } 90%, 100% { opacity: 0; transform: translateY(4px); } }
.editor68-old { animation: editor68-old 10s ease infinite; }
.editor68-new { opacity: 0; animation: editor68-new 10s ease infinite; }
@media (prefers-reduced-motion: reduce) {
  .editor68-old, .editor68-new { animation: none; }
  .editor68-old { opacity: 0; }
  .editor68-new { opacity: 1; }
}
`;

export function Editor68({ label, before, after, animate = false, framed = true, fill = false, className }: Editor68Props) {
  const looping = animate && Boolean(before);
  const edited = (
    <>
      {before && <s className="text-muted-foreground">{before}</s>}
      <span className="truncate">{after}</span>
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {looping && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-sm",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex h-28 items-center justify-center rounded-2xl bg-card px-5 text-card-foreground", !framed && "border border-border")}>
          <div className="flex w-full max-w-60 flex-col gap-1.5 text-xs">
            {label && <span className="text-muted-foreground">{label}</span>}
            {looping ? (
              <span className="relative block h-9 rounded-lg border border-border bg-background text-sm">
                <span className="editor68-old absolute inset-y-0 left-2.5 flex items-center">{before}</span>
                <span className="editor68-new absolute inset-y-0 right-2.5 left-2.5 flex items-center gap-2">{edited}</span>
              </span>
            ) : (
              <span className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-sm">
                {edited}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
