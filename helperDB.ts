// helperDB.ts
import { type SQLiteDatabase } from "expo-sqlite"
import { Workout, Exercise, WorkoutSet } from "@/constants/types/workout-types"
import * as dbDefinitions from "@/constants/dbDefinitions"

// import { Workout, Exercise, WorkoutSet } from '@/c';
/** Optional enum to mirror the CHECK constraint below */
export enum ExerciseCategory {
  DUMBBELL = "DUMBBELL",
  SMITH_MACHINE = "SMITH_MACHINE",
  BARBELL = "BARBELL",
  CABLE = "CABLE",
  BODYWEIGHT = "BODYWEIGHT",
  CARDIO = "CARDIO",
  OTHER = "'OTHER'", // For future-proofing, if you add more categories
}

export enum DefaultValuesWorkout {
  notes = "''",
}

export enum DefaultValuesExercise {
  loadUnit = "kg",
  progressRate = 2, // percent per week
  weightGap = 0, // e.g. 2.5kg plates
  restSec = 0, // no rest
  plannedSets = 3, // typical
  exerciseCategory = "OTHER",
  notes = "''",
}

export enum DefaultValuesSet {
  isWarmup = 0, // false
  durationTimeSecs = 0, // for non-cardio
  rpe = 0, // optional
}

/** Full schema (PRAGMAs + tables + indexes) */
const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

/* 1) Workouts */
CREATE TABLE IF NOT EXISTS workouts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,                -- uuid v4 (or INTEGER PRIMARY KEY)
  name         TEXT NOT NULL,
  notes        TEXT DEFAULT ${DefaultValuesWorkout.notes},  
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

/* 2) Exercises (each belongs to a workout) */
CREATE TABLE IF NOT EXISTS exercises (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id    TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  weight_gap    REAL CHECK (weight_gap >= 0)  DEFAULT ${DefaultValuesExercise.weightGap},      -- e.g. 2.5kg plates
  category      TEXT CHECK (category IN (
    'DUMBBELL','SMITH_MACHINE','BARBELL','CABLE','BODYWEIGHT','CARDIO', 'OTHER'
    )) DEFAULT ${DefaultValuesExercise.exerciseCategory},
  rest_sec      INTEGER CHECK (rest_sec >= 0) DEFAULT ${DefaultValuesExercise.restSec},        -- planned rest (optional)
  notes         TEXT DEFAULT ${DefaultValuesExercise.notes},                            -- optional notes
  progress_rate REAL CHECK (progress_rate >= 0) DEFAULT ${DefaultValuesExercise.progressRate},     -- e.g. 2.5%/week
  position      INTEGER NOT NULL CHECK (position >= 0),                                       -- 1..N within the workout
  load_unit     TEXT CHECK (load_unit IN ('kg','lb')) DEFAULT ${DefaultValuesExercise.loadUnit},
  UNIQUE(workout_id, position)                                                                -- keep stable ordering
  );
  
  CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises(workout_id);
  
/* 3) Sets (each belongs to an exercise) */
CREATE TABLE IF NOT EXISTS sets (
  exercise_id        TEXT    NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  position           INTEGER NOT NULL CHECK (position > 0),             -- 0..N within the exercise
  reps               INTEGER NOT NULL CHECK (reps > 0),
  load_kg            REAL    NOT NULL CHECK (load_kg >= 0),
  rpe                INTEGER DEFAULT ${DefaultValuesSet.rpe} ,                                         -- optional: perceived effort
  duration_time_secs INTEGER CHECK (duration_time_secs >= 0) DEFAULT ${DefaultValuesSet.durationTimeSecs}, -- in seconds, for cardio
  is_warmup          BOOLEAN NOT NULL DEFAULT ${DefaultValuesSet.isWarmup},                              -- 0=false, 1=true
  UNIQUE(exercise_id, position)
);

CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets(exercise_id);
`

// const query = `SELECT * FROM exercisf where workout_id = 1`

// workout #1 will be a set of seeded common exercises
// workout #2 will be a user-created workout

export async function seedUserExercisesWorkout(db: SQLiteDatabase) {
  await db.execAsync("BEGIN")
  try {
    const workout = await db.getFirstAsync(
      `SELECT * FROM workouts WHERE id = ${dbDefinitions.WorkoutId_To_userCreatedExercise}`
    )
    if (workout) {
      console.info(
        `Workout to userCreatedExercise '${dbDefinitions.WorkoutId_To_userCreatedExercise}' already exists, skipping seeding.`
      )
      await db.execAsync("COMMIT")
      return
    } else {
      // 1) Ensure workout #dbDefinitions.WorkoutId_To_userCreatedExercise exists
      await db.runAsync(
        `INSERT INTO workouts (id, name, notes)
       VALUES (${dbDefinitions.WorkoutId_To_userCreatedExercise}, 'User_Created_Exercises', 'User-created exercises')`
      )
      await db.execAsync("COMMIT")
      console.info(
        `Seeded workout #${dbDefinitions.WorkoutId_To_userCreatedExercise} for user-created exercises.`
      )
    }
  } catch (e) {
    await db.execAsync("ROLLBACK")
    console.error("Seeding user exercises workout failed:", e)
    throw e
  }
}

export async function deleteAllUserExercisesWorkout(db: SQLiteDatabase) {
  await db.execAsync("BEGIN")
  try {
    // 1) Delete all exercises and their sets for workout #dbDefinitions.WorkoutId_To_userCreatedExercise
    await db.runAsync(
      `DELETE FROM exercises WHERE workout_id = ${dbDefinitions.WorkoutId_To_userCreatedExercise}`
    )
    await db.execAsync("COMMIT")
    console.info(
      `Deleted all exercises for workout #${dbDefinitions.WorkoutId_To_userCreatedExercise}.`
    )
  } catch (e) {
    await db.execAsync("ROLLBACK")
    console.error("Deleting user exercises workout failed:", e)
    throw e
  }
}

export async function seedCommonWorkout(db: SQLiteDatabase) {
  await db.execAsync("BEGIN")
  try {
    // 1) Ensure workout #0 exists (fixed id)
    const workout = await db.getFirstAsync(
      `SELECT * FROM workouts WHERE id = ${dbDefinitions.WorkoutId_To_SeededExercises}`
    )

    if (workout) {
      console.info(
        `Workout to common exercises '${dbDefinitions.WorkoutId_To_SeededExercises}' already exists, skipping seeding.`
      )
      await db.execAsync("COMMIT")
      return
    }

    await db.runAsync(
      `INSERT INTO workouts (id, name, notes)
       VALUES (${dbDefinitions.WorkoutId_To_SeededExercises}, 'Dummy_Basics', 'Auto-seeded common exercises')
       ON CONFLICT(id) DO UPDATE SET
         name=excluded.name,
         notes=excluded.notes,
         updated_at=datetime('now')`
    )

    // 2) Clear any previous exercises for this workout to keep it deterministic
    await db.runAsync(
      `DELETE FROM exercises WHERE workout_id = ${dbDefinitions.WorkoutId_To_SeededExercises}`
    )

    // 3) Insert 10 common exercises with fixed ids 1..10 and positions 1..10
    type Row = [
      id: number,
      name: string,
      category: ExerciseCategory,
      rest: number | null,
      position: number
    ]
    const rows: Row[] = [
      [1, "Barbell Back Squat", ExerciseCategory.BARBELL, 120, 1],
      [2, "Barbell Bench Press", ExerciseCategory.BARBELL, 120, 2],
      [3, "Conventional Deadlift", ExerciseCategory.BARBELL, 180, 3],
      [4, "Overhead Press", ExerciseCategory.BARBELL, 90, 4],
      [5, "Pull-up", ExerciseCategory.BODYWEIGHT, 90, 5],
      [6, "Seated Cable Row", ExerciseCategory.CABLE, 75, 6],
      [7, "Lat Pulldown", ExerciseCategory.CABLE, 75, 7],
      [8, "Dumbbell Bicep Curl", ExerciseCategory.DUMBBELL, 60, 8],
      [9, "Triceps Pushdown", ExerciseCategory.CABLE, 60, 9],
      [10, "Smith Machine Squat", ExerciseCategory.SMITH_MACHINE, 120, 10],
    ]

    const stmt = await db.prepareAsync(
      `INSERT INTO exercises
       (id, workout_id, name, category, rest_sec, position)
       VALUES (?, ${dbDefinitions.WorkoutId_To_SeededExercises}, ?, ?, ?, ?)`
    )
    try {
      for (const [id, name, category, rest, position] of rows) {
        await stmt.executeAsync([id, name, category, rest, position])
      }
    } finally {
      await stmt.finalizeAsync()
    }
    await db.execAsync("COMMIT")
    console.info(
      `Seeded workout #${dbDefinitions.WorkoutId_To_SeededExercises} with 10 exercises (ids 1..10).`
    )
  } catch (e) {
    await db.execAsync("ROLLBACK")
    console.error("Seeding failed:", e)
    throw e
  }
}

