"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
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

interface RoleImage {
  src: string;
  alt: string;
}

interface Fact {
  title: string;
  value: string;
}

interface FitChoice {
  value: string;
  label: string;
  description?: string;
}

interface FitQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: FitChoice[];
}

interface Role {
  /**
   * Field name to answer value. A role is only matched when every pair fits.
   * Leave it out on the last role, which is the catch-all.
   */
  match?: Record<string, string>;
  title: string;
  summary: string;
  facts?: Fact[];
  /** Replaces the standing photograph once this role is matched */
  image?: RoleImage;
  caption?: string;
  button?: ActionButton;
}

interface Careers56Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  matchTitle?: string;
}

interface Careers56Props {
  badge?: Badge;
  /** Short line beside the eyebrow, across the hairline divider */
  meta?: string;
  heading?: string;
  description?: string;
  questions?: FitQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Checked in order; the first one whose `match` fits the answers wins. */
  roles?: Role[];
  /** Standing photograph, shown until a role is matched */
  image?: RoleImage;
  caption?: string;
  /** Two bordered cells under the photograph */
  stats?: Fact[];
  labels?: Careers56Labels;
  className?: string;
}

export const careers56Demo: Careers56Props = {
  badge: { label: "Careers" },
  meta: "Six open roles",
  heading: "Skip the job board and answer three questions",
  description:
    "Every open role here wants a different kind of week. Tell us what yours looks like and we will name the one that fits, including the pay band, before you write anything.",
  shortcuts: "numbers",
  labels: {
    submit: "Find my role",
    restart: "Answer again",
    matchTitle: "Closest role",
  },
  image: {
    src: "https://images.unsplash.com/photo-1594100165806-939c3fbb5b6a?q=80&w=1747&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Studio wall covered in pinned work in progress",
  },
  caption: "Twenty-two people, one floor, and a wall that is never empty.",
  stats: [
    { title: "Median reply", value: "3 days" },
    { title: "Interview rounds", value: "Two" },
  ],
  questions: [
    {
      name: "craft",
      title: "What do you want to spend the day doing?",
      description: "The part of the work you would keep if the rest went away.",
      choices: [
        {
          value: "build",
          label: "Building the thing",
          description: "Code, performance, and the parts nobody sees.",
        },
        {
          value: "design",
          label: "Deciding how it looks",
          description: "Type, systems, and the argument behind both.",
        },
        {
          value: "client",
          label: "Holding it together",
          description: "Scope, schedules, and the people paying for it.",
        },
      ],
    },
    {
      name: "experience",
      title: "How long have you been at it?",
      choices: [
        { value: "early", label: "Under three years" },
        { value: "mid", label: "Three to six years" },
        { value: "senior", label: "Seven or more" },
      ],
    },
    {
      name: "place",
      title: "Where do you want to work from?",
      choices: [
        { value: "studio", label: "In the studio, most days" },
        { value: "hybrid", label: "A couple of days in" },
        { value: "remote", label: "Wherever I am" },
      ],
    },
  ],
  roles: [
    {
      match: { craft: "build", experience: "senior" },
      title: "Engineering lead",
      summary:
        "You set how the work is built and you still write a good share of it. Two engineers report to you, and the first thing you would inherit is a rebuild already underway.",
      facts: [
        { title: "Team", value: "Engineering, 4 people" },
        { title: "Based", value: "Studio or hybrid" },
        { title: "Band", value: "£82,000 to £95,000" },
        { title: "Closing", value: "End of the month" },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1754390754756-16ee0e29cf36?q=80&w=1735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Desk with a laptop, notes, and printed schedules",
      },
      caption: "The engineering corner, where most of the arguing about scope happens.",
      button: { label: "Read the full role", href: "https://beste.co" },
    },
    {
      match: { craft: "build" },
      title: "Engineer",
      summary:
        "Front of the stack, on client work, with someone senior in the same room. You would ship something to production in your first fortnight.",
      facts: [
        { title: "Team", value: "Engineering, 4 people" },
        { title: "Based", value: "Studio, hybrid, or remote" },
        { title: "Band", value: "£54,000 to £68,000" },
        { title: "Closing", value: "Rolling" },
      ],
      button: { label: "Read the full role", href: "https://beste.co" },
    },
    {
      match: { craft: "design" },
      title: "Designer, brand systems",
      summary:
        "Identity work that has to survive being handed over. You would own the type, the rules, and the document that stops both from being ignored.",
      facts: [
        { title: "Team", value: "Design, 6 people" },
        { title: "Based", value: "Studio, most days" },
        { title: "Band", value: "£48,000 to £62,000" },
        { title: "Closing", value: "In three weeks" },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1583201173319-a4efa99605cf?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Printed identity material laid out across a table",
      },
      caption: "Everything the design team makes is printed before it is signed off.",
      button: { label: "Read the full role", href: "https://beste.co" },
    },
    {
      match: { craft: "client" },
      title: "Producer",
      summary:
        "You hold the schedule, the budget, and the awkward conversation. Three projects at a time, and the authority to say no to a fourth.",
      facts: [
        { title: "Team", value: "Production, 3 people" },
        { title: "Based", value: "Studio or hybrid" },
        { title: "Band", value: "£46,000 to £58,000" },
        { title: "Closing", value: "End of the month" },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1777523743687-233bbfdbd894?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Two people talking across a studio desk",
      },
      caption: "Production sits between the studio and everyone who is waiting on it.",
      button: { label: "Read the full role", href: "https://beste.co" },
    },
    {
      title: "Open application",
      summary:
        "Nothing on the list matched, which happens. Tell us what you do and what you would want the first six months to look like, and we will read it properly.",
      facts: [
        { title: "Team", value: "Wherever you fit" },
        { title: "Based", value: "Tell us" },
        { title: "Band", value: "Set against the role" },
        { title: "Closing", value: "Always open" },
      ],
      button: { label: "Write to us", href: "https://beste.co" },
    },
  ],
};

