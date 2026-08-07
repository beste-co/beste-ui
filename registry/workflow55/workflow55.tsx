"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";
import { Badge6 } from "@/components/beste/component/badge6";
import { Button1 } from "@/components/beste/component/button1";
import { Socialproof24 } from "@/components/beste/piece/socialproof24";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface BandImage {
  src: string;
  alt: string;
}

interface WeightChoice {
  value: string;
  label: string;
  description?: string;
  /** Added to the score. The highest weight in each question sets the ceiling. */
  weight: number;
}

interface WeightQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: WeightChoice[];
}

interface Band {
  /** Upper edge of this band as a percent. Bands are read in order. */
  upTo: number;
  title: string;
  summary: string;
  /** What this band actually asks a team to do */
  practices?: string[];
  image?: BandImage;
  button?: ActionButton;
}

interface Aside {
  title?: string;
  note?: string;
  /** Piece shown in the banner beside the questions */
  media?: ReactNode;
}

interface Workflow55Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  railTitle?: string;
  scoreLabel?: string;
  practicesTitle?: string;
}

interface Workflow55Props {
  badge?: Badge;
  /** Short line beside the eyebrow, across the hairline divider */
  meta?: string;
  heading?: string;
  description?: string;
  questions?: WeightQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Read in order; the first band whose `upTo` covers the score wins. */
  bands?: Band[];
  /** Band across the top, shown until the score is placed */
  image?: BandImage;
  /** Small banner beside the questions, so the column is not empty while answering */
  aside?: Aside;
  labels?: Workflow55Labels;
  className?: string;
}

export const workflow55Demo: Workflow55Props = {
  badge: { label: "How much process" },
  meta: "Four questions",
  heading: "Most teams are running the wrong amount of process",
  description:
    "Not too much or too little in general, just the wrong amount for this piece of work. Four questions put you somewhere on the line, and the line has an honest bottom end.",
  shortcuts: "numbers",
  image: {
    src: "https://images.unsplash.com/photo-1777873106116-4f29e3988626?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Empty meeting room with chairs pulled back",
  },
  aside: {
    title: "Who it ends up involving",
    note: "Every rung up the scale adds a name that has to say yes before the work can move.",
    media: (
      <Socialproof24
        items={[
          {
            src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
            alt: "Portrait of the engineer writing the change",
          },
          {
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
            alt: "Portrait of the reviewer on the same team",
          },
          {
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
            alt: "Portrait of the approver from the platform team",
            name: "Waiting on Dana",
          },
          {
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop",
            alt: "Portrait of the person who has to be told afterwards",
          },
        ]}
      />
    ),
  },
  labels: {
    submit: "Place me on the line",
    restart: "Answer again",
    railTitle: "How much process this needs",
    scoreLabel: "on the line",
    practicesTitle: "What that actually means",
  },
  questions: [
    {
      name: "blast",
      title: "If this goes wrong on a Friday, who notices?",
      description: "The honest blast radius, not the one in the risk register.",
      choices: [
        { value: "team", label: "The team, and nobody else", weight: 0 },
        { value: "company", label: "The rest of the company", weight: 2 },
        { value: "customers", label: "Paying customers, immediately", weight: 4 },
      ],
    },
    {
      name: "reverse",
      title: "How hard is it to undo?",
      choices: [
        { value: "easy", label: "One command, under a minute", weight: 0 },
        { value: "awkward", label: "A morning of work and an apology", weight: 2 },
        { value: "never", label: "It cannot be undone", weight: 4 },
      ],
    },
    {
      name: "people",
      title: "How many people have to agree?",
      choices: [
        { value: "one", label: "One, and they are writing it", weight: 0 },
        { value: "few", label: "Two or three in the same team", weight: 1 },
        { value: "many", label: "Several teams, plus somebody senior", weight: 3 },
      ],
    },
    {
      name: "rules",
      title: "Is anybody outside the company allowed to ask about it?",
      description: "Auditors, regulators, or a customer with a contract clause.",
      choices: [
        { value: "no", label: "No", weight: 0 },
        { value: "maybe", label: "In theory, never in practice", weight: 1 },
        { value: "yes", label: "Yes, and they do", weight: 4 },
      ],
    },
  ],
  bands: [
    {
      upTo: 20,
      title: "Just ship it",
      summary:
        "Nothing here justifies a process. A review board on this work would cost more than the mistake it is meant to prevent.",
      practices: [
        "One person writes it and one person looks at it",
        "No document, no ticket, no meeting",
        "Fix forward rather than plan around failure",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&h=1000&fit=crop",
        alt: "Single desk with a laptop and a notebook",
      },
      button: { label: "See the lightweight kit", href: "https://beste.co" },
    },
    {
      upTo: 45,
      title: "Light checkpoints",
      summary:
        "Enough at stake to write things down, not enough to stop and gather people. Two checkpoints, both asynchronous.",
      practices: [
        "A one-page note before, a one-page note after",
        "A named reviewer rather than a committee",
        "Rollback rehearsed once, not documented three times",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=1000&fit=crop",
        alt: "Two people reviewing work on a shared screen",
      },
      button: { label: "See the checkpoint template", href: "https://beste.co" },
    },
    {
      upTo: 70,
      title: "Staged review",
      summary:
        "Several teams and a change that is awkward to reverse. Stage it, and let each stage prove the next one is safe.",
      practices: [
        "Three stages with a named owner and an exit condition each",
        "A dry run against production data before the first stage",
        "One meeting, at the start, with everyone who can say no",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=1000&fit=crop",
        alt: "Small team standing around a table mid-discussion",
      },
      button: { label: "See the staging plan", href: "https://beste.co" },
    },
    {
      upTo: 100,
      title: "Full change control",
      summary:
        "Irreversible, externally visible, and somebody outside the company is entitled to ask how it was done. This is the one case where the paperwork is the cheap part.",
      practices: [
        "Written change request, approved before any work starts",
        "Evidence captured as it happens rather than reconstructed after",
        "A rehearsed rollback, signed off by somebody who did not write it",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=1000&fit=crop",
        alt: "Empty meeting room with chairs pulled back",
      },
      button: { label: "See the change control pack", href: "https://beste.co" },
    },
  ],
};

