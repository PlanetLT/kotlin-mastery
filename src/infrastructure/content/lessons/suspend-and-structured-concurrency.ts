import type { Lesson } from "@/domain/lesson";

export const suspendAndStructuredConcurrency: Lesson = {
  id: "suspend-and-structured-concurrency",
  slug: "suspend-and-structured-concurrency",
  partId: "async",
  order: 15,
  title: "Suspend and structured concurrency",
  summary: "Functions that wait without blocking the thread, and jobs that cancel with their owner.",
  minutes: 30,
  checkpoint: "You can mark a repository function suspend, call it from viewModelScope, and name the dispatcher.",
  sections: [
    {
      id: "suspend",
      heading: "suspend waits without freezing the thread",
      paragraphs: [
        "A `suspend` function can pause at a suspension point and resume later, possibly on another thread. The thread is free to do other work while it waits. That is the difference from `Thread.sleep`, which holds the thread, and from a callback pyramid, which hides the sequence.",
        "You can only call a suspend function from another suspend function or from a coroutine builder (`launch`, `async`). The compiler enforces this. A composable body is not a suspend function. A click handler is not either, until you `launch` on a scope.",
        "Sequential code stays sequential. `val user = api.user(id); val notes = api.notes(user.id)` waits for the user, then loads notes. That is what you want when the second call needs the first. When the calls are independent, start them in the same scope and await both, so the waits overlap.",
      ],
      code: {
        source: `class NoteRepository(private val api: NoteApi) {
    suspend fun load(id: String): Note {
        return api.fetchNote(id)
    }
}`,
      },
    },
    {
      id: "structured",
      heading: "Structured concurrency means the parent owns the children",
      paragraphs: [
        "A coroutine runs in a `CoroutineScope`. When the scope is cancelled, its children are cancelled. `viewModelScope` is cancelled when the ViewModel is cleared, which is when the screen is gone. That is why you launch repository calls there and not on `GlobalScope`. A global job keeps running after the user left, and it can touch a ViewModel that should be dead.",
        "`launch` starts a job and returns immediately. `async` starts a job that produces a value you `await`. Use `coroutineScope { }` inside a suspend function when you need children to finish before the function returns, and to cancel the siblings if one fails. `coroutineScope` is not `GlobalScope`. The similar names are a trap.",
        "Cancellation is cooperative. A suspend call in `kotlinx.coroutines` checks cancellation. Your own loop must check `ensureActive()` or use a cancellable API. A tight `while` that never suspends will ignore cancellation and keep the thread.",
      ],
      code: {
        source: `fun refresh() {
    viewModelScope.launch {
        val notes = repository.loadNotes()
        // publish notes to state, next lesson
    }
}`,
      },
      callouts: [
        {
          level: "working",
          title: "Dispatchers",
          body: "Dispatchers.Main runs UI work. viewModelScope already uses Main. Dispatchers.IO is for blocking calls such as a raw disk read. Retrofit's suspend functions do not need you to switch to IO. They already suspend. withContext(Dispatchers.IO) is for code that would otherwise block Main. CPU-heavy parsing uses Dispatchers.Default.",
        },
      ],
    },
    {
      id: "errors",
      heading: "Exceptions cancel the scope unless you say otherwise",
      paragraphs: [
        "An exception thrown in `launch` cancels the scope by default and is reported to the handler. For a screen, you usually want to catch inside the coroutine and publish `NotesUiState.Error`. The screen stays alive and the user can retry.",
        "Catch the failures you can show. Let cancellation through. `CancellationException` must be rethrown. Swallowing it breaks structured concurrency: the parent thinks the child finished, and the child keeps working after it was cancelled.",
        "`supervisorScope` keeps siblings alive when one child fails. Use it when several independent refreshes share a screen and one empty endpoint should not cancel the others. Do not use it as a default wrapper around every call.",
      ],
      code: {
        source: `viewModelScope.launch {
    try {
        val notes = repository.loadNotes()
        // Success(notes)
    } catch (cancelled: CancellationException) {
        throw cancelled
    } catch (error: IOException) {
        // Error(error.message ?: "Offline")
    }
}`,
      },
    },
  ],
  exercise: {
    prompt: "Write `suspend fun titles(api: NoteApi, ids: List<String>): List<String>` that loads each note with `api.fetchNote(id)` and returns the titles. The loads may run concurrently. If any load throws `IOException`, the others should cancel and the exception should escape. Use `coroutineScope` and `async`.",
    solution: `suspend fun titles(api: NoteApi, ids: List<String>): List<String> = coroutineScope {
    ids.map { id ->
        async { api.fetchNote(id).title }
    }.awaitAll()
}`,
  },
  quiz: [
    {
      id: "block",
      prompt: "What is the difference between a suspend function and Thread.sleep?",
      choices: [
        "suspend blocks the thread, sleep does not",
        "suspend pauses the coroutine and frees the thread, sleep holds the thread",
        "They are the same on Android",
        "suspend can be called from a property getter",
      ],
      answerIndex: 1,
      explanation: "Suspension does not block the thread. Thread.sleep does. A getter cannot be suspend.",
    },
    {
      id: "scope",
      prompt: "Why launch screen work on viewModelScope instead of GlobalScope?",
      choices: [
        "GlobalScope cannot call suspend functions",
        "viewModelScope is cancelled when the ViewModel is cleared",
        "GlobalScope always runs on the UI thread",
        "viewModelScope disables exceptions",
      ],
      answerIndex: 1,
      explanation: "The ViewModel scope follows the screen. GlobalScope outlives it and can leak work.",
    },
    {
      id: "cancel",
      prompt: "What should you do with CancellationException in a catch?",
      choices: [
        "Swallow it and show an error snackbar",
        "Rethrow it",
        "Convert it into NotesUiState.Error",
        "Ignore all exceptions equally",
      ],
      answerIndex: 1,
      explanation: "Cancellation must propagate. Catching it and continuing breaks the parent-child relationship.",
    },
  ],
  sources: [
    { title: "Coroutines overview", url: "https://kotlinlang.org/docs/coroutines-overview.html" },
    { title: "Coroutines basics", url: "https://kotlinlang.org/docs/coroutines-basics.html" },
    { title: "Cancellation and timeouts", url: "https://kotlinlang.org/docs/cancellation-and-timeouts.html" },
    { title: "Coroutines on Android", url: "https://developer.android.com/kotlin/coroutines" },
    { title: "Kotlin coroutines hands-on", url: "https://kotlinlang.org/docs/kotlin-hands-on.html" },
  ],
};
