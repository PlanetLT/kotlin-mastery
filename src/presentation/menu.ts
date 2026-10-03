import { lessonPath } from "@/application/curriculum";
import type { Curriculum } from "@/domain/lesson";

export type MenuLesson = {
  id: string;
  title: string;
  href: string;
  minutes: number;
  summary: string;
};

export type MenuPart = {
  id: string;
  title: string;
  summary: string;
  lessons: MenuLesson[];
};

export function toMenu(curriculum: Curriculum): MenuPart[] {
  return curriculum.parts.map((part) => ({
    id: part.id,
    title: part.title,
    summary: part.summary,
    lessons: part.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      href: lessonPath(lesson.slug),
      minutes: lesson.minutes,
      summary: lesson.summary,
    })),
  }));
}
