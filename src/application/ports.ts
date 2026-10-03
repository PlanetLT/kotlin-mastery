import type { ProgressState } from "@/domain/progress";

export interface ProgressStore {
  read(): ProgressState;
  write(state: ProgressState): void;
  subscribe(listener: () => void): () => void;
}
