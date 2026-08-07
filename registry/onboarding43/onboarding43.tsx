"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
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

interface SetupPoint {
  title: string;
  description: string;
}

interface WizardChoice {
  value: string;
  label: string;
  description?: string;
}

interface WizardStep {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: WizardChoice[];
  /** Free-text escape hatch rendered under the fixed choices */
  input?: { label: string; placeholder?: string };
  /** Blocks Next and hides Skip until the step is answered */
  required?: boolean;
  /** Renders the choices as checkboxes instead of radios */
  multiple?: boolean;
}

interface WizardLabels {
  previous?: string;
  skip?: string;
  next?: string;
  submit?: string;
  restart?: string;
}

interface WizardSummary {
  title?: string;
  description?: string;
  /** Stands in for a step that was skipped or left blank */
  emptyLabel?: string;
}

interface Onboarding43Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  points?: SetupPoint[];
  note?: string;
  button?: ActionButton;
  wizardHeading?: string;
  wizardDescription?: string;
  steps?: WizardStep[];
  /** Prints a scoped shortcut on every choice and binds it while the step is active */
  shortcuts?: "letters" | "numbers";
  /** The bar and the "Question n of m" line above the active step */
  showProgress?: boolean;
  labels?: WizardLabels;
  /** The panel that replaces the flow once it is submitted */
  summary?: WizardSummary;
  className?: string;
}

export const onboarding43Demo: Onboarding43Props = {
  badge: { label: "Setup" },
  heading: "Four questions, then your workspace is ready",
  description:
    "Nothing here is permanent. Every answer maps to a setting you can change later, and skipping one just leaves the default in place.",
  points: [
    {
      title: "One question at a time",
      description:
        "The whole form is one field wide, so there is never a screen of empty inputs waiting for you.",
    },
    {
      title: "Answers become settings",
      description:
        "Your role picks the home screen, the tools you choose are the first integrations we connect.",
    },
    {
      title: "Nothing is locked in",
      description:
        "The summary at the end lists what we are about to create, and every line of it stays editable.",
    },
  ],
  note: "Takes about a minute. You can leave and pick it up from the same question.",
  button: { label: "See what each answer changes", href: "https://beste.co" },
  wizardHeading: "Set up your workspace",
  wizardDescription: "Press a number key to answer without reaching for the mouse.",
  shortcuts: "numbers",
  labels: { submit: "Create workspace", restart: "Start over" },
  summary: {
    title: "Workspace ready",
    description: "Here is what we will start you on. Everything stays editable in settings.",
    emptyLabel: "Skipped",
  },
  steps: [
    {
      name: "role",
      title: "What do you do most days?",
      description: "This picks the home screen you land on.",
      required: true,
      choices: [
        { value: "engineering", label: "Engineering", description: "Ship, review, and deploy." },
        { value: "design", label: "Design", description: "Files, handoff, and feedback." },
        { value: "operations", label: "Operations", description: "Numbers, reports, and access." },
      ],
    },
    {
      name: "team-size",
      title: "How many people will use this workspace?",
      required: true,
      choices: [
        { value: "1", label: "Just me" },
        { value: "2-10", label: "2 to 10" },
        { value: "11-50", label: "11 to 50" },
        { value: "51+", label: "More than 50" },
      ],
    },
    {
      name: "tools",
      title: "What should we connect first?",
      description: "Pick as many as you like. You can add the rest later.",
      multiple: true,
      choices: [
        { value: "github", label: "GitHub", description: "Pull requests and deploy status." },
        { value: "slack", label: "Slack", description: "Alerts in the channel you choose." },
        { value: "figma", label: "Figma", description: "Frames pinned next to the issue." },
        { value: "linear", label: "Linear", description: "Two-way issue sync." },
      ],
    },
    {
      name: "goal",
      title: "What would make the first week a success?",
      description: "Optional, and it goes straight to the person setting you up.",
      input: { label: "Your goal", placeholder: "Cut our release checklist in half..." },
    },
  ],
};

