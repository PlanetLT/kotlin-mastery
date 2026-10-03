import type { Lesson } from "@/domain/lesson";

export const gradleKotlinDsl: Lesson = {
  id: "gradle-kotlin-dsl",
  slug: "gradle-kotlin-dsl",
  partId: "gradle",
  order: 10,
  title: "Gradle Kotlin DSL, when the build breaks",
  summary: "Read build.gradle.kts, add a library with the Compose BOM, and fix the failures you will actually hit.",
  minutes: 26,
  checkpoint: "You can find the Compose BOM in the version catalog, add a dependency, and name the usual sync failure.",
  sections: [
    {
      id: "files",
      heading: "Two Gradle files, plus a catalog",
      paragraphs: [
        "You do not need a Gradle course. You need to read the files Android Studio already generated. The project `build.gradle.kts` declares plugins that subprojects can use. The module file, usually `app/build.gradle.kts`, is the one that sets `namespace`, `compileSdk`, `minSdk`, and `dependencies`. Kotlin DSL means those files are Kotlin, so you get completion and the compiler checks the script.",
        "`gradle/libs.versions.toml` is the version catalog. Versions live there once, under `[versions]`, libraries under `[libraries]`, and plugins under `[plugins]`. The module then writes `implementation(libs.androidx.lifecycle.viewmodel.compose)` instead of a raw string with a version. When a tutorial shows `implementation(\"androidx.something:something:1.2.3\")`, translate it into the catalog instead of pasting a second source of truth.",
        "Sync the project after a Gradle edit. Sync is not a run. It resolves dependencies and regenerates the IDE model. If sync fails, the app will not run, and reading the first error is faster than changing random versions.",
      ],
      code: {
        caption: "A catalog entry and the module line that uses it.",
        source: `# gradle/libs.versions.toml
[versions]
composeBom = "2026.02.00"

[libraries]
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }

# app/build.gradle.kts
dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
}`,
      },
      callouts: [
        {
          level: "beginner",
          title: "The BOM has no classes",
          body: "The Compose Bill of Materials sets versions so your Compose artifacts agree. You still depend on ui, material3, and the others. You do not depend on the BOM alone and expect Text to appear.",
        },
      ],
    },
    {
      id: "blocks",
      heading: "The blocks you will edit",
      paragraphs: [
        "`plugins` applies the Android application plugin and Kotlin. `android { defaultConfig { minSdk ... } }` is where a library's required API level fights yours. `buildFeatures { compose = true }` must be on for Compose. The Kotlin Compose compiler plugin is applied as a Gradle plugin in current Android templates, not as a free-floating compiler extension version you hunt for in a blog post from 2023.",
        "`implementation` puts a library on the compile and runtime classpath of this module. `debugImplementation` is only for debug builds, which is where you want Compose tooling. `testImplementation` is for unit tests. Adding a UI library as `testImplementation` is a common way to get an unresolved reference in `MainActivity`.",
        "Module boundaries matter more than syntax. `app` depends on `feature` and `core`. Those modules do not depend back on `app`. You will not need a second module on day one. You will need to know that `internal` stops at the module, which you already met.",
      ],
    },
    {
      id: "failures",
      heading: "The failures worth recognizing",
      paragraphs: [
        "Unresolved reference after you added an import usually means the dependency is missing, on the wrong configuration, or the sync did not finish. Read the import, find the artifact, add it, sync.",
        "A minSdk error means the library calls APIs newer than your `minSdk`. Raise `minSdk` if you can, or pick an older library. Do not suppress the lint check and hope the phone is new.",
        "Duplicate classes or mismatched Compose versions mean two artifacts brought different Compose versions. Rely on the BOM and remove hardcoded Compose versions. A Kotlin version mismatch surfaces as a compiler plugin error. Align the Kotlin Gradle plugin with the Compose compiler plugin the Android template expects, then sync. Changing only one of them is how that error survives.",
        "If Gradle itself will not start, the first lines of the build output name the JDK. Android Studio ships a JDK. Use that embedded JDK unless you have a reason not to. Installing a random system Java and pointing `JAVA_HOME` at it is a separate outage.",
      ],
      callouts: [
        {
          level: "pro",
          title: "Stop when the error names a version",
          body: "Copy the version conflict into the catalog and delete the other declaration. Adding `resolutionStrategy.force` hides the conflict until the next library. Force is a last resort you can explain, not a habit.",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Open your Empty Activity project. In `gradle/libs.versions.toml`, find the Compose BOM version. In `app/build.gradle.kts`, find the `platform(...)` line and one Compose `implementation` that does not repeat a version number. Write down, in a comment at the top of `MainActivity.kt`, the BOM version and `minSdk` you found. Do not add a new library yet.",
    solution: "The catalog key is often `composeBom` or similar, and the module uses `implementation(platform(libs.androidx.compose.bom))` followed by artifacts such as `libs.androidx.ui` or `libs.androidx.material3` without versions. `minSdk` is inside `android.defaultConfig` in `app/build.gradle.kts`. A comment such as `// BOM 2026.02.00, minSdk 24` is enough. If your template inlines versions instead of a catalog, the same facts are string versions in `dependencies` and `defaultConfig`. The exercise is to read them, not to modernize the file.",
  },
  quiz: [
    {
      id: "bom",
      prompt: "What does the Compose BOM do?",
      choices: [
        "Draws Material widgets",
        "Aligns the versions of Compose libraries you depend on",
        "Replaces build.gradle.kts",
        "Sets minSdk automatically",
      ],
      answerIndex: 1,
      explanation: "The BOM is a platform dependency that picks a consistent set of Compose versions. You still add the libraries you use.",
    },
    {
      id: "unresolved",
      prompt: "An unresolved reference appears right after a new import. What do you check first?",
      choices: [
        "Whether the dependency is declared and Gradle has synced",
        "Whether the phone is plugged in",
        "Whether the function is a value class",
        "Whether you need Kotlin Multiplatform",
      ],
      answerIndex: 0,
      explanation: "Most new unresolved references are a missing dependency or a sync that has not picked it up.",
    },
    {
      id: "catalog",
      prompt: "Why put versions in libs.versions.toml?",
      choices: [
        "Gradle Kotlin DSL cannot contain version numbers",
        "One catalog is the source of truth instead of copied version strings",
        "The file is shipped inside the APK",
        "It disables the BOM",
      ],
      answerIndex: 1,
      explanation: "The version catalog names versions once. Modules reference aliases. That is how you avoid two Compose versions.",
    },
  ],
  sources: [
    { title: "Gradle Kotlin DSL", url: "https://docs.gradle.org/current/userguide/kotlin_dsl.html" },
    { title: "Compose BOM", url: "https://developer.android.com/develop/ui/compose/bom" },
    { title: "Version catalogs", url: "https://docs.gradle.org/current/userguide/version_catalogs.html" },
    { title: "Android Gradle plugin", url: "https://developer.android.com/build" },
  ],
};
