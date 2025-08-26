// types.ts

/** Must match your CHECK() list in the DB. */
export enum ExerciseCategory {
  DUMBBELL = "DUMBBELL",
  SMITH_MACHINE = "SMITH_MACHINE",
  BARBELL = "BARBELL",
  CABLE = "CABLE",
  BODYWEIGHT = "BODYWEIGHT",
  CARDIO = "CARDIO",
  OTHER = "OTHER", // For future-proofing, if you add more categories
}

/** A workout made of ordered exercises */
export type Workout = Readonly<{
  id: number;
  name: string;
  notes?: string;
  createdAt: string;            // ISO
  updatedAt: string;            // ISO
  exercises: ReadonlyArray<Exercise>;
}>;


/** One movement inside a workout */
export type Exercise = Readonly<{
  id: number;
  workoutId: number;
  name: string;
  weightGap?: number;           // e.g. 2.5kg plates
  category?: ExerciseCategory;
  restSec?: number;             // planned rest
  notes?: string;
  loadUnit?: 'kg' | 'lb'; 
  progress_rate?: number;       // e.g. 2.5%/week
  position: number;             // 0..N-1 within the workout
  plannedSets: number;          // number of work sets planned
  sets: ReadonlyArray<WorkoutSet>;
}>;

/** Atomic training unit */
export type WorkoutSet = Readonly<{
  id: number;
  exerciseId: number;
  position: number;     // 0..N-1 within the exercise
  reps: number;
  loadKg?: number;
  rpe?: number;
  isWarmup: boolean;
  duration_time_secs?: number;    // in seconds, for cardio
}>;