export function Onboarding43({
  badge,
  heading,
  description,
  points = [],
  note,
  button,
  wizardHeading,
  wizardDescription,
  steps = [],
  shortcuts,
  showProgress = true,
  labels = {},
  summary = {},
  className,
}: Onboarding43Props) {
  const {
    previous: previousLabel,
    skip: skipLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
  } = labels;
  const { title: summaryTitle, description: summaryDescription, emptyLabel } = summary;

  const [answers, setAnswers] = useState<Record<string, string[]> | null>(null);
  /**
   * Only observed, never enforced: the flow stays uncontrolled so the primitive
   * keeps owning navigation, and this is here purely to draw the bar.
   */
  const [activeName, setActiveName] = useState(steps[0]?.name);

  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.name === activeName)
  );
  const percent = steps.length > 0 ? ((activeIndex + 1) / steps.length) * 100 : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const collected: Record<string, string[]> = {};
    for (const step of steps) {
      collected[step.name] = data
        .getAll(step.name)
        .map((entry) => String(entry).trim())
        .filter((entry) => entry.length > 0);
    }
    setAnswers(collected);
  };

  const restart = () => {
    setAnswers(null);
    setActiveName(steps[0]?.name);
  };

  /** A stored value is a choice value first, and whatever was typed otherwise. */
  const readable = (step: WizardStep, value: string) =>
    step.choices?.find((choice) => choice.value === value)?.label ?? value;

  return (
    <section className={cn("w-full py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div>
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 max-w-xl text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
              </p>
            )}

            {(note || button) && (
              <div className="mt-10 border-t border-current/10 pt-8">
                {note && <p className="max-w-md text-lg text-muted-foreground">{note}</p>}
                {button && (
                  <div className="mt-6">
                    <Button12 asChild label={button.label} tone="outline">
                      <Link href={button.href} />
                    </Button12>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full">
            {answers ? (
              <>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-1 size-6 shrink-0 text-foreground" />
                  <div className="min-w-0">
                    <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {summaryTitle ?? "All set"}
                    </p>
                    {summaryDescription && (
                      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                        {summaryDescription}
                      </p>
                    )}
                  </div>
                </div>

                <dl className="mt-8 flex flex-col">
                  {steps.map((step, index) => {
                    const given = answers[step.name] ?? [];
                    return (
                      <div
                        key={index}
                        className="grid gap-1 border-t border-current/10 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-6"
                      >
                        <dt className="text-base text-muted-foreground md:text-lg">{step.title}</dt>
                        <dd className="text-base font-bold text-foreground md:text-lg">
                          {given.length > 0
                            ? given.map((value) => readable(step, value)).join(", ")
                            : (emptyLabel ?? "Skipped")}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-8">
                  <Button12
                    label={restartLabel ?? "Start over"}
                    tone="outline"
                    icon={RotateCcw}
                    onClick={restart}
                  />
                </div>
              </>
            ) : (
              <>
                {(wizardHeading || wizardDescription) && (
                  <div className="mb-8">
                    {wizardHeading && (
                      <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        {wizardHeading}
                      </p>
                    )}
                    {wizardDescription && (
                      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                        {wizardDescription}
                      </p>
                    )}
                  </div>
                )}

                <Questionnaire
                  defaultItem={steps[0]?.name}
                  onItemChange={setActiveName}
                  shortcuts={shortcuts}
                  onSubmit={handleSubmit}
                  className="gap-6"
                >
                  {showProgress && steps.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <QuestionnaireProgress className="text-base" />
                      <div className="h-1 w-full overflow-hidden rounded-full bg-current/10">
                        <div
                          className="h-full rounded-full bg-foreground transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {steps.map((step, index) => (
                    <QuestionnaireItem
                      key={index}
                      name={step.name}
                      required={step.required}
                      multiple={step.multiple}
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
                            className="rounded-md p-4 text-base data-checked:border-foreground"
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
                    <QuestionnairePrevious className="cursor-pointer rounded-full text-base">
                      {previousLabel}
                    </QuestionnairePrevious>
                    <QuestionnaireSkip className="cursor-pointer rounded-full text-base">
                      {skipLabel}
                    </QuestionnaireSkip>
                    <QuestionnaireNext className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                      {nextLabel}
                    </QuestionnaireNext>
                    <QuestionnaireSubmit className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                      {submitLabel}
                    </QuestionnaireSubmit>
                  </QuestionnaireActions>
                </Questionnaire>
              </>
            )}
          </div>
        </div>

        {points.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-12">
            {points.map((point, index) => (
              <div key={index} className="border-t border-current/10 pt-6">
                <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {point.title}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
