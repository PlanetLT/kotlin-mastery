import type { ProgressStore } from "@/application/ports";
import { emptyProgress, type ProgressState } from "@/domain/progress";

const STORAGE_KEY = "kotlin-field-guide.progress.v1";

let snapshot: ProgressState = emptyProgress;
let hydrated = false;
const listeners = new Set<() => void>();

function isProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== "object") return false;
  const record = value as ProgressState;
  return Array.isArray(record.completedLessonIds) && !!record.quizScores && typeof record.quizScores === "object";
}

function load(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed: unknown = JSON.parse(raw);
    if (!isProgressState(parsed)) return emptyProgress;
    return {
      completedLessonIds: parsed.completedLessonIds.filter((id) => typeof id === "string"),
      quizScores: parsed.quizScores,
    };
  } catch {
    return emptyProgress;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export const localStorageProgressStore: ProgressStore = {
  read() {
    if (typeof window === "undefined") return emptyProgress;
    if (!hydrated) {
      snapshot = load();
      hydrated = true;
    }
    return snapshot;
  },
  write(state) {
    snapshot = state;
    hydrated = true;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    emit();
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
