import type { Lesson } from "@/domain/lesson";

export const kotlinMultiplatform: Lesson = {
  id: "kotlin-multiplatform",
  slug: "kotlin-multiplatform",
  partId: "later",
  order: 19,
  title: "Kotlin Multiplatform",
  summary: "Share logic with iOS only when the product actually runs there. Skip it for Android-only.",
  minutes: 18,
  checkpoint: "You can say what expect and actual are for, and you can justify skipping multiplatform for an Android-only app.",
  sections: [
    {
      id: "skip",
      heading: "Skip it when the app is Android-only",
      paragraphs: [
        "Kotlin Multiplatform compiles the same Kotlin to more than one target. A `commonMain` source set holds code that is valid everywhere. `androidMain` holds Android-only code. `iosMain` holds Apple-only code. The pitch is sharing the repository, the validation, and the use cases with an iOS app.",
        "That pitch is a cost if you do not have the other app. You take on source sets, a second set of tests, and APIs that must exist without Android's `Context`. You delay the Android screen to design a platform split nobody calls. For an Android-only product, stay on Kotlin/JVM and the Android libraries. Revisit multiplatform when an iOS client is a real commitment, not a maybe.",
        "Compose Multiplatform, which draws UI on iOS and desktop from composables, is a further decision. It is not required to share a repository. Many teams share logic and keep SwiftUI on Apple platforms. This guide does not teach that UI. It tells you the decision exists so you do not confuse it with Jetpack Compose for Android.",
      ],
    },
    {
      id: "expect",
      heading: "expect and actual are the escape hatch",
      paragraphs: [
        "Some operations have no common API. The current time, a file path, a settings store. You declare `expect fun platformName(): String` in common code and write `actual fun platformName(): String` in each platform source set. The compiler checks that every target provides an actual.",
        "Prefer a common library before you write expect/actual. Kotlinx coroutines, serialization, and datetime run on the targets they support. An expect/actual pair is for the thin edge you cannot express in common code. A giant expect/actual that hides an entire database is a second app with extra steps.",
        "The hands-on Kotlin Multiplatform tutorials build a small shared client with Ktor. Read them when you have two targets. Copying that structure into an Android-only repository adds modules without a caller on the other side.",
      ],
      code: {
        caption: "Common declaration, and one Android actual. An iOS actual would live in iosMain.",
        source: `// commonMain
expect fun platformName(): String

// androidMain
actual fun platformName(): String = "Android"`,
      },
      callouts: [
        {
          level: "working",
          title: "What is worth sharing",
          body: "Share pure decisions: validation, mapping DTOs to domain models, and use cases that return sealed results. Do not share composables, ViewModels that need Android lifecycles, or anything that imports android.*. Those stay in androidMain.",
        },
      ],
    },
    {
      id: "later",
      heading: "How you will know it is time",
      paragraphs: [
        "It is time when the same rules are being reimplemented in Swift, and the two copies have already drifted. It is time when a product requirement says the offline notebook logic must match on both phones. It is not time because a conference talk used multiplatform, and it is not time because value classes and multiplatform both showed up in a keyword list.",
        "Until then, the professional Android path is the one you just walked. Kotlin/JVM, sealed UI state, Gradle Kotlin DSL when the build asks, Compose, coroutines and Flow, one screen with a repository and a ViewModel. That is the job. The rest is a measured optimization or a second platform.",
      ],
    },
  ],
  exercise: {
    prompt: "Write a short decision for this product: a notes app with no iOS client and no schedule for one. In four or five sentences, say whether you adopt Kotlin Multiplatform, what you would put in commonMain if you did later, and what stays Android-only. Do not add a KMP module to the project.",
    solution: "Do not adopt Kotlin Multiplatform. There is no second platform to compile for, so source sets would only slow the Android app. Later, commonMain could hold note validation, the sealed load result, and a repository interface that does not mention Android. androidMain would keep Room or Retrofit, the ViewModel, and the Compose screens. iosMain would supply the actual storage and would not be created until an iOS app exists.",
  },
  quiz: [
    {
      id: "when",
      prompt: "When is Kotlin Multiplatform worth adopting?",
      choices: [
        "For every Android app, on day one",
        "When the same logic must also run on iOS or another platform",
        "Whenever you use Compose",
        "When you want value classes",
      ],
      answerIndex: 1,
      explanation: "Multiplatform pays for itself when another target will run the shared code. An Android-only app can skip it.",
    },
    {
      id: "expect",
      prompt: "What is expect/actual for?",
      choices: [
        "Declaring a platform-specific API in common code and implementing it per target",
        "Replacing suspend",
        "Marking a composable as stable",
        "Version catalogs",
      ],
      answerIndex: 0,
      explanation: "expect declares the API once. Each target provides an actual implementation.",
    },
    {
      id: "share",
      prompt: "Which piece is a poor candidate for commonMain?",
      choices: [
        "A pure validation function",
        "A sealed result type",
        "A ViewModel that imports android.app",
        "A mapping from a DTO to a domain model",
      ],
      answerIndex: 2,
      explanation: "Android lifecycle types and android.* imports stay in the Android source set. Pure logic can be common.",
    },
  ],
  sources: [
    { title: "Kotlin Multiplatform", url: "https://kotlinlang.org/docs/multiplatform.html" },
    { title: "Expected and actual declarations", url: "https://kotlinlang.org/docs/multiplatform-expect-actual.html" },
    { title: "Kotlin Multiplatform hands-on", url: "https://kotlinlang.org/docs/kotlin-hands-on.html" },
    { title: "Get started with Kotlin Multiplatform", url: "https://kotlinlang.org/docs/multiplatform-get-started.html" },
  ],
};
