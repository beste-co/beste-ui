"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import Link from "next/link";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { Card31 } from "@/components/beste/piece/card31";
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

interface TileImage {
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
  /** Form field name. Must be unique across the intake. */
  name: string;
  title: string;
  description?: string;
  choices?: IntakeChoice[];
}

interface Route {
  /**
   * Field name to answer value. A route is only matched when every pair fits.
   * Leave it out on the last route, which is the catch-all.
   */
  match?: Record<string, string>;
  title: string;
  summary: string;
  facts?: Fact[];
  /** Piece floated over the image tile once this route is matched */
  media?: ReactNode;
}

interface Booking29Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  matchTitle?: string;
  waitingTitle?: string;
}

interface Booking29Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  questions?: IntakeQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Checked in order; the first one whose `match` fits the answers wins. */
  routes?: Route[];
  /** Backdrop behind the floated piece */
  image?: TileImage;
  /** Piece shown on the tile before anything has been answered */
  media?: ReactNode;
  /** Copy under the tile while the questions are still open */
  waitingBody?: string;
  button?: ActionLink;
  labels?: Booking29Labels;
  className?: string;
}

export const booking29Demo: Booking29Props = {
  badge: { label: "Before you book" },
  heading: "Three questions decide the appointment, not a drop-down",
  description:
    "Every combination lands on a real appointment type with a named clinician and a length, so nobody arrives for twenty minutes that needed an hour.",
  shortcuts: "numbers",
  labels: {
    submit: "Match me",
    restart: "Change my answers",
    matchTitle: "Your appointment",
    waitingTitle: "On duty today",
  },
  waitingBody:
    "Whoever you end up with, the notes follow you. Nobody has to hear the same history twice.",
  questions: [
    {
      name: "reason",
      title: "What brings you in?",
      description: "The closest one. It only sets the length and who you sit with.",
      choices: [
        {
          value: "assessment",
          label: "Something new",
          description: "A symptom or a concern nobody here has looked at yet.",
        },
        {
          value: "review",
          label: "A follow-up",
          description: "Checking in on something already being treated.",
        },
        {
          value: "advice",
          label: "A question, not a problem",
          description: "Medication, a letter, or a second opinion.",
        },
      ],
    },
    {
      name: "history",
      title: "Have you been seen here before?",
      choices: [
        { value: "new", label: "First time" },
        { value: "returning", label: "I am already registered" },
      ],
    },
    {
      name: "when",
      title: "When would you rather come in?",
      choices: [
        { value: "soon", label: "The soonest slot going" },
        { value: "evening", label: "After work, if possible" },
        { value: "any", label: "Whenever suits the clinic" },
      ],
    },
  ],
  routes: [
    {
      match: { reason: "assessment", history: "new" },
      title: "First assessment, 60 minutes",
      summary:
        "A full first appointment with the assessment lead. Longer than a standard slot because the history is taken from the beginning.",
      facts: [
        { label: "With", value: "Dr Amelia Frost" },
        { label: "Length", value: "60 minutes" },
        { label: "Bring", value: "Any current medication" },
      ],
      media: (
        <Card31
          avatar={{
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop",
            alt: "Portrait of Dr Amelia Frost",
          }}
          name="Dr Amelia Frost"
          role="Assessment lead"
          status="Next free Wednesday 09:00"
          availability="soon"
          rows={[
            { label: "Appointment", value: "60 minutes" },
            { label: "Site", value: "Bramble Health" },
            { label: "Waiting", value: "6 days on median" },
          ]}
        />
      ),
    },
    {
      match: { reason: "review" },
      title: "Follow-up review, 30 minutes",
      summary:
        "Back with the clinician who is already holding your plan, so the appointment starts where the last one finished.",
      facts: [
        { label: "With", value: "Your named clinician" },
        { label: "Length", value: "30 minutes" },
        { label: "Bring", value: "Nothing, we have the notes" },
      ],
      media: (
        <Card31
          avatar={{
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
            alt: "Portrait of Dr Owen Meade",
          }}
          name="Dr Owen Meade"
          role="Your named clinician"
          status="Next free tomorrow 11:30"
          availability="free"
          rows={[
            { label: "Appointment", value: "30 minutes" },
            { label: "Site", value: "Kingsway Clinic" },
            { label: "Waiting", value: "2 days on median" },
          ]}
        />
      ),
    },
    {
      title: "Advice call, 15 minutes",
      summary:
        "A short call with whoever is on duty. If it turns out to need a room and an hour, they book that for you before hanging up.",
      facts: [
        { label: "With", value: "The duty practitioner" },
        { label: "Length", value: "15 minutes, by phone" },
        { label: "Bring", value: "The question, written down" },
      ],
      media: (
        <Card31
          avatar={{
            src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=160&h=160&fit=crop",
            alt: "Portrait of Sara Okonjo",
          }}
          name="Sara Okonjo"
          role="Duty practitioner"
          status="Calling back within the hour"
          availability="free"
          rows={[
            { label: "Appointment", value: "15 minutes" },
            { label: "Site", value: "By phone" },
            { label: "Waiting", value: "Same day" },
          ]}
        />
      ),
    },
  ],
  media: (
    <Card31
      avatar={{
        src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=160&h=160&fit=crop",
        alt: "Portrait of Sara Okonjo",
      }}
      name="Sara Okonjo"
      role="Duty practitioner"
      status="Free from 09:30 today"
      availability="free"
      rows={[
        { label: "Covering", value: "All four sites" },
        { label: "Answering", value: "Calls and messages" },
        { label: "Until", value: "18:00" },
      ]}
    />
  ),
  image: {
    src: "https://images.unsplash.com/photo-1750918619871-dc74c9a57394?q=80&w=2222&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Soft blue gradient backdrop",
  },
  button: { label: "Choose a time", href: "https://beste.co" },
};

