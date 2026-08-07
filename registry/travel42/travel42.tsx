"use client";

import { ArrowUpRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
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

interface ActionLink {
  label: string;
  href: string;
}

interface DestinationImage {
  src: string;
  alt: string;
}

interface Destination {
  name: string;
  note: string;
  image: DestinationImage;
  /** Matched against the tags each answer keeps */
  tags?: string[];
  link?: ActionLink;
}

interface FilterChoice {
  value: string;
  label: string;
  description?: string;
  /** A destination survives this answer when it carries one of these tags */
  keeps?: string[];
}

interface FilterQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: FilterChoice[];
}

interface Travel42Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  countSuffix?: string;
  shortlistTitle?: string;
  emptyTitle?: string;
  emptyBody?: string;
}

interface Travel42Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  questions?: FilterQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** The grid that narrows as the questions are answered */
  destinations?: Destination[];
  labels?: Travel42Labels;
  className?: string;
}

export const travel42Demo: Travel42Props = {
  badge: { label: "Where to" },
  heading: "Watch the list get shorter as you answer",
  description:
    "Six places we book often. Every answer strikes the ones that no longer apply, so you can see what each question is costing you before the end.",
  shortcuts: "numbers",
  labels: {
    submit: "Keep what is left",
    restart: "Start the list again",
    countSuffix: "still fit",
    shortlistTitle: "What survived",
    emptyTitle: "Nothing survived that combination",
    emptyBody:
      "The three answers together rule out everything on the list. Loosen one of them, usually the season, and something comes back.",
  },
  questions: [
    {
      name: "pace",
      title: "What is the trip for?",
      description: "One of these is always the real reason.",
      choices: [
        {
          value: "quiet",
          label: "Doing very little",
          description: "A view, a book, and short distances.",
          keeps: ["quiet"],
        },
        {
          value: "outdoors",
          label: "Being outside all day",
          description: "Boots on at nine, back after dark.",
          keeps: ["outdoors"],
        },
        {
          value: "culture",
          label: "Looking at things people made",
          description: "Buildings, food, and a lot of walking.",
          keeps: ["culture"],
        },
      ],
    },
    {
      name: "length",
      title: "How long have you got?",
      choices: [
        { value: "short", label: "A long weekend", keeps: ["short"] },
        { value: "long", label: "A week or more", keeps: ["long"] },
      ],
    },
    {
      name: "season",
      title: "When are you going?",
      choices: [
        { value: "winter", label: "Deep winter", keeps: ["winter"] },
        { value: "shoulder", label: "Spring or autumn", keeps: ["shoulder"] },
        { value: "summer", label: "Height of summer", keeps: ["summer"] },
      ],
    },
  ],
  destinations: [
    {
      name: "Yosemite Valley",
      note: "Granite walls, a river underneath them, and more trail than a week can cover.",
      tags: ["outdoors", "long", "winter"],
      image: {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=800&fit=crop",
        alt: "A river running through a valley between granite cliffs at dawn",
      },
      link: { label: "See the Yosemite week", href: "https://beste.co" },
    },
    {
      name: "Venice",
      note: "Water instead of streets, and a week is not too long to spend on it.",
      tags: ["culture", "long", "shoulder"],
      image: {
        src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=800&fit=crop",
        alt: "A stone bridge over a canal with gondolas passing beneath it",
      },
      link: { label: "See the Venice week", href: "https://beste.co" },
    },
    {
      name: "London",
      note: "Three days of galleries, and the river to walk between them.",
      tags: ["culture", "short", "summer"],
      image: {
        src: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=800&fit=crop",
        alt: "A twin-towered bridge over a river with the city behind it",
      },
      link: { label: "See the London weekend", href: "https://beste.co" },
    },
    {
      name: "Isle of Skye",
      note: "One ridge, one road, and weather that changes twice an afternoon.",
      tags: ["outdoors", "short", "shoulder"],
      image: {
        src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop",
        alt: "Green ridges under low cloud with a single road running through them",
      },
      link: { label: "See the Skye weekend", href: "https://beste.co" },
    },
    {
      name: "Lago di Braies",
      note: "A rowing boat, a shoreline path, and nothing else asked of you.",
      tags: ["quiet", "short", "summer"],
      image: {
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop",
        alt: "Rowing boats on a green lake below limestone peaks",
      },
      link: { label: "See the Braies weekend", href: "https://beste.co" },
    },
    {
      name: "Moraine Lake",
      note: "Turquoise water under ten peaks, and a shoreline you can walk before breakfast.",
      tags: ["quiet", "long", "winter"],
      image: {
        src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=800&fit=crop",
        alt: "A turquoise lake below snow-streaked peaks at first light",
      },
      link: { label: "See the Moraine Lake week", href: "https://beste.co" },
    },
  ],
};

