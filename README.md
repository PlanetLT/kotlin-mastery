# Kotlin Field Guide

A beginner-to-pro reading guide for people who build Android apps. It teaches Kotlin in the order a screen actually needs it: the JVM, objects and companions, data and sealed types, Gradle Kotlin DSL when the build breaks, Jetpack Compose, coroutines and Flow, then one screen that uses all of them. Value classes and Kotlin Multiplatform come last, with an explicit reason to skip them on an Android-only app.

The lessons are original. Each one cites the official Kotlin, Android, or Gradle page it was checked against. Those links are collected again on the sources page.

## Run it locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

The guide stores quiz scores and completed lessons in this browser only. There is no account and no server.

## GitHub Pages

The production build is a static export in `out/`. Publishing is a manual GitHub Actions workflow, [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

Once, in the GitHub repository:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.

Then, whenever you want to publish:

1. Open **Actions → Deploy GitHub Pages**.
2. Choose **Run workflow**.
3. Leave **site** as `project` for `https://<owner>.github.io/<repo>/`. Choose `root` for a user or organization site (`https://<owner>.github.io/`) or a custom domain.

The workflow installs dependencies, builds with that URL prefix, and deploys the `out` folder. It does not run on push.

## Vercel

Publishing to Vercel is a separate manual workflow, [`.github/workflows/deploy-vercel.yml`](.github/workflows/deploy-vercel.yml). The site is served from the domain root. Leave the Vercel project disconnected from Git so this workflow is the only deploy path.

Once, on your machine:

```bash
npx vercel link
```

That writes `.vercel/project.json` (gitignored). Create a token at [vercel.com/account/tokens](https://vercel.com/account/tokens).

Then, in the GitHub repository, open **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
| --- | --- |
| `VERCEL_TOKEN` | The token you created |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

Whenever you want to publish:

1. Open **Actions → Deploy Vercel**.
2. Choose **Run workflow**.

The workflow builds on the GitHub runner and uploads that build to Vercel production. The deployment URL is in the job summary. It does not run on push.

## Where code lives

| Layer | Path | Responsibility |
| --- | --- | --- |
| Domain | `src/domain` | Lesson, quiz, and progress types, plus grading and completion rules |
| Application | `src/application` | Use cases: curriculum, sources, grading, progress updates, and the lesson URL |
| Infrastructure | `src/infrastructure` | The lesson catalog, the `localStorage` adapter, and composition |
| Presentation | `src/presentation` and `src/app` | Pages and the reading UI |
| UI kit | `src/shared/ui` | shadcn/ui primitives. Feature code imports `@/shared/ui` |

Project skills in `.cursor/skills/` describe the Next.js stack and these layer rules.

## What you still do in Android Studio

This site does not compile Kotlin. Create an Empty Activity project in Android Studio and paste a lesson's snippets there when you want to run them. The install steps are in the first lesson.
# kotlin-mastery
