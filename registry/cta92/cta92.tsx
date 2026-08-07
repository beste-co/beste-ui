"use client";

import { Check, MailCheck } from "lucide-react";
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
  QuestionnaireInput,
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

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface Step {
  title: string;
  description?: string;
}

interface EmailStep extends Step {
  label: string;
  placeholder?: string;
}

interface PromiseItem {
  title: string;
  description: string;
}

interface Cta92Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  confirmationTitle?: string;
  confirmationDescription?: string;
  topicsSummary?: string;
  cadenceSummary?: string;
  emailSummary?: string;
}

interface Cta92Props {
  badge?: Badge;
  /** Short line beside the eyebrow, across the hairline divider */
  meta?: string;
  heading?: string;
  description?: string;
  /** Standing photograph in the left column */
  image?: CoverImage;
  caption?: string;
  /** Bordered cells under the photograph: what the subscription is and is not */
  promises?: PromiseItem[];
  note?: string;
  topicsStep?: Step;
  topics?: Option[];
  cadenceStep?: Step;
  cadences?: Option[];
  emailStep?: EmailStep;
  /** Prints a scoped shortcut on every choice and binds it while the step is active */
  shortcuts?: "letters" | "numbers";
  /** Seal CTA under the confirmation */
  button?: ActionButton;
  labels?: Cta92Labels;
  className?: string;
}

export const cta92Demo: Cta92Props = {
  badge: { label: "Newsletter" },
  meta: "4,100 readers",
  heading: "Subscribe to the parts you actually read",
  description:
    "One list, three subjects, and a cadence you choose. Nothing arrives that you did not ask for, and the first email tells you exactly what you signed up to.",
  image: {
    src: "https://images.unsplash.com/photo-1781819062931-57ea2c12deb4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Printed newsletter issues stacked on a desk",
  },
  caption: "Every issue is written, edited, and sent by the same two people.",
  promises: [
    {
      title: "You pick the subjects",
      description:
        "Choose one or all three. Anything you leave out is never sent, not even as a footer.",
    },
    {
      title: "You pick the rhythm",
      description: "Weekly on a Thursday, monthly on the first, or only when something is released.",
    },
    {
      title: "Leaving is one click",
      description: "The unsubscribe link sits at the top of every email, not buried under a footer.",
    },
  ],
  note: "No sponsorships, and the list is never shared with anyone.",
  shortcuts: "numbers",
  topicsStep: {
    title: "What should we send you?",
    description: "Pick as many as you like.",
  },
  topics: [
    {
      value: "notes",
      label: "Engineering notes",
      description: "What we changed, and the version that broke first.",
    },
    {
      value: "design",
      label: "Design teardowns",
      description: "One interface a month, read closely and drawn over.",
    },
    {
      value: "releases",
      label: "Release announcements",
      description: "New versions, migrations, and anything being retired.",
    },
  ],
  cadenceStep: {
    title: "How often is welcome?",
  },
  cadences: [
    { value: "weekly", label: "Weekly", description: "Thursday mornings, around 400 words." },
    { value: "monthly", label: "Monthly", description: "The first of the month, a longer read." },
    { value: "releases", label: "Only when something ships", description: "Roughly six a year." },
  ],
  emailStep: {
    title: "Where should it arrive?",
    description: "We confirm the address before anything is sent to it.",
    label: "Email address",
    placeholder: "you@company.com",
  },
  button: { label: "Read the last issue", href: "https://beste.co" },
  labels: {
    submit: "Confirm my subscription",
    restart: "Change my answers",
    confirmationTitle: "Check your inbox",
    confirmationDescription:
      "A confirmation link is on its way. Nothing is sent until you open it, and this is what it will set up.",
    topicsSummary: "Subjects",
    cadenceSummary: "How often",
    emailSummary: "Sent to",
  },
};

