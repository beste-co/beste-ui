"use client";

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

interface BriefImage {
  src: string;
  alt: string;
}

interface BriefChoice {
  value: string;
  label: string;
  description?: string;
}

interface BriefStep {
  /** Form field name. Must be unique across the brief. */
  name: string;
  title: string;
  description?: string;
  choices?: BriefChoice[];
  /** Free-text field rendered under the fixed choices, or on its own */
  input?: { label: string; placeholder?: string; type?: "email" | "text" };
  /** Blocks Next until the step is answered */
  required?: boolean;
  /** Renders the choices as checkboxes instead of radios */
  multiple?: boolean;
  /** Shown in the panel while this step is the one on screen */
  image: BriefImage;
  /** Line under the panel while this step is the one on screen */
  caption: string;
}

interface Closing {
  image: BriefImage;
  caption: string;
  title: string;
  description: string;
  /** Stands in for a step that was left blank */
  emptyLabel?: string;
}

interface Note {
  title: string;
  description: string;
}

interface Agency24Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
}

interface Agency24Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  steps?: BriefStep[];
  /** Prints a scoped shortcut on every choice and binds it while the step is active */
  shortcuts?: "letters" | "numbers";
  /** The panel and the ledger shown once the brief is sent */
  closing?: Closing;
  button?: ActionButton;
  /** Ruled row under the brief */
  notes?: Note[];
  labels?: Agency24Labels;
  className?: string;
}

export const agency24Demo: Agency24Props = {
  badge: { label: "Start a brief" },
  heading: "Four answers and we know whether we are the wrong studio for you.",
  description:
    "This is the same set of questions we would ask on a first call, asked in the order that actually decides anything.",
  shortcuts: "numbers",
  labels: { submit: "Send the brief", restart: "Write a different one" },
  steps: [
    {
      name: "work",
      title: "What are we making?",
      description: "Pick the centre of gravity. The rest tends to follow it.",
      required: true,
      choices: [
        {
          value: "identity",
          label: "An identity",
          description: "A name, a mark, and the rules that keep it upright.",
        },
        {
          value: "site",
          label: "A site",
          description: "Something people read, buy from, or sign up through.",
        },
        {
          value: "campaign",
          label: "A campaign",
          description: "A launch with a date attached and nowhere to hide.",
        },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1583201173319-a4efa99605cf?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Printed material laid out across a studio table",
      },
      caption: "Wordmark and print system for a small publisher, set over four weeks.",
    },
    {
      name: "stage",
      title: "Where is it now?",
      required: true,
      choices: [
        { value: "blank", label: "Nothing exists yet" },
        { value: "rebuild", label: "Something exists and it is tired" },
        { value: "rescue", label: "Something exists and it is on fire" },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1594100165806-939c3fbb5b6a?q=80&w=1747&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "A wall of pinned reference sheets in a working studio",
      },
      caption: "A rebuild usually starts as an audit, on a wall, in a single afternoon.",
    },
    {
      name: "window",
      title: "When does it have to be live?",
      description: "A date you are held to, not the one you would prefer.",
      required: true,
      choices: [
        { value: "weeks", label: "Inside six weeks" },
        { value: "quarter", label: "This quarter" },
        { value: "open", label: "No fixed date yet" },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1754390754756-16ee0e29cf36?q=80&w=1735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Close view of a printed schedule beside a pen",
      },
      caption: "Six weeks is a real project. It just has fewer opinions in it.",
    },
    {
      name: "contact",
      title: "Where do we send the reply?",
      description: "One person reads it. There is no queue behind this.",
      required: true,
      input: { label: "Email address", placeholder: "you@studio.com", type: "email" },
      image: {
        src: "https://images.unsplash.com/photo-1777523743687-233bbfdbd894?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Two people talking across a studio desk",
      },
      caption: "Every brief gets a written answer, including the ones we turn down.",
    },
  ],
  closing: {
    image: {
      src: "https://images.unsplash.com/photo-1763307411452-43cfd9f516ce?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Studio interior with work pinned along one wall",
    },
    caption: "This is the room your brief lands in on Monday morning.",
    title: "Brief received",
    description:
      "One of us replies inside two working days with either a plan or an honest reason we are not the studio for it.",
    emptyLabel: "Left blank",
  },
  button: { label: "Book the intro call", href: "https://beste.co" },
  notes: [
    {
      title: "No forms after this one",
      description:
        "The reply comes from the person who would run the work, not from an account manager collecting more answers.",
    },
    {
      title: "We say no in writing",
      description:
        "If the date, the budget, or the shape of it is wrong for us, you get told why rather than ghosted.",
    },
    {
      title: "The brief stays yours",
      description:
        "Nothing you write here is shown to anyone outside the studio, and we delete it if the work does not happen.",
    },
  ],
};

