import type {
  Curriculum,
  Lesson,
  LessonNeighbors,
  PartMeta,
} from "@/domain/lesson";

export function lessonPath(slug: string): string {
  return `/lessons/${slug}`;
}

export function getCurriculum(
  lessons: readonly Lesson[],
  parts: readonly PartMeta[],
): Curriculum {
  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const grouped = parts.map((part) => ({
    ...part,
    lessons: ordered.filter((lesson) => lesson.partId === part.id),
  }));
  return { parts: grouped, lessons: ordered };
}

export function getLesson(
  lessons: readonly Lesson[],
  slug: string,
): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function neighborLessons(
  lessons: readonly Lesson[],
  slug: string,
): LessonNeighbors {
  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((lesson) => lesson.slug === slug);
  if (index < 0) return {};
  return {
    previous: ordered[index - 1],
    next: ordered[index + 1],
  };
}

export function lessonParams(lessons: readonly Lesson[]): { slug: string }[] {
  return [...lessons]
    .sort((a, b) => a.order - b.order)
    .map((lesson) => ({ slug: lesson.slug }));
}
