"use client";

import { Check, Minus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
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

interface BandImage {
  src: string;
  alt: string;
}

interface Fact {
  label: string;
  value: string;
}

interface IntakeChoice {
  value: string;
  label: string;
  description?: string;
}

interface IntakeQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: IntakeChoice[];
}

interface Programme {
  /**
   * Field name to answer value. A programme is only matched when every pair
   * fits. Leave it out on the last one, which is the catch-all.
   */
  match?: Record<string, string>;
  title: string;
  summary: string;
  /** Replaces the standing band once this programme is matched */
  image?: BandImage;
  caption?: string;
  /** The honest half: who this is for */
  suits?: string[];
  /** The other honest half: who should not take it */
  avoid?: string[];
  facts?: Fact[];
  button?: ActionLink;
}

interface Fitness40Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  matchTitle?: string;
  suitsTitle?: string;
  avoidTitle?: string;
}

interface Fitness40Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  /** Standing band, shown until a programme is matched */
  image?: BandImage;
  caption?: string;
  questions?: IntakeQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Checked in order; the first one whose `match` fits the answers wins. */
  programmes?: Programme[];
  labels?: Fitness40Labels;
  className?: string;
}

export const fitness40Demo: Fitness40Props = {
  badge: { label: "Find your programme" },
  heading: "Three questions, and one of them we will talk you out of",
  description:
    "Every programme here says who it is not for. That list is longer than the other one, and it is the reason people finish these instead of quitting in week three.",
  shortcuts: "numbers",
  image: {
    src: "https://images.unsplash.com/photo-1741722604274-cb1da5e87ebd?q=80&w=3167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Empty gym floor in morning light",
  },
  caption: "One room, four coaches, and nobody filming themselves.",
  labels: {
    submit: "Show me the programme",
    restart: "Answer again",
    matchTitle: "Closest programme",
    suitsTitle: "Take this if",
    avoidTitle: "Do not take this if",
  },
  questions: [
    {
      name: "now",
      title: "Where are you starting from?",
      description: "Honestly. The wrong answer here is the one that hurts in week two.",
      choices: [
        {
          value: "none",
          label: "Nothing for a year or more",
          description: "Walking counts, but that is where it stops.",
        },
        {
          value: "some",
          label: "On and off",
          description: "A good month, then three weeks of nothing.",
        },
        {
          value: "regular",
          label: "Already training weekly",
          description: "It is in the calendar and it mostly happens.",
        },
      ],
    },
    {
      name: "time",
      title: "How many mornings can you actually give it?",
      choices: [
        { value: "two", label: "Two" },
        { value: "three", label: "Three" },
        { value: "four", label: "Four or more" },
      ],
    },
    {
      name: "goal",
      title: "What would make this worth doing?",
      choices: [
        { value: "strength", label: "Being stronger than I am" },
        { value: "stamina", label: "Not being out of breath" },
        { value: "normal", label: "Feeling like myself again" },
      ],
    },
  ],
  programmes: [
    {
      match: { now: "none" },
      title: "Return, eight weeks",
      summary:
        "Two sessions a week, both supervised, and deliberately easier than you want them to be. The point is to still be here in March.",
      image: {
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=900&fit=crop",
        alt: "Coach setting up equipment in a quiet gym",
      },
      caption: "Return groups are capped at six, which is why they book out first.",
      suits: [
        "You have not trained in a year and would rather not be the worst person in the room",
        "You want somebody watching the first six weeks of movement",
        "Two mornings is what you can genuinely protect",
      ],
      avoid: [
        "You are chasing a number by a fixed date",
        "You already train and want to add volume, not rebuild it",
        "You would find a capped, supervised group patronising",
      ],
      facts: [
        { label: "Sessions", value: "Two a week, 50 minutes" },
        { label: "Group size", value: "Six people" },
        { label: "Starts", value: "First Monday of the month" },
      ],
      button: { label: "See the eight week plan", href: "https://beste.co" },
    },
    {
      match: { goal: "strength" },
      title: "Strength, three mornings",
      summary:
        "A barbell programme with the boring parts left in. Progress is slow, written down, and checked against the last block rather than against anyone else.",
      image: {
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=900&fit=crop",
        alt: "Loaded barbell resting on a gym floor",
      },
      caption: "Everything on this programme is logged, including the sessions that go badly.",
      suits: [
        "You can hold three mornings a week for at least twelve weeks",
        "You want a number to go up and are willing to be patient about it",
        "You are comfortable being coached on technique in front of other people",
      ],
      avoid: [
        "You are coming back from a long gap with no supervision",
        "You want variety more than you want progress",
        "Three mornings is optimistic rather than true",
      ],
      facts: [
        { label: "Sessions", value: "Three a week, 70 minutes" },
        { label: "Block length", value: "Twelve weeks" },
        { label: "Reviewed", value: "Every fourth week" },
      ],
      button: { label: "See the strength block", href: "https://beste.co" },
    },
    {
      match: { goal: "stamina" },
      title: "Endurance, rolling",
      summary:
        "Mostly easy running and cycling with one hard session a week. It works because the easy parts are genuinely easy, which most people find harder than the hard part.",
      suits: [
        "You want to stop being out of breath on ordinary days",
        "You can do most of the work outside, alone, without being chased",
        "You are willing to go slower than feels productive",
      ],
      avoid: [
        "You need company to get out of the door",
        "You want visible change in six weeks",
        "One hard session a week sounds like too little",
      ],
      facts: [
        { label: "Sessions", value: "Three to five, mostly easy" },
        { label: "Check-in", value: "Fortnightly, fifteen minutes" },
        { label: "Starts", value: "Any Monday" },
      ],
      button: { label: "See the endurance plan", href: "https://beste.co" },
    },
    {
      title: "General, two mornings",
      summary:
        "The unglamorous one. Mixed sessions, no target, and the only measure is whether you are still coming in three months.",
      suits: [
        "You want to train without signing up to a goal",
        "Two mornings a week suits your life and you would like to keep it that way",
        "You would rather be told what to do when you arrive",
      ],
      avoid: [
        "You have a date and a number in mind",
        "You want a programme you can follow on your own",
        "You find mixed groups distracting",
      ],
      facts: [
        { label: "Sessions", value: "Two a week, 45 minutes" },
        { label: "Group size", value: "Ten people" },
        { label: "Starts", value: "Any week" },
      ],
      button: { label: "See what a week looks like", href: "https://beste.co" },
    },
  ],
};

