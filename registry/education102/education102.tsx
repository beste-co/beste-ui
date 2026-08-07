"use client";

import { ArrowUpRight, Check, RotateCcw, X } from "lucide-react";
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

interface StatItem {
  title: string;
  value: string;
}

interface ResourceLink {
  title: string;
  description: string;
  href: string;
}

interface QuizChoice {
  value: string;
  label: string;
  description?: string;
}

interface QuizQuestion {
  /** Form field name. Must be unique across the quiz. */
  name: string;
  title: string;
  description?: string;
  choices?: QuizChoice[];
  /**
   * The answer key. A string is a single-answer question; an array turns the
   * question into a checkbox set that only counts as correct when the whole
   * set matches.
   */
  answer: string | string[];
  /** Shown under the question in the review, once the quiz is graded */
  explanation?: string;
}

interface QuizLabels {
  previous?: string;
  next?: string;
  submit?: string;
  retry?: string;
  scoreTitle?: string;
  passed?: string;
  failed?: string;
  yourAnswer?: string;
  correctAnswer?: string;
  noAnswer?: string;
}

interface Education102Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  stats?: StatItem[];
  quizHeading?: string;
  quizDescription?: string;
  questions?: QuizQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Percent needed to pass. Omit to grade without a pass or fail line. */
  passingScore?: number;
  /** Prints the right answer and the explanation in the review */
  showAnswerKey?: boolean;
  labels?: QuizLabels;
  resourcesTitle?: string;
  resources?: ResourceLink[];
  className?: string;
}

/** Order-insensitive comparison key for a set of answer values. */
function answerKey(values: string[]) {
  return JSON.stringify([...values].sort());
}

function expected(question: QuizQuestion) {
  return Array.isArray(question.answer) ? question.answer : [question.answer];
}

export const education102Demo: Education102Props = {
  badge: { label: "Module 3" },
  heading: "Check what stuck before you move on",
  description:
    "Five questions on accessible forms. You see the right answer and the reason for it as soon as you finish, and you can retake it as often as you like.",
  stats: [
    { title: "Questions", value: "5" },
    { title: "To pass", value: "60%" },
    { title: "Attempts", value: "No limit" },
  ],
  quizHeading: "Lesson 3 check",
  quizDescription: "Press a letter key to answer without reaching for the mouse.",
  shortcuts: "letters",
  passingScore: 60,
  showAnswerKey: true,
  labels: {
    submit: "Finish quiz",
    retry: "Try again",
    scoreTitle: "Your score",
    passed: "Passed. Lesson 4 is unlocked.",
    failed: "Not quite. Read the notes below and take it again.",
  },
  questions: [
    {
      name: "label",
      title: "What gives a text input its accessible name?",
      answer: "label",
      explanation:
        "A label element with a matching for attribute is the only one of these the browser exposes as the field's name to every assistive technology.",
      choices: [
        { value: "label", label: "A label pointing at the input's id" },
        { value: "placeholder", label: "The placeholder attribute" },
        { value: "title", label: "The title attribute" },
        { value: "nearby", label: "Text sitting next to the field" },
      ],
    },
    {
      name: "error",
      title: "An error message appears under a field. What has to be true?",
      answer: "described",
      explanation:
        "aria-describedby ties the message to the field, so it is read out with the field rather than stranded in the page.",
      choices: [
        { value: "described", label: "The field references it with aria-describedby" },
        { value: "red", label: "It is red" },
        { value: "icon", label: "It has a warning icon" },
        { value: "top", label: "It is repeated at the top of the form" },
      ],
    },
    {
      name: "grouping",
      title: "Which of these belong around a set of radio buttons?",
      description: "Two answers are right.",
      answer: ["fieldset", "legend"],
      explanation:
        "A fieldset groups the controls and its legend names the group, which is what turns four loose radios into one question.",
      choices: [
        { value: "fieldset", label: "A fieldset element" },
        { value: "legend", label: "A legend element" },
        { value: "table", label: "A table element" },
        { value: "role-list", label: "A list role on the wrapper" },
      ],
    },
    {
      name: "focus",
      title: "Where should focus go after a failed submit?",
      answer: "first-invalid",
      explanation:
        "Moving focus to the first invalid field puts the person at the thing they have to fix, instead of at the top of a page they have to re-read.",
      choices: [
        { value: "first-invalid", label: "The first invalid field" },
        { value: "submit", label: "Back on the submit button" },
        { value: "body", label: "Nowhere in particular" },
        { value: "top", label: "The page heading" },
      ],
    },
    {
      name: "target",
      title: "What is the minimum target size a control should meet?",
      answer: "24",
      explanation:
        "WCAG 2.2 sets 24 by 24 CSS pixels as the floor, and 44 by 44 as the comfortable size most touch guidelines land on.",
      choices: [
        { value: "16", label: "16 by 16 pixels" },
        { value: "24", label: "24 by 24 pixels" },
        { value: "40", label: "40 by 40 pixels" },
        { value: "none", label: "There is no minimum" },
      ],
    },
  ],
  resourcesTitle: "If a question caught you out",
  resources: [
    {
      title: "Naming form controls",
      description: "Labels, legends, and the three things that are not a name.",
      href: "https://beste.co",
    },
    {
      title: "Errors people can act on",
      description: "Wording, placement, and where focus belongs after a failed submit.",
      href: "https://beste.co",
    },
    {
      title: "Target sizes in WCAG 2.2",
      description: "The 24 pixel floor, the exceptions, and how to measure it.",
      href: "https://beste.co",
    },
  ],
};

