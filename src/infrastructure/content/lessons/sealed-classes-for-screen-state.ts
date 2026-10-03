import type { Lesson } from "@/domain/lesson";

export const sealedClassesForScreenState: Lesson = {
  id: "sealed-classes-for-screen-state",
  slug: "sealed-classes-for-screen-state",
  partId: "model",
  order: 9,
  title: "Sealed classes for screen state",
  summary: "Loading, Success, and Error as a closed set the compiler checks.",
  minutes: 24,
  checkpoint: "You can model a screen as a sealed interface and write a when that has no else.",
  sections: [
    {
      id: "sealed",
      heading: "A sealed type lists every direct child",
      paragraphs: [
        "A `sealed interface` or `sealed class` restricts which types may implement it. Every direct subtype is known when the module compiles. No other module can add a surprise state. That is the opposite of an open interface, where a new implementation can appear from anywhere.",
        "Direct subtypes must live in the same package. They can be top-level or nested. They can be data classes when they carry data, and objects when they do not. `Loading` usually carries nothing. `Success` carries the notes. `Error` carries a message you are willing to show.",
        "Prefer a sealed interface when the branches do not need a shared constructor. Prefer a sealed class when every branch shares an id or a common property. For screen state, a sealed interface is the usual choice.",
      ],
      code: {
        source: `sealed interface NotesUiState {
    data object Loading : NotesUiState
    data class Success(val notes: List<Note>) : NotesUiState
    data class Error(val message: String) : NotesUiState
}`,
      },
    },
    {
      id: "when",
      heading: "when without else is the point",
      paragraphs: [
        "Once `NotesUiState` is sealed, `when (state)` must handle `Loading`, `Success`, and `Error`, or it must have an `else`. Leave `else` off. The day you add `Empty`, the compiler lists every screen that forgot it. An `else` that draws a blank box will not.",
        "Inside the `Success` branch the compiler smart-casts, so `state.notes` is available. You do not check a boolean `isLoading` and also check whether `notes` is null. Those flags can be true together. A sealed type makes the illegal combinations unrepresentable.",
        "`data object` is the current way to declare a singleton branch that should have value equality generated cleanly. A plain `object Loading` still works. Use `data object` for state branches so `equals` behaves like the data classes beside it.",
      ],
      code: {
        source: `fun titleFor(state: NotesUiState): String = when (state) {
    NotesUiState.Loading -> "Loading"
    is NotesUiState.Success -> "\${state.notes.size} notes"
    is NotesUiState.Error -> state.message
}`,
      },
      callouts: [
        {
          level: "working",
          title: "Model the screen, not the HTTP client",
          body: "A 404 and a timeout can both become NotesUiState.Error if the screen shows the same kind of message and retry button. Keep the protocol details in the repository. Let the UI state describe what the user can see and do.",
        },
      ],
    },
    {
      id: "api",
      heading: "The same tool models API results",
      paragraphs: [
        "A repository can return `sealed interface NoteResult` with `Found` and `Missing` before the ViewModel maps that into UI state. The mapping is a function, not a tangle of nulls. The UI does not import Retrofit error types.",
        "Do not make one giant sealed hierarchy for the whole app. Each feature owns the states its screen can show. A notes screen and a settings screen do not share a parent just because both can fail.",
      ],
    },
  ],
  exercise: {
    prompt: "Declare `sealed interface SaveState` with `object Idle`, `object Saving`, `data class Saved(val id: String)`, and `data class Failed(val message: String)`. Write `fun canEdit(state: SaveState): Boolean` that is true only for `Idle` and `Failed`, using `when` and no `else`.",
    solution: `sealed interface SaveState {
    data object Idle : SaveState
    data object Saving : SaveState
    data class Saved(val id: String) : SaveState
    data class Failed(val message: String) : SaveState
}

fun canEdit(state: SaveState): Boolean = when (state) {
    SaveState.Idle, is SaveState.Failed -> true
    SaveState.Saving, is SaveState.Saved -> false
}`,
  },
  quiz: [
    {
      id: "where",
      prompt: "Where must a direct subtype of a sealed type be declared?",
      choices: [
        "In the same file only",
        "In the same package, inside the same module",
        "Anywhere in the project",
        "Only as a nested class",
      ],
      answerIndex: 1,
      explanation: "Direct subtypes of a sealed class or interface must be in the same package and module. They may be nested or top-level.",
    },
    {
      id: "else",
      prompt: "Why omit else when switching on a sealed UI state?",
      choices: [
        "else is illegal on sealed types",
        "A new state then fails compilation at every when that forgot it",
        "else allocates an extra object",
        "Compose forbids else",
      ],
      answerIndex: 1,
      explanation: "Exhaustive when is the benefit. else would swallow a new branch such as Empty.",
    },
    {
      id: "flags",
      prompt: "What problem do isLoading and nullable data flags have?",
      choices: [
        "They cannot be used from coroutines",
        "They can be true at the same time, so illegal screens type-check",
        "They are slower than strings",
        "They require Kotlin Multiplatform",
      ],
      answerIndex: 1,
      explanation: "Independent flags allow Loading plus Success plus Error together. A sealed type allows one branch.",
    },
  ],
  sources: [
    { title: "Sealed classes and interfaces", url: "https://kotlinlang.org/docs/sealed-classes.html" },
    { title: "UI layer and UI state", url: "https://developer.android.com/topic/architecture/ui-layer" },
    { title: "Data classes", url: "https://kotlinlang.org/docs/data-classes.html" },
  ],
};