export async function deleteDatabase(db: SQLiteDatabase) {
  // confirm with user before calling this!

  await db.execAsync("PRAGMA foreign_keys = OFF;")
  await db.execAsync("DROP TABLE IF EXISTS sets;")
  await db.execAsync("DROP TABLE IF EXISTS exercises;")
  await db.execAsync("DROP TABLE IF EXISTS workouts;")
  await db.execAsync("PRAGMA foreign_keys = ON;")
  console.info("Dropped old tables.")
}

export async function getSeededWorkout(db: SQLiteDatabase) {
  return db.getAllAsync(
    `SELECT * FROM exercises where workout_id = ${dbDefinitions.WorkoutId_To_SeededExercises}`
  )
}

export async function restartDatabase(db: SQLiteDatabase) {
  await deleteDatabase(db)
  try {
    await db.execAsync(SCHEMA_SQL)
    console.info("Schema created successfully.")
  } catch (err) {
    console.error("Schema error:", err)
  }
  try {
    await seedCommonWorkout(db)
  } catch (err) {
    console.error("Seeding error:", err)
  }
}

/* Call this from your app’s root, once, to initialize the DB */

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync(SCHEMA_SQL)
    console.info("Schema created successfully.")
  } catch (err) {
    console.error("Schema error:", err)
  }

  await seedCommonWorkout(db)
  await seedUserExercisesWorkout(db)
  // await deleteDatabase(db) // uncomment to reset DB during development
  // console.info("Database initialized with schema.")
  // const seeded = await getSeededWorkout(db)
  // // console.info("Seeded workout #1 :", seeded)
  // if (seeded) {
  // } else {
  //   await seedCommonWorkout(db)
  // }
}

/** ---- Types for convenience in UI code ---- */
// --- DB row types for insertions --- //

export async function createWorkout(
  db: SQLiteDatabase,
  row: RowWorkout
): Promise<number> {
  const res = await db.runAsync(`INSERT INTO workouts (name) VALUES (?)`, [
    row.name,
    row.notes ?? null,
  ])
  return res.lastInsertRowId!
}

export async function getMaxExerciseId(
  db: SQLiteDatabase
): Promise<number | null> {
  const row = await db.getFirstAsync<{ maxId: number }>(
    "SELECT MAX(id) as maxId FROM exercises"
  )
  return row?.maxId ?? null
}

export async function getMaxExercisePositionOnUserCreatedExercises(
  db: SQLiteDatabase
): Promise<number | null> {
  const row = await db.getFirstAsync<{ maxPosition: number }>(
    `SELECT MAX(position) as maxPosition FROM exercises WHERE workout_id = ${dbDefinitions.WorkoutId_To_userCreatedExercise}`
  )
  return row?.maxPosition ?? null
}

