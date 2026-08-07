"use client";

import { Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
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

interface Frame {
  src: string;
  alt: string;
}

interface PhotoChoice {
  value: string;
  label: string;
  image: Frame;
  /** Which style this frame counts towards. Matches a `Style` key. */
  style: string;
}

interface PhotoQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: PhotoChoice[];
}

interface Style {
  /** Referenced by every frame that counts towards it */
  key: string;
  title: string;
  description: string;
  /** The set shown once this style leads */
  strip?: Frame[];
  button?: ActionButton;
}

interface Gallery25Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  leadLabel?: string;
  breakdownTitle?: string;
}

interface Gallery25Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  questions?: PhotoQuestion[];
  /** Counted from the frames that were picked; the largest share leads. */
  styles?: Style[];
  labels?: Gallery25Labels;
  className?: string;
}

export const gallery25Demo: Gallery25Props = {
  badge: { label: "What do you actually like" },
  heading: "Choose pictures, not adjectives.",
  description:
    "Nobody knows what they mean by warm or timeless. Pick the frames you would hang and we will tell you what you have been choosing.",
  labels: {
    submit: "Read my picks",
    restart: "Pick again",
    leadLabel: "of your picks",
    breakdownTitle: "How it broke down",
  },
  questions: [
    {
      name: "one",
      title: "Which of these would you hang?",
      description: "First instinct. There is no wrong frame here.",
      choices: [
        {
          value: "a",
          label: "Empty foreground, long light",
          style: "quiet",
          image: {
            src: "https://images.unsplash.com/photo-1758094651721-2381a3b2d553?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Frame from the quiet selection",
          },
        },
        {
          value: "b",
          label: "Somebody caught mid-sentence",
          style: "documentary",
          image: {
            src: "https://images.unsplash.com/photo-1771838230544-aac51a5fcd24?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Frame from the documentary selection",
          },
        },
        {
          value: "c",
          label: "Everything squared to the wall",
          style: "formal",
          image: {
            src: "https://images.unsplash.com/photo-1649930691189-df5fe1c1483b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Frame from the formal selection",
          },
        },
      ],
    },
    {
      name: "two",
      title: "And of these?",
      choices: [
        {
          value: "a",
          label: "Fog doing most of the work",
          style: "quiet",
          image: {
            src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=900&h=1100&fit=crop",
            alt: "Second frame from the quiet selection",
          },
        },
        {
          value: "b",
          label: "A room full of people, none of them posing",
          style: "documentary",
          image: {
            src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&h=1100&fit=crop",
            alt: "Second frame from the documentary selection",
          },
        },
        {
          value: "c",
          label: "One object, centred, nothing else",
          style: "formal",
          image: {
            src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&h=1100&fit=crop",
            alt: "Second frame from the formal selection",
          },
        },
      ],
    },
    {
      name: "three",
      title: "Last one.",
      choices: [
        {
          value: "a",
          label: "Nothing happening, beautifully",
          style: "quiet",
          image: {
            src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=900&h=1100&fit=crop",
            alt: "Third frame from the quiet selection",
          },
        },
        {
          value: "b",
          label: "The moment just after the moment",
          style: "documentary",
          image: {
            src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=1100&fit=crop",
            alt: "Third frame from the documentary selection",
          },
        },
        {
          value: "c",
          label: "Light used like a ruler",
          style: "formal",
          image: {
            src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&h=1100&fit=crop",
            alt: "Third frame from the formal selection",
          },
        },
      ],
    },
  ],
  styles: [
    {
      key: "quiet",
      title: "The quiet eye",
      description:
        "You keep choosing frames where very little is happening. They are the hardest to sell and the easiest to live with, which is why they end up in hallways rather than above sofas.",
      strip: [
        {
          src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
          alt: "Print from the quiet series",
        },
        {
          src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=800&fit=crop",
          alt: "Second print from the quiet series",
        },
        {
          src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=800&fit=crop",
          alt: "Third print from the quiet series",
        },
      ],
      button: { label: "See the quiet series", href: "https://beste.co" },
    },
    {
      key: "documentary",
      title: "The documentary eye",
      description:
        "You pick the frames with somebody in them, usually caught between two intentions. These date faster and mean more, and nobody ever asks what they are of.",
      strip: [
        {
          src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop",
          alt: "Print from the documentary series",
        },
        {
          src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
          alt: "Second print from the documentary series",
        },
        {
          src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
          alt: "Third print from the documentary series",
        },
      ],
      button: { label: "See the documentary series", href: "https://beste.co" },
    },
    {
      key: "formal",
      title: "The formal eye",
      description:
        "Squared, centred, and lit deliberately. You are choosing composition over subject, which means these will still look right when the room around them changes.",
      strip: [
        {
          src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&h=800&fit=crop",
          alt: "Print from the formal series",
        },
        {
          src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=800&fit=crop",
          alt: "Second print from the formal series",
        },
        {
          src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=800&fit=crop",
          alt: "Third print from the formal series",
        },
      ],
      button: { label: "See the formal series", href: "https://beste.co" },
    },
  ],
};

/** Segment shades for the breakdown bar, strongest first. */
const shades = ["bg-foreground", "bg-foreground/45", "bg-foreground/20"];

