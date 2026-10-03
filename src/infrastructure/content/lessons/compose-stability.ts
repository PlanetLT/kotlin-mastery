import type { Lesson } from "@/domain/lesson";

export const composeStability: Lesson = {
  id: "compose-stability",
  slug: "compose-stability",
  partId: "compose",
  order: 14,
  title: "Stability and skipping",
  summary: "Why Compose restarts a function, and the small set of fixes that matter.",
  minutes: 22,
  checkpoint: "You can explain skippable composables, and you know not to chase stability before the screen is correct.",
  sections: [
    {
      id: "skip",
      heading: "Skipping is the performance feature you get for free",
      paragraphs: [
        "If the inputs of a composable have not changed, Compose can skip calling it. Inputs are the parameters. A parameter is stable when Compose can tell that it changed, either because it is immutable or because it reports changes. Strings, ints, and your sealed UI state of `val` data classes are the easy cases.",
        "A class with a `var` that Compose does not track is unstable. Passing it in forces the child to run again whenever the parent runs, because Compose cannot be sure the fields stayed put. The fix is usually to pass the fields the child actually reads, or to make the model an immutable data class.",
        "This is a pro topic on purpose. A skipped composable will not fix a screen that loads on the main thread or a list without keys. Measure jank with the layout inspector and macrobenchmark when a list scrolls badly. Do not annotate the whole codebase with `@Stable` on a hunch.",
      ],
    },
    {
      id: "restarts",
      heading: "What causes a restart",
      paragraphs: [
        "Reading snapshot state subscribes the reader. A `ViewModel` that exposes one giant state object is fine when the screen is small. When a ticking timer sits in that same object, every reader restarts, including the list. Split the timer from the list state, and read each in the composable that draws it.",
        "Lambdas allocate. A lambda created in composition changes every time unless you `remember` it. Unstable lambdas defeat skipping in children that take `onClick`. `remember(key) { { viewModel.onClick(id) } }` is the tool when a profiler says the row is recomposing because of the lambda, not because the title changed.",
        "Defer reading state with a lambda trailing parameter when a parent should not subscribe. The parent passes `title = { state.title }` and the child reads it. You will rarely need this on a first screen. You need it when a parent of a long list is restarting because it read one field for a header.",
      ],
      callouts: [
        {
          level: "pro",
          title: "Strong skipping",
          body: "Recent Compose compilers can skip more aggressively. The rule you can keep is still the old one: pass stable values, read state as low in the tree as you can, and do not mutate a list that a composable already captured.",
        },
      ],
    },
    {
      id: "dont",
      heading: "What not to do early",
      paragraphs: [
        "Do not mark a mutable type `@Stable` to silence a warning if it is not actually stable. The annotation is a promise. If you mutate the object without going through snapshot state, Compose will skip a function that should have run, and the bug looks like a stale UI.",
        "Do not replace a clear `data class` with a hand-rolled mutable model for speed. Correct state and a keyed lazy list solve the problems beginners can see. Stability work starts when those are done and a trace still shows wasted composition.",
      ],
    },
  ],
  exercise: {
    prompt: "A `NoteRow` takes a whole `Note` and only reads `title`. The parent also stores a `now: Long` in the same state object as the list, and the row recomposes every second. Name two changes that stop the row from caring about the clock, without mentioning value classes.",
    solution: "Split the clock out of the list state so the list composable does not read `now`. Pass `title: String` (and the id for the click) into `NoteRow` instead of the whole object if the row does not need the rest. Remember the click lambda with the id as its key if the lambda identity is what still invalidates the row. Do not mark Note @Stable unless it really never changes without a new instance.",
  },
  quiz: [
    {
      id: "skip",
      prompt: "When can Compose skip a composable?",
      choices: [
        "When its inputs are unchanged and stable enough to compare",
        "Only when it is a Text",
        "Whenever the phone is charging",
        "Only if you add @Stable to every class",
      ],
      answerIndex: 0,
      explanation: "Skipping depends on unchanged inputs Compose knows how to compare. It is not limited to Text, and @Stable is not the starting move.",
    },
    {
      id: "stable-lie",
      prompt: "What goes wrong if you mark a mutable class @Stable but mutate it quietly?",
      choices: [
        "The app refuses to compile",
        "Compose may skip UI that should have updated",
        "The class becomes a value class",
        "Coroutines cancel",
      ],
      answerIndex: 1,
      explanation: "@Stable promises Compose it will hear about changes. A silent mutation makes skipping show stale UI.",
    },
    {
      id: "first",
      prompt: "What should you fix before chasing stability?",
      choices: [
        "A list with no keys, or work done on the main thread",
        "The app's package name",
        "Value classes on every id",
        "Kotlin Multiplatform",
      ],
      answerIndex: 0,
      explanation: "Keys, bounded lazy lists, and moving work off the main thread dwarf stability annotations for a first app.",
    },
  ],
  sources: [
    { title: "Compose performance", url: "https://developer.android.com/develop/ui/compose/performance" },
    { title: "Compiler metrics and stability", url: "https://developer.android.com/develop/ui/compose/performance/stability" },
    { title: "Compose API guidelines", url: "https://android.googlesource.com/platform/frameworks/support/+/androidx-main/compose/docs/compose-api-guidelines.md" },
  ],
};
