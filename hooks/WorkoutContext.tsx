// hooks/WeightUnitContext.tsx
import { createContext, useContext, useState } from "react"

const WorkoutContext = createContext<any>(null)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [loadUnit, setLoadUnit] = useState<"kg" | "lb">("kg")
  const [timeUnit, setTimeUnit] = useState<"sec" | "min">("sec")
  const [displayWorkoutTimeRemaining, setDisplayWorkoutTimeRemaining] =
    useState<boolean>(true)
  // const [displayWorkoutTimeElapsed, setDisplayWorkoutTimeElapsed] = useState<boolean>(true)
  // const [displayWorkoutTotalTime, setDisplayWorkoutTotalTime] = useState<boolean>(true)
  // const [displayNextExerciseName, setDisplayNextExerciseName] = useState<boolean>(true)
  // const [displayCurrentExerciseName, setDisplayCurrentExerciseName] = useState<boolean>(true)
  // const [displayCurrentSetInfo, setDisplayCurrentSetInfo] = useState<boolean>(true)
  // const [displayRestTime, setDisplayRestTime] = useState<boolean>(true)
  // const [displayTotalSetsReps, setDisplayTotalSetsReps] = useState<boolean>(true)
  // const [displayTotalVolume, setDisplayTotalVolume] = useState<boolean>(true)
  // const [displayAverageIntensity, setDisplayAverageIntensity] = useState<boolean>(true)
  // const [displayWorkoutProgressBar, setDisplayWorkoutProgressBar] = useState<boolean>(true)
  // const [displayHeartRate, setDisplayHeartRate] = useState<boolean>(false)
  const [showWorkoutProgressBar, setShowWorkoutProgressBar] =
    useState<boolean>(true)
  const [showWorkoutSetCheckbox, setShowWorkoutSetCheckbox] =
    useState<boolean>(true)

  const toggleLoadUnit = () => setLoadUnit((u) => (u === "kg" ? "lb" : "kg"))
  const toggleTimeUnit = () => setTimeUnit((u) => (u === "sec" ? "min" : "sec"))
  const toggleShowWorkoutSetCheckbox = () =>
    setShowWorkoutSetCheckbox((u) => !u)
  const toggleShowWorkoutProgressBar = () =>
    setShowWorkoutProgressBar((u) => !u)

  return (
    <WorkoutContext.Provider
      value={{
        loadUnit,
        toggleLoadUnit,
        timeUnit,
        toggleTimeUnit,
        showWorkoutSetCheckbox,
        toggleShowWorkoutSetCheckbox,
        showWorkoutProgressBar,
        toggleShowWorkoutProgressBar,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkoutContext() {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error("useWorkoutContext must be used within a WorkoutProvider")
  }
  return context
}