export function Gallery25({
  badge,
  heading,
  description,
  questions = [],
  styles = [],
  labels = {},
  className,
}: Gallery25Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    leadLabel,
    breakdownTitle,
  } = labels;

  const [result, setResult] = useState<{ key: string; count: number; percent: number }[] | null>(
    null
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const counts: Record<string, number> = {};
    let total = 0;
    for (const question of questions) {
      const value = String(data.get(question.name) ?? "");
      const choice = question.choices?.find((entry) => entry.value === value);
      if (!choice) continue;
      counts[choice.style] = (counts[choice.style] ?? 0) + 1;
      total += 1;
    }
    if (total === 0) return;

    const tally = styles
      .map((style) => ({
        key: style.key,
        count: counts[style.key] ?? 0,
        percent: Math.round(((counts[style.key] ?? 0) / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    setResult(tally);
  };

  const restart = () => setResult(null);

  const styleFor = (key: string) => styles.find((style) => style.key === key);
  const lead = result ? styleFor(result[0]?.key ?? "") : undefined;

  return (
    <section className={cn("w-full py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
              {description}
            </p>
          )}
        </div>

        {result && lead ? (
          <div className="mt-12 md:mt-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <p className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                  {lead.title}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {lead.description}
                </p>

                <p className="mt-8 text-4xl font-bold tabular-nums tracking-tight text-foreground md:text-5xl">
                  {result[0]?.percent}%
                  <span className="ml-3 text-lg font-bold text-muted-foreground md:text-xl">
                    {leadLabel ?? "of your picks"}
                  </span>
                </p>

                {lead.button && (
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button12 asChild label={lead.button.label}>
                      <Link href={lead.button.href} />
                    </Button12>
                    <Button12
                      label={restartLabel ?? "Pick again"}
                      tone="outline"
                      icon={RotateCcw}
                      onClick={restart}
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="grid grid-cols-3 gap-4">
                  {lead.strip?.map((frame, index) => (
                    <div key={index} className="rounded-md bg-muted p-3">
                      <div className="relative h-52 overflow-hidden rounded-md md:h-64">
                        <img
                          className="absolute inset-0 size-full object-cover"
                          src={frame.src}
                          alt={frame.alt}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  {breakdownTitle && (
                    <p className="text-lg font-bold tracking-tight text-foreground">
                      {breakdownTitle}
                    </p>
                  )}

                  <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-current/10">
                    {result.map((entry, index) => (
                      <div
                        key={index}
                        className={cn("h-full", shades[index] ?? "bg-foreground/10")}
                        style={{ width: `${entry.percent}%` }}
                      />
                    ))}
                  </div>

                  <dl className="mt-6 flex flex-col">
                    {result.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-baseline justify-between gap-6 border-t border-current/10 py-4 first:border-t-0 first:pt-0"
                      >
                        <dt className="flex items-center gap-3 text-base text-muted-foreground md:text-lg">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-3 shrink-0 rounded-full",
                              shades[index] ?? "bg-foreground/10"
                            )}
                          />
                          {styleFor(entry.key)?.title}
                        </dt>
                        <dd className="text-base font-bold tabular-nums text-foreground md:text-lg">
                          {entry.percent}%
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 md:mt-16">
            <Questionnaire defaultItem={questions[0]?.name} onSubmit={handleSubmit} className="gap-8">
              {questions.length > 0 && <QuestionnaireProgress className="text-base" />}

              {questions.map((question, index) => (
                <QuestionnaireItem key={index} name={question.name} required>
                  <QuestionnaireTitle className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {question.title}
                  </QuestionnaireTitle>
                  {question.description && (
                    <QuestionnaireDescription className="text-lg text-muted-foreground md:text-xl">
                      {question.description}
                    </QuestionnaireDescription>
                  )}
                  <QuestionnaireChoices className="mt-2 gap-4 sm:grid-cols-3">
                    {question.choices?.map((choice, choiceIndex) => (
                      <QuestionnaireChoice
                        key={choiceIndex}
                        value={choice.value}
                        className="flex-col items-stretch gap-0 rounded-md border-0 bg-muted p-3 hover:bg-muted data-checked:bg-foreground dark:bg-muted dark:data-checked:bg-foreground [&>[data-slot=questionnaire-choice-indicator]]:hidden [&>[data-slot=questionnaire-choice-shortcut]]:hidden"
                      >
                        <span className="relative block h-52 w-full overflow-hidden rounded-md md:h-64">
                          <img
                            className="absolute inset-0 size-full object-cover"
                            src={choice.image.src}
                            alt={choice.image.alt}
                          />
                          <span
                            aria-hidden="true"
                            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-opacity group-data-checked/questionnaire-choice:opacity-100"
                          >
                            <Check className="size-4" />
                          </span>
                        </span>
                        <span className="block px-1 pt-4 pb-1 text-base font-bold text-foreground group-data-checked/questionnaire-choice:text-background md:text-lg">
                          {choice.label}
                        </span>
                      </QuestionnaireChoice>
                    ))}
                  </QuestionnaireChoices>
                  <QuestionnaireError className="text-base" />
                </QuestionnaireItem>
              ))}

              <QuestionnaireActions>
                <QuestionnairePrevious className="cursor-pointer rounded-full border-current/15 bg-background text-base">
                  {previousLabel}
                </QuestionnairePrevious>
                <QuestionnaireNext className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                  {nextLabel}
                </QuestionnaireNext>
                <QuestionnaireSubmit className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                  {submitLabel}
                </QuestionnaireSubmit>
              </QuestionnaireActions>
            </Questionnaire>
          </div>
        )}
      </div>
    </section>
  );
}
