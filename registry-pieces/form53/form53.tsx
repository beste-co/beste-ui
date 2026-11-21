"use client";

import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface Form53Submission {
  name: string;
  /** A square photo; the first letter of the name shows when empty */
  avatar?: string;
  subject: string;
  time: string;
  unread?: boolean;
}

interface Form53Props {
  title?: string;
  /** The form the submissions came from */
  form?: string;
  /** A short count beside the title, e.g. "2 new" */
  count?: string;
  submissions?: Form53Submission[];
  /** The fields of the first submission, shown when it opens */
  fields?: { label: string; value: string }[];
  replyLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form53Demo: Form53Props = {
  title: "Inbox",
  form: "Booking request",
  count: "2 new",
  submissions: [
    { name: "Norah Jones", avatar: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=400&h=400&auto=format&fit=crop", subject: "A facial for two on Saturday?", time: "9:41", unread: true },
    { name: "Thom Yorke", avatar: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop", subject: "Gift card for my sister", time: "8:12", unread: true },
    { name: "Esperanza Spalding", avatar: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=400&h=400&auto=format&fit=crop", subject: "Do you open on Mondays?", time: "Tue" },
    { name: "Nils Frahm", avatar: "https://images.unsplash.com/photo-1618673747378-7e0d3561371a?q=80&w=400&h=400&auto=format&fit=crop", subject: "Moving my appointment", time: "Mon" },
  ],
  fields: [
    { label: "Name", value: "Norah Jones" },
    { label: "Email", value: "hello@beste.co" },
    { label: "Treatment", value: "Signature facial, 2 people" },
    { label: "Message", value: "Could we come in together on Saturday morning? Any time before noon works." },
  ],
  replyLabel: "Reply",
  framed: true,
};

// The first row opens into its detail and closes again; the list is the opening frame
const STYLES = `
@keyframes form53-detail { 0%, 30% { transform: translateX(104%) } 38%, 78% { transform: translateX(0) } 86%, 100% { transform: translateX(104%) } }
@keyframes form53-row { 0%, 22% { background-color: transparent } 26%, 36% { background-color: var(--muted) } 44%, 100% { background-color: transparent } }
@keyframes form53-dot { 0%, 34% { opacity: 1 } 38%, 92% { opacity: 0 } 100% { opacity: 1 } }
.form53-detail { animation: form53-detail 11s cubic-bezier(.65,0,.35,1) infinite }
.form53-row { animation: form53-row 11s ease infinite }
.form53-dot { animation: form53-dot 11s ease infinite }
@media (prefers-reduced-motion: reduce) { .form53-detail, .form53-row, .form53-dot { animation: none } }
`;

export function Form53({ title, form, count, submissions = [], fields = [], replyLabel = "Reply", framed = true, fill = false, className }: Form53Props) {
  const first = submissions[0];
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div className={cn("w-full", !fill && "max-w-80", framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md")}>
        <div className={cn("relative overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")} aria-hidden="true">
          <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 pt-4 pb-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium tracking-tight">{title}</p>
              {form && <p className="mt-0.5 truncate text-xs text-muted-foreground">{form}</p>}
            </div>
            {count && <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{count}</span>}
          </div>
          <ul className="p-1.5">
            {submissions.map((item, index) => (
              <li key={index} className={cn("flex items-start gap-3 rounded-xl px-2.5 py-2.5", index === 0 && "form53-row")}>
                {item.avatar ? (
                  <img src={item.avatar} alt="" loading="lazy" decoding="async" className="size-7 shrink-0 rounded-full bg-muted object-cover" />
                ) : (
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground">{item.name.charAt(0)}</span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={cn("truncate text-xs", item.unread ? "font-medium text-foreground" : "text-muted-foreground")}>{item.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    {item.unread && <span className={cn("size-1.5 shrink-0 rounded-full bg-chart-1", index === 0 && "form53-dot")} />}
                    <span className="truncate text-xs text-muted-foreground">{item.subject}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {first && (
            <div className="form53-detail absolute inset-0 flex flex-col bg-card motion-reduce:hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 pt-4 pb-3">
                <ArrowLeft className="size-3.5 shrink-0 text-muted-foreground" />
                <p className="truncate text-sm font-medium tracking-tight">{first.subject}</p>
              </div>
              <dl className="flex-1 space-y-2.5 px-4 py-3.5">
                {fields.map((field, index) => (
                  <div key={index}>
                    <dt className="text-xs text-muted-foreground">{field.label}</dt>
                    <dd className="mt-0.5 line-clamp-2 text-xs text-foreground">{field.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="px-4 pb-4">
                <span className="inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-xs text-primary-foreground">{replyLabel}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
