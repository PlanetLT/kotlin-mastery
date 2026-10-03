import Link from "next/link";
import type { Lesson } from "@/domain/lesson";
import { lessonPath } from "@/application/curriculum";
import { CodeBlock } from "@/presentation/code-block";
import { Exercise } from "@/presentation/exercise";
import { LessonMenu } from "@/presentation/lesson-menu";
import { MarkRead } from "@/presentation/mark-read";
import type { MenuPart } from "@/presentation/menu";
import { Quiz } from "@/presentation/quiz";
import { RichText } from "@/presentation/rich-text";
import { Badge, cn } from "@/shared/ui";

const LEVEL_LABEL = {
  beginner: "Beginner",
  working: "Working",
  pro: "Pro",
} as const;

export function LessonScreen({
  lesson,
  parts,
  previous,
  next,
}: {
  lesson: Lesson;
  parts: readonly MenuPart[];
  previous?: Lesson;
  next?: Lesson;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-14 hidden max-h-[calc(100svh-3.5rem)] overflow-y-auto border-r border-border px-4 py-8 lg:block">
        <LessonMenu parts={parts} currentId={lesson.id} />
      </aside>
      <article className="min-w-0 px-4 py-10 sm:px-8 sm:py-12">
        <p className="font-mono text-[11px] tracking-[0.16em] text-primary uppercase">
          Lesson {lesson.order} · {lesson.minutes} min
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">{lesson.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/80">{lesson.summary}</p>
        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {lesson.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] tracking-wide uppercase hover:bg-muted"
            >
              {section.heading}
            </a>
          ))}
        </nav>

        {lesson.sections.map((section) => (
          <section key={section.id} id={section.id} className="mt-10 scroll-mt-20">
            <h2 className="font-serif text-2xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-2xl text-base leading-7">
                <RichText text={paragraph} />
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-base leading-7">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <RichText text={bullet} />
                  </li>
                ))}
              </ul>
            ) : null}
            {section.code ? <CodeBlock source={section.code.source} caption={section.code.caption} /> : null}
            {section.callouts?.map((callout) => (
              <aside
                key={callout.title}
                className={cn(
                  "mt-5 max-w-2xl rounded-xl border px-4 py-3",
                  callout.level === "pro" ? "border-primary/40 bg-primary/5" : "border-border bg-card",
                )}
              >
                <Badge variant={callout.level === "pro" ? "default" : "outline"}>{LEVEL_LABEL[callout.level]}</Badge>
                <h3 className="mt-2 font-serif text-lg">{callout.title}</h3>
                <p className="mt-1 text-sm leading-6">
                  <RichText text={callout.body} />
                </p>
              </aside>
            ))}
          </section>
        ))}

        <aside className="mt-10 max-w-2xl rounded-xl bg-foreground px-5 py-4 text-background">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-background/70">You can do this now</p>
          <p className="mt-2 leading-7">{lesson.checkpoint}</p>
        </aside>

        <Exercise exercise={lesson.exercise} />
        <Quiz lessonId={lesson.id} questions={lesson.quiz} />
        <MarkRead lessonId={lesson.id} />

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl">Sources</h2>
          <ul className="mt-3 max-w-2xl space-y-2 text-sm leading-6">
            {lesson.sources.map((source) => (
              <li key={source.url}>
                <a className="underline decoration-primary/50 underline-offset-4" href={source.url}>
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          {previous ? (
            <Link href={lessonPath(previous.slug)} className="rounded-xl border border-border px-4 py-3 hover:bg-muted">
              <span className="font-mono text-[11px] tracking-wide uppercase text-muted-foreground">Previous</span>
              <span className="mt-1 block font-serif text-lg">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={lessonPath(next.slug)} className="rounded-xl border border-border px-4 py-3 hover:bg-muted sm:text-right">
              <span className="font-mono text-[11px] tracking-wide uppercase text-muted-foreground">Next</span>
              <span className="mt-1 block font-serif text-lg">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}
