"use client";

import type { Exercise as ExerciseModel } from "@/domain/lesson";
import { CodeBlock } from "@/presentation/code-block";
import { RichText } from "@/presentation/rich-text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

export function Exercise({ exercise }: { exercise: ExerciseModel }) {
  return (
    <section aria-labelledby="exercise-heading" className="mt-12 border-t border-border pt-8">
      <h2 id="exercise-heading" className="font-heading text-2xl">
        Try this
      </h2>
      <p className="mt-3 text-base leading-8">
        <RichText text={exercise.prompt} />
      </p>
      {exercise.starter ? <CodeBlock source={exercise.starter} caption="Starter" /> : null}
      <Accordion className="mt-4">
        <AccordionItem value="solution">
          <AccordionTrigger className="font-sans text-xs font-medium tracking-wide uppercase">
            Show one solution
          </AccordionTrigger>
          <AccordionContent>
            <CodeBlock source={exercise.solution} caption="One solution" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
