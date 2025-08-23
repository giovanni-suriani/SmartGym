import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Exercise, WorkoutSet } from "@/constants/types/workout-types"
import React, { useMemo } from "react"
import { StyleSheet, useColorScheme, ScrollView } from "react-native"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { Text } from "react-native"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import WorkoutSetComponent from "./WorkoutSetComponent"
import { Colors } from "@/constants/Colors"

type Props = {
  focused?: boolean
  exercise: Exercise
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

const ExerciseComponent = ({ focused = false, exercise }: Props) => {
  // const weightUnit = useWeightUnit() // Assuming you have a hook to get the weight unit
  const { loadUnit, timeUnit } = useWorkoutContext()
  const colorScheme = useColorScheme()
  const workoutSetsQuery: ReadonlyArray<WorkoutSet> = exercise.sets // Assuming you want to display the first set
  const [workoutSets, setWorkoutSets] =
    useState<ReadonlyArray<WorkoutSet>>(workoutSetsQuery)
  const [forceDone, setForceDone] = useState<number>(0)
  // const [checkedSets, setCheckedSets] = useState<boolean[]>(new Array(workoutSets.length).fill(false))

  // const [checkedReported, setCheckedReported] = useState(false)
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
    console.log(`focused = ${focused}`)
    return createStyles({ borderColor })
  }, [colorScheme, focused])

  // const handleCheckChange = (value: boolean) => {
  //   setCheckedReported(value)
  //   console.log(`Checked reported: ${value}`);
  // }
  const handleCheckChange = (index: number, value: boolean) => {
    const newCheckedsReported = [...checkedsReported]
    newCheckedsReported[index] = value
    setCheckedsReported(newCheckedsReported)
    console.log(`Set ${index + 1} checked reported: ${value}`)
  }

  return (
    <ThemedView style={styles.container}>
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
            // 3 states for forceDone on checkboxes
          }}
        >
          <Text style={{ color: "#fff" }}>Done</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  )
}

const createStyles = ({ borderColor }: { borderColor: string }) =>
  StyleSheet.create({
    container: {
      // flexDirection: "row",
      // margin: "10%",
      marginHorizontal: "10%",
      borderRadius: 10,
      fontSize: 20,
      borderWidth: 2,
      borderColor,
      paddingHorizontal: "5%",
      paddingVertical: "5%",
      // backgroundColor: "rgba(255, 255, 255, 0.57)", // semi-transparent white
      // borderColor,
      // borderColor: colorScheme === "dark" ? "#fff" : "#000",
    },
    setsContainer: {
      gap: 10,
    },
    doneButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "#4CAF50", // Green
      borderRadius: 5,
      alignItems: "center",
    },
  })
export default ExerciseComponent