export function Travel42({
  badge,
  heading,
  description,
  questions = [],
  shortcuts,
  destinations = [],
  labels = {},
  className,
}: Travel42Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    countSuffix,
    shortlistTitle,
    emptyTitle,
    emptyBody,
  } = labels;

  const [picked, setPicked] = useState<Record<string, string>>({});
  const [settled, setSettled] = useState(false);

  /**
   * A destination survives every question that has been answered. An
   * unanswered question rules nothing out, which is what makes the grid
   * narrow one step at a time.
   */
  const survives = (destination: Destination) =>
    questions.every((question) => {
      const value = picked[question.name];
      if (!value) return true;
      const keeps = question.choices?.find((choice) => choice.value === value)?.keeps ?? [];
      return keeps.some((tag) => destination.tags?.includes(tag));
    });

  const survivors = destinations.filter(survives);

  const record = (question: FilterQuestion, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) return;
    setSettled(false);
    setPicked((previous) => ({ ...previous, [question.name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSettled(true);
  };

  const restart = () => {
    setPicked({});
    setSettled(false);
  };

  return (
    <section className={cn("w-full bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {badge && <Badge23 label={badge.label} />}

        <div className="mt-6 border-t border-border pt-8 md:pt-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div className="flex md:justify-end">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
          <div>
            {settled ? (
              <>
                {survivors.length > 0 ? (
                  <>
                    {shortlistTitle && (
                      <p className="text-sm text-muted-foreground">{shortlistTitle}</p>
                    )}
                    <p className="mt-3 text-4xl font-light tracking-tight text-foreground">
                      {survivors.length}
                      <span className="text-muted-foreground"> of {destinations.length}</span>
                    </p>

                    <div className="mt-8">
                      {survivors.map((destination, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 border-t border-border py-5 first:border-t-0 first:pt-0"
                        >
                          <img
                            className="size-16 shrink-0 rounded-md object-cover"
                            src={destination.image.src}
                            alt={destination.image.alt}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-medium text-foreground">
                              {destination.name}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {destination.note}
                            </p>
                            {destination.link && (
                              <Link
                                href={destination.link.href}
                                className="group/travel42 mt-2 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
                              >
                                {destination.link.label}
                                <ArrowUpRight
                                  className="size-4 transition-transform motion-safe:group-hover/travel42:-translate-y-0.5 motion-safe:group-hover/travel42:translate-x-0.5"
                                  aria-hidden="true"
                                />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
                      {emptyTitle ?? "Nothing survived that combination"}
                    </p>
                    {emptyBody && (
                      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        {emptyBody}
                      </p>
                    )}
                  </>
                )}

                <div className="mt-8">
                  <Button21
                    label={restartLabel ?? "Start the list again"}
                    tone="outline"
                    icon={RotateCcw}
                    onClick={restart}
                  />
                </div>
              </>
            ) : (
              <Questionnaire
                defaultItem={questions[0]?.name}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {questions.length > 0 && (
                  <QuestionnaireProgress className="text-sm font-normal tracking-normal" />
                )}

                {questions.map((question, index) => (
                  <QuestionnaireItem key={index} name={question.name} required>
                    <QuestionnaireTitle className="text-xl font-medium text-foreground">
                      {question.title}
                    </QuestionnaireTitle>
                    {question.description && (
                      <QuestionnaireDescription className="text-base leading-relaxed">
                        {question.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {question.choices?.map((choice, choiceIndex) => (
                        <QuestionnaireChoice
                          key={choiceIndex}
                          value={choice.value}
                          onChange={record(question, choice.value)}
                          className="rounded-md border-border p-4 text-base"
                        >
                          <span className="font-medium text-foreground">{choice.label}</span>
                          {choice.description && (
                            <QuestionnaireChoiceDescription className="text-sm">
                              {choice.description}
                            </QuestionnaireChoiceDescription>
                          )}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError className="text-sm" />
                  </QuestionnaireItem>
                ))}

                <QuestionnaireActions>
                  <QuestionnairePrevious className="cursor-pointer rounded-md border-border text-sm font-medium">
                    {previousLabel}
                  </QuestionnairePrevious>
                  <QuestionnaireNext className="cursor-pointer rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {nextLabel}
                  </QuestionnaireNext>
                  <QuestionnaireSubmit className="cursor-pointer rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {submitLabel}
                  </QuestionnaireSubmit>
                </QuestionnaireActions>
              </Questionnaire>
            )}
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {destinations.map((destination, index) => {
                const kept = survives(destination);
                return (
                  <div
                    key={index}
                    aria-hidden={kept ? undefined : "true"}
                    className={cn(
                      "relative h-44 overflow-hidden rounded-md bg-muted transition-opacity duration-300 md:h-56",
                      kept ? "opacity-100" : "opacity-25"
                    )}
                  >
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={destination.image.src}
                      alt={destination.image.alt}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-base font-medium text-background">{destination.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 border-t border-border pt-5 text-base text-muted-foreground">
              <span className="text-primary">
                {survivors.length} of {destinations.length}
              </span>{" "}
              {countSuffix ?? "still fit"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
