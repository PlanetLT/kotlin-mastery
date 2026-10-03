---
name: clean-architecture
description: >-
  Place code in the layer-based clean architecture and keep usages centralized.
  Use when adding a type, use case, adapter, catalog entry, import, or feature.
---

# Layer-based clean architecture

Dependencies point inward. Inner layers do not import outer layers.

```
presentation  -->  application  -->  domain
infrastructure --> application
infrastructure --> domain
```

| Layer | Path | May import | Must not import |
| --- | --- | --- | --- |
| Domain | `src/domain` | nothing in this repo | React, Next, infrastructure, presentation |
| Application | `src/application` | `src/domain` and port types | React, Next, `localStorage`, concrete adapters |
| Infrastructure | `src/infrastructure` | domain, application ports | presentation components |
| Presentation | `src/presentation` and `src/app` | application, composition, `@/shared/ui` | `localStorage`, primitive paths, lesson modules |

`src/shared/ui` is the UI kit, not a layer of business rules. It does not import domain or application.

## What each layer owns

- **Domain.** Lesson, section, quiz, exercise, source, and progress types. Pure rules: grade a quiz, decide whether a lesson is complete, compute path counts. No side effects.
- **Application.** Use cases: `getCurriculum`, `getLesson`, `listSources`, `gradeQuiz`, `recordProgress`. They accept ports or plain values. They do not construct adapters.
- **Infrastructure.** The lesson catalog (one registry), the `localStorage` progress adapter, and the composition modules that wire adapters to use cases.
- **Presentation.** Route files and visual components. Routes stay thin: load through the server composition module, then render.

## Composition

- Server wiring lives in `src/infrastructure/composition/server.ts`. Pages import that module, not individual lesson files and not use cases plus adapters side by side.
- Browser wiring lives in `src/infrastructure/composition/browser.ts` (`"use client"`). Client hooks import `getProgressStore()` from there. That file is the only production caller of the `localStorage` adapter.

## Centralized usages

- **UI.** `@/shared/ui` is the only public import for shadcn primitives. Adding a primitive includes its export in `src/shared/ui/index.ts`.
- **Lessons.** A lesson is one module under `src/infrastructure/content/lessons`. Register it with a single line in `src/infrastructure/content/catalog.ts`. Do not import a lesson module from a page.
- **Paths.** Lesson hrefs are built by one function, `lessonPath(slug)`, in the application layer. Do not hand-write `` `/lessons/${slug}` `` in components.
- **Progress.** Read and write only through the `ProgressStore` port. Keys, JSON shape, and the storage name live in the adapter.
- **Sources.** The sources page is a use case over the catalog (`listSources`). Do not maintain a second handwritten bibliography that can drift from the lessons.
- **Theme.** Tokens live in `src/app/globals.css`. Shared frames (`LessonFrame`, `PathList`, `Quiz`, `Exercise`) are reused. Do not copy a lesson layout into a new page.
- **No root barrel.** Do not add `src/index.ts` that re-exports every layer. Centralize inside the layer that owns the usage.

## When you add a lesson

1. Create the lesson module (content only, typed as `Lesson`).
2. Register it in the catalog.
3. Do not touch route files unless the URL shape changes. `generateStaticParams` already reads the catalog through composition.
