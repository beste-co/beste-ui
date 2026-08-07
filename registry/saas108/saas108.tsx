"use client";

import { Check, CheckCircle2, Clock, Lock, type LucideIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
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
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSkip,
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

interface Assurance {
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface Confirmation {
  title?: string;
  description?: string;
}

interface OutlineChoice {
  value: string;
  label: string;
  description?: string;
}

/**
 * A step is only asked when the named step's answer is one of `equals`. The
 * named step has to come earlier in the array, so a step can never gate itself
 * out from under the person standing on it.
 */
interface OutlineCondition {
  step: string;
  equals: string[];
}

interface OutlineStep {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  /** Short label for the rail. Falls back to `title`. */
  shortTitle?: string;
  choices?: OutlineChoice[];
  /** Free-text escape hatch rendered under the fixed choices */
  input?: { label: string; placeholder?: string };
  /** Blocks Next and hides Skip until the step is answered */
  required?: boolean;
  /** Renders the choices as checkboxes instead of radios */
  multiple?: boolean;
  /** Branching: drops the step out of the rail, the count, and navigation */
  when?: OutlineCondition;
}

interface OutlineLabels {
  previous?: string;
  skip?: string;
  next?: string;
  submit?: string;
  /** The rail's own heading. Falls back to a "Step n of m" line. */
  rail?: string;
  answered?: string;
  skipped?: string;
}

interface Saas108Props {
  badge?: Badge;
  /** Short line beside the eyebrow, across the hairline divider */
  meta?: string;
  heading?: string;
  description?: string;
  outlineHeading?: string;
  outlineDescription?: string;
  steps?: OutlineStep[];
  /** Prints a scoped shortcut on every choice and binds it while the step is active */
  shortcuts?: "letters" | "numbers";
  labels?: OutlineLabels;
  /** The banner shown above the step once the flow is submitted */
  confirmation?: Confirmation;
  /** Seal CTA under the confirmation banner, for people who would rather talk */
  button?: ActionButton;
  assurances?: Assurance[];
  className?: string;
}

export const saas108Demo: Saas108Props = {
  badge: { label: "Talk to us" },
  meta: "Five questions",
  heading: "Tell us what you are building, not your company size",
  description:
    "The questions change as you answer them, so nobody gets asked about compliance for a blog or about a CMS for an internal tool.",
  outlineHeading: "Scope your project",
  outlineDescription:
    "The outline on the left reshapes itself as you answer. Jump back to any step from the list.",
  shortcuts: "numbers",
  labels: { submit: "Send scope", rail: "Your outline" },
  confirmation: {
    title: "Scope sent",
    description:
      "A solutions engineer picks this up and replies with a plan within one working day.",
  },
  button: {
    label: "Book a call instead",
    href: "https://beste.co",
  },
  steps: [
    {
      name: "use-case",
      title: "What are you building?",
      shortTitle: "Project",
      description: "Everything after this question follows from the answer.",
      required: true,
      choices: [
        {
          value: "marketing",
          label: "A marketing site",
          description: "Pages, campaigns, and a blog.",
        },
        {
          value: "app",
          label: "A customer-facing app",
          description: "Accounts, data, and a dashboard.",
        },
        {
          value: "internal",
          label: "An internal tool",
          description: "Behind the login, for staff only.",
        },
      ],
    },
    {
      name: "cms",
      title: "Where does the content live?",
      shortTitle: "Content",
      required: true,
      when: { step: "use-case", equals: ["marketing"] },
      choices: [
        { value: "headless", label: "A headless CMS" },
        { value: "files", label: "Markdown in the repository" },
        { value: "undecided", label: "Not decided yet" },
      ],
    },
    {
      name: "compliance",
      title: "Which of these do you have to satisfy?",
      shortTitle: "Compliance",
      description: "Pick as many as apply. This decides where the data is allowed to sit.",
      multiple: true,
      when: { step: "use-case", equals: ["app", "internal"] },
      choices: [
        { value: "soc2", label: "SOC 2", description: "Evidence collection and an annual audit." },
        { value: "hipaa", label: "HIPAA", description: "A signed BAA and a restricted region." },
        { value: "gdpr", label: "GDPR", description: "Data residency inside the EU." },
        { value: "none", label: "None of these yet" },
      ],
    },
    {
      name: "traffic",
      title: "What should it hold at peak?",
      shortTitle: "Scale",
      required: true,
      choices: [
        { value: "low", label: "Under 10k visits a month" },
        { value: "mid", label: "10k to 500k visits a month" },
        { value: "high", label: "More than 500k visits a month" },
      ],
    },
    {
      name: "timeline",
      title: "When would you like to be live?",
      shortTitle: "Timeline",
      description: "Optional, and a rough answer is more useful than none.",
      input: { label: "Target date", placeholder: "Early October, before the conference..." },
    },
  ],
  assurances: [
    {
      title: "One working day",
      description: "A solutions engineer reads the scope and replies with a plan, not a brochure.",
      icon: Clock,
    },
    {
      title: "No sales sequence",
      description: "One reply from one person. Nothing gets added to a drip campaign.",
      icon: MessageSquare,
    },
    {
      title: "Only what you answered",
      description: "Steps the outline closed are never sent, because they were never asked.",
      icon: Lock,
    },
  ],
};

export function Saas108({
  badge,
  meta,
  heading,
  description,
  outlineHeading,
  outlineDescription,
  steps = [],
  shortcuts,
  labels = {},
  confirmation = {},
  button,
  assurances = [],
  className,
}: Saas108Props) {
  const {
    previous: previousLabel,
    skip: skipLabel,
    next: nextLabel,
    submit: submitLabel,
    rail: railLabel,
    answered: answeredLabel,
    skipped: skippedLabel,
  } = labels;
  const { title: confirmationTitle, description: confirmationDescription } = confirmation;

  const [active, setActive] = useState(steps[0]?.name);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  /** A step with no condition is always asked; one with a condition waits for it. */
  const isAsked = (step: OutlineStep) => {
    const condition = step.when;
    if (!condition) return true;
    const given = answers[condition.step] ?? [];
    return given.some((value) => condition.equals.includes(value));
  };

  const asked = steps.filter(isAsked);
  const activeIndex = asked.findIndex((step) => step.name === active);

  const goTo = (name: string) => {
    setSubmitted(false);
    setActive(name);
  };

  const markStatus = (name: string, status: string) => {
    setStatuses((previous) =>
      previous[name] === status ? previous : { ...previous, [name]: status }
    );
  };

  /**
   * The answers are mirrored here only so a later step can be gated on an
   * earlier one. The form itself stays the source of truth on submit.
   */
  const recordChoice =
    (step: OutlineStep, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setSubmitted(false);
      setAnswers((previous) => {
        const current = previous[step.name] ?? [];
        if (!step.multiple) {
          return { ...previous, [step.name]: checked ? [value] : [] };
        }
        return {
          ...previous,
          [step.name]: checked
            ? [...current, value]
            : current.filter((entry) => entry !== value),
        };
      });
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

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

        <div className="mt-12 grid overflow-hidden rounded-md border md:grid-cols-[minmax(0,18rem)_1fr]">
          <div className="border-b bg-muted p-6 md:border-b-0 md:border-r md:p-8">
            <p className="text-base font-bold uppercase tracking-widest text-muted-foreground">
              {railLabel ?? `Step ${Math.max(1, activeIndex + 1)} of ${asked.length}`}
            </p>
            <ol className="mt-6 flex flex-col gap-1">
              {asked.map((step, index) => {
                const isActive = step.name === active;
                const status = statuses[step.name];
                const isAnswered = status === "answered";
                const isSkipped = status === "skipped";
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => goTo(step.name)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-base font-bold transition-colors",
                        isActive
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-md text-base tabular-nums",
                          isAnswered
                            ? "bg-primary text-primary-foreground"
                            : isActive
                              ? "bg-foreground text-background"
                              : "border text-muted-foreground"
                        )}
                      >
                        {isAnswered ? (
                          <Check className="size-4" />
                        ) : isSkipped ? (
                          <span className="h-px w-3 bg-current" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {step.shortTitle ?? step.title}
                      </span>
                      {(isAnswered || isSkipped) && !isActive && (
                        <span className="sr-only">
                          {isAnswered ? (answeredLabel ?? "Answered") : (skippedLabel ?? "Skipped")}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="p-6 md:p-10">
            {(outlineHeading || outlineDescription) && (
              <div className="mb-8 border-b pb-6">
                {outlineHeading && (
                  <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {outlineHeading}
                  </p>
                )}
                {outlineDescription && (
                  <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
                    {outlineDescription}
                  </p>
                )}
              </div>
            )}

            <Questionnaire
              item={active}
              onItemChange={goTo}
              shortcuts={shortcuts}
              onSubmit={handleSubmit}
              className="gap-6"
            >
              {submitted && (
                <div role="status" className="flex items-start gap-4 rounded-md border bg-muted p-5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <CheckCircle2 className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-lg font-bold tracking-tight text-foreground">
                      {confirmationTitle ?? "Answers sent"}
                    </p>
                    {confirmationDescription && (
                      <p className="mt-2 text-base text-muted-foreground">
                        {confirmationDescription}
                      </p>
                    )}
                    {button && (
                      <div className="mt-5">
                        <Button1 asChild label={button.label}>
                          <Link href={button.href} />
                        </Button1>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {steps.map((step, index) => (
                <QuestionnaireItem
                  key={index}
                  name={step.name}
                  required={step.required}
                  multiple={step.multiple}
                  disabled={!isAsked(step)}
                  onStatusChange={(status: string) => markStatus(step.name, status)}
                >
                  <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {step.title}
                  </QuestionnaireTitle>
                  {step.description && (
                    <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                      {step.description}
                    </QuestionnaireDescription>
                  )}
                  <QuestionnaireChoices>
                    {step.choices?.map((choice, choiceIndex) => (
                      <QuestionnaireChoice
                        key={choiceIndex}
                        value={choice.value}
                        onChange={recordChoice(step, choice.value)}
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
                    {step.input && (
                      <QuestionnaireInput
                        aria-label={step.input.label}
                        placeholder={step.input.placeholder}
                        className="h-11 rounded-md px-4 text-base md:text-base"
                      />
                    )}
                  </QuestionnaireChoices>
                  <QuestionnaireError className="text-base" />
                </QuestionnaireItem>
              ))}

              <QuestionnaireActions>
                <QuestionnairePrevious className="cursor-pointer rounded-md text-base">
                  {previousLabel}
                </QuestionnairePrevious>
                <QuestionnaireSkip className="cursor-pointer rounded-md text-base">
                  {skipLabel}
                </QuestionnaireSkip>
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

        {assurances.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {assurances.map((assurance, index) => {
              const Icon = assurance.icon;
              return (
                <div key={index} className="rounded-md border bg-muted p-6">
                  {Icon && (
                    <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                  )}
                  <p className="text-lg font-bold tracking-tight text-foreground">
                    {assurance.title}
                  </p>
                  <p className="mt-2 text-base text-muted-foreground">{assurance.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
