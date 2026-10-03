"use client";

import Link from "next/link";
import { useGuideProgress } from "@/presentation/progress-provider";
import type { MenuPart } from "@/presentation/menu";
import { Badge, Button, Card, CardContent, Progress, ProgressLabel, ProgressValue } from "@/shared/ui";

const STATUS_COPY = {
  empty: "You have not marked a lesson yet. Start with how the guide is organized, then the JVM.",
  "in-progress": "You are partway through the path. The next unfinished lesson is the one to open.",
  finished: "You have finished every lesson. Come back when a screen needs the pro notes.",
} as const;

export function GuideHome({ parts }: { parts: readonly MenuPart[] }) {
  const progress = useGuideProgress();
  const lessonIds = parts.flatMap((part) => part.lessons.map((lesson) => lesson.id));
  const total = lessonIds.length;
  const done = progress.done(lessonIds);
  const status = progress.status(lessonIds);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
        Android · Kotlin/JVM
      </p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-tight sm:text-5xl">
        Learn Kotlin in the order an app actually needs it.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/80">
        Every Android app is Kotlin on the JVM. New screens are Jetpack Compose. Data moves
        through coroutines and Flow, and the screen state is a sealed type. This guide teaches
        that path, and it tells you when to skip multiplatform and value classes.
      </p>

      <Card className="mt-8 max-w-2xl">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-xl">Your place on the path</h2>
            <Badge variant="outline">{statusLabel(status)}</Badge>
          </div>
          <Progress value={percent}>
            <ProgressLabel className="font-sans text-xs font-medium tracking-wide uppercase">
              {done} of {total} lessons
            </ProgressLabel>
            <ProgressValue />
          </Progress>
          <p className="text-sm leading-6 text-muted-foreground">{STATUS_COPY[status]}</p>
          {done > 0 ? (
            <Button variant="ghost" className="self-start" onClick={progress.reset}>
              Clear progress
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <section className="mt-12" aria-labelledby="path-heading">
        <h2 id="path-heading" className="font-heading text-2xl">
          The path
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Priority and teaching order are not the same list. Compose matters more than companion
          objects, but you model state before you draw it, and you read Gradle when a library has
          to be added.
        </p>
        <div className="mt-8 flex flex-col gap-10">
          {parts.map((part, partIndex) => (
            <section key={part.id} aria-labelledby={`part-${part.id}`}>
              <h3 id={`part-${part.id}`} className="font-heading text-xl">
                {partIndex + 1}. {part.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{part.summary}</p>
              <ol className="mt-4 divide-y divide-border border-y border-border">
                {part.lessons.map((lesson) => {
                  const complete = progress.complete(lesson.id);
                  const score = progress.state.quizScores[lesson.id];
                  return (
                    <li key={lesson.id}>
                      <Link href={lesson.href} className="group grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline">
                        <span>
                          <span className="font-heading text-lg font-semibold tracking-[-0.015em] group-hover:underline">
                            {lesson.title}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                            {lesson.summary}
                          </span>
                        </span>
                        <span className="font-sans text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                          {lesson.minutes} min · {lessonMark(complete, score)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

function statusLabel(status: "empty" | "in-progress" | "finished"): string {
  if (status === "finished") return "Finished";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

function lessonMark(
  complete: boolean,
  score: { correct: number; total: number } | undefined,
): string {
  if (complete) return "Done";
  if (score) return `Quiz ${score.correct}/${score.total}`;
  return "Not started";
}
