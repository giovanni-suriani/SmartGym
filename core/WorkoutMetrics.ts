import { Workout, Exercise, WorkoutSet } from "@/constants/types/workout-types"

export function calculateTotalSets({
  workout,
  exercises,
}: {
  workout?: Workout
  exercises?: ReadonlyArray<Exercise>
}): number {
  const list = workout?.exercises ?? exercises
  if (!list) return 0
  return list.reduce((sum, ex) => sum + ex.sets.length, 0)
}
