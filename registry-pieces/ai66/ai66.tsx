"use client";

import { cn } from "@/lib/utils";

interface Ai66Props {
  /** Earlier requests, fading the older they are */
  history?: string[];
  /** Prompts that take turns in the input */
  prompts?: string[];
  /** A picture at the start of the input, e.g. the assistant */
  image?: string;
  className?: string;
}

const SLOT_SECONDS = 4;

// Each prompt owns a 4s slot of the cycle, so the cycle grows with the count
function styles(count: number) {
  const slot = 100 / Math.max(1, count);
  const pct = (value: number) => `${Math.round(value * 100) / 100}%`;
  const cycle =
    count > 1
      ? `@keyframes ai66-cycle { 0% { opacity: 0; transform: translateY(8px) } ${pct(slot * 0.12)}, ${pct(slot * 0.87)} { opacity: 1; transform: none } ${pct(slot)}, 100% { opacity: 0; transform: translateY(-8px) } }
.ai66-prompt { opacity: 0; animation: ai66-cycle ${count * SLOT_SECONDS}s ease infinite }`
      : ".ai66-prompt { opacity: 1 }";
  return `
${cycle}
@keyframes ai66-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.ai66-caret { animation: ai66-blink 1.1s step-end infinite }
@media (prefers-reduced-motion: reduce) {
  .ai66-prompt, .ai66-caret { animation: none }
  .ai66-prompt:first-child { opacity: 1 }
}
`;
}

const HISTORY_FADE = ["opacity-40", "opacity-70"];

export const ai66Demo: Ai66Props = {
  history: ["Shorten the hero", "Add a contact form"],
  prompts: ["Add a pricing section", "Make this headline sharper", "Make a Spanish version of this page"],
  image: "https://oud.pics/b/beste/bestie-jelly.webp",
};

export function Ai66({ history = [], prompts = [], image, className }: Ai66Props) {
  const shown = prompts.slice(0, 3);
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{styles(shown.length)}</style>
      <div className="flex w-full max-w-100 flex-col gap-2.5 text-foreground">
        {history.slice(-2).map((item, index, list) => (
          <p key={index} className={cn("self-end rounded-2xl rounded-br-sm bg-card px-3.5 py-2.5 text-sm", HISTORY_FADE[index + 2 - list.length])}>
            {item}
          </p>
        ))}
        <div className="mt-3.5 flex h-15 items-center gap-3 rounded-full bg-card pr-5.5 pl-3.5 text-base shadow-lg">
          {image && <img src={image} alt="" aria-hidden="true" className="size-7 object-contain" />}
          <span className="relative grid h-6 flex-1 overflow-hidden">
            {shown.map((prompt, index) => (
              <span key={index} className="ai66-prompt col-start-1 row-start-1 truncate" style={{ animationDelay: `${-((shown.length - index) % shown.length) * SLOT_SECONDS}s` }}>
                {prompt}
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="ai66-caret h-5 w-0.5 bg-chart-1" />
        </div>
      </div>
    </div>
  );
}
