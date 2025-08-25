PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

/* 1) Workouts */
CREATE TABLE IF NOT EXISTS workouts (
    -- uuid v4 (or INTEGER PRIMARY KEY)
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

/* 2) Exercises (each belongs to a workout) */
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id TEXT NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight_gap REAL CHECK (weight_gap >= 0) DEFAULT 0,  -- e.g. 2.5kg plates
    category TEXT CHECK (category IN (
        'DUMBBELL',
        'SMITH_MACHINE',
        'BARBELL',
        'CABLE',
        'BODYWEIGHT',
        'CARDIO',
        'OTHER'
    )),
    -- planned rest (optional)
    rest_sec INTEGER CHECK (rest_sec >= 0) DEFAULT 0,
    notes TEXT DEFAULT '',                              -- optional notes
    -- e.g. 2.5%/week
    progress_rate REAL CHECK (progress_rate >= 0) DEFAULT 2,
    -- 1..N within the workout
    position INTEGER NOT NULL CHECK (position >= 0),
    -- number of planned work sets
    planned_sets INTEGER NOT NULL,
    load_unit TEXT CHECK (load_unit IN ('kg', 'lb')) DEFAULT 'kg',
    -- keep stable ordering
    UNIQUE (workout_id, position)
);

CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises (workout_id);

/* 3) Sets (each belongs to an exercise) */
CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id TEXT NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
    position INTEGER NOT NULL CHECK (position > 0),  -- 0..N within the exercise
    reps INTEGER NOT NULL CHECK (reps > 0),
    load_kg REAL NOT NULL CHECK (load_kg >= 0),
    rpe REA,                                   -- optional: perceived effort
    -- in seconds, for cardio
    duration_time_secs INTEGER CHECK (duration_time_secs >= 0) DEFAULT 0,
    is_warmup BOOLEAN NOT NULL DEFAULT 0,             -- 0=false, 1=true
    UNIQUE (exercise_id, position)
);

CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets (exercise_id);

-- sqlite3 test.db < schema.sql
