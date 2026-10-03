import type { Metadata } from "next";
import { loadSources } from "@/infrastructure/composition/server";

export const metadata: Metadata = {
  title: "Sources",
  description: "Official Kotlin, Android, and Gradle pages cited by the field guide.",
};

export default function SourcesPage() {
  const groups = loadSources();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-primary uppercase">References</p>
      <h1 className="mt-3 font-heading text-4xl">Sources</h1>
      <p className="mt-4 text-lg leading-8 text-foreground/80">
        The lessons are original. These are the official pages they are checked against. If a sentence
        and a doc disagree, the doc wins.
      </p>
      <div className="mt-10 flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.topic}>
            <h2 className="font-heading text-2xl">{group.topic}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
