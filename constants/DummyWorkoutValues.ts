import * as typos from "./types/workout-types";

export const DUMMY_SET1: typos.WorkoutSet = {
    id: 1,
    exerciseId: 1,
    position: 1,
    reps: 4,
    loadKg: 40,
    isWarmup: true,
}

export const DUMMY_SET2: typos.WorkoutSet = {
    id: 2,
    exerciseId: 1,
    position: 2,
    reps: 8,
    loadKg: 6,
    isWarmup: false,
}

export const DUMMY_SET3: typos.WorkoutSet = {
    id: 2,
    exerciseId: 1,
    position: 3,
    reps: 8,
    loadKg: 60,
    isWarmup: false,
}

export const DUMMY_EXERCISE1: typos.Exercise = {
    id: 1,
    workoutId: 1,
    position: 1,
    name: "Bench Press",
    category: typos.ExerciseCategory.BARBELL,
    restSec: 90,
    plannedSets: 2,
    sets: [DUMMY_SET1, DUMMY_SET2, DUMMY_SET3],
}

export const DUMMY_EXERCISE2: typos.Exercise = {
    id: 2,
    workoutId: 1,
    position: 1,
    name: "Peck Deck",
    category: typos.ExerciseCategory.BARBELL,
    restSec: 90,
    plannedSets: 2,
    sets: [DUMMY_SET1, DUMMY_SET2, DUMMY_SET3],
}

export const DUMMY_EXERCISE3: typos.Exercise = {
    id: 3,
    workoutId: 1,
    position: 1,
    name: "Dumbell Flyes",
    category: typos.ExerciseCategory.BARBELL,
    restSec: 90,
    plannedSets: 2,
    sets: [DUMMY_SET1, DUMMY_SET2, DUMMY_SET3],
}

export const DUMMY_EXERCISE4: typos.Exercise = {
    id: 4,
    workoutId: 1,
    position: 1,
    name: "Dumbell Bench Press",
    category: typos.ExerciseCategory.BARBELL,
    restSec: 90,
    plannedSets: 2,
    sets: [DUMMY_SET1, DUMMY_SET2, DUMMY_SET3],
}



export const DUMMY_WORKOUT: typos.Workout = {
    id: 1,
    name: "Chest Day",
    notes: "Focus on strength",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // exercises: [DUMMY_EXERCISE1],
    // exercises: [DUMMY_EXERCISE1, DUMMY_EXERCISE2] // DUMMY_EXERCISE3, DUMMY_EXERCISE4],
    // exercises: [DUMMY_EXERCISE1, DUMMY_EXERCISE2, DUMMY_EXERCISE3],
    exercises: [DUMMY_EXERCISE1, DUMMY_EXERCISE2, DUMMY_EXERCISE3, DUMMY_EXERCISE4],
}