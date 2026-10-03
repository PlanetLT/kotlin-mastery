import type { Lesson, PartMeta, SourceLink } from "@/domain/lesson";

export type SourceGroup = {
  topic: string;
  links: readonly SourceLink[];
};

export function listSources(
  lessons: readonly Lesson[],
  parts: readonly PartMeta[],
): readonly SourceGroup[] {
  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  return parts
    .map((part) => {
      const seen = new Set<string>();
      const links: SourceLink[] = [];
      for (const lesson of ordered) {
        if (lesson.partId !== part.id) continue;
        for (const source of lesson.sources) {
          if (seen.has(source.url)) continue;
          seen.add(source.url);
          links.push(source);
        }
      }
      return { topic: part.title, links };
    })
    .filter((group) => group.links.length > 0);
}
