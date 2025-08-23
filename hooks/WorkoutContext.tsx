// hooks/WeightUnitContext.tsx
import { createContext, useContext, useState } from "react"

const WorkoutContext = createContext<any>(null)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [loadUnit, setLoadUnit] = useState<"kg" | "lb">("kg")
  const [timeUnit, setTimeUnit] = useState<"sec" | "min">("sec")
  const [showWorkoutSetCheckbox, setShowWorkoutSetCheckbox] = useState<boolean>(true)
  const toggleLoadUnit = () => setLoadUnit((u) => (u === "kg" ? "lb" : "kg"))
  const toggleTimeUnit = () => setTimeUnit((u) => (u === "sec" ? "min" : "sec"))
  const toggleShowWorkoutSetCheckbox = () =>
    setShowWorkoutSetCheckbox((u) => !u)

  return (
    <WorkoutContext.Provider
      value={{
        loadUnit,
        toggleLoadUnit,
        timeUnit,
        toggleTimeUnit,
        showWorkoutSetCheckbox,
        toggleShowWorkoutSetCheckbox,
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