export function Fitness40({
  badge,
  heading,
  description,
  image,
  caption,
  questions = [],
  shortcuts,
  programmes = [],
  labels = {},
  className,
}: Fitness40Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    matchTitle,
    suitsTitle,
    avoidTitle,
  } = labels;

  const [programme, setProgramme] = useState<Programme | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const given: Record<string, string> = {};
    for (const question of questions) {
      given[question.name] = String(data.get(question.name) ?? "");
    }

    // The last programme stands in when nothing fits, so a submit never dead-ends.
    const matched = programmes.find((entry) =>
      Object.entries(entry.match ?? {}).every(([name, value]) => given[name] === value)
    );
    setProgramme(matched ?? programmes[programmes.length - 1] ?? null);
  };

  const restart = () => setProgramme(null);

  const shownImage = programme?.image ?? image;
  const shownCaption = programme?.caption ?? caption;

  return (
    <section className={cn("w-full bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
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

        <div className="relative mt-12 h-72 overflow-hidden rounded-md bg-muted md:mt-16 md:h-96">
          {shownImage && (
            <img
              className="absolute inset-0 size-full object-cover"
              src={shownImage.src}
              alt={shownImage.alt}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto -mt-12 max-w-3xl rounded-md border border-border bg-background p-6 md:p-10">
          {programme ? (
            <>
              {matchTitle && <p className="text-sm text-muted-foreground">{matchTitle}</p>}
              <p className="mt-3 text-2xl font-light tracking-tight text-foreground md:text-4xl">
                {programme.title}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {programme.summary}
              </p>

              <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {suitsTitle ?? "Take this if"}
                  </p>
                  <ul className="mt-4">
                    {programme.suits?.map((line, index) => (
                      <li
                        key={index}
                        className="flex gap-3 border-t border-border py-4"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span className="text-base leading-relaxed text-foreground">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-lg font-medium text-foreground">
                    {avoidTitle ?? "Do not take this if"}
                  </p>
                  <ul className="mt-4">
                    {programme.avoid?.map((line, index) => (
                      <li
                        key={index}
                        className="flex gap-3 border-t border-border py-4"
                      >
                        <Minus
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="text-base leading-relaxed text-muted-foreground">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {programme.facts && programme.facts.length > 0 && (
                <dl className="mt-10 grid gap-6 sm:grid-cols-3">
                  {programme.facts.map((fact, index) => (
                    <div key={index} className="border-t border-border pt-4">
                      <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                      <dd className="mt-2 text-base text-foreground">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {programme.button && (
                  <Button21 asChild label={programme.button.label}>
                    <Link href={programme.button.href} />
                  </Button21>
                )}
                <Button21
                  label={restartLabel ?? "Answer again"}
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

        {shownCaption && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{shownCaption}</p>
        )}
      </div>
    </section>
  );
}
