"use client";

import { cn } from "@/lib/utils";

interface Editor103Props {
  /** Up to four manuals, bottom first; all but the first drop onto the stack in turn */
  books?: string[];
  /** An orange ribbon hanging from the top manual */
  bookmark?: boolean;
  className?: string;
}

export const editor103Demo: Editor103Props = {
  books: ["Classes", "Breakpoints", "Interactions", "Components"],
  bookmark: true,
};

const STYLES = `
@keyframes editor103-d1 { 0%, 4% { opacity: 0; transform: translateY(-20px) } 12%, 84% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
@keyframes editor103-d2 { 0%, 20% { opacity: 0; transform: translateY(-20px) } 28%, 84% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
@keyframes editor103-d3 { 0%, 36% { opacity: 0; transform: translateY(-20px) } 44%, 84% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
.editor103-d1 { animation: editor103-d1 13s cubic-bezier(.45,0,.25,1) infinite }
.editor103-d2 { animation: editor103-d2 13s cubic-bezier(.45,0,.25,1) infinite }
.editor103-d3 { animation: editor103-d3 13s cubic-bezier(.45,0,.25,1) infinite }
@media (prefers-reduced-motion: reduce) { .editor103-d1, .editor103-d2, .editor103-d3 { animation: none } }
`;

// Left edge, width and tilt of each manual, bottom first
const PLACES = [
  { x: 42, w: 160, r: 0 },
  { x: 52, w: 146, r: -1.5 },
  { x: 38, w: 156, r: 1 },
  { x: 56, w: 140, r: -1 },
];

export function Editor103({ books = [], bookmark = true, className }: Editor103Props) {
  const stack = books.slice(0, PLACES.length);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 60 240 132" className="h-auto w-full max-w-68 overflow-visible" aria-hidden="true">
        <ellipse cx="122" cy="184" rx="88" ry="4.5" className="fill-foreground/5" />
        {stack.map((book, index) => {
          const place = PLACES[index] ?? { x: 0, w: 0, r: 0 };
          const y = 158 - index * 24;
          const right = place.x + place.w;
          const top = index === stack.length - 1;
          return (
            <g key={index} className={cn(index > 0 && `editor103-d${index}`)}>
              <g transform={`rotate(${place.r} ${place.x + place.w / 2} ${y + 11})`}>
                <rect x={place.x} y={y} width={place.w} height="22" rx="3" className="fill-card stroke-muted-foreground/40" />
                <line x1={place.x + 14} y1={y} x2={place.x + 14} y2={y + 22} className="stroke-muted-foreground/40" />
                {[4, 11, 18].map((offset) => (
                  <line key={offset} x1={right - 12} y1={y + offset} x2={right - 2} y2={y + offset} className="stroke-border" />
                ))}
                <text x={place.x + 24} y={y + 14} fontSize="8.5" className="fill-foreground">
                  {book}
                </text>
                {top && bookmark && <path d={`M${right - 30} ${y + 22} V${y + 38} L${right - 26} ${y + 34} L${right - 22} ${y + 38} V${y + 22} Z`} className="fill-chart-1" />}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
