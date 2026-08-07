"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Badge6 } from "@/components/beste/component/badge6";
import { Button1 } from "@/components/beste/component/button1";
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

interface CoverImage {
  src: string;
  alt: string;
}

interface Episode {
  /** Printed in the index chip, e.g. the episode number */
  number: string;
  title: string;
  /** Runtime in whole minutes. Summed into the path's total. */
  minutes: number;
  note: string;
  image: CoverImage;
}

interface Path {
  title: string;
  summary: string;
  /** Matched against the traits the answers ask for */
  traits?: string[];
  episodes?: Episode[];
  button?: ActionButton;
}

interface PathChoice {
  value: string;
  label: string;
  description?: string;
  /** Traits this answer asks for. A path scores one point per trait it has. */
  traits?: string[];
}

interface PathQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: PathChoice[];
  /** Renders the choices as checkboxes instead of radios */
  multiple?: boolean;
}

interface Podcast54Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  pathTitle?: string;
  totalLabel?: string;
  /** Printed in front of each episode number */
  episodeLabel?: string;
  hour?: string;
  minute?: string;
}

interface Podcast54Props {
  badge?: Badge;
  /** Short line beside the eyebrow, across the hairline divider */
  meta?: string;
  heading?: string;
  description?: string;
  questions?: PathQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Scored against the answers; the highest score wins, ties go to the first. */
  paths?: Path[];
  /** Shown beside the questions, before a path is chosen */
  image?: CoverImage;
  caption?: string;
  /** Two bordered cells under the standing photograph */
  stats?: { title: string; value: string }[];
  labels?: Podcast54Labels;
  className?: string;
}

/** "1 hr 48 min", without a locale API that can drift between server and client. */
function formatMinutes(total: number, hour: string, minute: string) {
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours === 0) return `${rest} ${minute}`;
  if (rest === 0) return `${hours} ${hour}`;
  return `${hours} ${hour} ${rest} ${minute}`;
}

export const podcast54Demo: Podcast54Props = {
  badge: { label: "Start here" },
  meta: "142 episodes",
  heading: "Nobody starts a show at episode one",
  description:
    "Three questions and we hand you an order to listen in, not a back catalogue to scroll. Every path is three episodes, chosen so the second makes sense after the first.",
  shortcuts: "numbers",
  image: {
    src: "https://images.unsplash.com/photo-1785304968591-077766b38d74?q=80&w=3125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "A condenser microphone in a shock mount with a pop filter",
  },
  caption: "Recorded in one room, edited lightly, and published on Tuesdays.",
  stats: [
    { title: "Median length", value: "38 min" },
    { title: "Published since", value: "2019" },
  ],
  labels: {
    submit: "Build my path",
    restart: "Answer again",
    pathTitle: "Your listening path",
    totalLabel: "Three episodes",
    episodeLabel: "Episode",
    hour: "hr",
    minute: "min",
  },
  questions: [
    {
      name: "reason",
      title: "Why are you here?",
      description: "Somebody sent you a link, or you went looking. Both are fine.",
      choices: [
        {
          value: "craft",
          label: "I want to get better at the work",
          description: "Process, tools, and the parts that go wrong.",
          traits: ["craft"],
        },
        {
          value: "people",
          label: "I like hearing how people think",
          description: "Long conversations that wander and come back.",
          traits: ["people"],
        },
        {
          value: "industry",
          label: "I want to know where this is going",
          description: "Money, platforms, and what is quietly changing.",
          traits: ["industry"],
        },
      ],
    },
    {
      name: "time",
      title: "How long is your commute?",
      choices: [
        { value: "short", label: "Under half an hour", traits: ["short"] },
        { value: "long", label: "Long enough for a proper one", traits: ["long"] },
      ],
    },
    {
      name: "tone",
      title: "What do you want it to feel like?",
      choices: [
        { value: "practical", label: "Useful on Monday morning", traits: ["craft", "short"] },
        { value: "argument", label: "A good argument", traits: ["industry", "long"] },
        { value: "company", label: "Company, mostly", traits: ["people", "long"] },
      ],
    },
  ],
  paths: [
    {
      title: "The one about doing the work",
      summary:
        "Three episodes on process, in the order that makes the third one land. Start on a Monday and you can use most of it that week.",
      traits: ["craft", "short"],
      episodes: [
        {
          number: "31",
          title: "The brief nobody reads",
          minutes: 34,
          note: "Why the document everyone signs is the one nobody opens again.",
          image: {
            src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop",
            alt: "A dynamic microphone on a boom arm against a dark backdrop",
          },
        },
        {
          number: "58",
          title: "Estimating in public",
          minutes: 41,
          note: "Two studios show their numbers and defend them out loud.",
          image: {
            src: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",
            alt: "A condenser microphone in a shock mount with a pop filter",
          },
        },
        {
          number: "97",
          title: "The handover problem",
          minutes: 29,
          note: "What happens to good work six months after it ships.",
          image: {
            src: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=600&fit=crop",
            alt: "Over-ear headphones on a black surface",
          },
        },
      ],
      button: { label: "Start with episode 31", href: "https://beste.co" },
    },
    {
      title: "The one about the industry",
      summary:
        "Three of the arguments people still email us about, arranged so you hear the case before the rebuttal.",
      traits: ["industry", "long"],
      episodes: [
        {
          number: "44",
          title: "Who actually pays for this",
          minutes: 52,
          note: "Following the money from the brief to the invoice and back.",
          image: {
            src: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",
            alt: "A condenser microphone in a shock mount with a pop filter",
          },
        },
        {
          number: "72",
          title: "The platform tax",
          minutes: 64,
          note: "What it costs to build on somebody else's floor.",
          image: {
            src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop",
            alt: "A studio control room with a mixing console and guitars on the wall",
          },
        },
        {
          number: "118",
          title: "Nothing is niche anymore",
          minutes: 47,
          note: "An hour on what happens when every audience is addressable.",
          image: {
            src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop",
            alt: "A dynamic microphone on a boom arm against a dark backdrop",
          },
        },
      ],
      button: { label: "Start with episode 44", href: "https://beste.co" },
    },
    {
      title: "The one for company",
      summary:
        "Long conversations that go somewhere unplanned. Nothing here is useful on Monday, which is rather the point.",
      traits: ["people", "long"],
      episodes: [
        {
          number: "12",
          title: "Two hours with a sign painter",
          minutes: 96,
          note: "Forty years of lettering by hand, and one strong opinion about vinyl.",
          image: {
            src: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=600&fit=crop",
            alt: "Over-ear headphones on a black surface",
          },
        },
        {
          number: "65",
          title: "The archivist",
          minutes: 71,
          note: "What gets kept, what gets thrown away, and who decides.",
          image: {
            src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop",
            alt: "A dynamic microphone on a boom arm against a dark backdrop",
          },
        },
        {
          number: "103",
          title: "Leaving the industry",
          minutes: 58,
          note: "Three people who stopped, and what they do on Tuesdays now.",
          image: {
            src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop",
            alt: "A studio control room with a mixing console and guitars on the wall",
          },
        },
      ],
      button: { label: "Start with episode 12", href: "https://beste.co" },
    },
  ],
};

