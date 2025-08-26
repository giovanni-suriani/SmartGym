import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Exercise, WorkoutSet } from "@/constants/types/workout-types"
import React, { useMemo } from "react"
import { StyleSheet, ScrollView } from "react-native"
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
  onDoneDelta?: (value: number) => void
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
  onDoneDelta,
}: Props) => {
  // const weightUnit = useWeightUnit() // Assuming you have a hook to get the weight unit
  const { loadUnit, timeUnit } = useWorkoutContext()
  const colorScheme = useColorScheme()
  const workoutSetsQuery: ReadonlyArray<WorkoutSet> = exercise.sets // Assuming you want to display the first set
  const [workoutSets, setWorkoutSets] =
    useState<ReadonlyArray<WorkoutSet>>(workoutSetsQuery)
  const [forceDone, setForceDone] = useState<number>(0)
  // const [checkedSets, setCheckedSets] = useState<boolean[]>(new Array(workoutSets.length).fill(false))

  // const [checkedReported, setCheckedReported] = useState<number>(true)
  const [checkedsReported, setCheckedsReported] = useState<boolean[]>(
    new Array(workoutSets.length).fill(false)
  )
  const styles = useMemo(() => {
    const borderColor = focused
      ? colorScheme === "dark"
        ? Colors.dark.borderColorFocused
        : Colors.light.borderColorFocused
      : colorScheme === "dark"
      ? Colors.dark.borderColorUnfocused
      : Colors.light.borderColorUnfocused
    // console.log(`focused = ${focused}`)
    return createStyles({ borderColor })
  }, [colorScheme, focused])

  // const handleCheckChange = (value: boolean) => {
  //   setCheckedReported(value)
  //   console.log(`Checked reported: ${value}`);
  // }
  const handleCheckChange = (index: number, value: boolean) => {
    const newCheckedsReported = [...checkedsReported]
    newCheckedsReported[index] = value
    const delta = value ? 1 : -1
    if (newCheckedsReported[index] !== checkedsReported[index]) {
      setCheckedsReported(newCheckedsReported)
      if (value) {
        onDoneDelta?.(1)
      } else {
        onDoneDelta?.(-1)
      }
    }
    console.debug(`-------------75:ExerciseComponent------------`)
    console.debug(`Checked reported at index ${index}: ${value}`)
    console.debug(`checkedsReported: ${newCheckedsReported}`)
    console.debug(`delta: ${delta}`)
    console.debug(`--------------------------------------------`)
  }

  return (
    <ContentBoxView>
      {/* <ThemedText type={"ft18"}>Oi</ThemedText> */}
      <ThemedText type={"subtitle"}>{exercise.name}:</ThemedText>
      <View style={styles.setsContainer}>
        {workoutSets.map((workoutSet, index) => (
          <WorkoutSetComponent
            key={index}
            style={{ marginTop: 7, paddingBottom: 2 }}
            workoutSet={workoutSet}
            handleCheckChange={(value: boolean) =>
              handleCheckChange(index, value)
            }
            forceDone={forceDone}
          />
        ))}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            setForceDone((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 1))
            let amountTrue = 0
            checkedsReported.forEach((v) => {
              if (v) amountTrue++
            })
            const setsMade = workoutSets.length - amountTrue
            onDoneDelta?.(setsMade)
            setCheckedsReported(new Array(workoutSets.length).fill(true))
            if (testSettings.TEST_DONE_BUTTON && forceDone === 1) {
              setCheckedsReported(new Array(workoutSets.length).fill(false))
              onDoneDelta?.(-workoutSets.length)
            }
          }}
        >
          <ThemedText>Done</ThemedText>
        </TouchableOpacity>
      </View>
    </ContentBoxView>
  )
}

const createStyles = ({ borderColor }: { borderColor: string }) =>
  StyleSheet.create({
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