export function Cta92({
  badge,
  meta,
  heading,
  description,
  image,
  caption,
  promises = [],
  note,
  topicsStep,
  topics = [],
  cadenceStep,
  cadences = [],
  emailStep,
  shortcuts,
  button,
  labels = {},
  className,
}: Cta92Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    confirmationTitle,
    confirmationDescription,
    topicsSummary,
    cadenceSummary,
    emailSummary,
  } = labels;

  const [signup, setSignup] = useState<{
    topics: string[];
    cadence: string;
    email: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSignup({
      topics: data.getAll("topics").map((entry) => String(entry)),
      cadence: String(data.get("cadence") ?? ""),
      email: String(data.get("email") ?? "").trim(),
    });
  };

  const restart = () => setSignup(null);

  const labelFor = (options: Option[], value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

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
            {/* Fixed height on purpose: the plate never resizes with the step beside it. */}
            <div className="relative h-72 overflow-hidden rounded-md border bg-muted lg:h-96">
              {image && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              )}
            </div>
            {caption && <p className="mt-4 text-base text-muted-foreground">{caption}</p>}
          </div>

          <div>
            {signup ? (
              <>
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <MailCheck className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {confirmationTitle ?? "Check your inbox"}
                    </p>
                    {confirmationDescription && (
                      <p className="mt-3 text-base text-muted-foreground md:text-lg">
                        {confirmationDescription}
                      </p>
                    )}
                  </div>
                </div>

                <dl className="mt-8 grid gap-4">
                  <div className="rounded-md border bg-muted p-5">
                    <dt className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                      {topicsSummary ?? "Subjects"}
                    </dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {signup.topics.length > 0 ? (
                        signup.topics.map((value, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 rounded-md bg-background px-3 py-1.5 text-base font-bold text-foreground"
                          >
                            <Check className="size-4 text-primary" aria-hidden="true" />
                            {labelFor(topics, value)}
                          </span>
                        ))
                      ) : (
                        <span className="text-base font-bold text-foreground">
                          Nothing selected
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md border bg-muted p-5">
                      <dt className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                        {cadenceSummary ?? "How often"}
                      </dt>
                      <dd className="mt-2 text-lg font-bold tracking-tight text-foreground">
                        {labelFor(cadences, signup.cadence)}
                      </dd>
                    </div>
                    <div className="rounded-md border bg-muted p-5">
                      <dt className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                        {emailSummary ?? "Sent to"}
                      </dt>
                      <dd className="mt-2 text-lg font-bold break-all tracking-tight text-foreground">
                        {signup.email}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  {button && (
                    <Button1 asChild label={button.label}>
                      <Link href={button.href} />
                    </Button1>
                  )}
                  <button
                    type="button"
                    onClick={restart}
                    className="cursor-pointer text-lg font-bold text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    {restartLabel ?? "Change my answers"}
                  </button>
                </div>
              </>
            ) : (
              <Questionnaire
                defaultItem={topicsStep ? "topics" : cadenceStep ? "cadence" : "email"}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                <QuestionnaireProgress className="text-base" />

                {topicsStep && (
                  <QuestionnaireItem name="topics" required multiple>
                    <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {topicsStep.title}
                    </QuestionnaireTitle>
                    {topicsStep.description && (
                      <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                        {topicsStep.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {topics.map((topic, index) => (
                        <QuestionnaireChoice
                          key={index}
                          value={topic.value}
                          className="rounded-md p-4 text-base data-checked:border-primary"
                        >
                          <span className="font-bold text-foreground">{topic.label}</span>
                          {topic.description && (
                            <QuestionnaireChoiceDescription className="text-base">
                              {topic.description}
                            </QuestionnaireChoiceDescription>
                          )}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError className="text-base" />
                  </QuestionnaireItem>
                )}

                {cadenceStep && (
                  <QuestionnaireItem name="cadence" required>
                    <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {cadenceStep.title}
                    </QuestionnaireTitle>
                    {cadenceStep.description && (
                      <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                        {cadenceStep.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {cadences.map((cadence, index) => (
                        <QuestionnaireChoice
                          key={index}
                          value={cadence.value}
                          className="rounded-md p-4 text-base data-checked:border-primary"
                        >
                          <span className="font-bold text-foreground">{cadence.label}</span>
                          {cadence.description && (
                            <QuestionnaireChoiceDescription className="text-base">
                              {cadence.description}
                            </QuestionnaireChoiceDescription>
                          )}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError className="text-base" />
                  </QuestionnaireItem>
                )}

                {emailStep && (
                  <QuestionnaireItem name="email" required>
                    <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {emailStep.title}
                    </QuestionnaireTitle>
                    {emailStep.description && (
                      <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                        {emailStep.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      <QuestionnaireInput
                        type="email"
                        aria-label={emailStep.label}
                        placeholder={emailStep.placeholder}
                        className="h-11 rounded-md px-4 text-base md:text-base"
                      />
                    </QuestionnaireChoices>
                    <QuestionnaireError className="text-base" />
                  </QuestionnaireItem>
                )}

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

        {promises.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {promises.map((promise, index) => (
              <div key={index} className="rounded-md border bg-muted p-5">
                <p className="text-lg font-bold tracking-tight text-foreground">{promise.title}</p>
                <p className="mt-2 text-base text-muted-foreground">{promise.description}</p>
              </div>
            ))}
          </div>
        )}

        {note && <p className="mt-6 text-base text-muted-foreground">{note}</p>}
      </div>
    </section>
  );
}