export function Podcast54({
  badge,
  meta,
  heading,
  description,
  questions = [],
  shortcuts,
  paths = [],
  image,
  caption,
  stats = [],
  labels = {},
  className,
}: Podcast54Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    pathTitle,
    totalLabel,
    episodeLabel,
    hour,
    minute,
  } = labels;

  const [path, setPath] = useState<Path | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const wanted: string[] = [];
    for (const question of questions) {
      for (const entry of data.getAll(question.name)) {
        const choice = question.choices?.find((option) => option.value === String(entry));
        if (choice) wanted.push(...(choice.traits ?? []));
      }
    }

    let best: Path | undefined;
    let bestScore = -1;
    for (const candidate of paths) {
      const score = wanted.filter((trait) => candidate.traits?.includes(trait)).length;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }

    if (best) setPath(best);
  };

  const restart = () => setPath(null);

  const total = (path?.episodes ?? []).reduce((sum, episode) => sum + episode.minutes, 0);

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

        {path ? (
          <div className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b pb-8">
              <div className="max-w-2xl">
                {pathTitle && (
                  <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                    {pathTitle}
                  </p>
                )}
                <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {path.title}
                </p>
                <p className="mt-4 text-lg text-muted-foreground">{path.summary}</p>
              </div>
              <p className="text-lg font-bold tracking-tight text-foreground">
                {totalLabel ?? "Three episodes"},{" "}
                <span className="tabular-nums text-primary">
                  {formatMinutes(total, hour ?? "hr", minute ?? "min")}
                </span>
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {path.episodes?.map((episode, index) => (
                <div key={index} className="overflow-hidden rounded-md border">
                  <div className="relative h-44 bg-muted">
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={episode.image.src}
                      alt={episode.image.alt}
                    />
                    <span className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-md bg-primary text-base font-bold tabular-nums text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                      {episodeLabel ?? "Episode"} {episode.number}
                    </p>
                    <p className="mt-3 text-lg font-bold tracking-tight text-foreground">
                      {episode.title}
                    </p>
                    <p className="mt-2 text-base text-muted-foreground">{episode.note}</p>
                    <p className="mt-4 text-base font-bold tabular-nums text-foreground">
                      {formatMinutes(episode.minutes, hour ?? "hr", minute ?? "min")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              {path.button && (
                <Button1 asChild label={path.button.label}>
                  <Link href={path.button.href} />
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
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <div className="relative h-72 overflow-hidden rounded-md border bg-muted lg:h-80">
                {image && (
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={image.src}
                    alt={image.alt}
                  />
                )}
              </div>
              {caption && <p className="mt-4 text-base text-muted-foreground">{caption}</p>}

              {stats.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {stats.map((stat, index) => (
                    <div key={index} className="rounded-md border bg-muted p-5">
                      <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Questionnaire
                defaultItem={questions[0]?.name}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {questions.length > 0 && <QuestionnaireProgress className="text-base" />}

                {questions.map((question, index) => (
                  <QuestionnaireItem
                    key={index}
                    name={question.name}
                    required={!question.multiple}
                    multiple={question.multiple}
                  >
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