export function Careers56({
  badge,
  meta,
  heading,
  description,
  questions = [],
  shortcuts,
  roles = [],
  image,
  caption,
  stats = [],
  labels = {},
  className,
}: Careers56Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    matchTitle,
  } = labels;

  const [role, setRole] = useState<Role | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const given: Record<string, string> = {};
    for (const question of questions) {
      given[question.name] = String(data.get(question.name) ?? "");
    }

    // The last role stands in when nothing fits, so a submit never dead-ends.
    const matched = roles.find((entry) =>
      Object.entries(entry.match ?? {}).every(([name, value]) => given[name] === value)
    );
    setRole(matched ?? roles[roles.length - 1] ?? null);
  };

  const restart = () => setRole(null);

  const shownImage = role?.image ?? image;
  const shownCaption = role?.caption ?? caption;

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

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <div className="relative h-80 overflow-hidden rounded-md border bg-muted lg:h-[30rem]">
              {shownImage && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={shownImage.src}
                  alt={shownImage.alt}
                />
              )}
            </div>

            {shownCaption && (
              <p className="mt-4 text-base text-muted-foreground">{shownCaption}</p>
            )}

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
            {role ? (
              <>
                {matchTitle && (
                  <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                    {matchTitle}
                  </p>
                )}
                <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {role.title}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{role.summary}</p>

                {role.facts && role.facts.length > 0 && (
                  <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                    {role.facts.map((fact, index) => (
                      <div key={index} className="rounded-md border bg-muted p-5">
                        <dt className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                          {fact.title}
                        </dt>
                        <dd className="mt-2 text-lg font-bold tracking-tight text-foreground">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  {role.button && (
                    <Button1 asChild label={role.button.label}>
                      <Link href={role.button.href} />
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
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