export function Education102({
  badge,
  heading,
  description,
  stats = [],
  quizHeading,
  quizDescription,
  questions = [],
  shortcuts,
  passingScore,
  showAnswerKey = true,
  labels = {},
  resourcesTitle,
  resources = [],
  className,
}: Education102Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    retry: retryLabel,
    scoreTitle,
    passed: passedLabel,
    failed: failedLabel,
    yourAnswer: yourAnswerLabel,
    correctAnswer: correctAnswerLabel,
    noAnswer: noAnswerLabel,
  } = labels;

  const [graded, setGraded] = useState<{
    score: number;
    total: number;
    percent: number;
    passed: boolean;
    answers: Record<string, string[]>;
    correct: Record<string, boolean>;
  } | null>(null);
  /**
   * Only observed, never enforced: the quiz stays uncontrolled so the primitive
   * keeps owning navigation, and this is here purely to draw the bar.
   */
  const [activeName, setActiveName] = useState(questions[0]?.name);

  const activeIndex = Math.max(
    0,
    questions.findIndex((question) => question.name === activeName)
  );
  const percentThrough = questions.length > 0 ? ((activeIndex + 1) / questions.length) * 100 : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers: Record<string, string[]> = {};
    const correct: Record<string, boolean> = {};

    for (const question of questions) {
      const given = data
        .getAll(question.name)
        .map((entry) => String(entry))
        .filter((entry) => entry.length > 0);
      answers[question.name] = given;
      correct[question.name] = answerKey(given) === answerKey(expected(question));
    }

    const score = questions.filter((question) => correct[question.name]).length;
    const total = questions.length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    setGraded({
      score,
      total,
      percent,
      passed: passingScore === undefined || percent >= passingScore,
      answers,
      correct,
    });
  };

  const retry = () => {
    setGraded(null);
    setActiveName(questions[0]?.name);
  };

  const readable = (question: QuizQuestion, value: string) =>
    question.choices?.find((choice) => choice.value === value)?.label ?? value;

  return (
    <section className={cn("w-full bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
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

        {stats.length > 0 && (
          <dl className="mt-12 grid gap-8 sm:grid-cols-3 md:mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="border-t border-border pt-5">
                <dt className="text-sm text-muted-foreground">{stat.title}</dt>
                <dd className="mt-3 text-4xl font-light tracking-tight text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-12 md:mt-16">
          {graded ? (
            <>
              <p className="text-sm text-muted-foreground">{scoreTitle ?? "Your score"}</p>
              <p className="mt-3 text-4xl font-light tracking-tight text-foreground md:text-6xl">
                {graded.score}
                <span className="text-muted-foreground"> of {graded.total}</span>
              </p>

              <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${graded.percent}%` }}
                />
              </div>

              {passingScore !== undefined && (
                <p
                  className={cn(
                    "mt-5 text-base",
                    graded.passed ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {graded.passed ? (passedLabel ?? "Passed") : (failedLabel ?? "Not passed")}
                </p>
              )}

              <ul className="mt-10">
                {questions.map((question, index) => {
                  const isCorrect = graded.correct[question.name] ?? false;
                  const given = graded.answers[question.name] ?? [];
                  return (
                    <li
                      key={index}
                      className="flex gap-4 border-b border-border py-5 first:border-t"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                          isCorrect
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        {isCorrect ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-medium text-foreground">{question.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {yourAnswerLabel ?? "Your answer"}
                          {": "}
                          {given.length > 0
                            ? given.map((value) => readable(question, value)).join(", ")
                            : (noAnswerLabel ?? "Not answered")}
                        </p>
                        {showAnswerKey && !isCorrect && (
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {correctAnswerLabel ?? "Correct answer"}
                            {": "}
                            {expected(question)
                              .map((value) => readable(question, value))
                              .join(", ")}
                          </p>
                        )}
                        {showAnswerKey && question.explanation && (
                          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <Button21
                  label={retryLabel ?? "Try again"}
                  tone="outline"
                  icon={RotateCcw}
                  onClick={retry}
                />
              </div>
            </>
          ) : (
            <>
              {(quizHeading || quizDescription) && (
                <div className="mb-8">
                  {quizHeading && (
                    <p className="text-xl font-medium text-foreground">{quizHeading}</p>
                  )}
                  {quizDescription && (
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {quizDescription}
                    </p>
                  )}
                </div>
              )}

              <Questionnaire
                defaultItem={questions[0]?.name}
                onItemChange={setActiveName}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {questions.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <QuestionnaireProgress className="text-sm font-normal tracking-normal" />
                    <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${percentThrough}%` }}
                      />
                    </div>
                  </div>
                )}

                {questions.map((question, index) => (
                  <QuestionnaireItem
                    key={index}
                    name={question.name}
                    required
                    multiple={Array.isArray(question.answer)}
                  >
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
            </>
          )}
        </div>

        {resources.length > 0 && (
          <div className="mt-12 md:mt-16">
            {resourcesTitle && (
              <p className="text-xl font-medium text-foreground">{resourcesTitle}</p>
            )}
            <div className="mt-6">
              {resources.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.href}
                  className="group/education102 flex items-start justify-between gap-6 border-b border-border py-5 first:border-t"
                >
                  <div className="min-w-0">
                    <p className="text-lg font-medium text-foreground">{resource.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover/education102:-translate-y-0.5 motion-safe:group-hover/education102:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