type DBExerciseRow = {
  id: number
  workout_id: number
  name: string
  category: string
  rest_sec: number | null
  notes: string | null
  progress_rate: number | null
  weight_gap: number | null
  position: number
  load_unit: "kg" | "lb"
}


export type RowExercise = {
  id: number // AUTOINCREMENT
  workout_id: number // FK -> workouts.id
  name: string
  category: string
  progressRate?: number | null
  weightGap?: number | null
  restSec?: number | null
  position: number
}

export type RowWorkout = {
  id?: number // AUTOINCREMENT
  name: string
  notes?: string | null
  created_at?: string // DEFAULT datetime('now')
  updated_at?: string // DEFAULT datetime('now')
}

/** ---- Insert helpers ---- */

export async function createUserExercise(
  db: SQLiteDatabase,
  row: Omit<RowExercise, "id" | "workout_id">
): Promise<number> {
  const position = (await getMaxExercisePositionOnUserCreatedExercises(db)) ?? 0
  row.position = position + 1
  try {
    const res = await db.runAsync(
      `INSERT INTO exercises (workout_id, name, category, rest_sec, position)
       VALUES (?, ?, ?, ?, ?)`,
      [
        dbDefinitions.WorkoutId_To_userCreatedExercise,
        row.name.trim(),
        row.category ?? DefaultValuesExercise.exerciseCategory,
        row.restSec ?? DefaultValuesExercise.restSec,
        row.position,
      ]
    )
    // const exercisesCreated = await getUserCreatedExercises(db)
    // console.log("Exercises after insertion:", exercisesCreated)
    return res.lastInsertRowId! // Assert that will never be null
  } catch (e) {
    console.error("Error inserting user exercise:", e)
    throw e
  }
}

/** ---- Exercise Queries ---- */

export async function getExercise(
  db: SQLiteDatabase,
  exerciseId: number
): Promise<Exercise | null> {
  const exercise = await db.getFirstAsync<Exercise>(
    `SELECT * FROM exercises WHERE id = ? `,
    [exerciseId]
  )
  return exercise || null
}

export async function getUserCreatedExercises(
  db: SQLiteDatabase
): Promise<Exercise[] | null> {

  const exercises = await db.getAllAsync<Exercise>(
    `SELECT
       id,
       workout_id  AS workoutId,
       name,
       category,
       rest_sec    AS restSec,
       notes,
       progress_rate AS progressRate,
       weight_gap  AS weightGap,
       position,
       load_unit   AS loadUnit
     FROM exercises
     WHERE workout_id = ?
     ORDER BY position ASC`,
    [dbDefinitions.WorkoutId_To_userCreatedExercise]
  )
  
  /* Casting  exercises fetchedExercises to exercises */
  // const exercises: Exercise[] = fetchedExercises.map((ex) => ({
  //   id: ex.id,
  //   workoutId: ex.workout_id,
  //   name: ex.name,
  //   category: ex.category,
  //   restSec: ex.rest_sec,
  //   notes: ex.notes,
  //   progressRate: ex.progress_rate,
  //   weightGap: ex.weight_gap,
  //   position: ex.position,
  //   loadUnit: ex.load_unit,
  // }))



  return exercises || null
}

export async function deleteAllUserExercisesCreatedExercises(
  db: SQLiteDatabase
): Promise<void> {
  await db.runAsync(
    `DELETE FROM exercises WHERE workout_id = ${dbDefinitions.WorkoutId_To_userCreatedExercise}`
  )
  console.info(`Deleted all exercises for workout #${dbDefinitions.WorkoutId_To_userCreatedExercise}.`)
  return
}


export async function createDummySets(
  db: SQLiteDatabase,
  exerciseCategory: string,
  exerciseId: number
): Promise<void> {}