export function Workflow55({
  badge,
  meta,
  heading,
  description,
  questions = [],
  shortcuts,
  bands = [],
  image,
  aside,
  labels = {},
  className,
}: Workflow55Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    railTitle,
    scoreLabel,
    practicesTitle,
  } = labels;

  const [percent, setPercent] = useState<number | null>(null);

  /** The ceiling is the heaviest answer to every question, so the rail is always full scale. */
  const ceiling = questions.reduce(
    (sum, question) =>
      sum + Math.max(0, ...(question.choices ?? []).map((choice) => choice.weight)),
    0
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let score = 0;
    for (const question of questions) {
      const value = String(data.get(question.name) ?? "");
      const choice = question.choices?.find((entry) => entry.value === value);
      score += choice?.weight ?? 0;
    }

    setPercent(ceiling > 0 ? Math.round((score / ceiling) * 100) : 0);
  };

  const restart = () => setPercent(null);

  const band =
    percent === null ? undefined : (bands.find((entry) => percent <= entry.upTo) ?? bands.at(-1));

  const shownImage = band?.image ?? image;

  return (
    <section className={cn("w-full py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-5">
          {badge && <Badge6 label={badge.label} />}
          {badge && meta && <span className="h-9 w-px bg-border" />}
          {meta && (
            <span className="text-base font-bold uppercase tracking-widest text-muted-foreground">
              {meta}
            </span>
          )}
        </div>

        <div className="mt-6 border-b" />

        {heading && (
          <h2 className="mt-10 max-w-3xl text-balance text-3xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl">
            {heading}
          </h2>
        )}
        {description && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{description}</p>
        )}
        <div className="relative mt-12 h-64 overflow-hidden rounded-md bg-muted md:h-[26rem]">
          {shownImage && (
            <img
              className="absolute inset-0 size-full object-cover"
              src={shownImage.src}
              alt={shownImage.alt}
            />
          )}
        </div>

        {percent === null ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <Questionnaire
              defaultItem={questions[0]?.name}
              shortcuts={shortcuts}
              onSubmit={handleSubmit}
              className="gap-6"
            >
              {questions.length > 0 && <QuestionnaireProgress className="text-base" />}

              {questions.map((question, index) => (
                <QuestionnaireItem key={index} name={question.name} required>
                  <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {question.title}
                  </QuestionnaireTitle>
                  {question.description && (
                    <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                      {question.description}
                    </QuestionnaireDescription>
                  )}
                  <QuestionnaireChoices>
                    {question.choices?.map((choice, choiceIndex) => (
                      <QuestionnaireChoice
                        key={choiceIndex}
                        value={choice.value}
                        className="rounded-md p-4 text-base data-checked:border-primary"
                      >
                        <span className="font-bold text-foreground">{choice.label}</span>
                        {choice.description && (
                          <QuestionnaireChoiceDescription className="text-base">
                            {choice.description}
                          </QuestionnaireChoiceDescription>
                        )}
                      </QuestionnaireChoice>
                    ))}
                  </QuestionnaireChoices>
                  <QuestionnaireError className="text-base" />
                </QuestionnaireItem>
              ))}

              <QuestionnaireActions>
                <QuestionnairePrevious className="cursor-pointer rounded-md text-base">
                  {previousLabel}
                </QuestionnairePrevious>
                <QuestionnaireNext className="cursor-pointer rounded-md text-base">
                  {nextLabel}
                </QuestionnaireNext>
                <QuestionnaireSubmit className="cursor-pointer rounded-md text-base">
                  {submitLabel}
                </QuestionnaireSubmit>
              </QuestionnaireActions>
            </Questionnaire>

            {aside && (
              <div>
                {aside.title && (
                  <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                    {aside.title}
                  </p>
                )}
                {aside.media && (
                  <div className="mt-6 flex min-h-56 items-center justify-center rounded-md border">
                    {aside.media}
                  </div>
                )}
                {aside.note && (
                  <p className="mt-4 text-base text-muted-foreground">{aside.note}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              {railTitle && (
                <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                  {railTitle}
                </p>
              )}
              <p className="mt-6 text-6xl font-bold leading-none tabular-nums tracking-tight text-foreground md:text-8xl">
                {percent}%
              </p>
              <p className="mt-4 text-base font-bold uppercase tracking-widest text-muted-foreground">
                {scoreLabel ?? "on the line"}
              </p>

              {band && (
                <>
                  <p className="mt-10 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {band.title}
                  </p>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                    {band.summary}
                  </p>
                </>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-5">
                {band?.button && (
                  <Button1 asChild label={band.button.label}>
                    <Link href={band.button.href} />
                  </Button1>
                )}
                <button
                  type="button"
                  onClick={restart}
                  className="cursor-pointer text-lg font-bold text-foreground underline underline-offset-4 hover:text-primary"
                >
                  {restartLabel ?? "Answer again"}
                </button>
              </div>
            </div>

            {band?.practices && band.practices.length > 0 && (
              <div>
                {practicesTitle && (
                  <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                    {practicesTitle}
                  </p>
                )}
                <ol className="mt-6 border-b">
                  {band.practices.map((practice, index) => (
                    <li key={index} className="flex gap-4 border-t py-5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-base font-bold tabular-nums text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="text-lg text-foreground">{practice}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