export function Booking29({
  badge,
  heading,
  description,
  questions = [],
  shortcuts,
  routes = [],
  image,
  media,
  waitingBody,
  button,
  labels = {},
  className,
}: Booking29Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    matchTitle,
    waitingTitle,
  } = labels;

  const [route, setRoute] = useState<Route | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const given: Record<string, string> = {};
    for (const question of questions) {
      given[question.name] = String(data.get(question.name) ?? "");
    }

    // The last route stands in when nothing fits, so a submit never dead-ends.
    const matched = routes.find((entry) =>
      Object.entries(entry.match ?? {}).every(([name, value]) => given[name] === value)
    );
    setRoute(matched ?? routes[routes.length - 1] ?? null);
  };

  const restart = () => setRoute(null);

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

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div>
            {route ? (
              <>
                {matchTitle && <p className="text-sm text-muted-foreground">{matchTitle}</p>}
                <p className="mt-3 text-2xl font-light tracking-tight text-foreground md:text-3xl">
                  {route.title}
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {route.summary}
                </p>

                {route.facts && route.facts.length > 0 && (
                  <dl className="mt-8">
                    {route.facts.map((fact, index) => (
                      <div
                        key={index}
                        className="grid gap-1 border-b border-border py-4 first:border-t sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] sm:gap-4"
                      >
                        <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                        <dd className="text-base text-foreground">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {button && (
                    <Button21 asChild label={button.label}>
                      <Link href={button.href} />
                    </Button21>
                  )}
                  <Button21
                    label={restartLabel ?? "Change my answers"}
                    tone="outline"
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

          <div>
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-md bg-muted md:h-[26rem]">
              {image && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              )}
              <div className="relative z-10 size-full">{route?.media ?? media}</div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-lg font-medium text-foreground">
                {route ? route.title : (waitingTitle ?? "On duty today")}
              </p>
              {waitingBody && (
                <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {waitingBody}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
