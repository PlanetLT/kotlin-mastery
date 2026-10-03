"use client";

import { useState } from "react";
import { gradeLessonQuiz } from "@/application/grading";
import type { QuizQuestion } from "@/domain/lesson";
import { useGuideProgress } from "@/presentation/progress-provider";
import { Button, cn } from "@/shared/ui";

export function Quiz({ lessonId, questions }: { lessonId: string; questions: readonly QuizQuestion[] }) {
  const progress = useGuideProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const grade = gradeLessonQuiz(
    questions.map((question) => ({ id: question.id, answerIndex: question.answerIndex })),
    answers,
  );

  function choose(questionId: string, index: number) {
    setAnswers((current) => ({ ...current, [questionId]: index }));
    setSubmitted(false);
  }

  function check() {
    const next = gradeLessonQuiz(
      questions.map((question) => ({ id: question.id, answerIndex: question.answerIndex })),
      answers,
    );
    setSubmitted(true);
    if (next.complete) progress.saveQuiz(lessonId, next);
  }

  const saved = progress.state.quizScores[lessonId];

  return (
    <section aria-labelledby="quiz-heading" className="mt-12 border-t border-border pt-8">
      <h2 id="quiz-heading" className="font-heading text-2xl">
        Check yourself
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        A perfect score marks the lesson complete. A miss stays on the page so you can change the answer.
        {saved ? ` Last score saved in this browser: ${saved.correct}/${saved.total}.` : ""}
      </p>
      <ol className="mt-6 flex flex-col gap-8">
        {questions.map((question, questionIndex) => {
          const result = submitted ? grade.results.find((item) => item.questionId === question.id) : undefined;
          return (
            <li key={question.id}>
              <fieldset>
                <legend className="text-base leading-7">
                  {questionIndex + 1}. {question.prompt}
                </legend>
                <div className="mt-3 flex flex-col gap-2">
                  {question.choices.map((choice, index) => {
                    const selected = answers[question.id] === index;
                    const show = submitted && selected;
                    return (
                      <label
                        key={choice}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm leading-6",
                          selected ? "border-foreground" : "border-border",
                          show && result?.correct && "border-primary",
                          show && result && !result.correct && "border-destructive",
                        )}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          className="mt-1.5 accent-primary"
                          checked={selected}
                          onChange={() => choose(question.id, index)}
                        />
                        <span>{choice}</span>
                      </label>
                    );
                  })}
                </div>
                {submitted && result?.answered ? (
                  <p className={cn("mt-2 text-sm leading-6", result.correct ? "text-primary" : "text-destructive")}>
                    {result.correct ? "Right. " : "Not this one. "}
                    {question.explanation}
                  </p>
                ) : null}
                {submitted && result && !result.answered ? (
                  <p className="mt-2 text-sm text-destructive">Choose an answer.</p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <Button type="button" className="mt-6" onClick={check}>
        Check answers
      </Button>
      {submitted && grade.perfect ? (
        <p className="mt-3 text-sm text-primary">Perfect. This lesson is marked complete on this browser.</p>
      ) : null}
    </section>
  );
}
