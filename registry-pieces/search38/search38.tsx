"use client";

import { cn } from "@/lib/utils";

interface Search38Props {
  fileName?: string;
  /** The site at the root of the tree */
  root?: string;
  /** A section with one page already under it */
  branch?: string;
  child?: string;
  /** The page that joins the branch, with its orange tag */
  added?: string;
  addedTag?: string;
  /** Two top-level pages that move down to make room */
  siblings?: string[];
  /** A quiet line at the foot of the sheet */
  note?: string;
  className?: string;
}

export const search38Demo: Search38Props = {
  fileName: "sitemap.xml",
  root: "orielstudio.pt",
  branch: "Treatments",
  child: "Facials",
  added: "Peels",
  addedTag: "New page",
  siblings: ["About", "Contact"],
};

const STYLES = `
@keyframes search38-in { 0%, 36% { opacity: 0; transform: translateX(-6px) } 46%, 82% { opacity: 1; transform: none } 88%, 100% { opacity: 0; transform: none } }
@keyframes search38-push { 0%, 24% { transform: none } 34%, 88% { transform: translateY(18px) } 96%, 100% { transform: none } }
.search38-in { opacity: 0; animation: search38-in 12s cubic-bezier(.3,0,.2,1) infinite }
.search38-push { animation: search38-push 12s cubic-bezier(.45,0,.25,1) infinite }
@media (prefers-reduced-motion: reduce) { .search38-in, .search38-push { animation: none } .search38-in { opacity: 1 } .search38-push { transform: translateY(18px) } }
`;

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <circle cx={x} cy={y} r="2.6" className="fill-card stroke-muted-foreground/50" />
      <text x={x + 8} y={y + 3} fontSize="9" className="fill-foreground/80">
        {label}
      </text>
    </>
  );
}

export function Search38({ fileName, root, branch, child, added, addedTag, siblings = [], note, className }: Search38Props) {
  const tagWidth = addedTag ? Math.round(addedTag.length * 4.6 + 10) : 0;
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" aria-hidden="true" className="w-full max-w-72 overflow-visible">
        <ellipse cx="120" cy="200" rx="80" ry="5" className="fill-foreground/5" />
        <path d="M60.5 14.5 H172 L191.5 34 V180 a12 12 0 0 1 -12 12 H60.5 a12 12 0 0 1 -12 -12 V26.5 a12 12 0 0 1 12 -12 Z" className="fill-card stroke-border" />
        <path d="M172 14 V28 a6 6 0 0 0 6 6 H192" strokeLinejoin="round" className="fill-background stroke-border" />
        {fileName && (
          <text x="62" y="36" fontSize="8.5" className="fill-muted-foreground">
            {fileName}
          </text>
        )}
        <line x1="62" y1="46" x2="178" y2="46" className="stroke-border" />

        <circle cx="66" cy="62" r="3.2" className="fill-background stroke-muted-foreground/60" />
        {root && (
          <text x="75" y="65.5" fontSize="9.5" fontWeight="500" className="fill-foreground">
            {root}
          </text>
        )}
        <line x1="66" y1="66" x2="66" y2="124" className="stroke-border" />
        <line x1="66" y1="86" x2="77" y2="86" className="stroke-border" />
        {branch && <Node x={80} y={86} label={branch} />}
        <line x1="80" y1="89" x2="80" y2="106" className="stroke-border" />
        <line x1="80" y1="106" x2="91" y2="106" className="stroke-border" />
        {child && <Node x={94} y={106} label={child} />}

        {added && (
          <g className="search38-in">
            <line x1="80" y1="106" x2="80" y2="124" className="stroke-border" />
            <line x1="80" y1="124" x2="91" y2="124" className="stroke-chart-1" />
            <text x="102" y="127" fontSize="9" className="fill-accent-foreground">
              {added}
            </text>
            {addedTag && (
              <>
                <rect x={106 + added.length * 5} y="117.5" width={tagWidth} height="13" rx="3" className="fill-accent" />
                <text x={106 + added.length * 5 + tagWidth / 2} y="126.8" textAnchor="middle" fontSize="8" className="fill-accent-foreground">
                  {addedTag}
                </text>
              </>
            )}
          </g>
        )}

        <g className="search38-push">
          {siblings.length > 0 && (
            <line x1="66" y1="106" x2="66" y2={124 + (Math.min(siblings.length, 2) - 1) * 18} className="stroke-border" />
          )}
          {siblings.slice(0, 2).map((sibling, index) => (
            <g key={index}>
              <line x1="66" y1={124 + index * 18} x2="77" y2={124 + index * 18} className="stroke-border" />
              <Node x={80} y={124 + index * 18} label={sibling} />
            </g>
          ))}
        </g>

        {note && (
          <>
            <line x1="62" y1="172" x2="178" y2="172" className="stroke-border" />
            <text x="62" y="184" fontSize="8" className="fill-muted-foreground">
              {note}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
