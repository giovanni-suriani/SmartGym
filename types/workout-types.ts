// types.ts

export type ID = number; 

/** Must match your CHECK() list in the DB. */
export enum ExerciseCategory {
  DUMBBELL = "DUMBBELL",
  SMITH_MACHINE = "SMITH_MACHINE",
  BARBELL = "BARBELL",
  CABLE = "CABLE",
  BODYWEIGHT = "BODYWEIGHT",
  CARDIO = "CARDIO",
  other = "OTHER", // For future-proofing, if you add more categories
}

/** Atomic training unit */
export type Set = Readonly<{
  id: ID;
  exerciseId: ID;
  position: number;     // 0..N-1 within the exercise
  reps: number;
  loadKg: number;
  rpe?: number;
  isWarmup: boolean;
}>;

/** One movement inside a workout */
export type Exercise = Readonly<{
  id: ID;
  workoutId: ID;
  position: number;             // 0..N-1 within the workout
  name: string;
  category?: ExerciseCategory;
  restSec?: number;             // planned rest
  plannedSets: number;          // number of work sets planned
  sets: ReadonlyArray<Set>;
}>;

/** A workout made of ordered exercises */
export type Workout = Readonly<{
  id: ID;
  name: string;
  notes?: string;
  createdAt: string;            // ISO
  updatedAt: string;            // ISO
  exercises: ReadonlyArray<Exercise>;
}>;
