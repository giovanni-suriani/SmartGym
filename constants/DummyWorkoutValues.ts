import * as typos from "../types/workout-types";

export const DUMMY_SET: typos.Set = {
    id: 1,
    exerciseId: 1,
    position: 0,
    reps: 10,
    loadKg: 50,
    rpe: 7,
    isWarmup: false,
}

export const DUMMY_EXERCISE: typos.Exercise = {
    id: 1,
    workoutId: 1,
    position: 0,
    name: "Bench Press",
    category: typos.ExerciseCategory.BARBELL,
    restSec: 90,
    plannedSets: 4,
    sets: [DUMMY_SET],
}

export const DUMMY_WORKOUT: typos.Workout = {
    id: 1,
    name: "Chest Day",
    notes: "Focus on strength",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    exercises: [DUMMY_EXERCISE],
}