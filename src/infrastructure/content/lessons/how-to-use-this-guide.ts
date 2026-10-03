import type { Lesson } from "@/domain/lesson";

export const howToUseThisGuide: Lesson = {
  id: "how-to-use-this-guide",
  slug: "how-to-use-this-guide",
  partId: "start",
  order: 1,
  title: "How to use this guide",
  summary: "Android-only Kotlin, taught in the order a screen actually needs it.",
  minutes: 12,
  checkpoint: "You can name the eight topics, say which two wait until later, and open a new Android project in Android Studio.",
  sections: [
    {
      id: "who",
      heading: "This is an Android guide",
      paragraphs: [
        "Every Android app you ship is Kotlin compiled for the JVM. The Android runtime is not a separate Kotlin. Your classes become JVM bytecode, and that bytecode calls the Android APIs, most of which are still Java types. If you learn Kotlin/JS or Kotlin/Native first, you will learn a real language and still be unable to open `Activity` or `ViewModel`.",
        "Jetpack Compose is the UI you should learn first. New screens are functions that describe what should be on screen, then the toolkit updates the pixels. XML layouts still exist in old code. You can read them later. You should not start there.",
        "This guide stays on that path. It does not tour the whole language before you can show a list, and it does not pretend Gradle is a subject you study in isolation.",
      ],
    },
    {
      id: "order",
      heading: "Priority is not the same as teaching order",
      paragraphs: [
        "The topics that matter, in the order an Android job asks for them, are Kotlin/JVM, Compose, coroutines and Flow, data and sealed classes, Gradle Kotlin DSL, objects and companions, then multiplatform and value classes only when they earn a place.",
        "You cannot write an honest Compose screen before you can model `Loading`, `Success`, and `Error`. You cannot add the Compose libraries before you can read `build.gradle.kts`. So the lessons follow dependencies, and the map below is how that lines up with the priority list.",
      ],
      bullets: [
        "Kotlin/JVM comes first, because everything else is written in it.",
        "Objects and companions come early. They are small, and Android code uses them for constants immediately.",
        "Data classes and sealed classes come before Compose, because they are how a screen describes its state.",
        "Gradle is taught when the first library has to be added, not as a separate course.",
        "Compose comes next, then coroutines and Flow, then one screen that uses all of them.",
        "Value classes are a later optimization. Skip them until a measurement says a wrapper is hot.",
        "Kotlin Multiplatform is worth it only when the same logic must also run on iOS or another platform. Skip it for an Android-only app.",
      ],
    },
    {
      id: "studio",
      heading: "What to install",
      paragraphs: [
        "Install Android Studio from the official download page, not a random mirror. During setup, install the current Android SDK and one recent system image so the emulator can boot. Create a project with the Empty Activity template and the Kotlin language. That template is already Compose.",
        "You will live in two files at the start: `MainActivity.kt` and the module `build.gradle.kts`. The first is your screen. The second is how libraries get into the app. This site does not compile Kotlin for you. Paste the snippets into that project when a lesson says to try something.",
        "Use a physical phone if you have one, with USB debugging on. The emulator is fine when you do not. Either one is enough to see a composable update.",
      ],
      callouts: [
        {
          level: "beginner",
          title: "You do not need a server",
          body: "The first half of this guide runs inside the sample app. No backend, no account, no Firebase. A repository that returns a hardcoded list is a real repository for learning.",
        },
      ],
    },
    {
      id: "how-to-read",
      heading: "How a lesson is shaped",
      paragraphs: [
        "Each lesson ends with a checkpoint, one exercise, and a short quiz. The checkpoint is the skill, in one sentence. The exercise is something you can type into Android Studio. The quiz is finished only when every answer is right, and that is what marks the lesson complete. You can also mark a lesson read if you already know it.",
        "Callouts are labeled Beginner, Working, and Pro. Read the beginner notes on the first pass. The pro notes are the part you come back to when a code review asks why a `Flow` is cold or why a composable restarted.",
        "Sources sit at the bottom of every lesson and again on the sources page. The explanations here are original. The links are the official Kotlin docs, Android docs, Gradle docs, and the Now in Android sample. When a sentence and a doc disagree, the doc wins, and you should treat that as a bug in the guide.",
      ],
    },
  ],
  exercise: {
    prompt: "In Android Studio, create an Empty Activity project named Field Notes. Confirm the language is Kotlin and that `MainActivity.kt` contains a `@Composable` function. Change the greeting string to your name and run it on a device or emulator.",
    solution: "File, New, New Project, Empty Activity. Set the name, choose Kotlin, and finish. Open `app/src/main/java/.../MainActivity.kt`. The `Greeting` composable takes a `name` and displays it in a `Text`. Change the call site to `Greeting(\"Ada\")` or edit the default argument. Run the app configuration. If the emulator is slow the first time, wait for the system image to finish booting. The screen should show your string, which proves the project is a Kotlin/JVM Android app using Compose.",
  },
  quiz: [
    {
      id: "target",
      prompt: "What does an Android app compile Kotlin to?",
      choices: [
        "Kotlin/JS bundles for the WebView",
        "JVM bytecode that calls Android APIs",
        "A separate Android bytecode that cannot call Java",
        "Native code only, via Kotlin/Native",
      ],
      answerIndex: 1,
      explanation: "Android apps are Kotlin/JVM. The compiler emits JVM bytecode, and that code calls Android and Java APIs directly.",
    },
    {
      id: "compose-first",
      prompt: "Which UI toolkit should you learn first for new Android screens?",
      choices: [
        "XML layouts and ViewBinding",
        "Jetpack Compose",
        "Kotlin Multiplatform Compose for iOS",
        "A web view with HTML",
      ],
      answerIndex: 1,
      explanation: "New Android screens are written in Jetpack Compose. XML still appears in older codebases, and multiplatform UI is a later decision.",
    },
    {
      id: "skip",
      prompt: "When should you skip Kotlin Multiplatform?",
      choices: [
        "When the app also has a settings screen",
        "When you use coroutines",
        "When the app is Android-only",
        "When you use Gradle Kotlin DSL",
      ],
      answerIndex: 2,
      explanation: "Multiplatform pays off when the same logic must run on iOS or another platform. An Android-only app does not need it.",
    },
  ],
  sources: [
    { title: "Learn the Kotlin programming language", url: "https://developer.android.com/kotlin/learn" },
    { title: "Android Basics with Compose", url: "https://developer.android.com/courses/android-basics-compose/course" },
    { title: "Get started with Jetpack Compose", url: "https://developer.android.com/develop/ui/compose/documentation" },
    { title: "Download Android Studio", url: "https://developer.android.com/studio" },
  ],
};
