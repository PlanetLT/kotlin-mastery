"use client";

import type { ProgressStore } from "@/application/ports";
import { localStorageProgressStore } from "@/infrastructure/progress/local-storage-store";

export function getProgressStore(): ProgressStore {
  return localStorageProgressStore;
}
