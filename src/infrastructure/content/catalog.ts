import type { Lesson } from "@/domain/lesson";
import { classesAndProperties } from "./lessons/classes-and-properties";
import { collectionsLambdasAndScope } from "./lessons/collections-lambdas-and-scope";
import { composablesModifiersLayout } from "./lessons/composables-modifiers-layout";
import { composeStability } from "./lessons/compose-stability";
import { dataClasses } from "./lessons/data-classes";
import { extensionsAndGenerics } from "./lessons/extensions-and-generics";
import { flowAndUiUpdates } from "./lessons/flow-and-ui-updates";
import { gradleKotlinDsl } from "./lessons/gradle-kotlin-dsl";
import { howToUseThisGuide } from "./lessons/how-to-use-this-guide";
import { jvmAndTheFirstProgram } from "./lessons/jvm-and-the-first-program";
import { kotlinMultiplatform } from "./lessons/kotlin-multiplatform";
import { listsMaterialNavigationEffects } from "./lessons/lists-material-navigation-effects";
import { nullSafetyAndControlFlow } from "./lessons/null-safety-and-control-flow";
import { objectsAndCompanions } from "./lessons/objects-and-companions";
import { oneRealScreen } from "./lessons/one-real-screen";
import { sealedClassesForScreenState } from "./lessons/sealed-classes-for-screen-state";
import { stateHoistingRecomposition } from "./lessons/state-hoisting-recomposition";
import { suspendAndStructuredConcurrency } from "./lessons/suspend-and-structured-concurrency";
import { valueClasses } from "./lessons/value-classes";

export const lessons: readonly Lesson[] = [
  howToUseThisGuide,
  jvmAndTheFirstProgram,
  nullSafetyAndControlFlow,
  classesAndProperties,
  collectionsLambdasAndScope,
  extensionsAndGenerics,
  objectsAndCompanions,
  dataClasses,
  sealedClassesForScreenState,
  gradleKotlinDsl,
  composablesModifiersLayout,
  stateHoistingRecomposition,
  listsMaterialNavigationEffects,
  composeStability,
  suspendAndStructuredConcurrency,
  flowAndUiUpdates,
  oneRealScreen,
  valueClasses,
  kotlinMultiplatform,
];
