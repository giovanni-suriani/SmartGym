import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Exercise, WorkoutSet } from "@/constants/types/workout-types"
import { useState } from "react"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import Checkbox from "expo-checkbox"
import { StyleProp, ViewStyle } from "react-native"
import * as testSettings from  "@/settings"

type Props = {
  style?: StyleProp<ViewStyle>
  workoutSet: WorkoutSet
  forceDone?: number
  handleCheckChange?: (value: boolean) => void
}

const WorkoutSetComponent = ({
  style,
  workoutSet,
  handleCheckChange,
  forceDone,
}: Props) => {
  const { loadUnit, timeUnit, showWorkoutSetCheckbox } = useWorkoutContext()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if ((forceDone ?? 0) > 0) {
      if (!checked) {
        setChecked(true)
        // handleCheckChange?.(true)
      }
      if (testSettings.TEST_DONE_BUTTON && forceDone === 2) {
        setChecked(false)
        // handleCheckChange?.(false)
      }
    }
  }, [forceDone]) // when dependencies change, the effect runs again
  // empty dependencies array [] means the effect runs only once after the initial render

  const onToggle = (value: boolean) => {
    setChecked(value)
    handleCheckChange?.(value)
  }
  // const item: WorkoutSet = DUMMY_SET // Assuming you want to display the first set
  // const item = {
  //   workoutSet: workoutSetItem, // Assuming you want to display the first set
  // }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.rowText]}>
        <ThemedText type={"default"} style={checked && styles.dashedText}>
          {workoutSet.position}.{" "}
        </ThemedText>
        <ThemedText type={"default"} style={checked && styles.dashedText}>
          {workoutSet.isWarmup ? "Warmup Set" : "Working Set"}:{" "}
        </ThemedText>
        <ThemedText type={"default"} style={checked && styles.dashedText}>
          {workoutSet.reps} x{" "}
        </ThemedText>
        <ThemedText type={"default"} style={checked && styles.dashedText}>
          {workoutSet.loadKg} {loadUnit}{" "}
        </ThemedText>
      </View>
      {showWorkoutSetCheckbox && (
        <Checkbox
          style={styles.checkbox}
          value={checked}
          onValueChange={onToggle} // passing a callback function
          // onValueChange={setChecked, handleChildCheckChange}
          color={checked ? "rgb(0, 172, 14)" : undefined}
        />
      )}
    </View>
  )
}

const checkboxSize = 24

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.57)", // semi-transparent white
  },
  rowText: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    textDecorationLine: "line-through",
    // paddingTop: 15,
    // paddingVertical: 15,
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  dashedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "dashed",
  },
  checkbox: {
    width: checkboxSize * 1.2,
    height: checkboxSize,
    // backgroundColor: "rgba(255, 255, 255, 0.57)", // semi-transparent white
    borderRadius: 10,
    // margin: 8,
  },
})
export default WorkoutSetComponent
