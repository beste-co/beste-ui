"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface Editor69Member {
  /** A round photo; without it the initials show */
  image?: string;
  initials?: string;
  name?: string;
  role?: string;
}

interface Editor69Props {
  /** The two cards already hanging on the rail */
  members?: Editor69Member[];
  /** The card that swings into the empty slot */
  newMember?: Editor69Member;
  className?: string;
}

export const editor69Demo: Editor69Props = {
  members: [
    { image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop", name: "Norah Jones", role: "Therapist" },
    { image: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop", name: "Jacob Collier", role: "Aesthetician" },
  ],
  newMember: { image: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=400&h=400&auto=format&fit=crop", name: "Corinne Bailey Rae", role: "Nutritionist" },
};

const STYLES = `
@keyframes editor69-hang { 0%, 12% { opacity: 0; transform: translateY(-14px); } 24% { opacity: 1; transform: rotate(3deg); } 30% { transform: rotate(-2deg); } 36%, 88% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; transform: translateY(-14px); } }
.editor69-hang { opacity: 0; transform-box: view-box; transform-origin: 208px 10px; animation: editor69-hang 12s cubic-bezier(.3,0,.2,1) infinite; }
@media (prefers-reduced-motion: reduce) { .editor69-hang { animation: none; opacity: 1; } }
`;

const SLOTS = [44, 126, 208];

function Card({ cx, member, fresh = false }: { cx: number; member: Editor69Member; fresh?: boolean }) {
  const clip = `editor69-avatar-${useId().replace(/:/g, "")}`;
  return (
    <g>
      <path d={`M${cx - 5} 11 L${cx - 3} 22 M${cx + 5} 11 L${cx + 3} 22`} className="fill-none stroke-border" />
      <rect x={cx - 7} y={20} width={14} height={8} rx={2} className="fill-muted stroke-border" />
      <rect x={cx - 36} y={26} width={72} height={74} rx={6} className="fill-card stroke-border" />
      <rect x={cx - 8} y={31} width={16} height={3.5} rx={1.75} className="fill-muted stroke-border" />
      {member.image ? (
        <>
          <clipPath id={clip}>
            <circle cx={cx} cy={52} r={11} />
          </clipPath>
          <image href={member.image} x={cx - 11} y={41} width={22} height={22} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
        </>
      ) : (
        <>
          <circle cx={cx} cy={52} r={11} className={fresh ? "fill-accent stroke-border" : "fill-muted stroke-border"} />
          <text x={cx} y={55} textAnchor="middle" fontSize={8.5} fontWeight={500} className={fresh ? "fill-accent-foreground" : "fill-muted-foreground"}>
            {member.initials}
          </text>
        </>
      )}
      <text x={cx} y={77} textAnchor="middle" fontSize={8.5} fontWeight={500} className="fill-foreground">
        {member.name}
      </text>
      <text x={cx} y={89} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
        {member.role}
      </text>
    </g>
  );
}

export function Editor69({ members = [], newMember, className }: Editor69Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 252 110" className="h-auto w-full max-w-64 overflow-visible" aria-hidden="true">
        <ellipse cx={126} cy={106} rx={112} ry={3} className="fill-foreground/5" />
        <line x1={4} y1={10} x2={248} y2={10} className="stroke-border" />
        <circle cx={4} cy={10} r={2.5} className="fill-muted stroke-border" />
        <circle cx={248} cy={10} r={2.5} className="fill-muted stroke-border" />
        {SLOTS.map((cx) => (
          <circle key={cx} cx={cx} cy={10} r={2} className="fill-card stroke-border" />
        ))}
        <rect x={172} y={26} width={72} height={74} rx={6} strokeDasharray="3 3" className="fill-none stroke-border" />
        {members.slice(0, 2).map((member, i) => (
          <Card key={i} cx={SLOTS[i] ?? 44} member={member} />
        ))}
        {newMember && (
          <g className="editor69-hang">
            <Card cx={208} member={newMember} fresh />
          </g>
        )}
      </svg>
    </div>
  );
}
