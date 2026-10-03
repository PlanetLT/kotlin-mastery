import type { Lesson } from "@/domain/lesson";

export const jvmAndTheFirstProgram: Lesson = {
  id: "jvm-and-the-first-program",
  slug: "jvm-and-the-first-program",
  partId: "jvm",
  order: 2,
  title: "The JVM, types, and functions",
  summary: "Values, variables, basic types, and functions that say what they return.",
  minutes: 25,
  checkpoint: "You can declare a val, write a function with an explicit return type, and explain why Android code can call a Java API.",
  sections: [
    {
      id: "jvm",
      heading: "Kotlin/JVM is the required target",
      paragraphs: [
        "Kotlin is a language with several compilers. Kotlin/JVM emits bytecode for the Java Virtual Machine. Kotlin/JS emits JavaScript. Kotlin/Native emits binaries that do not need a JVM. Android Studio uses the JVM compiler. The Android Gradle Plugin then packages that bytecode into the APK, along with the Android framework.",
        "Interoperability is the practical consequence. A Kotlin function can take a `java.io.File` or an `android.content.Context` with no wrapper language. Java can also call your Kotlin, with a few naming rules you will meet when a Java caller cannot see a `companion object` the way you expect. You do not translate Android's Java APIs into Kotlin by hand. You call them.",
      ],
      callouts: [
        {
          level: "pro",
          title: "Bytecode is not an excuse to ignore null",
          body: "Java types are platform types when Kotlin does not know if they are null. A return value from an old Java API can crash with a NullPointerException even though your Kotlin file looks null-safe. Treat platform types as untrusted until you check them.",
        },
      ],
    },
    {
      id: "vals",
      heading: "val, var, and the basic types",
      paragraphs: [
        "`val` names a read-only binding. `var` names a binding you can assign again. Prefer `val`. Most data on a screen does not need to be reassigned in place. You replace the whole state instead, which you will do with a sealed type later.",
        "The types you will type every day are `String`, `Int`, `Long`, `Double`, `Boolean`, and `Unit`. `Unit` is the type of a function that does not return a useful value. It is not the same idea as a missing value. Missing values are null, and the next lesson is about them.",
        "Type inference works when the right-hand side already has a type. Write the type when the value is public, when the type is easy to misread, or when you are looking at a function signature. A signature is documentation that the compiler checks.",
      ],
      code: {
        caption: "Read-only bindings, and a function whose return type is visible.",
        source: `val appName: String = "Field Notes"
var unreadCount = 0

fun greeting(name: String): String {
    return "Hello, $name"
}

fun bumpUnread() {
    unreadCount = unreadCount + 1
}`,
      },
    },
    {
      id: "functions",
      heading: "Functions, strings, and expression bodies",
      paragraphs: [
        "A function is `fun`, a name, parameters, and a return type. The last expression can be returned with `return`, or the whole function can be a single expression after `=`. Use the expression form when the function is one line and obviously pure. Use a block when there are branches.",
        "String templates interpolate with `$name` or `${user.name}`. They are the ordinary way to build a label. Do not concatenate with `+` unless you are joining a list you already decided to format yourself.",
        "Default arguments replace most overloads. A caller can skip `prefix` when the default is right. Named arguments help when a call has several parameters of the same type, which is common in Compose (`color`, `modifier`, and more).",
      ],
      code: {
        source: `fun label(count: Int, prefix: String = "Notes"): String {
    return "$prefix: $count"
}

fun isEmpty(count: Int): Boolean = count == 0

val title = label(count = 3)`,
      },
      callouts: [
        {
          level: "beginner",
          title: "Semicolons are optional",
          body: "You do not end Kotlin lines with semicolons. A newline ends the statement. You will still see semicolons in Java files that sit next to your Kotlin.",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Write a function `fun noteTitle(topic: String, pinned: Boolean = false): String` that returns `\"Pinned: $topic\"` when `pinned` is true and `topic` otherwise. Call it twice from `main` or from a composable: once with the default, once with `pinned = true`.",
    starter: `fun noteTitle(topic: String, pinned: Boolean = false): String {
    TODO()
}`,
    solution: `fun noteTitle(topic: String, pinned: Boolean = false): String {
    if (pinned) return "Pinned: $topic"
    return topic
}

fun main() {
    println(noteTitle("Market"))
    println(noteTitle("Market", pinned = true))
}`,
  },
  quiz: [
    {
      id: "val",
      prompt: "What does val mean?",
      choices: [
        "The binding can be assigned again later",
        "The binding is read-only",
        "The value is stored only in a database",
        "The value cannot be null, even from Java",
      ],
      answerIndex: 1,
      explanation: "val cannot be reassigned. It does not by itself mean the object is deeply immutable, and it does not protect you from Java nulls.",
    },
    {
      id: "unit",
      prompt: "A function written as fun bump() { count = count + 1 } returns which type?",
      choices: ["Nothing", "void", "Unit", "Any"],
      answerIndex: 2,
      explanation: "Kotlin uses Unit where Java uses void. Nothing is a different type, used for functions that never return normally.",
    },
    {
      id: "interop",
      prompt: "Why can Kotlin call android.content.Context?",
      choices: [
        "Context was rewritten in Kotlin in the SDK",
        "Kotlin/JVM bytecode can call Java types directly",
        "Compose translates Java into Kotlin at runtime",
        "Only Kotlin/Native can see Android APIs",
      ],
      answerIndex: 1,
      explanation: "Android Kotlin is Kotlin/JVM. Java Android APIs are called directly from Kotlin.",
    },
  ],
  sources: [
    { title: "Kotlin basic syntax", url: "https://kotlinlang.org/docs/basic-syntax.html" },
    { title: "Learn Kotlin on Android", url: "https://developer.android.com/kotlin/learn" },
    { title: "Calling Java from Kotlin", url: "https://kotlinlang.org/docs/java-interop.html" },
    { title: "Packages and the JVM", url: "https://kotlinlang.org/docs/packages.html" },
  ],
};
