import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Exercise, WorkoutSet } from "@/constants/types/workout-types"
import React, { useEffect, useMemo } from "react"
import { StyleSheet, ScrollView, Pressable } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { Text } from "react-native"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import WorkoutSetComponent from "./WorkoutSetComponent"
import { Colors } from "@/constants/Colors"
import * as testSettings from "@/settings"
import ContentBoxView from "../ui/ContentBoxView"

type Props = {
  focused?: boolean
  exercise: Exercise
  workoutHandleCheckChange?: (value: number[]) => void
  // exerciseHandleCheckChange?: (index: number, value: number) => number[]
  // onDoneDelta?: (value: number) => void
}

/*  
 Without useMemo
  const borderColor = focused
    ? colorScheme === "dark"
      ? "#bbb"
      : "#dda"
    : colorScheme === "dark"
    ? "#fff"
    : "#000" 
    */
const ballSize = 48

const ExerciseComponent = ({
  focused = false,
  exercise,
  workoutHandleCheckChange,
}: Props) => {
  const { loadUnit, timeUnit } = useWorkoutContext()
  const colorScheme = useColorScheme()
  const workoutSetsQuery: ReadonlyArray<WorkoutSet> = exercise.sets // Assuming you want to display the first set
  const [workoutSets, setWorkoutSets] =
    useState<ReadonlyArray<WorkoutSet>>(workoutSetsQuery)
  const [forceDone, setForceDone] = useState<number>(0)
  const [checkedsReported, setCheckedsReported] = useState<number[]>(
    new Array(workoutSets.length).fill(0)
  )

  const exerciseOnCheckChange = (index: number, value: number) => {
    setCheckedsReported((prev) => {
      const next = [...prev]
      next[index] = value
      // If wants to done button to be clicked only once if all items are checkced
      // if (next.reduce((a, b) => a + b, 0) > exercise.sets.length) {
      //   setForceDone(1)
      // }
      return next
    })
    workoutHandleCheckChange?.(checkedsReported)
    console.debug(`-------------75:ExerciseComponent------------`)
    console.debug(`Checked reported at index ${index}: ${value}`)
    console.debug(`--------------------------------------------`)
  }

  useEffect(() => {
    workoutHandleCheckChange?.(checkedsReported)
  }, [checkedsReported])

  return (
    <ContentBoxView>
      <ThemedText type={"subtitle"}>{exercise.name}:</ThemedText>
      <View style={styles.setsContainer}>
        {workoutSets.map((workoutSet, index) => (
          <WorkoutSetComponent
            key={index}
            style={{ marginTop: 7, paddingBottom: 2 }}
            workoutSet={workoutSet}
            handleCheckChange={(value: number) =>
              exerciseOnCheckChange(index, value)
            }
            forceDone={forceDone}
          />
        ))}
        <Pressable
          style={styles.doneButton}
          onPress={() => {
            setForceDone((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 1))
          }}
        >
          <ThemedText>Done</ThemedText>
        </Pressable>
      </View>
    </ContentBoxView>
  )
}

const styles = StyleSheet.create({
  setsContainer: {
    gap: 10,
  },
  doneButton: {
    marginTop: 10,
    padding: 7,
    backgroundColor: Colors.mutual.inWorkoutDoneButtonBackground, // Green
    borderRadius: 5,
    alignItems: "center",
  },
})
export default ExerciseComponent
