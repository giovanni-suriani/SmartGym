// helperDB.ts
import { type SQLiteDatabase } from "expo-sqlite"
import { Workout, Exercise, WorkoutSet } from '@/constants/types/workout-types';
// import { Workout, Exercise, WorkoutSet } from '@/c';
/** Optional enum to mirror the CHECK constraint below */
export enum ExerciseCategory {
  DUMBBELL = "DUMBBELL",
  SMITH_MACHINE = "SMITH_MACHINE",
  BARBELL = "BARBELL",
  CABLE = "CABLE",
  BODYWEIGHT = "BODYWEIGHT",
  CARDIO = "CARDIO",
  OTHER = "OTHER", // For future-proofing, if you add more categories
}

/** Full schema (PRAGMAs + tables + indexes) */
const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

/* 1) Workouts */
CREATE TABLE IF NOT EXISTS workouts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,                -- uuid v4 (or INTEGER PRIMARY KEY)
  name         TEXT NOT NULL,
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

/* 2) Exercises (each belongs to a workout) */
CREATE TABLE IF NOT EXISTS exercises (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id    TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  weight_gap    REAL CHECK (weight_gap >= 0)  DEFAULT 0,  -- e.g. 2.5kg plates
  category      TEXT CHECK (category IN (
    'DUMBBELL','SMITH_MACHINE','BARBELL','CABLE','BODYWEIGHT','CARDIO', 'OTHER'
    )),
  rest_sec      INTEGER CHECK (rest_sec >= 0) DEFAULT 0,      -- planned rest (optional)
  notes         TEXT DEFAULT '',                              -- optional notes
  progress_rate REAL CHECK (progress_rate >= 0) DEFAULT 2,    -- e.g. 2.5%/week
  position      INTEGER NOT NULL CHECK (position >= 0),       -- 1..N within the workout
  planned_sets  INTEGER NOT NULL,                             -- number of planned work sets
  load_unit     TEXT CHECK (load_unit IN ('kg','lb')) DEFAULT 'kg',
  UNIQUE(workout_id, position)                                -- keep stable ordering
  );
  
  CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises(workout_id);
  
/* 3) Sets (each belongs to an exercise) */
CREATE TABLE IF NOT EXISTS sets (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id        TEXT    NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  position           INTEGER NOT NULL CHECK (position > 0),  -- 0..N within the exercise
  reps               INTEGER NOT NULL CHECK (reps > 0),
  load_kg            REAL    NOT NULL CHECK (load_kg >= 0),
  rpe                REAL,                                   -- optional: perceived effort
  duration_time_secs INTEGER CHECK (duration_time_secs >= 0) DEFAULT 0, -- in seconds, for cardio
  is_warmup          BOOLEAN NOT NULL DEFAULT 0,             -- 0=false, 1=true
  UNIQUE(exercise_id, position)
);

CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets(exercise_id);
`

// const query = `SELECT * FROM exercisf where workout_id = 1`

// workout #1 will be a set of seeded common exercises
// workout #2 will be a user-created workout

export async function seedCommonWorkout(db: SQLiteDatabase) {
  await db.execAsync("BEGIN");
  try {
    // 1) Ensure workout #1 exists (fixed id)
    await db.runAsync(
      `INSERT INTO workouts (id, name, notes)
       VALUES (1, 'Dummy_Basics', 'Auto-seeded common exercises')
       ON CONFLICT(id) DO UPDATE SET
         name=excluded.name,
         notes=excluded.notes,
         updated_at=datetime('now')`
    );

    // 2) Clear any previous exercises for this workout to keep it deterministic
    await db.runAsync(`DELETE FROM exercises WHERE workout_id = 1`);

    // 3) Insert 10 common exercises with fixed ids 1..10 and positions 1..10
    type Row = [id: number, name: string, category: ExerciseCategory, rest: number | null, position: number, plannedSets: number];
    const rows: Row[] = [
      [1,  "Barbell Back Squat",     ExerciseCategory.BARBELL,       120, 1,  3],
      [2,  "Barbell Bench Press",    ExerciseCategory.BARBELL,       120, 2,  3],
      [3,  "Conventional Deadlift",  ExerciseCategory.BARBELL,       180, 3,  3],
      [4,  "Overhead Press",         ExerciseCategory.BARBELL,        90, 4,  3],
      [5,  "Pull-up",                ExerciseCategory.BODYWEIGHT,     90, 5,  3],
      [6,  "Seated Cable Row",       ExerciseCategory.CABLE,          75, 6,  3],
      [7,  "Lat Pulldown",           ExerciseCategory.CABLE,          75, 7,  3],
      [8,  "Dumbbell Bicep Curl",    ExerciseCategory.DUMBBELL,       60, 8,  3],
      [9,  "Triceps Pushdown",       ExerciseCategory.CABLE,          60, 9,  3],
      [10, "Smith Machine Squat",    ExerciseCategory.SMITH_MACHINE, 120, 10, 3],
    ];

    const stmt = await db.prepareAsync(
      `INSERT INTO exercises
       (id, workout_id, name, category, rest_sec, position, planned_sets)
       VALUES (?, 1, ?, ?, ?, ?, ?)`
    );
    try {
      for (const [id, name, category, rest, position, plannedSets] of rows) {
        await stmt.executeAsync([id, name, category, rest, position, plannedSets]);
      }
    } finally {
      await stmt.finalizeAsync();
    }
    await db.execAsync("COMMIT");
    console.info("Seeded workout #1 with 10 exercises (ids 1..10).");
  } catch (e) {
    await db.execAsync("ROLLBACK");
    console.error("Seeding failed:", e);
    throw e;
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
    `SELECT * FROM exercises where workout_id = 1`
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
  
  // await deleteDatabase(db) // uncomment to reset DB during development
  await seedCommonWorkout(db)
  console.info("Database initialized with schema.")
  const seeded = await getSeededWorkout(db)
  console.info("Seeded workout #1 :", seeded)
  if (seeded) {
  } else {
    await seedCommonWorkout(db)
  }
}

/** ---- Types for convenience in UI code ---- */
// --- DB row types for insertions --- //
export type RowWorkout = {
  id?: number;              // AUTOINCREMENT
  name: string;
  notes?: string | null;
  created_at?: string;      // DEFAULT datetime('now')
  updated_at?: string;      // DEFAULT datetime('now')
}

export type RowExercise = {
  id?: number;              // AUTOINCREMENT
  workout_id: number;       // FK -> workouts.id
  name: string;
  category: string;
  rest_sec?: number | null;
  position: number;
  planned_sets: number;
}

/** ---- Insert helpers ---- */
export async function createWorkout(
  db: SQLiteDatabase,
  row: RowWorkout
): Promise<number> {
  const res = await db.runAsync(
    `INSERT INTO workouts (name) VALUES (?)`,
    [row.name, row.notes ?? null]
  )
  return res.lastInsertRowId!
}

export async function createExercise(
  db: SQLiteDatabase,
  row: RowExercise
): Promise<number> {
  const res = await db.runAsync(
    `INSERT INTO exercises (workout_id, name, category, rest_sec, position, planned_sets)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      row.workout_id,
      row.name.trim(),
      row.category,
      row.rest_sec ?? null,
      row.position,
      row.planned_sets,
    ]
  )
  return res.lastInsertRowId!
}



