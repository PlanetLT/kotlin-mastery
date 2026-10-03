import {
  getCurriculum,
  getLesson,
  lessonParams,
  neighborLessons,
} from "@/application/curriculum";
import { listSources } from "@/application/sources";
import { lessons } from "@/infrastructure/content/catalog";
import { parts } from "@/infrastructure/content/parts";

export function loadCurriculum() {
  return getCurriculum(lessons, parts);
}

export function loadLesson(slug: string) {
  return getLesson(lessons, slug);
}

export function loadNeighbors(slug: string) {
  return neighborLessons(lessons, slug);
}

export function loadLessonParams() {
  return lessonParams(lessons);
}

export function loadSources() {
  return listSources(lessons, parts);
}
