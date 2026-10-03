import type { Lesson } from "@/domain/lesson";

export const oneRealScreen: Lesson = {
  id: "one-real-screen",
  slug: "one-real-screen",
  partId: "async",
  order: 17,
  title: "One real screen",
  summary: "Repository, ViewModel, sealed state, and Compose, in one direction.",
  minutes: 35,
  checkpoint: "You can trace a retry click from the button to the repository and back to a Success or Error branch.",
  sections: [
    {
      id: "shape",
      heading: "Four pieces, one direction",
      paragraphs: [
        "A screen that loads notes has four pieces. The repository knows how to load. The ViewModel turns that into `NotesUiState` and exposes `StateFlow`. The composable draws the state and sends events. The Gradle file already contains the libraries. None of these pieces constructs the others in a circle.",
        "The repository is an interface when you care about previews and tests. The implementation calls Retrofit, Room, or, today, a fake delay and a list. The ViewModel depends on the interface. A preview does not need the implementation. This is the same dependency direction you are using in this website: the UI calls a use case, the use case does not know about the button.",
        "Now in Android, Google's sample, is the reference for how a larger app splits modules. You do not copy it. You notice that UI state is a sealed type, ViewModels expose immutable state, and composables stay stateless at the edges.",
      ],
    },
    {
      id: "code",
      heading: "The whole path",
      paragraphs: [
        "Read this from the click, not from the top. `Retry` calls `onRetry`. The screen passed `viewModel::refresh`. `refresh` sets `Loading`, calls `repository.loadNotes()` inside `viewModelScope`, and sets `Success` or `Error`. `collectAsStateWithLifecycle` sees the new value. `when` picks a branch. The list keys rows by id.",
        "The fake repository is enough to learn the path. Swap `loadNotes` for a Retrofit suspend function when you have a server. The ViewModel's catch stays. The composable does not grow a try/catch.",
      ],
      code: {
        source: `data class Note(val id: String, val title: String)

sealed interface NotesUiState {
    data object Loading : NotesUiState
    data class Success(val notes: List<Note>) : NotesUiState
    data class Error(val message: String) : NotesUiState
}

interface NoteRepository {
    suspend fun loadNotes(): List<Note>
}

class NotesViewModel(private val repository: NoteRepository) : ViewModel() {
    private val _state = MutableStateFlow<NotesUiState>(NotesUiState.Loading)
    val state: StateFlow<NotesUiState> = _state.asStateFlow()

    init { refresh() }

    fun refresh() {
        viewModelScope.launch {
            _state.value = NotesUiState.Loading
            _state.value = try {
                NotesUiState.Success(repository.loadNotes())
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (error: IOException) {
                NotesUiState.Error(error.message ?: "Could not load notes")
            }
        }
    }
}

@Composable
fun NotesRoute(viewModel: NotesViewModel = viewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    NotesBody(state = state, onRetry = viewModel::refresh, onOpen = { })
}`,
      },
    },
    {
      id: "check",
      heading: "How you know it is finished",
      paragraphs: [
        "Rotate the device. The ViewModel survives and the list does not reload unless you told it to. Kill the process from the system settings and reopen. `rememberSaveable` drafts come back. The list reloads because the process was new, and `init` calls `refresh` again. That is the correct split.",
        "Turn on airplane mode if the repository hits the network. You should see `Error`, not a frozen spinner and not a crash. Press Retry. You should see `Loading`, then one of the other two branches. If both an error message and the old list show at once, the state is not sealed. Fix the model, not the if statement.",
        "You are working at a professional level on this screen when a new state, such as `Empty`, is a compiler error in `NotesBody` until you draw it, when the repository can be faked without Android, and when a second collector cannot write the `MutableStateFlow`.",
      ],
      callouts: [
        {
          level: "pro",
          title: "Process death versus rotation",
          body: "Rotation keeps the process, so the ViewModel stays. Process death does not. Anything the user typed that is not in a saved handle or a repository will vanish. StateFlow is not a Bundle. rememberSaveable and a real store cover the two different lifetimes.",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Add `data object Empty : NotesUiState` only if you want a distinct empty screen. Otherwise keep empty lists inside `Success`. Write the `when` branch you would add if `Empty` exists, and say which other functions stop compiling until you handle it. Then implement `class FakeNotes : NoteRepository` whose `loadNotes` returns two notes.",
    solution: `class FakeNotes : NoteRepository {
    override suspend fun loadNotes(): List<Note> = listOf(
        Note(id = "1", title = "Milk"),
        Note(id = "2", title = "Bread"),
    )
}

// If you add data object Empty, every when on NotesUiState must handle it.
// NotesBody draws Text("No notes yet") for Empty.
// titleFor, or any other exhaustive when, fails compilation until it does too.
// Mapping belongs in the ViewModel:
// val notes = repository.loadNotes()
// _state.value = if (notes.isEmpty()) NotesUiState.Empty else NotesUiState.Success(notes)`,
  },
  quiz: [
    {
      id: "who-catches",
      prompt: "Where should an IOException from loadNotes become an error message?",
      choices: [
        "Inside Text()",
        "In the ViewModel, stored as NotesUiState.Error",
        "In the LazyColumn key",
        "In a companion object on Note",
      ],
      answerIndex: 1,
      explanation: "The ViewModel maps failures into UI state. The composable only draws the branch.",
    },
    {
      id: "direction",
      prompt: "Which direction is the screen's data flow?",
      choices: [
        "The composable writes MutableStateFlow and the repository reads clicks",
        "State flows down to the composable, events flow up to the ViewModel",
        "The repository calls composables directly",
        "Gradle pushes state into the Activity",
      ],
      answerIndex: 1,
      explanation: "The ViewModel holds state. The composable renders it and forwards events such as retry.",
    },
    {
      id: "rotation",
      prompt: "What survives a configuration change such as rotation?",
      choices: [
        "A local var in a composable, without remember",
        "The ViewModel and its StateFlow",
        "A GlobalScope job you hoped was cancelled",
        "Nothing, the process is always killed",
      ],
      answerIndex: 1,
      explanation: "The ViewModel survives rotation. Plain locals do not. Process death is a separate event and does kill the ViewModel.",
    },
  ],
  sources: [
    { title: "UI layer", url: "https://developer.android.com/topic/architecture/ui-layer" },
    { title: "ViewModel", url: "https://developer.android.com/topic/libraries/architecture/viewmodel" },
    { title: "Kotlin flows on Android", url: "https://developer.android.com/kotlin/flow" },
    { title: "Now in Android", url: "https://github.com/android/nowinandroid" },
    { title: "Guide to app architecture", url: "https://developer.android.com/topic/architecture" },
  ],
};
