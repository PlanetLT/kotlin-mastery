---
name: next-stack
description: >-
  Build and change this repo's UI with Next.js App Router, TypeScript, Tailwind,
  and shadcn/ui. Use when adding a page, component, style, client interaction,
  or design token.
---

# Next.js, TypeScript, Tailwind, shadcn/ui

This site is a reading guide. The stack stays small: Next.js App Router, strict TypeScript, Tailwind, and shadcn/ui. Do not add another component library, CSS framework, or state library.

## App Router

- Routes live in `src/app`. A route file composes a screen. It does not grade quizzes, read `localStorage`, or reshape lesson data.
- Server Components are the default. Add `"use client"` only for a quiz, a revealed solution, progress, a copy button, or a mobile menu.
- Dynamic lesson routes use `generateStaticParams` from the lesson catalog so every lesson is a real page.
- Metadata (`title`, `description`) is set per route from lesson fields, not hardcoded duplicates.

## TypeScript

- `strict` stays on. No `any`. No non-null assertions used to silence a missing lesson; return a not-found UI instead.
- Props and content types come from `src/domain`. Do not redeclare a lesson, quiz, or progress shape in a component.
- Prefer `readonly` arrays on content that never mutates.

## Tailwind and tokens

- Design tokens live only in `src/app/globals.css` (shadcn CSS variables plus the paper, ink, and accent roles).
- Do not invent one-off hex colors in components. Use the token utilities (`bg-background`, `text-foreground`, `bg-primary`, `font-sans`, `font-heading`, `font-mono`).
- Combine classes with `cn()` from `@/shared/ui`. Do not add another classnames helper.
- The reading layout is the product: Source Sans 3 for body, navigation, buttons, and labels; Source Serif 4 for headings; Source Code Pro for code. One accent. Keep it paper and ink. No gradient heroes, no glass cards, no purple theme.

## shadcn/ui

- Primitives are generated into `src/shared/ui/primitives`.
- Feature code imports from `@/shared/ui` only. Never import `@/shared/ui/primitives/...` from a page or lesson component.
- Use the primitives that exist (Button, Card, Badge, Accordion, Progress, Sheet, Separator). Extend a primitive with `className` for layout, not by copying its markup into a new button.
- Add a primitive with the shadcn CLI, then re-export it from `src/shared/ui/index.ts` in the same change.

## Client boundaries

- A client component receives plain data (strings, numbers, serializable lesson fields) as props.
- Progress writes go through the progress port exposed by the composition module. Components never call `localStorage` directly.
- Do not fetch lesson content from the client. Lessons are compiled into the server bundle.