export function Agency24({
  badge,
  heading,
  description,
  steps = [],
  shortcuts,
  closing,
  button,
  notes = [],
  labels = {},
  className,
}: Agency24Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
  } = labels;

  const [answers, setAnswers] = useState<Record<string, string[]> | null>(null);
  /** Only observed: the panel beside the brief follows whichever step is on screen. */
  const [activeName, setActiveName] = useState(steps[0]?.name);

  const activeStep = steps.find((step) => step.name === activeName) ?? steps[0];
  const panelImage = answers ? (closing?.image ?? activeStep?.image) : activeStep?.image;
  const panelCaption = answers ? (closing?.caption ?? activeStep?.caption) : activeStep?.caption;

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

  /** A stored value is a choice label first, and whatever was typed otherwise. */
  const readable = (step: BriefStep, value: string) =>
    step.choices?.find((choice) => choice.value === value)?.label ?? value;

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

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative h-96 overflow-hidden rounded-md bg-muted md:h-[34rem]">
              {panelImage && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={panelImage.src}
                  alt={panelImage.alt}
                />
              )}
            </div>
            {panelCaption && (
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{panelCaption}</p>
            )}
          </div>

          <div>
            {answers && closing ? (
              <>
                <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {closing.title}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {closing.description}
                </p>

                <dl className="mt-8 flex flex-col">
                  {steps.map((step, index) => {
                    const given = answers[step.name] ?? [];
                    return (
                      <div
                        key={index}
                        className="grid gap-1 border-t border-current/10 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-6"
                      >
                        <dt className="text-base text-muted-foreground md:text-lg">{step.title}</dt>
                        <dd className="text-base font-bold break-words text-foreground md:text-lg">
                          {given.length > 0
                            ? given.map((value) => readable(step, value)).join(", ")
                            : (closing.emptyLabel ?? "Left blank")}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {button && (
                    <Button12 asChild label={button.label}>
                      <Link href={button.href} />
                    </Button12>
                  )}
                  <button
                    type="button"
                    onClick={restart}
                    className="cursor-pointer text-base font-bold text-foreground underline underline-offset-4"
                  >
                    {restartLabel ?? "Write a different one"}
                  </button>
                </div>
              </>
            ) : (
              <Questionnaire
                defaultItem={steps[0]?.name}
                onItemChange={setActiveName}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {steps.length > 0 && <QuestionnaireProgress className="text-base" />}

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
                          type={step.input.type ?? "text"}
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
                  <QuestionnaireNext className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                    {nextLabel}
                  </QuestionnaireNext>
                  <QuestionnaireSubmit className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                    {submitLabel}
                  </QuestionnaireSubmit>
                </QuestionnaireActions>
              </Questionnaire>
            )}
          </div>
        </div>

        {notes.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {notes.map((note, index) => (
              <div key={index} className="border-t border-current/10 pt-6">
                <p className="text-xl font-bold tracking-tight text-foreground">{note.title}</p>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {note.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
